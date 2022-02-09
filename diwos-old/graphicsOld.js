function draw_objs(ctx) {
  $.ajax({
      url: "/objGet",
      type: "post",
      data: {
          token: scripts.getCookies('token')
      },
      success: function (objs) {

        objs.forEach((obj) => {

          console.log(obj)

          draw_pic(ctx, obj.obj_pic, obj.obj_x, obj.obj_y, 1)


        });
      }
  })
}



function get_ready(ctx) {

  relative_SCALE = SIZE / SCALE;

  rounded_SCALE = round_to_significant_figures(SCALE, sf = 2);
  SCALE_depth = Number((0.5 + Math.abs(Math.log10(rounded_SCALE))).toFixed(0)) + 2; //js имеет не точную математику нужно правильно округлять
  rounded_SCALE_step = round_to_significant_figures(rounded_SCALE / STEPS, sf = 1); //Основной шаг

  //Очистка

  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.beginPath();

  //ctx.font = FONT;
  //ctx.lineWidth = 1;

}


function grid_markup(ctx) {

    var left_border  = (x - SCALE / 2);
    var top_border  = (y - SCALE / 2);

    x_step_start = left_border - left_border % rounded_SCALE_step;
    y_step_start = top_border - top_border % rounded_SCALE_step;

    //по оси x
    for (let i = 0; i < STEPS * 2; i++) {

        let point = 0;
        let point_2 = 0;
        let inverted = false;
        let relative_SCALED_point_x = 0;

        if (y > SCALE / 2) {
            point_2 = y - SCALE / 2;

        }
        if (-y > SCALE / 2) {
            inverted = true;
            point_2 = y + SCALE / 2;

        }

        point = Number((x_step_start + rounded_SCALE_step * i).toFixed(SCALE_depth));
        relative_SCALED_point_x = (SCALE / 2 - x + point) * relative_SCALE;

        //Разметка
        ctx.strokeStyle = 'grey';
        ctx.moveTo(relative_SCALED_point_x, 0);
        ctx.lineTo(relative_SCALED_point_x, SIZEy);
        ctx.stroke();

        //Цифры
        ctx.strokeStyle = 'black';
        symbol_at_cords(ctx, point, point_2, point, false, inverted);

    }

    //по оси y
    for (let i = 0; i < STEPS * 2; i++) {

        let point = 0;
        let point_2 = 0;
        let inverted = false;
        let relative_SCALED_point_y = 0;

        if (x > SCALE / 2) {
            point_2 = x - SCALE / 2;

        }
        if (-x > SCALE / 2) {
            inverted = true;
            point_2 = x + SCALE / 2;

        }

        point = Number((y_step_start + rounded_SCALE_step * i).toFixed(SCALE_depth));
        relative_SCALED_point_y = (SCALE / 2 + y - point) * relative_SCALE;

        //Разметка
        ctx.strokeStyle = 'silver';
        ctx.moveTo(0, relative_SCALED_point_y);
        ctx.lineTo(SIZEx, relative_SCALED_point_y);
        ctx.stroke();

        //Цифры
        ctx.strokeStyle = 'black';
        symbol_at_cords(ctx, point_2, point, point, inverted);

    }

    ctx.beginPath();

    //Крест
    var relative_SCALED_0x = (SCALE / 2 + y) * relative_SCALE;
    var relative_SCALED_0y = (SCALE / 2 - x) * relative_SCALE;

    ctx.strokeStyle = 'black';

    ctx.moveTo(relative_SCALED_0y, 0);
    ctx.lineTo(relative_SCALED_0y, SIZEy);
    ctx.stroke();

    ctx.moveTo(0,    relative_SCALED_0x);
    ctx.lineTo(SIZEx, relative_SCALED_0x);
    ctx.stroke();


}


function symbol_at_cords(ctx, p_x, p_y, symbol, inverted_vertical = false, inverted_horisontal = false) {

    var cords_x = (SCALE / 2 + p_x - x) * relative_SCALE;
    var cords_y = (SCALE / 2 - p_y + y) * relative_SCALE;

    var inverted_vertical_counter = 0;
    if (inverted_vertical) {
        inverted_vertical_counter = String(symbol).length * FONT_SIZE / 2 + 2 * SIZE * 0.01;
    }

    var inverted_horisontal_counter = 0;
    if (inverted_horisontal) {
        inverted_horisontal_counter = FONT_SIZE + SIZE * 0.01;
    }

    ctx.fillRect(cords_x - 1, cords_y - 1, 3, 3);
    ctx.fillText(symbol, cords_x + SIZE * 0.01 - inverted_vertical_counter, cords_y - SIZE * 0.01 + inverted_horisontal_counter)

}

