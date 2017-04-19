import drawMask from '../utils/drawMask.js'

const paint = ({
  canvas,
  image,
  imagePos = { x:0, y:0 },
  width = 200,
  height = 200,
  maskPos = { x:width/2, y:height/2 },
  maskRadius = width/2,
  maskFeather = 0
}) => {
  if (!canvas) return;
  //
  const ctx = canvas.getContext('2d');
  //  Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //  Draw image
  if (image) {
    ctx.drawImage(image, imagePos.x, imagePos.y, width, height);
    //
    drawMask({
      ctx, 
      maskPos, 
      maskRadius,
      maskFeather
    });
  }
};

const getBlob = ({
  canvas,
  before,
  after
}) => {
  before();
  const blob = canvas.toDataURL();
  after();
  return blob;
}

export {
  paint,
  getBlob
}