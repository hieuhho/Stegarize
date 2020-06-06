import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedImg: null,
    };
    this.fileSelect = this.fileSelect.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  fileSelect(e) {
    this.setState({
      selectedImg: e.target.files[0],
    });
  }

  handleUpload(e) {
    e.preventDefault();
    const { selectedImg } = this.state;
    if (selectedImg !== null) {
      const fd = new FormData();
      fd.append('newImage', selectedImg, selectedImg.name);
      axios.post('/uploadImg', fd, {
        onUploadProgress: (progressEvent) => console.log(`Upload Process:  ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`),
      })
        .then((response) => console.log(`Successfully Uploaded on ${response.headers.date}`))
        .catch((err) => console.log(`Something went wrong! ${err}`));
    }
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
