import drawMask from '../utils/drawMask';

const paint = ({
  canvas,
  image,
  anchor,
  noBoundingBox = false
}) => {
  if (!canvas) return;
  const { target, x, y, width, height } = image;
  //
  const ctx = canvas.getContext('2d');
  const anchorOffset = anchor.width/2;
  //  Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //  Setup styles
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  //  Draw image
  if (image) {
    ctx.drawImage(target, x, y, width, height);
    //
    drawMask({
      ctx,
      maskPos: {
        x: (canvas.width / 2) / 2,
        y: (canvas.height / 2) / 2,
      }
    });
    debugger;
    //
    if (noBoundingBox === undefined || !noBoundingBox) {
      //  Draw bounding box
      ctx.strokeRect(x, y, width, height);
      //  Draw anchors
      ctx.beginPath();
      ctx.arc(x, y, anchor.width, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width, y, anchor.width, anchor.width, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + width, y + height, anchor.width, anchor.width, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y + height, anchor.width, anchor.width, 0, 2 * Math.PI);
      ctx.fill();
    }
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
};

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
};

const getAnchor = image => {
  return {
    width: 10,
    topLeft: {
      x: image.x,
      y: image.y,
      opposite: 'bottomRight'
    },
    topRight: {
      x: image.x + image.width, 
      y: image.y,
      opposite: 'bottomLeft'
    },
    bottomRight: {
      x: image.x + image.width,
      y: image.y + image.height,
      opposite: 'topLeft'
    },
    bottomLeft: {
      x: image.x,
      y: image.y + image.height,
      opposite: 'topRight'
    }
  };
}

const getAction = (mousePos, image, anchor) => {
  for(var key in anchor){
    var areaRelativeToBox = (mousePos.x - anchor[key].x - (anchor.width/2)) * (mousePos.y - anchor[key].y - (anchor.width/2));
    if(areaRelativeToBox > 0 && areaRelativeToBox < Math.pow(anchor.width, 2)) {
      //  Return the type
      return {
        type: 'scaling',
        anchorHeld: key,
        anchorOpposite: anchor[key].opposite
      };
    }
  }
  if ( mousePos.x > image.x && mousePos.x < ( image.x + image.width ) && mousePos.y > image.y && mousePos.y < ( image.y + image.height ) ) {
    //  Return the type
    return {
      type: 'moving',
      offSet: {
        x: mousePos.x - image.x,
        y: mousePos.y - image.y
      }
    };
  }
  return {
    type: false
  };
};

const move = ({
  mousePos,
  canvas,
  image,
  offSet
}) => {
  //  Set the XY coords
  let x = mousePos.x - offSet.x;
  let y = mousePos.y - offSet.y;
  //  Constain XY position top left
  x = x < 0 ? image.x : x;
  y = y < 0 ? image.y : y;
  //  Constain XY position bottom right
  x = (x + image.width) > canvas.width ? image.x : x;
  y = (y + image.height) > canvas.height ? image.y : y;
  //  Paint the canvas
  return { x: x, y: y };
};

const scale = ({
  mousePos,
  image,
  anchor,
  anchorOpposite,
  anchorHeld,
  ratio
}) => {
  //  Set the XY coords
  let {
    x,
    y,
    width,
    height
  } = image;
  //
  width = Math.abs(anchor[anchorOpposite].x - mousePos.x);
  height = ratio <= 1 ? (width * ratio) : (width / ratio);
  //
  if ( anchorHeld === 'topLeft' ) {
    x = anchor[anchorOpposite].x - width;
    y = anchor[anchorOpposite].y - height;
  }
  //
  if ( anchorHeld === 'topRight' ) {
    x = anchor[anchorOpposite].x;
    y = anchor[anchorOpposite].y - height;
  }
  //
  if ( anchorHeld === 'bottomLeft' ) {
    x = anchor[anchorOpposite].x - width;
    y = anchor[anchorOpposite].y;
  }
  //  Paint the canvas
  return { 
    x: x, 
    y: y, 
    width: width, 
    height: height 
  };
};

export {
  paint,
  move,
  scale,
  getBlob,
  getMousePos,
  getAnchor,
  getAction
};
