import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTrue: true,
    };
  }

  render() {
    return (
      <div>
        Hello from React!
      </div>
    );
  }
}

export default App;
