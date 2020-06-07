import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      confirmation: null,
      selectedImg: null,
    };
    this.fileSelect = this.fileSelect.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  fileSelect(e) {
    this.setState({
      selectedImg: e.target.files[0],
    });
  }

  handleChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  handleImage() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('newImage', selectedImg, selectedImg.name);
    return axios.post('/uploadImg', fd, { onUploadProgress: (progressEvent) => console.log(`Upload Process: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`) });
  }

  handleText() {
    const { text } = this.state;
    return axios.post('/uploadText', { text });
  }

  handleUpload(e) {
    e.preventDefault();
    const { selectedImg, text } = this.state;
    if (selectedImg !== null && text !== '') {
      axios.all([this.handleImage(), this.handleText()])
        .then(axios.spread((...response) => {
          this.setState({
            confirmation: 'keep it secret, keep it safe',
          });
        }))
        .then(() => {
          setTimeout(() => {
            this.setState({
              text: '',
              selectedImg: null,
              confirmation: null,
            });
          }, 3000);
        })
        .catch((err) => console.log(`Something went wrong! ${err}`));
    }
  }

  render() {
    const { text, confirmation } = this.state;
    return (
      <div className="main-container">
        <form onSubmit={this.handleUpload}>
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={this.fileSelect}
            ref={(fileInput) => this.fileInput = fileInput}
          />
          <button type="button" onClick={() => this.fileInput.click()}>Upload</button>
          <input
            type="text"
            placeholder="Hide your message"
            value={text}
            onChange={this.handleChange}
          />
          <button type="submit">Encode</button>

        </form>
        <br />
        <div className="confirmation">
          {confirmation !== null && (
          <div>
            {confirmation}
          </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
