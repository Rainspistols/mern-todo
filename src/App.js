import React, { useState, useEffect, useMemo } from 'react';
import Controls from './components/Controls';
import TodoList from './components/TodoList';
import MongoService from './utils/services';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const mongoService = useMemo(() => new MongoService(), []);

  useEffect(() => {
    mongoService.getAllTodos().then((data) => setTodos(data));
  }, [mongoService]);

  const addTodo = () => {
    mongoService
      .postTodo({ name: inputValue })
      .then((res) => res.json())
      .then((data) => {
        setInputValue('');
        setTodos([...todos, data]);
      });
  };

  const deleteTodo = (_id) => {
    const index = todos.findIndex((item) => item._id === _id);
    mongoService
      .deleteTodo(_id)
      .then(
        (res) =>
          res.ok && setTodos([...todos.slice(0, index), ...todos.slice(index + 1, todos.length)])
      );
  };

  return (
    <div className="App">
      <header className="App-header">TODOAPP</header>
      <Controls addTodo={addTodo} inputValue={inputValue} setInputValue={setInputValue} />
      <TodoList todos={todos} deleteTodo={deleteTodo} setTodos={setTodos} todos={todos} />
    </div>
  );
}

export default App;
