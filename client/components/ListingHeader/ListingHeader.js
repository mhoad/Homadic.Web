import React from 'react';
import { Link } from 'react-router';
import Avatar from '../../Components/Avatar/Avatar';
import ThumbsUpDown from '../../components/ThumbsUpDown/ThumbsUpDown';
import DropDownMenu from '../../Components/DropDownMenu/DropDownMenu';

class ListingHeader extends React.Component {
    constructor(props) {
        super(props);

        this.clickThumbsUp = this.clickThumbsUp.bind(this);
    }

    clickThumbsUp(value) {
        let { handleThumbsUp, params } = this.props;

        handleThumbsUp(params.listingSlug, value);
    }

    renderEditDropDown() {
        let { params } = this.props;

        return (
            <DropDownMenu icon={<i className="fas fa-pencil-alt mr-1" />} name="Edit" customClass="ml-2">
                <Link className="dropdown-item text-truncate" href={'/listing/' + params.listingSlug}><span className="blue"><i className="fas fa-home mr-1" /> View listing</span></Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/history'}><i className="fas fa-history mr-1"></i> History</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/amenities'}><i className="fas fa-dumbbell mr-1" /> Amenities</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/bills'}><i className="fas fa-money-bill-wave mr-1" /> Bills</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/contact-details'}><i className="fas fa-users mr-1" /> Contact Details</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/images'}><i className="fas fa-images mr-1" /> Images</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/notes'}><i className="fas fa-align-left mr-1" /> Notes</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/rooms'}><i className="fas fa-bed mr-1" /> Rooms</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/social-details'}><i className="fab fa-facebook-square mr-1" /> Social Details</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/type'}><i className="fas fa-hotel mr-1" /> Type</Link>
                <Link className="dropdown-item" href={'/listing/' + params.listingSlug + '/wifi'}><i className="fas fa-wifi mr-1" /> Wifi</Link>
            </DropDownMenu>
        )
    }

    renderFullHeader() {
        return (
            <span><ThumbsUpDown {...this.props} clickThumbsUp={this.clickThumbsUp} /> {this.renderEditDropDown()}</span>
        )
    }

    render() {
        let { profile, full } = this.props;

        return (
            <div className="bg-white fixed-top pt-2 box-shadow">
                <div className="container">
                    <div className="float-left">
                        <h5 className="d-md-none"><Link className="logo logo-sm" to="/">{'{ H }'}</Link></h5><h5 className="d-none d-md-block"><Link className="logo logo-sm" to="/">{'{ Homadic }'}</Link></h5>
                    </div>
                    <div className="ml-auto d-flex justify-content-end">
                        <h5>{full ? this.renderFullHeader() : undefined} <Avatar className="ml-2" size={30} name={profile.data.name} id={profile.data.id} /></h5>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListingHeader;