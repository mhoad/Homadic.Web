import React from 'react';
import { browserHistory } from 'react-router';

class AppView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>Hey</p>
                {React.cloneElement(this.props.children, this.props)}
            </div>
        )
    }
}

export default AppView;
