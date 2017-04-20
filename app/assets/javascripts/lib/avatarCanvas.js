import drawMask from '../utils/drawMask'

const anchorWidth = 10;
const anchorOffset = anchorWidth / 2;
const boundingBox = ((obj = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}) => {
  let boundingBox = obj;
  return {
    get: () => boundingBox,
    set: (obj = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }) => {
      boundingBox = obj;
      return boundingBox;
    }
  }
})();

const paint = ({
  canvas,
  image,
  imagePos = { x:0, y:0 },
  width = 200,
  height = 200,
  maskPos = { x:width/2, y:height/2 },
  maskRadius = width/2,
  maskFeather = 0,
  noBoundingBox = false
}) => {
  if (!canvas) return;
  //
  const ctx = canvas.getContext('2d');
  //  Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //  Setup styles
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'red';
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
    //
    if ( noBoundingBox === undefined || !noBoundingBox ) {
      //  Draw bounding box
      ctx.strokeRect(imagePos.x, imagePos.y, width, height);
      //  Draw anchors
      ctx.strokeRect(imagePos.x - anchorOffset, imagePos.y - anchorOffset, anchorWidth, anchorWidth);
      ctx.strokeRect(imagePos.x + width - anchorOffset, imagePos.y - anchorOffset, anchorWidth, anchorWidth);
      ctx.strokeRect(imagePos.x + width - anchorOffset, imagePos.y + height - anchorOffset, anchorWidth, anchorWidth);
      ctx.strokeRect(imagePos.x - anchorOffset, imagePos.y + height - anchorOffset, anchorWidth, anchorWidth);
    }
    //
    boundingBox.set({ 
      x: imagePos.x,
      y: imagePos.y,
      width: width,
      height: height
    })
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

const getMousePos = e => {
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

const getAnchor = (obj = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}) => {
  return {
    topLeft: {
      x: obj.x,
      y: obj.y,
      opposite: 'bottomRight'
    },
    topRight: {
      x: obj.x + obj.width, 
      y: obj.y,
      opposite: 'bottomLeft'
    },
    bottomRight: {
      x: obj.x + obj.width,
      y: obj.y + obj.height,
      opposite: 'topLeft'
    },
    bottomLeft: {
      x: obj.x,
      y: obj.y + obj.height,
      opposite: 'topRight'
    }
  };
}

const getAction = (mouse) => {
  const box = boundingBox.get();
  const anchor = getAnchor(box);
  for(var key in anchor){
    var areaRelativeToBox = (mouse.x - anchor[key].x - anchorOffset) * (mouse.y - anchor[key].y - anchorOffset);
    if(areaRelativeToBox > 0 && areaRelativeToBox < Math.pow(anchorWidth, 2)) {
      //  Return the type
      return 'scale';
    }
  }
  if ( mouse.x > box.x && mouse.x < ( box.x + box.width ) && mouse.y > box.y && mouse.y < ( box.y + box.height ) ) {
    //  Return the type
    return 'move';
  }
  return false;
};

const move = mouse => {
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
  getMousePos,
  getAnchor,
  getAction
};
