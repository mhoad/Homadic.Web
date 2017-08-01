import React from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { getLoginUrl } from '../../../functions';
import Avatar from '../../../Components/Avatar/Avatar';
import PlacesTypeahead from '../../../Components/PlacesTypeahead/PlacesTypeahead';

class ActionBar extends React.Component {
    constructor(props) {
        super(props);
        this.setAddNewPlaceMode = this.setAddNewPlaceMode.bind(this);
    }

    renderLoggedIn() {
        let { profile } = this.props;

        return (
            <Avatar size={30} profile={profile.data} />
        );
    }

    setAddNewPlaceMode(value, e) {
        e.preventDefault();
        this.props.setAddNewPlaceMode(value);
    }

    renderLoggedOut() {
        const loginUrl = getLoginUrl(window.location.pathname);

        return (
            <a href={loginUrl}>Login</a>
        );
    }

    render() {
        let { authentication, map, params } = this.props;
        const classNames = {
            root: 'form-group map-typeahead',
            input: 'form-control',
            autocompleteContainer: ''
        }

        const inputProps = {
            placeholder: "Search cities..."
        }

        return (
            <div>
                <div className="d-flex search-container mr-3 mt-3">
                    <div className="ml-3">
                        <PlacesTypeahead {...this.props} classNames={classNames} inputProps={inputProps} />
                    </div>
                </div>
                <div className="d-flex profile-actions mr-3 mt-3">
                    <div className="ml-3 mt-2">
                        {map.addNewPlaceMode ?
                            <button onClick={this.setAddNewPlaceMode.bind(null, false)} className="btn btn-sm btn-error"><FontAwesome name="remove" /> Cancel</button> :
                            <button onClick={this.setAddNewPlaceMode.bind(null, true)} className="btn btn-sm btn-success"><FontAwesome name="plus" /> Add</button>
                        }
                    </div>
                    <div className="ml-3 mt-2">
                        {authentication.isLoggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
                    </div>
                </div>
            </div>
        )
    }
}

export default ActionBar;