function dot_at_cords(ctx, p_x, p_y) {

    var cords_x = (SCALE / 2 + p_x - x) * relative_SCALE;
    var cords_y = (SCALE / 2 - p_y + y) * relative_SCALE;

    ctx.fillRect(cords_x, cords_y, 1, 1);

}

function line_to_cords(ctx, p_x, p_y) {

    var cords_x = (SCALE / 2 + p_x - x) * relative_SCALE;
    var cords_y = (SCALE / 2 - p_y + y) * relative_SCALE;

    ctx.lineTo(cords_x, cords_y);

}

/*
function update_html_data() {
    document.getElementById('span_x').innerHTML     = 'x = ' + x;
    document.getElementById('span_y').innerHTML     = 'y = ' + y;
    document.getElementById('mouse_x').innerHTML    = 'mouse_x = ' + mouse_x;
    document.getElementById('mouse_y').innerHTML    = 'mouse_y = ' + mouse_y;
    document.getElementById('span_SCALE').innerHTML = 'SCALE = ' + SCALE;
    document.getElementById('span_SIZE').innerHTML  = 'SIZE = ' + SIZE;
    document.getElementById('document_mouse_x').innerHTML = 'document_mouse_x = ' + document_mouse_x;
    document.getElementById('document_mouse_y').innerHTML = 'document_mouse_y = ' + document_mouse_y;
    document.getElementById('span_x1').innerHTML    = 'rounded_SCALE = ' + rounded_SCALE;
    document.getElementById('span_x2').innerHTML    = 'SCALE_depth = ' + SCALE_depth;
    document.getElementById('span_x3').innerHTML    = 'rounded_SCALE_step = ' + rounded_SCALE_step;
    document.getElementById('span_x4').innerHTML    = 'rowrow = fight the power';
    //document.getElementById('span_1').innerHTML     = '';
    document.getElementById('span_2').innerHTML     = 'SIZEx = ' + SIZEx;
    document.getElementById('span_3').innerHTML     = 'SIZEy = ' + SIZEy;
    //document.getElementById('function_drawing_STEPS').innerHTML     = 'function_drawing_STEPS = ' + function_drawing_STEPS;


}
*/

//Перемещение по x y
canvas.addEventListener('mousedown', e => {
    document_mouse_x = e.offsetX;
    document_mouse_y = e.offsetY;
    canvas_mouse_moving = true;
});
canvas.addEventListener('mousemove', e => {
    if (canvas_mouse_moving === true) {
        change_position(e.offsetX, e.offsetY);
    }

    document_mouse_x = e.offsetX;
    document_mouse_y = e.offsetY;

    mouse_x = x + (- SIZEx / 2 + document_mouse_x) / relative_SCALE;
    mouse_y = y + (SIZEy / 2 - document_mouse_y) / relative_SCALE;
    //update_html_data();


});
canvas.addEventListener('mouseup', e => {
    if (canvas_mouse_moving === true) {
        change_position(e.offsetX, e.offsetY);
        document_mouse_x = 0;
        document_mouse_y = 0;
        canvas_mouse_moving = false;
    }
});
//Масштаб
canvas.addEventListener('wheel', e => {

    /*
    var now_SCALE_change = 1;
    var delta_mouse_x = 0;
    var delta_mouse_y = 0;

    delta_mouse_x = mouse_x - mouse_x * now_SCALE_change;
    delta_mouse_y = mouse_y - mouse_y * now_SCALE_change;

    x = x + delta_mouse_x;
    y = y + delta_mouse_y;

    */

    if (e.deltaY < 0) {
        now_SCALE_change = 1 / SCALE_change;

    }
    if (e.deltaY > 0) {
        now_SCALE_change = SCALE_change;

    }
    SCALE = SCALE * now_SCALE_change;

    x = mouse_x - (- SIZEx / 2 + document_mouse_x) / relative_SCALE;
    y = mouse_y - (SIZEy / 2 - document_mouse_y) / relative_SCALE;

    canvas_update()

});



