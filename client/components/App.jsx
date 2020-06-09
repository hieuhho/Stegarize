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
      uploadProgress: 0,
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
    this.setState({ selectedImg: null });
    return axios.post('/uploadImg', fd, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        this.setState({
          uploadProgress: percent,
        });
      },
    });
  }

  handleEncode(e) {
    e.preventDefault();
    const { selectedImg, text } = this.state;
    if (selectedImg !== null && text !== '') {
      axios.all([this.handleImage(), this.handleText()])
        .then(axios.spread((...response) => {
          this.setState({ confirmation: 'keep it secret, keep it safe', uploadProgress: 0 });
        }))
        .then(() => window.location.href = '/download')
        .catch((err) => { this.setState({ errorMessage: `${err.response.status} ${err.response.data}`, confirmation: 'you shall not pass' }); })
        .finally(() => this.clearAndReload());
    }
  }

  handleDecode() {
    const { selectedImg } = this.state;
    const fd = new FormData();
    fd.append('secretImage', selectedImg, selectedImg.name);
    this.setState({ selectedImg: null });
    axios.post('/decode', fd, {
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        this.setState({
          uploadProgress: percent,
        });
      },
    })
      .then((res) => {
        this.setState({ decoded: `Hidden message: ${res.data}`, imgPreview: null, uploadProgress: 0 });
      })
      .catch((err) => { err.response ? this.setState({ errorMessage: `${err.response.status} ${err.response.data.substring(err.response.data.indexOf('Error:'), err.response.data.indexOf('<br>'))}`, confirmation: 'Always remember, Frodo, the message is trying to get back to its master. It wants to be found.', uploadProgress: 0 }) : this.setState({ errorMessage: 'This is not the message you\'re looking for', uploadProgress: 0 }); })
      .finally(() => this.clearAndReload());
  }

  clearAndReload() {
    setTimeout(() => {
      this.setState({
        text: '',
        selectedImg: null,
        confirmation: 'deleting files ...',
        imgPreview: null,
      });
    }, 6000);
    setTimeout(() => window.location.reload(false), 7000);
  }

  render() {
    const {
      text, confirmation, imgPreview, selectedImg, decoded, errorMessage, uploadProgress,
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
        {(decoded && (<h2>{decoded}</h2>)) || (errorMessage && (<h2>{errorMessage}</h2>))}
        {uploadProgress > 0 && (
        <div className="progressBar">
          <div className="progressDone" style={{ opacity: 1, width: `${uploadProgress}%` }}>
            {uploadProgress}
            %
          </div>
        </div>
        )}
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
