import React from 'react';
import FontAwesome from 'react-fontawesome';

class Internet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { listing } = this.props;

        return (
            <div className="content-box">
                <h2 className="fancy blue">Internet</h2>
                <div className="row">
                    <div className="col-md-4 capitalize">
                        <p><FontAwesome name="dollar" /> {listing.wifi.type}</p>
                    </div>
                    <div className="col-md-4 capitalize">
                        <p><FontAwesome name="download" /> {listing.wifi.download}mbps</p>
                    </div>
                    <div className="col-md-4 capitalize">
                        <p><FontAwesome name="upload" /> {listing.wifi.upload}mbps</p>
                    </div>
                    <div className="col-md-12">
                        <p><strong>Notes:</strong> {listing.wifi.notes}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Internet;