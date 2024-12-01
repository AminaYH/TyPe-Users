import React, { useState } from "react";

interface TodoFormProps {
  addTodo: (content: string) => void;
}

const TodoForm = (props: TodoFormProps): JSX.Element => {
  const { addTodo } = props;
  const [content, setContent] = useState("");

  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  function handleChange(e: InputEvent) {
    setContent(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    addTodo(content);
    setContent("");
  }
  return (
    <form onSubmit={handleSubmit} className="todoForm" action="">
      <input
        autoFocus
        value={content}
        onChange={handleChange}
        placeholder="What is the task today?"
        maxLength={15}
      ></input>
      <button onClick={handleSubmit}>Add task</button>
    </form>
  );
};

export default TodoForm;