function change_position(new_mouse_x, new_mouse_y) {

    var mouse_x_change = new_mouse_x - document_mouse_x;
    var mouse_y_change = new_mouse_y - document_mouse_y;

    x = x - mouse_x_change / relative_SCALE;
    y = y + mouse_y_change / relative_SCALE;

    canvas_update()
}

function round_to_significant_figures(num, sf = 2) {

    var num_str = String(num);
    var ret_str = '';
    var last_char = '';
    var significant_figures = 0;
    var significants_started = false;
    var e_char = false;

    for (let char of num_str) {

        if (char == 'e') {
            e_char = true;
        }

        if (char != '.' && char != '-' && !e_char) {
            if (significant_figures > sf - 1) {

                char = '0';

            }

            if (char != '0' || significants_started) {
                significants_started = true;
                significant_figures = significant_figures + 1;

            }
        }

        ret_str = ret_str + char;
        last_char = char;
    }
    TESTer = ret_str;
    return Number(ret_str);
}





/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// WebGL


// setup GLSL program
var program = webglUtils.createProgramFromScripts(gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);

// look up where the vertex data needs to go.
var positionLocation = gl.getAttribLocation(program, "a_position");
var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

// lookup uniforms
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
var textureMatrixLocation = gl.getUniformLocation(program, "u_textureMatrix");
var textureLocation = gl.getUniformLocation(program, "u_texture");

// Create a buffer.
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put a unit quad in the buffer
var positions = [
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Create a buffer for texture coords
var texcoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

// Put texcoords in the buffer
var texcoords = [
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(url, drawInfo) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));

  // let's assume all images are not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  var textureInfo = {
    width: 1,   // we don't know the size until it loads
    height: 1,
    texture: tex,
  };
  var img = new Image();
  img.addEventListener('load', function() {
    textureInfo.width = img.width;
    textureInfo.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  });
  img.src = url;

  return textureInfo;
}

var storageObjects = JSON.parse(localStorage.getItem('mainObjects'))
var relative_SCALE = SIZE / SCALE
var storageObjPreloaded = prepareObjects(storageObjects)

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
    graphishDrawInfoAdd(prepareNewObject(obj))
    return
  }

  //console.log(drawInfos)
  //console.log(drawInfoElement)

  drawInfoElement.xDestinationFrom = drawInfoElement.xScreen
  drawInfoElement.yDestinationFrom = drawInfoElement.yScreen

  drawInfoElement.xWorld = obj.obj_x
  drawInfoElement.yWorld = obj.obj_y
  drawInfoElement.timeDestination = objTimeToMove

}



function graphishDrawInfoAdd(obj) {
  var drawInfo = {
    id: obj.id,
    xWorld: 0,
    yWorld: 0,
    xDestinationFrom: 0,
    yDestinationFrom: 0,
    timeDestination: 0,
    xScreen: 0,
    yScreen: 0,
    xScale: 1,
    yScale: 1,
    offX: 0,
    offY: 0,
    rotation: 0, // Math.PI * 1.5, // pi * 1 = 180*
    width:  1,
    height: 1,
    textureInfo: obj.pic
  }
  drawInfos.push(drawInfo);
}



function update(deltaTime) {

  drawInfos.forEach(function(drawInfo) {

    var xCordTo = (drawInfo.xWorld - x) * relative_SCALE
    var yCordTo = (drawInfo.yWorld - y) * relative_SCALE

    if (drawInfo.timeDestination > 0) {

      drawInfo.timeDestination += -deltaTime

      var deltaXDestination = xCordTo - drawInfo.xDestinationFrom
      var deltaYDestination = yCordTo - drawInfo.yDestinationFrom
      var destinationProportion = 1 - drawInfo.timeDestination / objTimeToMove

      xCordTo = drawInfo.xDestinationFrom + deltaXDestination * destinationProportion
      yCordTo = drawInfo.yDestinationFrom + deltaYDestination * destinationProportion

    } else {
      drawInfo.timeDestination = 0
    }

    drawInfo.xScreen = xCordTo
    drawInfo.yScreen = yCordTo
    drawInfo.xScale = 1 / (drawInfo.textureInfo.width / pixTexturesCompression) / (SCALE / pixTexturesCompression)
    drawInfo.yScale = 1 / (drawInfo.textureInfo.height / pixTexturesCompression) / (SCALE / pixTexturesCompression)

  });
}

