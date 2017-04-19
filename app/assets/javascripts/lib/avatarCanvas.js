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

const getMouseToCanvasCoords = ({
  canvas, 
  clientX,
  clientY
}) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
};

const getMousePos = (e) => {
  const {
    target: canvas,
    clientX,
    clientY
  } = e;
  const mouse = getMouseToCanvasCoords({
    canvas, 
    clientX,
    clientY
  });
  return mouse;
}

const move = (mouse) => {
  //  Set the XY coords
  var x = mouse.x - offsetX;
  var y = mouse.y - offsetY;
  //  Constain XY position top left
  x = x < 0 ? boundingBox.x : x;
  y = y < 0 ? boundingBox.y : y;
  //  Constain XY position bottom right
  x = (x + boundingBox.width) > canvas.width ? boundingBox.x : x;
  y = (y + boundingBox.height) > canvas.height ? boundingBox.y : y;
  //  Paint the canvas
  return { x: x, y: y };
};

export {
  paint,
  getBlob,
  getMousePos
};
