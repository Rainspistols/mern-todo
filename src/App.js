import React, { useState, useEffect, useMemo } from 'react';
import Controls from './components/Controls';
import TodoList from './components/TodoList';
import MongoService from './utils/services';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const mongoService = useMemo(() => new MongoService(), []);

  useEffect(() => {
    mongoService
      .getAllTodos()
      .then((data) => setTodos(data.hits.hits.map((item) => ({ ...item._source, _id: item._id }))));
  }, [mongoService]);

  const addTodo = () => {
    const newTodo = { name: inputValue };
    mongoService.postTodo(newTodo).then((data) => {
      if (data.result === 'created') {
        newTodo._id = data._id;
        setTodos([...todos, newTodo]);
        setInputValue('');
      }
    });
  };

  const deleteTodo = (_id) => {
    mongoService.deleteTodo(_id).then((data) => {
      if (data.result === 'deleted') {
        setTodos(todos.filter((item) => item._id !== data._id));
      }
    });
  };

  const searchTodo = (name) => {
    if (name) {
      mongoService.searchTodos(name).then((data) => {
        console.log(data);
        if (data.hits.hits.length > 0) {
          setTodos(data.hits.hits.map((item) => ({ ...item._source, _id: item._id })));
        }
      });
    } else {
      mongoService
        .getAllTodos()
        .then((data) =>
          setTodos(data.hits.hits.map((item) => ({ ...item._source, _id: item._id })))
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">TODOAPP</header>
      <Controls
        addTodo={addTodo}
        inputValue={inputValue}
        setInputValue={setInputValue}
        searchTodo={searchTodo}
      />
      <TodoList todos={todos} deleteTodo={deleteTodo} setTodos={setTodos} todos={todos} />
    </div>
  );
}

export default App;
