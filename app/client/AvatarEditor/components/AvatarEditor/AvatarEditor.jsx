import React, { Component, PropTypes } from 'react';
import HiDPICanvas from '../../utils/HiDPICanvas';
import { paint, move, scale, getBlob, getMousePos, getAction, getAnchor } from '../../lib/avatarCanvas';
import AvatarImage from '../AvatarImage/AvatarImage';

class AvatarEditor extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      image: undefined,
      imageSrc: '',
      imageRatio: 0,
      scaling: false,
      moving: false,
      offSet: {x:0,y:0}
    }
    this.handleSave = this.handleSave.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleImage = this.handleImage.bind(this);
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

  handleFileChange(e) {
    this.setState({
      imageSrc: URL.createObjectURL(e.target.files[0])
    });
  }

  handleImage(e, image) {
    const {
      canvas
    } = this.refs;
    this.setState({
      image: image,
    });
    const anchor = getAnchor(image);
    paint({
      canvas,
      image,
      anchor
    });
  }

  handleScale(mousePos) {
    const {
      canvas
    } = this.refs;
    const {
      image,
      anchorHeld,
      anchorOpposite
    } = this.state;
    const anchor = getAnchor(image);
    const ratio = image.width / image.height;
    const position = scale({
      mousePos,
      image,
      anchor,
      anchorOpposite,
      anchorHeld,
      ratio
    });

    image.x = position.x;
    image.y = position.y;
    image.width = position.width;
    image.height = position.height;

    paint({
      canvas,
      image,
      anchor
    });
  }

  handleMove(mousePos) {
    const {
      canvas
    } = this.refs;
    const {
      image,
      offSet
    } = this.state;
    const position = move({
      mousePos,
      canvas,
      image,
      offSet
    });

    image.x = position.x;
    image.y = position.y;

    const anchor = getAnchor(image);

    paint({
      canvas,
      image,
      anchor
    });
  }

  handleMouseMove(e) {
    const mousePos = getMousePos(e);
    const {
      scaling,
      moving,
    } = this.state;
    if (scaling) {
      this.handleScale(mousePos);
    } else if (moving) {
      this.handleMove(mousePos);
    }
  }

  handleMouseDown(e) {
    const {
      image
    } = this.state;
    if (!image) return;
    const anchor = getAnchor(image);
    const action = getAction(getMousePos(e), image, anchor);
    this.setState({
      [action.type]: true,
      offSet: action.offSet || {x:0,y:0},
      anchorHeld: action.anchorHeld || '',
      anchorOpposite: action.anchorOpposite || '',
    });
  }

  handleMouseUp(e) {
    this.setState({
      scaling: false,
      moving: false
    });
  }

  handleSave(e) {
    const {
      canvas
    } = this.refs;
    const {
      image
    } = this.state;

    const anchor = getAnchor(image);

    const blob = getBlob({
      before: () => {
        paint({
          canvas,
          image,
          anchor,
          noBoundingBox: true
        });
      },
      canvas,
      after: () => {
        paint({
          canvas,
          image,
          anchor
        });
      }
    });

    const ele = document.createElement('img');
    ele.width = canvas.width / 2;
    ele.setAttribute('src', blob);
    document.body.appendChild(ele);
  }

  render() {

    const {
      handleSave,
      handleFileChange,
      handleImage,
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
          <AvatarImage 
            imageSrc={imageSrc} 
            handleImage={handleImage}
          />
        }
        <br />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  }
};

export default AvatarEditor;
