import React, { Component, PropTypes } from 'react';
import HiDPICanvas from '../utils/HiDPICanvas';
import { paint, getBlob, getMousePos } from '../lib/avatarCanvas';

class AvatarEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: '',
      imageRatio: 0,
      scaling: false,
      moving: false
    }
    this.handleSave = this.handleSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileLoad = this.handleFileLoad.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
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
    const {
      canvas
    } = this.refs;

    const blob = getBlob({
      before: () => {console.log('before')},
      canvas,
      after: () => {console.log('after')}
    });

    const image = document.createElement('img');
    image.setAttribute('src', blob);
    document.body.appendChild(image);
  }

  handleFileChange(e) {
    this.setState({
      imageSrc: URL.createObjectURL(e.target.files[0])
    });
  }

  handleFileLoad(e) {
    const {
      canvas
    } = this.refs;
    const {
      target: image
    } = e;
    this.setState({
      imageRatio: image.width / image.height
    })
    paint({
      canvas,
      image,
      imagePos: { x:0, y:0 },
      width:200,
      height:200,
    });
  }

  handleScale(mousePos) {

  }

  handleMove(mousePos) {

  }

  handleMouseMove(e) {
    const mouse = getMousePos(e);
    const {
      scaling,
      moving,
    } = this.state;
    if (scaling) {
      handleScale(mouse);
    } else if (moving) {
      handleMove(mouse);
    }
  }

  handleMouseDown(e) {
    const mouse = getMousePos(e);
  }

  handleMouseUp(e) {
    this.setState({
      scaling: false,
      moving: false
    });
  }

  render() {

    const {
      handleSave,
      handleFileChange,
      handleFileLoad,
      handleMouseMove,
      handleMouseDown,
      handleMouseUp
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
        <canvas 
          ref="canvas" 
          width={width} 
          height={height}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        { imageSrc &&
          <img src={imageSrc} onLoad={handleFileLoad} width="0" height="0" />
        }
        <br />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  }
};

export default AvatarEditor;
