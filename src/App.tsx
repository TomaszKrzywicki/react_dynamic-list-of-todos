/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos, getUser } from './api';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(data => {
        setTodos(data);
        setFilteredTodos(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = todos;

    if (filter === 'completed') {
      result = todos.filter(todo => todo.completed);
    } else if (filter === 'active') {
      result = todos.filter(todo => !todo.completed);
    }

    if (searchQuery) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTodos(result);
  }, [todos, filter, searchQuery]);

  const handleShowTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setLoading(true);
    getUser(todo.userId)
      .then(setUser)
      .finally(() => setLoading(false));
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
    setUser(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filter={filter}
                setFilter={setFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            <div className="block">
              {loading && <Loader />}
              <TodoList todos={filteredTodos} onShowTodo={handleShowTodo} />
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal todo={selectedTodo} user={user} onClose={handleCloseModal} />
      )}
    </>
  );
};
