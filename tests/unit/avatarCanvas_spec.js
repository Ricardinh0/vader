import { 
  paint,
  move,
  scale,
  getBlob,
  getMousePos,
  getAction,
  getAnchor 
} from '../../app/client/AvatarEditor/lib/avatarCanvas';

describe('avatarCanvas', () => {

  it('will return an object of anchor points with a topRight.x of 200', () => {
    expect(getAnchor({
      x: 0,
      y: 0,
      width: 200,
      height: 100
    })).to.have.deep.property('topRight.x', 200);
  });

  it('will return an object of anchor points with a bottomRight.y of 100', () => {
    expect(getAnchor({
      x: 0,
      y: 0,
      width: 200,
      height: 100
    })).to.have.deep.property('bottomRight.y', 100);
  });
  
  /*
    it('will return image.y because the position is out of bounds (mousePos.y - offSet.y = -5)', () => {
      expect(move({
        mousePos: { x:5, y:5 },
        canvas: { width:200, height:200 },
        image: { x:5, y:15, width:100, height:100 },
        offSet: { x:10, y:10 }
      })).to.have.deep.property('y', 15);
    });
  */

  it('will return mousePos.y (mousePos.y - offSet.y = 5) because the position is within bounds', () => {
    expect(move({
      mousePos: { x: 5, y: 5 },
      canvas: { width: 200, height: 200 },
      image: { x: 5, y: 15, width: 100, height: 100 },
      offSet: { x: 10, y: 0 }
    })).to.have.deep.property('y', 5);
  });

});