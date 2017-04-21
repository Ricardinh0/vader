import React from 'react';

const AvatarImage = ({
  imageSrc,
  handleImage
}) => {

  const handleLoad = e => {
    const {
      target: image
    } = e;
    handleImage(e, {
      target: image,
      width: image.width,
      height: image.height,
      x: 0,
      y: 0,
    });
  }

  return (
    <img src={imageSrc} onLoad={(e) => handleLoad(e)} style={{display:'none'}} />
  )
};

export default AvatarImage;
