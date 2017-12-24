import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: {},
    }
  }

  saveProject() {
    axios.post('http://localhost:5000/newproject', {
      username: 'riceball1',
      url: 'www.github111.com',
      latitude: '1231242412',
      longitude: '1312312'
    }).then(function(response) {
      console.log(response.data);
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <h3>Welcome to GitMap!</h3>
        <p>Click on the button below to share your open source initiative with developers near you!</p>
        <button onClick={() => this.saveProject()}>Save</button>
      </div>
    );
  }
}

export default App;
