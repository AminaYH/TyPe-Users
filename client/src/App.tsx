import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import TodoForm from "./components/TodoForm";
import Todo from "./components/Todo";
import TodoEdit from "./components/TodoEdit";
import todoService from "./services/todo";
import TodoItem from "./models/todo";
import Login from "./components/ToDoUser"; // Assuming your login component is here

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch todos if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${apiUrl}/todo`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data); // Log the fetched data
            if (Array.isArray(data)) {
              setTodos(data);
            } else {
              console.error("Fetched data is not an array:", data);
            }
          })
          .catch((err) => console.error("Error fetching todos:", err));
    }
  }, [isLoggedIn]);

  const loadTodos = async () => {
    const todos = await todoService.getAllTodos();
    setTodos(todos);
  };

  const sortedItems: TodoItem[] = todos.sort((a, b) => a.id - b.id);

  const addTodo = async (content: string) => {
    const newTodo = await todoService.addNewTodo(content);
    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = async (id: number) => {
    await todoService.removeTodo(id);
    setTodos([...todos].filter((item) => item.id !== id));
  };

  const editTodo = async (id: number) => {
    setTodos(
        todos.map((todo) =>
            todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
        )
    );
  };

  const editTodoContent = async (id: number, newContent: string) => {
    await todoService.updateTodo(id, newContent);
    setTodos(
        todos.map((todo) =>
            todo.id === id
                ? { ...todo, content: newContent, isEditing: !todo.isEditing }
                : todo
        )
    );
  };

  const editTodoHasCompleted = async (id: number, state: boolean) => {
    await todoService.updateTodo(id, undefined, state);

    setTodos(
        todos.map((todo) =>
            todo.id === id ? { ...todo, hasCompleted: state } : todo
        )
    );
  };

  return (
      <Router>
        <div className="App">
          <Routes>
            {/* If the user is logged in, navigate them to the todos page */}
            <Route
                path="/todo"
                element={isLoggedIn ? (
                    <div className="todoWrapper">
                      <h1>Get Things Done!</h1>
                      <TodoForm addTodo={addTodo} />
                      {sortedItems.map((todo) =>
                          !todo.isEditing ? (
                              <Todo
                                  deleteTodo={deleteTodo}
                                  handleEdit={editTodo}
                                  editTodoHasCompleted={editTodoHasCompleted}
                                  key={todo.id}
                                  todo={todo}
                              />
                          ) : (
                              <TodoEdit
                                  editTodo={editTodo}
                                  editTodoContent={editTodoContent}
                                  key={todo.id}
                                  todo={todo}
                              />
                          )
                      )}
                    </div>
                ) : (
                    <Navigate to="/" /> // Redirect to login page if not logged in
                )}
            />

            {/* Login Page Route */}
            <Route
                path="/"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
