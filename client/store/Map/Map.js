/* global google */
import React from 'react';
import { browserHistory } from 'react-router';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import { getLoginUrl, getListingBySlug, getMetaDetails } from '../../functions'
import MapSidebar from './Components/MapSidebar';
import Avatar from '../../Components/Avatar/Avatar';
import AddListingMarker from './Components/AddListingMarker';
import ListingMarker from './Components/ListingMarker';
import MapListingToggle from './Components/MapListingToggle';
import MapStyle from '../../components/MapStyle/MapStyle';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import NotFound from '../../components/NotFound/NotFound';
import { icons } from '../../Images/Images';

const RenderMap = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        onClick={props.onMapClick}
        zoom={props.zoom}
        onZoomChanged={props.onZoomChanged}
        onDragEnd={props.onMapChanged}
        center={props.center}
        gestureHandling='greedy'
        options={{
            styles: MapStyle,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            minZoom: 12,
            draggableCursor: props.addNewListingMode ? 'url(' + icons.dart + ') 10 16, crosshair' : undefined
        }}
    >
        {
            props.addNewListingMode ?
                <AddListingMarker {...props} />
                :
                props.listings.map((listing, i) => (
                    <ListingMarker listing={listing} key={i} {...props} />
                ))

        }
    </GoogleMap >
));

