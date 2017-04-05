(function(window){
  /*
  *
  *
  */
  var AvatarEditor = function(params){
    /*
    *
    */
    var params = params || {};
    //
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    canvas.width = params.width || 100;
    canvas.height = params.height || 100;

    var image = new Image();
    
    var ratio = 0;
    var minimumPixel = 20;

    var moving = false;
    var scaling = false;

    var offsetX = 0;
    var offsetY = 0;

    var anchorWidth = 10;
    var anchorOffset = anchorWidth / 2;
    var anchorHeld = '';
    var anchorOpposite = '';

    var boundingBox = {
      x: 100,
      y: 100,
      width: 200,
      height: 200
    };
    /*
    *
    */
    if (typeof params.image === 'string' && params.image.length) {
      image.src = params.image || '';
    } else {
      return false;
    }
    /*
    *
    */
    var setBoundingBox = function(obj){
      boundingBox.width = obj.width || boundingBox.width;
      boundingBox.height = obj.height || boundingBox.height;
      boundingBox.x = obj.x || boundingBox.x;
      boundingBox.y = obj.y || boundingBox.y;
    };
    /*
    *
    */
    var getAnchor = function(params){
      //
      var params = params || {};
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
    /*
    *
    */
    var getMouseToCanvasCoords = function(canvas, e){
      var rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    /*
    *   
    */
    var setAction = function(mouse){

      var anchor = getAnchor();

      for(var key in anchor){
        var areaRelativeToBox = (mouse.x - anchor[key].x - anchorOffset) * (mouse.y - anchor[key].y - anchorOffset);
        if(areaRelativeToBox > 0 && areaRelativeToBox < Math.pow(anchorWidth, 2)) {
          //  Set anchor config
          anchorHeld = key;
          anchorOpposite = anchor[key].opposite;
          //  Set scaling to true
          scaling = true;
          //  Return the type
          return 'anchor';
        }
      }

      if ( mouse.x > boundingBox.x && mouse.x < ( boundingBox.x + boundingBox.width ) && mouse.y > boundingBox.y && mouse.y < ( boundingBox.y + boundingBox.height ) ) {
        //  Set the mouse offsets
        offsetX = mouse.x - boundingBox.x;
        offsetY = mouse.y - boundingBox.y;
        //  Set moving to true
        moving = true;
        //  Return the type
        return 'image';
      }

    };
    /*
    *
    */
    var drawMask = function(ctx, x, y, r, f) { /// context, x, y, radius, feather size
      /// create off-screen temporary canvas where we draw in the shadow
      var temp = document.createElement('canvas');
      var tx = temp.getContext('2d');
      //
      temp.width = ctx.canvas.width;
      temp.height = ctx.canvas.height;
      // offset the context so shape itself is drawn outside canvas
      tx.translate(-temp.width, 0);
      // offset the shadow to compensate, draws shadow only on canvas
      tx.shadowOffsetX = temp.width;    
      tx.shadowOffsetY = 0;
      // black so alpha gets solid
      tx.shadowColor = '#000';
      // "feather"
      tx.shadowBlur = f;
      // draw the arc, only the shadow will be inside the context
      tx.arc(x, y, r, 0, 2 * Math.PI);
      tx.closePath();
      tx.fill();
      // now punch a hole in main canvas with the blurred shadow
      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(temp, 0, 0);
      ctx.restore();
    };
    /*
    *   
    */
    var paintCanvas = function(params){
      //
      var params = params || {};
      //
      var noBoundingBox = params.noBoundingBox || false;
      //
      var x = params.x || boundingBox.x;
      var y = params.y || boundingBox.y;
      var width = params.width || boundingBox.width;
      var height = params.height || boundingBox.height;
      //  Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //  Setup styles
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'red';
      //  Draw image
      ctx.drawImage(image, x, y, width, height);
      //  Draw mask
      drawMask(ctx, 160, 160, 100, 0);
      //  Should the canvas be painted with a bounding box?
      if ( noBoundingBox === undefined || !noBoundingBox ) {
        //  Draw bounding box
        ctx.strokeRect(x, y, width, height);
        //  Draw anchors
        ctx.strokeRect(x - anchorOffset, y - anchorOffset, anchorWidth, anchorWidth);
        ctx.strokeRect(x + width - anchorOffset, y - anchorOffset, anchorWidth, anchorWidth);
        ctx.strokeRect(x + width - anchorOffset, y + height - anchorOffset, anchorWidth, anchorWidth);
        ctx.strokeRect(x - anchorOffset, y + height - anchorOffset, anchorWidth, anchorWidth);
      }
      //  Set the bounding box config
      setBoundingBox({
        x: x,
        y: y,
        width: width,
        height: height
      });
    };
    /*
    *
    */
    var move = function(mouse){
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
      paintCanvas({ x: x, y: y });
    };
    /*
    *
    */
    var scale = function (mouse){
      //
      var anchor = getAnchor();
      //  Set the XY coords
      var x = boundingBox.x;
      var y = boundingBox.y;
      var width = boundingBox.width;
      var height = boundingBox.height;
      //
      width = Math.abs(anchor[anchorOpposite].x - mouse.x);
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
      paintCanvas({ x: x, y: y, width: width, height: height });
    };
    /*
    *
    */
    canvas.onmousemove = function(e){
      //
      var mouse = getMouseToCanvasCoords(this, e);
      //
      if (scaling) {
        scale(mouse);
      } else if (moving) {
        move(mouse);
      }
    };
    /*
    *
    */
    canvas.onmousedown = function(e){
      //
      var mouse = getMouseToCanvasCoords(this, e);
      var mouseHasHit = setAction(mouse);
      //
    };
    /*
    *
    */
    canvas.onmouseup = function(e){
      moving = false;
      scaling = false;
    };
    /*
    *
    */
    image.onload = function() {
      ratio  = this.width / this.height;
      setBoundingBox({ x: 30, y: 30, width: this.width, height: this.height });
      paintCanvas();
    };
    /*
    *   Public
    */
    return {
      canvas: canvas,
      getBlob: function(){
        //  Paint canvas sans bounding box
        paintCanvas({
          noBoundingBox: true
        });
        //  Set blob
        var blob = canvas.toDataURL();
        //  Paint canvas with bounding box and anchors
        paintCanvas();
        //  Return blob
        return blob;
      }
    };
  };
  //
  window.AvatarEditor = AvatarEditor;
  /*
  *
  */
})(window);
/*
*
*/
var avatarEditor = new window.AvatarEditor({
  image:'/images/darth-vader.jpg',
  width: 500,
  height: 500
});
/*
*
*/
var canvas = avatarEditor.canvas;
document.body.appendChild(canvas);
/*
*
*/
document.getElementById('save').onclick = function(){
  var image = document.createElement('img');
  image.setAttribute('src', avatarEditor.getBlob());
  document.body.appendChild(image);
};




