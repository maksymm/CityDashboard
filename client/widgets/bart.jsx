import React, { PropTypes } from 'react';
import axios from 'axios';

class Bart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationTrue: this.props.location,
      nextTrains: [],
      originStation: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps && nextProps.location && nextProps.location[0] != this.state.locationTrue[0] && nextProps.location[1] != this.state.locationTrue[1]) {
      this.setState({locationTrue: nextProps.location}, () => {
        this.getClosestStation();
      });
    }
  }

  getClosestStation() {
    let url = '/bart';
    let dataToSend = {
      latLng: this.state.locationTrue
    };
    axios.post(url, dataToSend)
      .then( (response) => {
        console.log("line 29: response", response);
        this.setState({
          nextTrains: response.data.deptArr,
          originStation: response.data.originStation.name
        });
      })
      .catch( (response) => {
        console.log("Error getting closest station from bart: ", response);
        this.getClosestStation();
      });
  }

  componentDidMount() {
    if(this.state.locationTrue) {
      this.getClosestStation();
    }
  }
          // <div>
          //   <span className="destinations">Destination: {trains.destination} </span>
          //   <span className="directions">Direction: {trains.direction} </span>
          //   <span className="platforms">Platform #: {trains.platform} </span>
          //   <span className="times">Minutes Until: {trains.time} </span>
          // </div>

render() {
    let TrainsData;
    let that = this;
    if(that.state.nextTrains.length > 0){
      TrainsData = that.state.nextTrains.map((trains) => {
        return (
          <tr>
            <th>{trains.destination}</th>
            <th>{trains.direction}</th>
            <th>{trains.platform}</th>
            <th>{trains.time}</th>
          </tr>
        );
      });
    }
    if (!this.state.locationTrue) {
      return (
        <div>
          <p>Getting Your Location, Please Wait</p>
        </div>
      );
    } else {
      return (
         <div style={{ overflow:"auto" }}>
          <div>Departing from: {this.state.originStation}</div>
          <div className="TrainsData">
          <table>
            <tbody>
              <tr>
                <th>Destinations: </th>
                <th>Direction: </th>
                <th>Platform #: </th>
                <th>Minutes Until: </th>
              </tr>
            </tbody>
            {TrainsData}
          </table>
          </div>
        </div>
      );
    }
  }
}
export default Bart;