class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            center: undefined,
            searchedCenter: undefined,
            zoom: 14,
            searchThisArea: false,
            rentalTypes: undefined,
            max_rate: 0,
            min_rate: 0
        };

        this.setAddNewListingMode = this.setAddNewListingMode.bind(this);
        this.setSelectedListing = this.setSelectedListing.bind(this);
        this.searchThisArea = this.searchThisArea.bind(this);
        this.handleMapLoad = this.handleMapLoad.bind(this);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleZoomChanged = this.handleZoomChanged.bind(this);
        this.handleMapChanged = this.handleMapChanged.bind(this);
        this.handleMarkerDrag = this.handleMarkerDrag.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }

    UNSAFE_componentWillMount() {
        let { query } = this.props.location;

        // clear listing preview
        if (query.listing != undefined)
            this.renderQueryParams({ remove: [{ key: 'listing' }] })

        this.props.setAddNewListingMode(false);

        this.getListings({
            slug: this.props.params.citySlug,
            lat: parseFloat(query.lat),
            lng: parseFloat(query.lng),
            zoom: parseFloat(query.z)
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let { filter, location, setSelectedListing } = this.props;

        // check filter changes
        if (filter != nextProps.filter) {
            this.compareFilterParams(nextProps.filter);
        }

        // query param checks
        if (location.query != nextProps.location.query) {
            if (nextProps.location.query.listing == undefined)
                setSelectedListing(null);

            if (location.query.listing != nextProps.location.query.listing)
                setSelectedListing(getListingBySlug(nextProps.location.query.listing, nextProps.listings.data));
        }

        // check if route has changed
        if (location.pathname != nextProps.location.pathname) {
            setSelectedListing(null);
            this.getListings({ slug: nextProps.params.citySlug });
        }
    }

    renderLoggedIn() {
        let { map, profile } = this.props;

        return (
            <div className="d-flex profile-actions mr-3 mt-3">
                <div className="ml-3 mt-1 d-none d-sm-block">
                    {map.addNewListingMode ?
                        <button onClick={this.setAddNewListingMode.bind(null, false)} className="btn btn-sm btn-danger"><i className="fas fa-times" /> Cancel</button> :
                        <button onClick={this.setAddNewListingMode.bind(null, true)} className="btn btn-sm btn-success"><i className="fas fa-plus" /> Add</button>
                    }
                </div>
                <div className="ml-3 d-none d-sm-block">
                    <Avatar size={40} name={profile.data.name} id={profile.data.id} />
                </div>
            </div>
        );
    }

    renderLoggedOut() {
        const loginUrl = getLoginUrl(window.location.pathname);

        return (
            <div className="d-flex profile-actions mr-3 mt-3 d-none">
                <div className="ml-3">
                    <a href={loginUrl} className="btn btn-success btn-sm"><i className="fas fa-plus" /> Add</a>
                </div>
            </div>
        );
    }

    compareFilterParams(filter) {
        let { center } = this.state;
        let filterParams = {
            add: [],
            remove: [],
        }

        // types
        if (filter.parameters.types.length == 6)
            filterParams.remove.push({ key: 'types' });
        else
            filterParams.add.push({ key: 'types', value: filter.parameters.types.join(',') });

        // min rate
        if (filter.parameters.min_rate == 0)
            filterParams.remove.push({ key: 'min_rate' });
        else
            filterParams.add.push({ key: 'min_rate', value: filter.parameters.min_rate });

        // max rate
        if (filter.parameters.max_rate == 0)
            filterParams.remove.push({ key: 'max_rate' });
        else
            filterParams.add.push({ key: 'max_rate', value: filter.parameters.max_rate });

        this.renderQueryParams(filterParams);
        this.getListings(center);
    }

    // update the route
    renderQueryParams(newParams) {
        let currentParams = queryString.parse(location.search);

        if (newParams.add != undefined) {
            newParams.add.forEach(param => {
                currentParams[param.key] = param.value;
            });
        }

        if (newParams.remove != undefined) {
            newParams.remove.forEach(param => {
                delete currentParams[param.key];
            });
        }

        browserHistory.push(location.pathname + '?' + queryString.stringify(currentParams, { encode: false }));
    }

    setAddNewListingMode(value, e) {
        e.preventDefault();
        let { setSelectedListing, setAddNewListingCoordinates, setAddNewListingMode } = this.props;

        setSelectedListing(null);
        setAddNewListingMode(value);

        if (!value)
            setAddNewListingCoordinates(undefined);
    }

    setSelectedListing(listing, returnToMapView = false) {
        let { setSelectedListing, toggleMapView, setReturnToMapView } = this.props;

        this.setState({ center: { lat: listing.coordinates.lat, lng: listing.coordinates.lng } });
        toggleMapView(false);
        setSelectedListing(listing);
        setReturnToMapView(returnToMapView);

        this.renderQueryParams({
            add: [{ key: 'listing', value: listing.slug }]
        });
    }

    searchThisArea() {
        let { center, zoom } = this.state;

        this.getListings({ ...center, zoom });
        this.setState({ searchedCenter: center, searchThisArea: false });
    }

    getFilterParams() {
        let currentParams = queryString.parse(location.search);

        let params = {};

        if (currentParams['max_rate'] != undefined)
            params.max_rate = currentParams['max_rate'];

        if (currentParams['min_rate'] != undefined)
            params.min_rate = currentParams['min_rate'];

        if (currentParams['types'] != undefined)
            params.types = currentParams['types'];

        return params;
    }

    getListings(params) {
        const filterParams = this.getFilterParams();

        // set defaults
        this.props.setMapNotFound(false);
        this.props.setSelectedListing(null);

        if (!params.lat || !params.lng) {
            geocodeByAddress(params.slug)
                .then(results =>
                    getLatLng(results[0])
                ).then(({ lat, lng }) => {
                    this.props.handleGetListings({ ...filterParams, lat, lng, zoom: 14 });
                    this.setState({ center: { lat, lng }, searchedCenter: { lat, lng }, zoom: 14 });
                }).catch(() => {
                    this.props.setMapNotFound(true);
                });
        } else {
            this.props.handleGetListings({ ...filterParams, lat: params.lat, lng: params.lng, zoom: params.zoom ? params.zoom : 14 });
            this.setState({ center: { lat: params.lat, lng: params.lng }, searchedCenter: { lat: params.lat, lng: params.lng }, zoom: params.zoom ? params.zoom : 14 });
        }
    }

    handleMapLoad(map) {
        this._map = map;
    }

    handleMarkerDrag(e) {
        let { setAddNewListingCoordinates } = this.props;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setAddNewListingCoordinates({ lat, lng });
    }

    handleMapClick(e) {
        let { map, setAddNewListingCoordinates } = this.props;
        if (!map.addNewListingMode) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setAddNewListingCoordinates({ lat, lng });
        this.setState({ center: { lat, lng }, zoom: 18 });
    }

    handleZoomChanged() {
        const nextZoom = this._map.getZoom();
        if (nextZoom !== this.state.zoom) {
            this.setState({
                zoom: nextZoom,
            });

            this.renderQueryParams({
                add: [
                    { key: 'z', value: nextZoom }
                ]
            });
        }
    }

    handleMapChanged() {
        let { center, zoom } = this.state;
        const centerObj = this._map.getCenter();
        const nextZoom = this._map.getZoom();
        const lat = centerObj.lat();
        const lng = centerObj.lng();

        const nextCenter = { lat, lng };
        if (nextCenter !== center || nextZoom !== zoom) {
            this.setState({
                center: nextCenter,
            });

            this.setState({ searchThisArea: true });

            this.renderQueryParams({
                add: [
                    { key: 'lat', value: lat.toFixed(6) },
                    { key: 'lng', value: lng.toFixed(6) }
                ]
            });
        }
    }

    isLoading() {
        let { profile } = this.props;

        if (profile.updating) return true;
        return false;
    }

    renderLoaded() {
        let { authentication, listings, map, ui, toggleMapView } = this.props;
        let { center, zoom, searchThisArea } = this.state;
        const metaDetails = getMetaDetails('Crowd sourced monthly rentals', location.pathname);
        const sidebarClass = ui.mapView ? 'container map-sidebar d-none d-sm-block' : 'container map-sidebar';
        const mapClass = ui.mapView ? 'map' : 'map d-none d-sm-block';

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{metaDetails.title}</title>
                    <link rel="canonical" href={metaDetails.link} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content="@homadicco" />
                    <meta property="og:title" content="Homadic" />
                    <meta property="og:description" content="Crowd sourced monthly home rentals." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content={metaDetails.link} />
                    <meta property="og:image" content="https://homadicstorage.blob.core.windows.net/icons/icon180.png" />
                </Helmet>
                {
                    map.notFound ? <NotFound /> :
                        <div>
                            <div className={sidebarClass} style={{ overflowX: 'hidden' }}>
                                <MapSidebar {...this.props} renderQueryParams={this.renderQueryParams} />
                            </div>
                            <div className={mapClass}>
                                <RenderMap
                                    onMapLoad={this.handleMapLoad}
                                    onMapClick={this.handleMapClick}
                                    center={new google.maps.LatLng(center)}
                                    zoom={zoom}
                                    addNewListingMode={map.addNewListingMode}
                                    onMapChanged={this.handleMapChanged}
                                    onZoomChanged={this.handleZoomChanged}
                                    onMarkerDragged={this.handleMarkerDrag}
                                    setSelectedListing={this.setSelectedListing}
                                    containerElement={
                                        <div style={{ height: '100%' }} />
                                    }
                                    mapElement={
                                        <div style={{ height: '100%' }} />
                                    }
                                    listings={listings.data}
                                    map={map}
                                    selectedListing={map.selectedListing}
                                    ui={ui}
                                    toggleMapView={toggleMapView}
                                />
                                {authentication.isLoggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
                                {searchThisArea ? <button className="btn btn-action search-this-area" onClick={this.searchThisArea}>Search this area</button> : undefined}
                            </div>
                        </div>
                }
                <MapListingToggle {...this.props} />

            </div >
        )
    }

    render() {
        return (
            this.isLoading() ? <LoadingScreen /> : this.renderLoaded()
        )
    }
}

export default Map;
