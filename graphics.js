"use strict";


const PIXIapp = new PIXI.Application({
    width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xffffff
});
document.body.appendChild(PIXIapp.view);

const container = new PIXI.Container();

PIXIapp.stage.addChild(container);



var x = 0
var y = 0

var document_mouse_x = 0
var document_mouse_y = 0
var mouse_x = 0
var mouse_y = 0
var canvas_mouse_moving = false
var SCALE = 20
var SIZEx = window.innerWidth
var SIZEy = window.innerHeight
var SIZE = 600 //(SIZEx + SIZEy)/2
var relative_SCALE = SIZE / SCALE
var SCALE_change = 1.2

var timeNow = (new Date()).getTime()
var timePast = timeNow

var pixTexturesCompression = 64
var objTimeToMove = 250 //msec

var storageObjects = JSON.parse(localStorage.getItem('mainObjects'))
var storageObjPreloaded = prepareObjects(storageObjects)

var mainObj = '0'

//newdrawObj.x = (SCALE / 2 + storageObj.obj_x - x) * relative_SCALE
//newdrawObj.y = (SCALE / 2 - storageObj.obj_y + y) * relative_SCALE
var drawInfos = [];
var speed = 0;
for (var obj of storageObjPreloaded) {
  graphishDrawInfoAdd(obj)
}


function graphishDrawInfoUpdate(obj) {

  var drawInfoElement = drawInfos.find(function(element, index, array) {
    return element.id == obj.obj_id
  })

  if (drawInfoElement == undefined) {
    graphishDrawInfoAdd(prepareObject(obj))
    return
  }

  drawInfoElement.xDestinationFrom = drawInfoElement.x
  drawInfoElement.yDestinationFrom = drawInfoElement.y

  drawInfoElement.xWorld = obj.obj_x
  drawInfoElement.yWorld = obj.obj_y
  drawInfoElement.timeDestination = objTimeToMove

}


function graphishDrawInfoChangeUpdate(obj) {

  var drawInfoElement = drawInfos.find(function(element, index, array) {
    return element.id == obj.obj_id
  })

  if (drawInfoElement == undefined) {
    graphishDrawInfoAdd(prepareObject(obj))
    return
  }

  drawInfoElement.xDestinationFrom = drawInfoElement.x
  drawInfoElement.yDestinationFrom = drawInfoElement.y

  drawInfoElement.xWorld += obj.obj_x
  drawInfoElement.yWorld += obj.obj_y
  drawInfoElement.timeDestination = objTimeToMove

}


function graphishDrawInfoAdd(obj) {

  var newObj = new PIXI.Sprite(obj.pixiTexture)

  newObj.id = obj.obj_id
  newObj.xWorld = 0
  newObj.yWorld = 0
  newObj.xDestinationFrom = 0
  newObj.yDestinationFrom = 0
  newObj.timeDestination = 0
  newObj.x = 0
  newObj.y = 0

  container.addChild(newObj)

  drawInfos.push(newObj)

}



function prepareObjects(storageObjects) {

  for (var obj of storageObjects) {
    prepareObject(obj)

  }

  return storageObjects
}

function prepareObject(obj) {
  obj.pixiTexture = new PIXI.Texture.from(obj.obj_pic)
  return obj
}



function update(deltaTime) {

  drawInfos.forEach(function(drawInfo) {

    var xCordTo = (drawInfo.xWorld - x) * relative_SCALE
    var yCordTo = (drawInfo.yWorld - y) * relative_SCALE

    if (drawInfo.timeDestination > 0) {

      //console.log(deltaTime)

      drawInfo.timeDestination += -deltaTime

      var deltaXDestination = xCordTo - drawInfo.xDestinationFrom
      var deltaYDestination = yCordTo - drawInfo.yDestinationFrom
      var destinationProportion = 1 - drawInfo.timeDestination / objTimeToMove

      xCordTo = drawInfo.xDestinationFrom + deltaXDestination * destinationProportion
      yCordTo = drawInfo.yDestinationFrom + deltaYDestination * destinationProportion

    } else {
      drawInfo.timeDestination = 0
    }

    drawInfo.x = xCordTo
    drawInfo.y = yCordTo

    var xScale = 1 / (drawInfo.texture.width / pixTexturesCompression) / (SCALE / pixTexturesCompression)
    var yScale = 1 / (drawInfo.texture.height / pixTexturesCompression) / (SCALE / pixTexturesCompression)
    drawInfo.scale.set(xScale , yScale )

    //console.log(drawInfo.xDestinationFrom)

  });
}


PIXIapp.ticker.add((delta) => {

  timeNow = (new Date()).getTime()
  var deltaTime = timeNow - timePast

  update(deltaTime)

  timePast = timeNow


});
