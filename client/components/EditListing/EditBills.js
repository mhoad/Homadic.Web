import React from 'react';
import { browserHistory } from 'react-router';
import { apiUpdateBills } from '../../api';
import ListingHeader from '../ListingHeader/ListingHeader';
import LoadingPlane from '../LoadingScreen/LoadingPlane';
import Hero from '../ListingTemplate/components/Hero';
import BillsEditor from '../EditComponents/BillsEditor';

class EditBills extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
        this.handleGoBack = this.handleGoBack.bind(this);

        this.state = {
            error: undefined,
            loading: false,
        }
    }

    componentDidMount() {
        let { params, handleSetNewListing } = this.props;

        handleSetNewListing(params.listingSlug).catch(() => {
            browserHistory.push('/');
        });
    }

    handleGoBack(e) {
        e.preventDefault();

        browserHistory.push('/listing/' + this.props.params.listingSlug);
    }

    handleSaveChanges(e) {
        e.preventDefault();
        let { slug, bills } = this.props.addListing.listing;

        this.setState({ loading: true, error: undefined });

        apiUpdateBills(slug, bills).then(() => {
            browserHistory.push('/listing/' + slug + '?updated=true');
        }).catch((e) => {
            this.setState({ loading: false, error: e });
        });
    }

    handleChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let key = target.name;

        // check if int or string
        value = target.getAttribute('data-type') === 'int' ? parseFloat(value) : value;

        this.props.updateInputProp(key, value);
    }

    renderLoaded() {
        let { listing } = this.props.addListing;

        return (
            <div className="listing">
                <ListingHeader {...this.props} full />
                <Hero listing={listing} />
                <div className="content-box">
                    <BillsEditor bills={listing.bills} currency={listing.currency} handleChange={this.handleChange} />
                </div>
                <div className="text-center">
                    <div className="btn-group" role="group" aria-label="Do stuff">
                        <button className="btn" onClick={this.handleGoBack}><i className="far fa-save"></i> Back</button>
                        <button className="btn btn-action" onClick={this.handleSaveChanges}><i className="far fa-save"></i> Save</button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let { error, loading } = this.state;
        let { addListing, params, ui } = this.props;

        return (
            <div className="listing">
                <div className="container mb-4">
                    {error != undefined ? <div className="alert alert-danger">{error}</div> : undefined}
                    {ui.fetchingNewListing || loading || addListing.listing.slug != params.listingSlug ? <LoadingPlane /> : this.renderLoaded()}
                </div>
            </div>
        )
    }
}

export default EditBills;