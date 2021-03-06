export default ({
  ctx,
  maskRadius = 100,
  maskPos = {
    x: maskRadius,
    y: maskRadius
  },
  maskFeather = 0
}) => {
  if (!ctx) return;
  // create off-screen temporary canvas where we draw in the shadow
  const temp = document.createElement('canvas');
  const tx = temp.getContext('2d');
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
  tx.shadowBlur = maskFeather;
  // draw the arc, only the shadow will be inside the context
  tx.arc(maskPos.x, maskPos.y, maskRadius, 0, 2 * Math.PI);
  tx.closePath();
  tx.fill();
  // now punch a hole in main canvas with the blurred shadow
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(temp, 0, 0);
  ctx.restore();
};
