
(function(exports){

  exports.packagePrepare = function(){
    return {

    }

  };

  exports.upMove = {
    x : 0,
    y : -1
  }
  exports.leftMove = {
    x : -1,
    y : 0
  }
  exports.downMove = {
    x : 0,
    y : 1
  }
  exports.rightMove = {
    x : 1,
    y : 0
  }

  exports.abstractAction = class abstractAction {

    constructor() {
      this.id = 0
      this.xTo = 0
      this.yTo = 0
      this.target = 0
      this.collised = 0
      this.speed = 0
      this.damage = 0
      this.liveTicks = 0

      this.obj_id = 0
      this.obj_x = 0
      this.obj_y = 0
      this.obj_size = 1
      this.obj_pic = 'public/images/DEFAULT.png'

      this.obj = {}
    }

    initialize = function () {

    }

    disappearance = function () {

    }

    tick = function () {

    }

    onCollision = function (obj) {

    }

  }

  exports.magicArrow = class magicArrow extends exports.abstractAction  {
    //exports.abstractAction.call(this);

    constructor() {
      super()

      this.speed = 1
      this.damage = 1
      this.liveTicks = 100

      this._dx = 0
      this._dy = 0
      this._dxy = 0
      this._xratio = 0
      this._yratio = 0
    }

    initialize = function () {
      this._dx = this.xTo - this.obj_x
      this._dy = this.yTo - this.obj_y
      this._dxy = (this._dx**2 + this._dy**2)**(0.5)
      this._xratio = this._dx / this._dxy
      this._yratio = this._dy / this._dxy

    }

    disappearance = function () {
      if(this.collised > 0) {
        return true

      } else {
        return false

      }
    }

    tick = function () {

      this.obj.obj_x = this.obj.obj_x + this.speed * this._xratio
      this.obj.obj_y = this.obj.obj_y + this.speed * this._yratio

    }

    onCollision = function (objCollided) {
      objCollided.obj_hp = objCollided.hp - this.damage
    }

  }



}(typeof exports === 'undefined' ? this.scripts = {} : exports));
