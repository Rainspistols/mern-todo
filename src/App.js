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
    const newTodo = { name: inputValue };
    mongoService.postTodo(newTodo).then((data) => {
      if (data.result === 'created') {
        setTodos([...todos, data.item]);
        setInputValue('');
      }
    });
  };

  const deleteTodo = (id) => {
    mongoService.deleteTodo(id).then((data) => {
      if (data === 'deleted') {
        setTodos(todos.filter((item) => item.id !== id));
      }
    });
  };

  const searchTodo = (body) => {
    mongoService.searchTodos(body).then((data) => {
      if (data.length > 0) {
        setTodos(data);
      } else {
        mongoService.getAllTodos().then((data) => setTodos(data));
      }
    });
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
