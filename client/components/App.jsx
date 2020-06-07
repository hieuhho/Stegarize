import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      confirmation: null,
      selectedImg: null,
      imgPreview: null,
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleDecode = this.handleDecode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.target.id === 'selectedImg' ? this.setState({ selectedImg: e.target.files[0], imgPreview: URL.createObjectURL(e.target.files[0]) })
      : this.setState({ [e.target.id]: e.target.value });
  }

  handleImage() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('newImage', selectedImg, selectedImg.name);
    return axios.post('/uploadImg', fd, { onUploadProgress: (progressEvent) => console.log(`Upload Process: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`) });
  }

  handleDecode() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('decodeImage', selectedImg, selectedImg.name);
    axios.post('/decode', fd, { onUploadProgress: (progressEvent) => console.log(`Upload Process: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`) })
      .then((res) => { this.setState({ decoded: res.data }); })
      .catch((err) => console.log(err));
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
              confirmation: 'mischief managed!',
              imgPreview: null,
            });
          }, 4000);
          setTimeout(() => window.location.reload(false), 5000);
        })
        .then(() => window.open('/download'))
        .catch((err) => console.log(`Something went wrong! ${err}`));
    }
  }

  render() {
    const {
      text, confirmation, imgPreview, selectedImg, decoded,
    } = this.state;
    return (
      <div className="main-container">
        <div className="confirmation">
          {confirmation !== null && (
          <div>
            {confirmation}
          </div>
          )}
        </div>
        <form
          onSubmit={this.handleUpload}
          encType="multipart/form-data"
          autoComplete="off"
        >
          <input
            type="file"
            style={{ display: 'none' }}
            id="selectedImg"
            onChange={this.handleChange}
            ref={(fileInput) => this.fileInput = fileInput}
          />
          <button type="button" onClick={() => this.fileInput.click()}>Upload</button>
          <input
            type="text"
            placeholder="Hide your message"
            id="text"
            value={text}
            onChange={this.handleChange}
          />
          <button className="encodeButton" type="submit">Encode</button>
          {selectedImg !== null
          && <button className="decodeButton" type="button" onClick={this.handleDecode}>Decode</button>}
        </form>
        <br />
        {imgPreview !== null && (
        <div>
          <img alt="loading..." src={imgPreview} />
        </div>
        )}
        <br />
        {decoded
        && (
        <div>
          Hidden Message:
          {' '}
          {decoded}
        </div>
        )}
      </div>
    );
  }
}

export default App;
