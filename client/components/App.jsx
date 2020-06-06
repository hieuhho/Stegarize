import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      server: 'default',
      selectedImg: 'ok',
    };
    this.test = this.test.bind(this);
    this.fileSelect = this.fileSelect.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    this.test();
  }

  test() {
    axios.get('/lol')
      .then((data) => {
        this.setState({
          server: data.data,
          selectedImg: '',
        });
      })
      .catch((err) => console.log('is err: ', err));
  }

  fileSelect(e) {
    console.log('e.target.files[0]: ', e.target.files[0]);
    this.setState({
      selectedImg: e.target.files[0],
    });
  }

  handleUpload(e) {
    e.preventDefault();
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('newImage', selectedImg, selectedImg.name);
    console.log('fd: ', fd);
    axios.post('/uploadImg', fd, {
      onUploadProgress: (progressEvent) => console.log(`Upload Process:  ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`),
    })
      .then((res) => console.log('is axios', res))
      .catch((err) => console.log('is err', err));
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
        <form onSubmit={this.handleUpload}>
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={this.fileSelect}
            ref={(fileInput) => this.fileInput = fileInput}
          />
          <button type="button" onClick={() => this.fileInput.click()}>Upload Image</button>
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default App;
