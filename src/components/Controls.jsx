import React from 'react';

const Controls = ({ addTodo, inputValue, setInputValue }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        <input type="search" name="search-todo" id="search-todo" placeholder="search" />
        <br />
        <input
          type="text"
          placeholder="new todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <input type="submit" value="add new todo" />
      </form>
    </>
  );
};

export default Controls;
