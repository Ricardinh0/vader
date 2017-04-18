import React, { Component, PropTypes } from 'react';
import HiDPICanvas from '../utils/HiDPICanvas';

class AvatarEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: ''
    }
    this.handleSave = this.handleSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileLoad = this.handleFileLoad.bind(this);
  }

  componentDidMount() {
    
    const {
      canvas
    } = this.refs;

    const {
      width,
      height
    } = this.props;
    HiDPICanvas(canvas, width, height);
  }

  handleSave(e) {
    return;
    const image = document.createElement('img');
    image.setAttribute('src', this.getBlob());
    document.body.appendChild(image);
  }

  handleFileChange(e) {
    this.setState({
      imageSrc: URL.createObjectURL(e.target.files[0])
    });
  }

  handleFileLoad(e) {
    this.paintCanvas({
      x:0,
      y:0,
      width:200,
      height:200,
      image: e.target
    })
  }

  paintCanvas(params) {
    const {
      canvas
    } = this.refs;

    const ctx = canvas.getContext('2d');
    //
    const temp = params || {};
    //
    const x = temp.x;
    const y = temp.y;
    const width = temp.width;
    const height = temp.height;
    const image = temp.image;
    //  Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //  Setup styles
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'red';
    //  Draw image
    ctx.drawImage(image, x, y, width, height);
  };

  getBlob() {
    const canvas = this.refs.canvas;
    //  Paint canvas sans bounding box
    paintCanvas({ noBoundingBox: true });
    //  Set blob
    var blob = canvas.toDataURL();
    //  Paint canvas with bounding box and anchors
    paintCanvas();
    //  Return blob
    return blob;
  }

  render() {

    const {
      handleSave,
      handleFileChange,
      handleFileLoad
    } = this;

    const {
      width,
      height
    } = this.props;

    const {
      imageSrc
    } = this.state;

    return (
      <div>
        <canvas ref="canvas" width={width} height={height}/>
        <img src={imageSrc} onLoad={handleFileLoad} width="0" height="0" />
        <br />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  }
};

export default AvatarEditor;
