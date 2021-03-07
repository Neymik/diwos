
function mainEventControl() {
  chatInput = document.getElementById('inputChat')
  if (event.code == 'Enter') {
    let req = reqPrepare();
    req.type = 'chat'
    req.message = chatInput.value
    socket.send(JSON.stringify(req))
    chatInput.value = ""

  } else if (event.code == 'Space') {
    let req = reqPrepare();
    req.type = 'center'
    socket.send(JSON.stringify(req))

  } else if (getControlOption(event.code) != undefined && !event.repeat) {

    let option = getControlOption(event.code)

    movePrediction (option)

    let req = reqPrepare();
    req.type = 'control'
    req.mouse_x = mouse_x
    req.mouse_y = mouse_y
    req.option = option
    req.event = (event.type)
    socket.send(JSON.stringify(req))
  }
}

function mainEventControlkeyup() {
  if (getControlOption(event.code) != undefined) {
    let req = reqPrepare();
    req.type = 'control'
    req.option = getControlOption(event.code)
    req.event = (event.type)
    socket.send(JSON.stringify(req))
  }
}

function getControlOption(code) {

  var ControlOption = new Object()
  ControlOption.Key1 = '1'
  ControlOption.KeyW = {
    type: 'move',
    argument: 'upMove'
  }
  ControlOption.KeyA =
  {
    type: 'move',
    argument: 'leftMove'
  }
  ControlOption.KeyS = {
    type: 'move',
    argument: 'downMove'
  }
  ControlOption.KeyD = {
    type: 'move',
    argument: 'rightMove'
  }
  ControlOption.KeyE = {
    type: 'action',
    argument: 'magicArrow'
  }

  return ControlOption[code]

}

function reqPrepare () {
  return {
    type : 'type',
    token : scripts.getCookies('token')
  }
}

function movePrediction (option) {

  var predMove = predMoves[option]
  if (predMove != undefined) {
    var obj = {}
    obj.obj_id = mainObj
    obj.obj_x = predMove.x
    obj.obj_y = predMove.y

    graphishDrawInfoChangeUpdate(obj)
  }
}


var predMoves = {}

predMoves.upMove = {
    x : 0,
    y : -0.5
  }
predMoves.leftMove = {
    x : -0.5,
    y : 0
  }
predMoves.downMove = {
    x : 0,
    y : 0.5
  }
predMoves.rightMove = {
    x : 0.5,
    y : 0
  }