function draw() {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clear(gl.COLOR_BUFFER_BIT);

  drawInfos.forEach(function(drawInfo) {
    var dstX      = drawInfo.xScreen;
    var dstY      = drawInfo.yScreen;
    var dstWidth  = drawInfo.textureInfo.width  * drawInfo.xScale;
    var dstHeight = drawInfo.textureInfo.height * drawInfo.yScale;

    var srcX      = drawInfo.textureInfo.width  * drawInfo.offX;
    var srcY      = drawInfo.textureInfo.height * drawInfo.offY;
    var srcWidth  = drawInfo.textureInfo.width  * drawInfo.width;
    var srcHeight = drawInfo.textureInfo.height * drawInfo.height;

    drawImage(
      drawInfo.textureInfo.texture,
      drawInfo.textureInfo.width,
      drawInfo.textureInfo.height,
      srcX, srcY, srcWidth, srcHeight,
      dstX, dstY, dstWidth, dstHeight,
      drawInfo.rotation);
  });
}

var then = 0;
function render(time) {
  var now = time * 0.001;
  var deltaTime = Math.min(0.1, now - then);
  then = now;

  update(deltaTime);
  draw();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// Unlike images, textures do not have a width and height associated
// with them so we'll pass in the width and height of the texture
function drawImage(
    tex, texWidth, texHeight,
    srcX, srcY, srcWidth, srcHeight,
    dstX, dstY, dstWidth, dstHeight,
    srcRotation) {
  if (dstX === undefined) {
    dstX = srcX;
    srcX = 0;
  }
  if (dstY === undefined) {
    dstY = srcY;
    srcY = 0;
  }
  if (srcWidth === undefined) {
    srcWidth = texWidth;
  }
  if (srcHeight === undefined) {
    srcHeight = texHeight;
  }
  if (dstWidth === undefined) {
    dstWidth = srcWidth;
    srcWidth = texWidth;
  }
  if (dstHeight === undefined) {
    dstHeight = srcHeight;
    srcHeight = texHeight;
  }
  if (srcRotation === undefined) {
    srcRotation = 0;
  }

  gl.bindTexture(gl.TEXTURE_2D, tex);

  // Tell WebGL to use our shader program pair
  gl.useProgram(program);

  // Setup the attributes to pull data from our buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // this matrix will convert from pixels to clip space
  var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

  // this matrix will translate our quad to dstX, dstY
  matrix = m4.translate(matrix, dstX, dstY, 0);

  // this matrix will scale our 1 unit quad
  // from 1 unit to texWidth, texHeight units
  matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

  // Set the matrix.
  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  // just like a 2d projection matrix except in texture space (0 to 1)
  // instead of clip space. This matrix puts us in pixel space.
  var texMatrix = m4.scaling(1 / texWidth, 1 / texHeight, 1);

  // We need to pick a place to rotate around
  // We'll move to the middle, rotate, then move back
  var texMatrix = m4.translate(texMatrix, texWidth * 0.5, texHeight * 0.5, 0);
  var texMatrix = m4.zRotate(texMatrix, srcRotation);
  var texMatrix = m4.translate(texMatrix, texWidth * -0.5, texHeight * -0.5, 0);

  // because were in pixel space
  // the scale and translation are now in pixels
  var texMatrix = m4.translate(texMatrix, srcX, srcY, 0);
  var texMatrix = m4.scale(texMatrix, srcWidth, srcHeight, 1);

  // Set the texture matrix.
  gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);

  // Tell the shader to get the texture from texture unit 0
  gl.uniform1i(textureLocation, 0);

  // draw the quad (2 triangles, 6 vertices)
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}


function prepareObjects(storageObjects) {
  var objs = new Array()

  for (var obj of storageObjects) {
    var newObj = prepareNewObject(obj)
    objs.push(newObj)

  }
  return objs
}

function prepareNewObject(obj) {
  var newObj = new Object()

  newObj.id = obj.obj_id
  newObj.x = obj.obj_x
  newObj.y = obj.obj_y
  newObj.pic = loadImageAndCreateTextureInfo(obj.obj_pic)

  return newObj

}
