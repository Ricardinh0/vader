import React, { Component } from 'react';
import HiDPICanvas from '../utils/HiDPICanvas';

class AvatarEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      boundingBox: {}
    };
  }

  getBoundingBox() {

  }

  setBoundingBox(obj) {
    boundingBox.width = obj.width || boundingBox.width;
    boundingBox.height = obj.height || boundingBox.height;
    boundingBox.x = obj.x || boundingBox.x;
    boundingBox.y = obj.y || boundingBox.y;
  };

  getAnchor(params) {
    //
    var params = params || {};
    const boundingBox = getBoundingBox();
    //
    var x = params.x || boundingBox.x;
    var y = params.y || boundingBox.y;
    var width = params.width || boundingBox.width;
    var height = params.height || boundingBox.height;
    //
    return {
      topLeft: {
        x: x,
        y: y,
        opposite: 'bottomRight'
      },
      topRight: {
        x: x + width, 
        y: y,
        opposite: 'bottomLeft'
      },
      bottomRight: {
        x: x + width,
        y: y + height,
        opposite: 'topLeft'
      },
      bottomLeft: {
        x: x,
        y: y + height,
        opposite: 'topRight'
      }
    };
  };

  componentDidMount() {
    const canvas = this.refs.canvas;
    HiDPICanvas(canvas, canvas.width, canvas.height);
  }

  render() {

    const props = {} = this.props;

    return (
      <canvas ref="canvas"/>
    );
  }
};

export default AvatarEditor;
