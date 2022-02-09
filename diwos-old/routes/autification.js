const router = express.Router()

autificationController = require('autificationController');

app.post("/login", function (request, response) {
    if (!request.body) return response.sendStatus(400);

    var user_login = request.body.login
    var user_password = request.body.password

    connection.query("SELECT * FROM users WHERE `user_login` = ? AND `user_password` = ?",
    [user_login, user_password],
    function(err, data) {
      if(err) return console.log(err);

      if(data.length > 0) {
        var user_token = user_login + String(makeToken());

        connection.query("UPDATE users SET user_token = ? WHERE `user_login` = ? AND `user_password` = ?",
        [user_token, user_login, user_password],
        function(err, data) {
          if(err) return console.log(err);
          console.log('login OK ')
          response.send(user_token);
          //response.redirect("/");
        })
      } else {
        response.send('error');
        return console.log('error wrong password')
      }
    })
})


app.post("/loginToken", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    tokenValid(request, response, function (request, response, user) {
      response.sendStatus(200);
    })
})


app.post("/loginVk", function (request, response) {
    if (!request.body) return response.sendStatus(400);


    var path = '/access_token?client_id=7647522&client_secret=nrCzvmxaaijqE3QSb0Ov&redirect_uri=' + my_uri + '&code=' + request.body.code;

    const options = {
      hostname: 'oauth.vk.com',
      port: 443,
      path: path,
      method: 'GET'
    }

    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.setEncoding('utf8');
      res.on('data', d => {
        var data_vk = JSON.parse(d);

        connection.query("SELECT `user_id`, `user_token` FROM `users` WHERE `user_vk` = ?",
        [data_vk.user_id],
        function(err, data_db) {
          if(err) return console.log(err);
            var user_registrated = Boolean(data_db.length)

            var user_token;
            if (user_registrated) {
              user_token = data_db[0].user_token
            }

            var return_obj = new Object();
            return_obj.status = user_registrated
            return_obj.user_vk = data_vk.user_id
            return_obj.user_email = data_vk.email
            return_obj.user_token = user_token

            console.log('loginVk OK ')
            response.send(return_obj)

        })
      })
    })

    req.on('error', error => {
      console.error(error)
    })

    req.end()



});


app.post("/registrationVk", function (request, response) {
    if (!request.body) return response.sendStatus(400);

    console.log(request.body.user_vk);
    console.log(request.body.user_nickname);

    var user_vk = request.body.user_vk;
    var user_nickname = request.body.user_nickname;
    var user_email = request.body.user_email;
    var user_token = user_vk + String(makeToken());

    connection.query("SELECT `user_nickname` FROM `users` WHERE `user_nickname` = ? OR `user_vk` = ?",
    [user_nickname, user_vk],
    function(err, data) {
      if(err) return console.log(err);

      if(data.length > 0) {
        response.send('error'); // 1 - name occuped
        return

      } else {
        connection.query("INSERT INTO users (user_vk, user_nickname, user_email, user_token) VALUES (?,?,?,?)",
        [user_vk, user_nickname, user_email, user_token],
        function(err, data) {
          if(err) return console.log(err);

          console.log('registrationVk OK ')
          //response.redirect("/");
        });

        response.send(user_token);
      }
    });
});

app.post("/loginGame", function (request, response) {
    if (!request.body) return response.sendStatus(400);

    console.log(request.body.login);
    console.log(request.body.pa);

    var user_vk = request.body.user_vk;
    var user_nickname = request.body.user_nickname;
    var user_email = request.body.user_email;
    var user_token = user_vk + String(makeToken());

    connection.query("SELECT `user_nickname` FROM `users` WHERE `user_nickname` = ? OR `user_vk` = ?",
    [user_nickname, user_vk],
    function(err, data) {
      if(err) return console.log(err);

      if(data.length > 0) {
        response.send('error'); // 1 - name occuped
        return

      } else {
        connection.query("INSERT INTO users (user_vk, user_nickname, user_email, user_token) VALUES (?,?,?,?)",
        [user_vk, user_nickname, user_email, user_token],
        function(err, data) {
          if(err) return console.log(err);

          console.log('registrationVk OK ')
          //response.redirect("/");
        });

        response.send(user_token);
      }
    });
});


app.post("/registration", function (request, response) {
    if (!request.body) return response.sendStatus(400);

    var user_login = request.body.login;
    var user_nickname = request.body.userName;
    var user_password = request.body.pas;
    var user_email = request.body.email;
    var user_token = user_login + String(makeToken());

    connection.query("SELECT `user_login` FROM `users` WHERE `user_login` = ?",
    [user_login],
    function(err, data) {
      if(err) return console.log(err);

      if(data.lenght > 0) {
        response.send('errorLogin'); // 1 - name occuped
        return

      } else {
        connection.query("INSERT INTO users (user_login, user_nickname, user_password, user_email, user_token) VALUES (?,?,?,?,?)",
        [user_login, user_nickname, user_password, user_email, user_token],
        function(err, data) {
          if(err) return console.log(err);

          console.log('registration OK ')
          //response.redirect("/");
        });

        response.send(user_token);
      }
    });
});