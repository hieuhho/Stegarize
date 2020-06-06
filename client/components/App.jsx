import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTrue: true,
    };
    this.test = this.test.bind(this);
  }

  componentDidMount() {
    this.test();
  }

  test() {
    axios.get('/lol')
      .then((data) => console.log(data.data))
      .catch((err) => console.log('is err: ', err));
  }

  render() {
    return (
      <div className="main-container">
        <div>
          Hello from React!
        </div>
      </div>
    );
  }
}

export default App;
