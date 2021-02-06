const express = require('express');
const cors = require('cors');
const connectDb = require('./connection');
const Todo = require('./Todo.model');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;
  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).send(errMessage);
});

const getAllTodos = (req, res) => {
  Todo.find({}, (err, todos) => {
    res.json(todos);
  });
};

const getTodo = (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    todo ? res.json(todo) : res.json(`${req.params.id} is not valid`);
  });
};

const createTodo = (req, res) => {
  const newTodo = new Todo({ name: req.body.name });
  newTodo.save().then(() => res.send(newTodo));
};

const deleteTodo = (req, res) => {
  Todo.deleteOne({ _id: req.params.id }, (err, removedTodo) => {
    if (err) return res.send(err);
    return res.json(removedTodo);
  });
};

const editTodo = (req, res) => {
  Todo.updateOne({ _id: req.params.id }, { name: req.body.name }, (err, editedTodo) => {
    if (err) return res.send(err);
    return res.json(editedTodo);
  });
};

app.get('/api/todos', getAllTodos);
app.get('/api/todos/:id', getTodo);
app.post('/api/todos', createTodo);
app.delete('/api/todos/:id', deleteTodo);
app.put('/api/todos/:id', editTodo);

app.listen(port, function () {
  console.log(`Listening on ${port}`);
  connectDb().then(() => {
    console.log('MongoDb connected');
  });
});
