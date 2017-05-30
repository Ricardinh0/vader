import React, { PropTypes } from 'react';

const defaultProps = {
  imageSrc: '',
  handleImage: null
};

const propTypes = {
  imageSrc: PropTypes.string,
  handleImage: PropTypes.func
};

const AvatarImage = ({
  imageSrc,
  handleImage
}) => {
  const handleLoad = (e) => {
    const {
      target: image
    } = e;

    handleImage(e, {
      target: image,
      width: image.width,
      height: image.height,
      x: 10,
      y: 10,
      portrait: image.height > image.width
    });
  };
  return (
    <img alt="AvatarImage" src={imageSrc} onLoad={e => handleLoad(e)} style={{ display: 'none' }} />
  );
};

AvatarImage.defaultProps = defaultProps;
AvatarImage.propTypes = propTypes;

export default AvatarImage;
