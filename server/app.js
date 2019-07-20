var express = require('express');
var path = require('path');
var cors = require('cors');
var logger = require('morgan');
let bodyParser = require('body-parser');

let TodoApp = require('./app/todo');
let todo = new TodoApp();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/load/list', (req, res) => {
  todo.loadTodoList(req.params.user).then((data) => {
    res.status(200);
    res.json(data);
  }).catch(err => {
    console.log(err)
    res.json({ code: 400, msg: err })
  });
});

app.post('/add/list', (req, res) => {
  todo.addItem(req.params.user, req.body.text, req.body.detail ? req.body.detail : "").then(() => {
    todo.loadTodoList(req.params.user).then((data) => {
      res.status(200);
      console.log(data);
      res.json(data);
    });
  }).catch(err => {
    console.log(err)
    res.json({ code: 400, msg: err })
  });
});

app.put('/update/:uuid', (req, res) => {
  todo.changeStatus(req.params.user, req.params.uuid).then(() => {
    todo.loadTodoList(req.params.user).then((data) => {
      res.status(200);
      res.json(data);
    });
  }).catch(err => {
    console.log(err)
    res.json({ code: 400, msg: err })
  });
});

app.delete('/delete/:uuid', (req, res) => {
  todo.deleteItem(req.params.user, req.params.uuid).then(() => {
    todo.loadTodoList(req.params.user).then((data) => {
      res.status(200);
      res.json(data);
    });
  }).catch(err => {
    console.log(err)
    res.json({ code: 400, msg: err })
  });
});

module.exports = app;
