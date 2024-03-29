  ////////////////////////////////////////////////////////
 /////////////////////// ЕГОР ЛОХ ///////////////////////
//////////////////////////////////////////////////////// 

'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require("multer");
var uploadLimit = '10mb';

var https = require('https')
var http = require('http');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var scriptsModule = require('./scripts.js');
var serverControls = require('./serverControls.js');

var fs = require('fs')


var app = express();

var port = 1338;
var my_uri = 'http://diwos.online/login';

var returnVal = false



//////////////////////////////////
//////////// Датабаза ////////////
//////////////////////////////////
var mysql = require("mysql2");
var connection = mysql.createConnection({
varhost: "localhost",
    user: "root",
    database: "diwos",
    password: "qwer1234",
    port: 3308
});

connection.connect(function(err){
  if (err) {
    return console.error("Ошибка: " + err.message);
  }
    else{
      console.log("Подключение к серверу MySQL успешно установлено!");
  }
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: uploadLimit}));
app.use(bodyParser.urlencoded({ extended: true, limit: uploadLimit}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


//////////////////////////////////////////
//////////// multer
//////////////////////////////////


const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/images/uploads");
    },
    filename: (req, file, cb) =>{
        let date = new Date();
        let fileName = Date.parse(date) + "_" + file.originalname
        console.log(fileName)
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {

    if(file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"||
    file.mimetype === "image/jpeg"||
    file.mimetype === "image/gif"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }

app.use(express.static(__dirname));

app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("filedata"));
app.post("/upload", function (req, res, next) {

    let filedata = req.file;
    if(!filedata) {
      res.send("Ошибка при загрузке файла");
    }
    else {
      res.redirect(my_uri)
    }

});


  ////////////////////////////////////////////////
 //////////////////// REST //////////////////////
////////////////////////////////////////////////

app.post("/picLoad", function (request, response) {
    if (!request.body) return response.sendStatus(400)

    var pic       = request.body.image
    var obj_name  = request.body.name
    var obj_desc  = request.body.opis
    var obj_id    = null;

    console.log(request.body)

    connection.query("INSERT INTO `images` (`desc`) VALUES (?)",
    [obj_name + "_" + obj_desc],
    function(err, data_obj_pic) {
      if(err) return console.log(err)

      obj_id = data_obj_pic.insertId;
      var pic_dir   = path.normalize(__dirname + '/public/images/obj/' + obj_id)

      var stream = fs.createWriteStream(pic_dir)
      request.pipe(stream)

      stream.on('end', function(err){
        if(err) return console.log(err)
        response.sendStatus(201)
      })
    })
})

app.post("/picLoad", function (request, response) {
    if (!request.body) return response.sendStatus(400)

    var pic       = request.body.image
    var obj_name  = request.body.name
    var obj_desc  = request.body.opis
    var obj_id    = null;

    request.on('data', function(chunk) {
       console.log(chunk)
    });



    connection.query("INSERT INTO `images` (`desc`) VALUES (?)",
    [obj_name + "_" + obj_desc],
    function(err, data_obj_pic) {
      if(err) return console.log(err)

      obj_id = data_obj_pic.insertId;
      var pic_dir   = path.normalize(__dirname + '/public/images/obj/' + obj_id)

      var stream = fs.createWriteStream(pic_dir)
      request.pipe(stream)

      stream.on('end', function(err){
        if(err) return console.log(err)
        response.sendStatus(201)
      })
    })
})


app.post("/objLoad", function (request, response) {
    if (!request.body) return response.sendStatus(400)
    tokenValid(request, response, function(request, response, user) {
      var newObj = {}
      newObj.obj_x     = Number(request.body.x)
      newObj.obj_y     = Number(request.body.y)
      newObj.obj_prop  = request.body.func
      newObj.obj_pic   = request.body.image
      newObj.obj_name  = request.body.name
      newObj.obj_desc  = request.body.opis

      newObj.obj_pic   = newObj.obj_pic.replace(/\//g, "\\")

      connection.query("INSERT INTO objects (obj_x, obj_y, obj_prop, obj_pic, obj_name, obj_desc) VALUES (?, ?, ?, ?, ?, ?)",
      [newObj.obj_x, newObj.obj_y, newObj.obj_prop, newObj.obj_pic, newObj.obj_name, newObj.obj_desc],
      function(err, data) {
        if(err) return console.log(err)

        newObj.obj_id = data.insertId;

        addToWorldObjects (newObj)

        response.sendStatus(201)
      })
    })
})


app.post("/rights", function (request, response) {
    if (!request.body) return response.sendStatus(400)
    tokenValid(request, response, function(request, response, user) {
      response.send(user.user_rights_level)
    })
})


app.post("/worldSave", function (request, response) {
    if (!request.body) return response.sendStatus(400)
    tokenValid(request, response, function(request, response, user) {

      if (Number(user.user_rights_level) > 99) {
        worldSave ()
        response.send(200)
      } else {
        response.send(400)
      }

    })
})


app.post("/allImagesPaths", function (request, response) {
    if (!request.body) return response.sendStatus(400)
    tokenValid(request, response, function(request, response, user) {
      response.send(getAllImagesPaths())
    })
})


app.use("/scripts.js", function (request, response) {
    response.sendFile(__dirname + "/scripts.js");
});

app.get("/", function (request, response) {
    response.redirect(my_uri)
});

app.all("/", function (request, response) {
    //response.redirect(my_uri)
    response.send("'Другой программист лох и не может сделать нормальный запрос :|'");
});




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(port, function () {
    console.log('Express server listening on port ' + server.address().port)
    debug('Express server listening on port ' + server.address().port);
});



////////////////////////////////////////////////
////////////////// websocket ///////////////////
////////////////////////////////////////////////

var WebSocketServer = require('websocket').server;

var wsServer = new WebSocketServer({
    httpServer: server,
    port: 1337
});

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {

          // console.log('Received Message: ' + message.utf8Data);
          var jsonReq = JSON.parse(message.utf8Data)
          tokenValidWS (connection, jsonReq.token, function(connection, user) {

            if (jsonReq.type == 'chat') {
              chatAddMessage(user.user_nickname, jsonReq.message)
              var jsonRes = new Object()
              jsonRes.type = 'chat'
              jsonRes.user = user.user_nickname,
              jsonRes.message = jsonReq.message

              wsServer.broadcast(JSON.stringify(jsonRes))

            } else if (jsonReq.type == 'chatHistory') {
              var jsonRes = new Object()
              jsonRes.type = 'chatHistory'
              jsonRes.history = chatMessages

              connection.sendUTF(JSON.stringify(jsonRes))

            } else if (jsonReq.type == 'center') {
              var jsonRes = new Object()
              var locSCALE = 30
              var user_obj = getGetObjectByObjectId(user.user_obj)
              jsonRes.type = 'center'
              jsonRes.x = user_obj.obj_x
              jsonRes.y = user_obj.obj_y
              jsonRes.SCALE = locSCALE

              connection.sendUTF(JSON.stringify(jsonRes))

            } else if (jsonReq.type == 'control') {

              if (jsonReq.option.type == 'move') {
                var moveOpts = getControlOpts(jsonReq.option.argument)

                if (jsonReq.event == 'keydown') {
                  var objectProcess = new Object()
                  objectProcess.dx = moveOpts.x
                  objectProcess.dy = moveOpts.y
                  objectProcess.id = user.user_obj
                  WORLD.objectProcesses.push(objectProcess)

                } else if (jsonReq.event == 'keyup') {

                  for (var objIndex in WORLD.objectProcesses) {
                    if (user.user_obj == WORLD.objectProcesses[objIndex].id) {
                      WORLD.objectProcesses.splice(objIndex, 1)
                    }
                  }

                }
              } else if (jsonReq.option.type == 'action') {
                if (jsonReq.event == 'keydown') {

                  var user_obj = getGetObjectByObjectId(user.user_obj)
                  var action = new (getControlOpts (jsonReq.option.argument))

                  addWorldAction(user_obj, action, jsonReq)

                }
              }


            } else if (jsonReq.type == 'world') {
              var jsonRes = new Object()
              jsonRes.type = 'world'
              jsonRes.world = WORLD.worldObjects
              jsonRes.mainObj = user.user_obj

              connection.sendUTF(JSON.stringify(jsonRes))

            } else if (jsonReq.type == 'worldChange') {
              var jsonRes = new Object()
              jsonRes.type = 'worldChange'
              jsonRes.world = WORLD.worldObjects

              connection.sendUTF(JSON.stringify(jsonRes))

            } else if (jsonReq.type == 'forceObjectChange') {
              if (user.user_rights_level > 10){
                console.log(jsonReq.objToUpdate)
                updateObject (jsonReq.objToUpdate)
              }

            } else if (jsonReq.type == 'ping') {

              var jsonRes = new Object()
              jsonRes.type = 'ping'
              connection.sendUTF(JSON.stringify(jsonRes))

            }


          })
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

wsServer.broadcast = function broadcast(msg) {
    //console.log(msg);
    wsServer.connections.forEach(function each(client) {
        client.sendUTF(msg);
    });
};


////////////////////////////////////////////////
/////////////// OTHER //////////////
////////////////////////////////////////////////

function makeToken()
{
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 200; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function tokenValid(request, response, callback)
{
  var user_token = request.body.token;
  returnVal = false

  connection.query("SELECT * FROM `users` WHERE `user_token` = ?",
  [user_token],
  function(err, data) {
    if(err) {
      return console.log(err)
    } else {
      if (data.length > 0) {
        //console.log('loginToken OK ')
        callback(request, response, data[0])
      } else {
        response.sendStatus(401)
      }
    }
  })
}


function tokenValidWS (client, user_token, callback) {

  connection.query("SELECT * FROM `users` WHERE `user_token` = ?",
  [user_token],
  function(err, data) {
    if(err) {
      return console.log(err)
    } else {
      if (data.length > 0) {
        //console.log('loginToken OK ')
        callback(client, data[0])
      } else {
        client.sendUTF(401)
      }
    }
  })
}


function getControlOpts (option) {

  var controlOpts = new Object()

  if (serverControls[option] != undefined) {

    controlOpts = serverControls[option]
  }

  return controlOpts

}

////////////////////////////////////////////////////////
///////////////////////// ЧАТ //////////////////////////
////////////////////////////////////////////////////////

var chatMessages = new Array()

function chatAddMessage(user, message) {
  var newMessage = new Object()

  newMessage.user = String(user)
  newMessage.message = String(message)

  chatMessages.push(newMessage)

  if (chatMessages.length > 50) {
    chatMessages.shift()
  }

}

////////////////////////////////////////////////////////
///////////////////////// МИР //////////////////////////
////////////////////////////////////////////////////////

var WORLD = new Object()
WORLD.worldObjects = new Array()
WORLD.objectProcesses = new Array()
WORLD.objectProcessing = {}
var ttempId = 0


function worldBroadcast () {
  var jsonRes = new Object()
  jsonRes.type = 'world'
  jsonRes.world = WORLD.worldObjects
  wsServer.broadcast(JSON.stringify(jsonRes))
}


function objectProcessing () {
  for (var procObj of WORLD.objectProcesses) {

    var worldObj = WORLD.worldObjects.find(function(element, index, array) {
      return element.obj_id == procObj.id
    })

    if (worldObj != undefined) {
      if (procObj.dx != undefined) {
        worldObj.obj_x = Number(worldObj.obj_x) + procObj.dx
      }

      if (procObj.dy != undefined) {
        worldObj.obj_y = Number(worldObj.obj_y) + procObj.dy
      }

      if (procObj.damage != undefined) {
        worldObj.hp = Number(worldObj.hp) - procObj.damage
      }

    }
  }

  for (var objectID in WORLD.objectProcessing) {

    var objectProc = WORLD.objectProcessing[objectID]
    var obj = objectProc.obj
    objectProc.tick()
    objectProc.liveTicks = objectProc.liveTicks - 1

    if (false) {
      objectProc.onCollision()
    }

    if (objectProc.disappearance() || objectProc.liveTicks <= 0) {
      delete  WORLD.objectProcessing[objectID]
      var index = WORLD.worldObjects.indexOf(obj);
      if (index > -1) {
        WORLD.worldObjects.splice(index, 1);
      }
    }

  }


  worldBroadcast ()
}
setInterval(objectProcessing, 125)

function worldLoad () {

  connection.query("SELECT * FROM `objects`",
  [],
  function(err, data) {
    if(err) return console.log(err);

    for (var dataElement of data) {

      addToWorldObjects (dataElement)

    }

  });

}
worldLoad ()

function worldSave () {

  var queryText = ''
  queryText = queryText + "INSERT INTO objects (obj_id, obj_x, obj_y) VALUES"
  for (var obj of WORLD.worldObjects) {
    //queryText = queryText + "UPDATE `objects` SET `obj_x` = #1, `obj_y` = #2 WHERE (`obj_id` = #3); \n"
    queryText = queryText + "(" + obj.obj_id + "," + obj.obj_x + "," + obj.obj_y + "),"

  }
  queryText = queryText.slice(0, -1)
  queryText = queryText + "ON DUPLICATE KEY UPDATE obj_x = VALUES(obj_x), obj_y = VALUES(obj_y);"

  console.log(queryText)

  connection.query(queryText,[],
  function(err, data) {
    if(err) return console.log(err)
  });

}


function worldUpdate () {

}


function addToWorldObjects (obj) {

  var newObj = {}
  newObj.obj_id = obj.obj_id
  newObj.obj_x = obj.obj_x
  newObj.obj_y = obj.obj_y
  newObj.obj_size = obj.obj_size
  newObj.obj_pic = obj.obj_pic.replace(/\\/g,'/')
  WORLD.worldObjects.push(newObj)

  worldBroadcast ()

  return newObj

}


function addWorldAction (obj, action, prop) {

  action.obj_id = 't' + obj.obj_id + 'o' + ttempId
  action.obj_x = obj.obj_x
  action.obj_y = obj.obj_y
  action.xTo = prop.mouse_x
  action.yTo = prop.mouse_y
  action.obj = addToWorldObjects (action)
  action.obj.obj_id = action.obj_id

  action.initialize()

  WORLD.objectProcessing[action.obj_id] = action

  ttempId = ttempId + 1

}



////////////////////////////////////////////////////////
///////////////////////// Редактор /////////////////////
////////////////////////////////////////////////////////


function getGetObjectByObjectId (id) {

  for (var worldObj of WORLD.worldObjects) {
    if (worldObj.obj_id == id) {
      return worldObj
    }
  }

}


function getGetObjectByUserIdDB (user_id, callback) {

  var returnVal = {}
  var queryText = ""
  queryText += "SELECT * "
  queryText += "FROM `objects` "
  queryText += "LEFT JOIN `users` ON `users`.`user_obj` = `objects`.`obj_id` "
  queryText += "WHERE `user_id` = ? "

  connection.query(queryText,
  [user_id],
  function(err, data) {
    if(err) return console.log(err)
    if (data.length > 0) {
      returnVal = data[0]
    }
    callback(returnVal)

  })
}


function getAllImagesPaths () {

  var imagesFolder = 'public/images/uploads/'
  var imagesArray = []

  fs.readdirSync('./' + imagesFolder).forEach(file => {
    imagesArray.push(imagesFolder + file);
  });

  return imagesArray

}

function updateObject (obj) {

  for (var worldObj of WORLD.worldObjects) {
    if (worldObj.obj_id == obj.obj_id) {
      for (var key in obj) {
        if (key == 'obj_id' || key == 'obj_x' || key == 'obj_y' || key == 'obj_size'){
          worldObj[key] = Number(obj[key])
        } else {
          worldObj[key] = obj[key]
        }
      }
      worldBroadcast ()
      return
    }
  }
}


////////////////////////////////////////////////////////
///////////////////////// код ебаного лоха /////////////
////////////////////////////////////////////////////////
function rolling() {

}
