import React, { useState } from 'react';
import MongoService from '../utils/services';

const TodoItem = ({ item, deleteTodo, setTodos, todos }) => {
  const [isEdit, setEdit] = useState(false);
  const [inputValues, setInputValue] = useState(item.name);

  const mongoService = new MongoService();

  const onSpanClick = () => setEdit(true);
  const onInputBlur = () => {
    mongoService.editTodo(item.id, { name: inputValues }).then((data) => {
      if (data.result === 'updated') {
        setTodos(
          todos.map((todoItem) =>
            todoItem._id === item._id ? { ...todoItem, ...{ name: inputValues } } : todoItem
          )
        );
      }
    });
    setEdit(false);
  };

  return (
    <li>
      {isEdit ? (
        <input
          type="text"
          value={inputValues}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={onInputBlur}
          onKeyDown={(e) => e.key === 'Enter' && onInputBlur()}
        />
      ) : (
        <span onClick={onSpanClick}>{inputValues}</span>
      )}
      <button onClick={onSpanClick}> &#9998;</button>
      <button onClick={() => deleteTodo(item.id)}> &#128465;</button>
    </li>
  );
};

const TodoList = ({ todos, deleteTodo, setTodos }) => {
  return (
    <ul>
      {todos?.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          deleteTodo={deleteTodo}
          setTodos={setTodos}
          todos={todos}
        />
      ))}
    </ul>
  );
};

export default TodoList;
