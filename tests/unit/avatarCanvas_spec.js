import { 
  paint,
  move,
  scale,
  getBlob,
  getMousePos,
  getAction,
  getAnchor 
} from '../../app/client/AvatarEditor/lib/avatarCanvas';

describe('avatarCanvas', function(){

  it('will return an object of anchor points with a topRight.x of 200', function(){
    expect(getAnchor({
      x:0,
      y:0,
      width:200,
      height:100
    })).to.have.deep.property('topRight.x', 200);
  });

  it('will return an object of anchor points with a bottomRight.y of 100', function(){
    expect(getAnchor({
      x:0,
      y:0,
      width:200,
      height:100
    })).to.have.deep.property('bottomRight.y', 100);
  });

});