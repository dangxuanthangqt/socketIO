// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var socketio = require("socket.io");
// var cors = require('cors')
// // socket io---
// // Create the http server 
// const server = require('http').createServer(app); 
// var app = express();
// app.use(cors());
// // Create the Socket IO server on  
// // Create the Socket IO server on  
// // the top of http server 
// const io = socketio(server); 

// //--------
// var clients = 0;
// // io.on('connection', function(socket) {
// //    clients++;
// //    console.log(socket)
// //    socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
// //    socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
// //    socket.on('disconnect', function () {
// //       clients--;
// //       socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
// //    });
// // });




// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// module.exports = { app: app, server: server }; 

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var socketio = require("socket.io");
var cors = require("cors");
var app = express();
app.use(cors());
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// Create the http server
const server = require("http").createServer(app);

// Create the Socket IO server on
// the top of http server
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

var clients = 0;
io.on('connection', function(socket) {
   clients++;
   console.log(socket.id)
   socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error
  // in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app: app, server: server }; 