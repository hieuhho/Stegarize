import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      confirmation: 'Stegarize',
      selectedImg: null,
      imgPreview: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleText = this.handleText.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.handleEncode = this.handleEncode.bind(this);
    this.handleDecode = this.handleDecode.bind(this);
    this.clearAndReload = this.clearAndReload.bind(this);
  }

  handleChange(e) {
    e.target.id === 'selectedImg' ? this.setState({ selectedImg: e.target.files[0], imgPreview: URL.createObjectURL(e.target.files[0]) })
      : this.setState({ [e.target.id]: e.target.value });
  }

  handleText() {
    const { text } = this.state;
    return axios.post('/uploadText', { text });
  }

  handleImage() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('secretImage', selectedImg, selectedImg.name);
    return axios.post('/uploadImg', fd, { onUploadProgress: (progressEvent) => console.log(`Upload Process: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`) });
  }

  handleEncode(e) {
    e.preventDefault();
    const { selectedImg, text } = this.state;
    if (selectedImg !== null && text !== '') {
      axios.all([this.handleImage(), this.handleText()])
        .then(axios.spread((...response) => {
          this.setState({ confirmation: 'keep it secret, keep it safe' });
        }))
        .then(() => window.open('/download'))
        .catch((err) => { this.setState({ errorMessage: `${err.response.status} ${err.response.data}`, confirmation: 'you shall not pass' }); })
        .finally(() => this.clearAndReload());
    }
  }

  handleDecode() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('secretImage', selectedImg, selectedImg.name);
    axios.post('/decode', fd, { onUploadProgress: (progressEvent) => console.log(`Upload Process: ${Math.round((progressEvent.loaded / progressEvent.total) * 100)} %`) })
      .then((res) => { this.setState({ decoded: `Hidden message: ${res.data}`, imgPreview: null }); })
      .catch((err) => { this.setState({ errorMessage: `${err.response.status} ${err.response.data}`, confirmation: 'Always remember, Frodo, the message is trying to get back to its master. It wants to be found.' }); });
    // .finally(() => this.clearAndReload());
  }

  clearAndReload() {
    setTimeout(() => {
      this.setState({
        text: '',
        selectedImg: null,
        confirmation: 'mischief managed!',
        imgPreview: null,
      });
    }, 4000);
    setTimeout(() => window.location.reload(false), 5000);
  }

  render() {
    const {
      text, confirmation, imgPreview, selectedImg, decoded, errorMessage,
    } = this.state;
    return (
      <div className="main-container">
        <h1>
          {confirmation}
        </h1>
        <br />
        <form
          className="userArea"
          onSubmit={this.handleEncode}
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
          <button className="uploadButton" type="button" onClick={() => this.fileInput.click()}>Upload</button>
          <input
            className="textBox"
            type="text"
            placeholder="Hide your message"
            id="text"
            value={text}
            onChange={this.handleChange}
            required
          />
          <button className="encodeButton" type="submit">Encode</button>
          {selectedImg !== null
          && <button className="decodeButton" type="button" onClick={this.handleDecode}>Decode</button>}
        </form>
        <br />
        {imgPreview !== null && (
        <div><img alt="loading..." src={imgPreview} /></div>
        )}
        <br />
        {(decoded && (<div>{decoded}</div>)) || (errorMessage && (<div>{errorMessage}</div>))}
        <br />
        <div className="instructions">
          <p>
            To encode: upload an image, enter your message and click Encode.
          </p>
          <p>
            To decode: upload an image and click Decode.
          </p>
        </div>
      </div>
    );
  }
}

export default App;
