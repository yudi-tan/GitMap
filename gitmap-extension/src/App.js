import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import gh from 'parse-github-url';
import urlscript from './urlscript';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      done: false
    }
  }


  componentDidMount(){
    navigator.geolocation.getCurrentPosition(function(position) {
      this.setState({done: false, latitude: position.coords.latitude, longitude: position.coords.longitude});
    }.bind(this));
  }

  getUrl(){
    var x = document.createElement("SCRIPT");
    x.src = urlscript.method;
    document.body.appendChild(x);
  }

  saveProject() {
    this.getUrl();
    axios.post('http://gitmap.us-west-1.elasticbeanstalk.com/newproject', {
      username: urlscript.owner,
      reponame: urlscript.repoName,
      url: urlscript.url,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }).then(function(response) {
      this.setState({done: true});
    }.bind(this)).catch(function(error) {
      console.log(error);
    });
  }

  render() {

    if (!this.state.done) {
      return (
        <div className="App">
          <h3>Welcome to GitMap!</h3>
          <p>Click on the button below to share your open source initiative with developers near you!</p>
          {(this.state.latitude && this.state.longitude) ? <button onClick={() => this.saveProject()}>Save</button>
          : <p>Loading...</p>}

        </div>
      );
    } else {
      return (
        <div className="App">
          <p> Done! Download the app to view projects near you!</p>
        </div>)
    }

  }
}

export default App;
