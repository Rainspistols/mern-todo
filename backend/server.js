const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'https://search-dev-elastic-bf2lpdua7cfid7semxskyjowwi.eu-central-1.es.amazonaws.com' });

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

const getAllTodos = async (req, res) => {
  const {
    body: {
      hits: { hits },
    },
  } = await client.search({
    index: 'todos',
    body: {
      query: {
        match_all: {},
      },
    },
    size: 100,
    _source: true,
  });

  res.json(hits.map((item) => ({ id: item._id, ...item._source })));
};

const createTodo = async (req, res) => {
  const {
    body: { result, _id },
  } = await client.index({
    index: 'todos',
    body: req.body,
  });

  res.json({ result, item: { id: _id, ...req.body } });
};

const deleteTodo = async (req, res) => {
  const {
    body: { result },
  } = await client.delete({
    index: 'todos',
    id: req.params.id,
  });

  res.json(result);
};

const editTodo = async (req, res) => {
  const { body } = await client.update({
    index: 'todos',
    id: req.params.id,
    body: { doc: req.body },
  });

  res.json(body);
};

const searchTodos = async (req, res) => {
  const {
    body: {
      hits: { hits },
    },
  } = await client.search({
    index: 'todos',
    body: {
      query: {
        match: req.body,
      },
    },
    size: 100,
    _source: true,
  });

  res.json(hits.map((item) => ({ id: item._id, ...item._source })));
};

app.get('/api/todos', getAllTodos);
app.post('/api/todos', createTodo);
app.delete('/api/todos/:id', deleteTodo);
app.put('/api/todos/:id', editTodo);
app.post('/api/todos/search', searchTodos);

app.listen(port, function () {
  console.log(`Listening on ${port}`);
});
