import React, { useState } from 'react';

const Controls = ({ addTodo, inputValue, setInputValue, searchTodo }) => {
  const [searchInput, setSearchInput] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  const onSearchChange = (e) => {
    setSearchInput(e.target.value);
    searchTodo(e.target.value);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        <input
          type="search"
          name="search-todo"
          id="search-todo"
          placeholder="search"
          value={searchInput}
          onChange={onSearchChange}
        />
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
