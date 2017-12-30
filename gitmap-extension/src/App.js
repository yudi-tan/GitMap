import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import urlscript from './urlscript';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      done: false
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(function(position) {
      this.setState({done: false, latitude: position.coords.latitude, longitude: position.coords.longitude});
      this.getUrl();
    }.bind(this));
  }

  getUrl() {
    var x = document.createElement("SCRIPT");
    x.src = urlscript.method;
    document.body.appendChild(x);
    this.setState({
      done: false,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      url: localStorage.getItem('url'),
      reponame: localStorage.getItem('repoName'),
      username: localStorage.getItem('owner'),
      gmghUsername: localStorage.getItem('gmghUsername')
    });
  }

  saveProject() {
    if (this.state.gmghUsername === this.state.username){
      axios.post('http://gitmap.us-west-1.elasticbeanstalk.com/newproject', {
        username: this.state.username,
        reponame: this.state.reponame,
        url: this.state.url,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      }).then(function(response) {
        this.setState({done: true});
      }.bind(this)).catch(function(error) {
        console.log(error);
      });
    } else {
      this.setState({notOwnRepo: true});
    }
  }

  render() {

    if (!this.state.done && !this.state.notOwnRepo) {
      return (
        <div className="App">
          <h3>Welcome to GitMap!</h3>
          <p>Click on the button below to share your open source initiative with developers near you!</p>
          {(this.state.latitude && this.state.longitude && this.state.url && this.state.reponame && this.state.username && this.state.gmghUsername)
            ? <button onClick={() => this.saveProject()}>Save</button>
            : <p>Loading...</p>}

        </div>
      );
    } else if (this.state.done){
      return (
        <div className="App">
          <p>
            Done! Download the app to view projects near you!</p>
        </div>
      )
    } else if (!this.state.done && this.state.notOwnRepo) {
      return (
        <div className="App">
          <p>
            You are either not logged in on GitHub or trying to
            upload a repo that does not belong to you.</p>
        </div>
      )
    }

  }
}

export default App;
