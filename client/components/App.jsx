import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      server: 'default',
    };
    this.test = this.test.bind(this);
  }

  componentDidMount() {
    this.test();
  }

  test() {
    axios.get('/lol')
      .then((data) => {
        this.setState((prevState) => ({
          server: [data.data],
        }));
      })
      .catch((err) => console.log('is err: ', err));
  }

  render() {
    const { server } = this.state;
    return (
      <div className="main-container">
        <div>
          Hello from React!
        </div>
        <div>
          {server}
        </div>
      </div>
    );
  }
}

export default App;
