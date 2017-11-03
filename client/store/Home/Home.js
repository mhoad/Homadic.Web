import React from 'react';
import FontAwesome from 'react-fontawesome';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ListingTemplate from '../../components/ListingTemplate/ListingTemplate';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetching: true
        };
    }

    componentWillMount() {
        let { handleGetHome, params } = this.props;

        if (params.homeSlug) {
            this.setState({ fetching: true });
            this.props.handleGetHome(params.homeSlug).then(() => {
                this.setState({ fetching: false });
            });
        }
    }

    render() {
        let { homes } = this.props;
        let { fetching } = this.state;
        console.log(homes.selected);

        return (
            <div>
                {fetching ? <LoadingScreen /> : <ListingTemplate listing={homes.selected} previewMode={false} {...this.props} />}
            </div>
        )
    }
}

export default Home;