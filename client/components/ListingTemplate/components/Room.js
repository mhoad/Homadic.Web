import React from 'react';
import FontAwesome from 'react-fontawesome';
import { icons } from '../../../Images/Images';
import { bathrooms, bedrooms, rentalLengths } from '../../../data';

class Room extends React.Component {
    constructor(props) {
        super(props);
    }

    renderBedrooms() {
        let { room } = this.props;

        const i = bedrooms.findIndex((bedroom) => bedroom.value == room.bedrooms);
        return bedrooms[i].name;
    }

    renderBathrooms() {
        let { room } = this.props;

        const i = bathrooms.findIndex((bathroom) => bathroom.value == room.bathrooms);
        return bathrooms[i].name;
    }

    renderMinStay() {
        let { room } = this.props;

        const i = rentalLengths.findIndex((r) => r.value == room.min_rental);
        return rentalLengths[i];
    }

    renderKitchen() {
        let { room } = this.props;

        switch (room.kitchen) {
            case 'included':
                return (<FontAwesome name="check" size="lg" className="green" />)
            case 'shared':
                return (<span>Shared</span>)
            case 'none':
                return (<FontAwesome name="times" size="lg" className="text-muted" />)
        }
    }

    renderLaundry() {
        let { room } = this.props;

        switch (room.laundry) {
            case 'included':
                return (<FontAwesome name="check" size="lg" className="green" />)
            case 'shared':
                return (<span>Shared</span>)
            case 'none':
                return (<FontAwesome name="times" size="lg" className="text-muted" />)
        }
    }

    render() {
        let { currency, room } = this.props;
        const minStay = this.renderMinStay();

        return (
            <div className="col-md-6 mb-2">
                <div className="content-box room">
                    <h5><img className="mr-1" src={icons.bedroom} /> {this.renderBedrooms()} <img className="ml-3 mr-1" src={icons.bathroom} height={30} width={30} /> {this.renderBathrooms()}</h5>
                    <hr />
                    <div className="row">
                        <div className="col-6 mt-1">
                            <p><strong>Kitchen:</strong> {this.renderKitchen()}</p>
                        </div>
                        <div className="col-6 mt-1">
                            <p><strong>Laundry:</strong> {this.renderLaundry()}</p>
                        </div>
                        <div className="col-12 mt-2 min-stay">
                            <p className="text-muted"><img src={icons[minStay.icon]} className="mr-1" /> {minStay.name} min stay</p>
                        </div>
                    </div>
                    <div className="content-box-footer bg-blue">
                        <h6 className="white"><strong>{room.base_rate} {currency}</strong> {room.deposit ? <small>{room.deposit} {currency} deposit</small> : undefined}</h6>
                    </div>
                </div>
            </div>
        )
    }
}

export default Room;