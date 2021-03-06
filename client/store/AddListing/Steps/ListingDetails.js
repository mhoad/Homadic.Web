import React from 'react';
import { browserHistory } from 'react-router';
import { apiGetGooglePlace } from '../../../api';
import { emptyListing } from '../../../data';
import TypeEditor from '../../../components/EditComponents/TypeEditor';
import SocialDetailsEditor from '../../../components/EditComponents/SocialDetailsEditor';
import ContactDetailsEditor from '../../../components/EditComponents/ContactDetailsEditor';

class ListingDetails extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
    }

    UNSAFE_componentWillMount() {
        let { addListing, clearNewListing, setListingFromGoogleMaps, setLoadingStatus } = this.props;

        if (addListing.listing.google_place_id != addListing.ui.gmid) {
            setLoadingStatus(true);
            clearNewListing(emptyListing);
            apiGetGooglePlace(addListing.ui.gmid).then(response => {
                if (response.data.slug != null) {
                    browserHistory.push('/listing/' + response.data.slug);
                }
                setListingFromGoogleMaps(response.data.place);
                setLoadingStatus(false);
            }).catch(() => {
                setLoadingStatus(false);
                browserHistory.push('/');
            });
        }
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const key = target.name;

        this.props.updateInputProp(key, value);
    }

    handleNextClick(e) {
        e.preventDefault();
        const form = this.listingForm;

        if (form.checkValidity() == false) {
            form.classList.add('was-validated');
        } else {
            browserHistory.push('/add/rooms');
        }
    }

    render() {
        let { listing } = this.props.addListing;

        return (
            <form autoComplete="off" ref={(c) => { this.listingForm = c; }} noValidate>
                <h1 className="fancy blue display-4 mb-4">Listing details</h1>
                <div className="form-row">
                    <div className="form-group col-md-9">
                        <label htmlFor="inputListingName" className="col-form-label">Listing name*</label>
                        <input type="text" className="form-control" name="name" value={listing.name} id="inputListingName" placeholder="Listing name" maxLength={50} readOnly required />
                        <div className="invalid-feedback">
                            The listing needs a name!
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <TypeEditor type={listing.type} handleChange={this.handleChange} />
                    </div>
                </div>
                <ContactDetailsEditor address={listing.address} contactDetails={listing.contact_details} handleChange={this.handleChange} full />
                <SocialDetailsEditor socialDetails={listing.social_details} handleChange={this.handleChange} />
                <div className="row justify-content-center mt-4">
                    <div className="col-auto">
                        <button type="button" onClick={this.handleNextClick} className="btn btn-success mx-1">Next <i className="fas fa-caret-right" /></button>
                    </div>
                </div>
            </form>
        )
    }
}

export default ListingDetails;