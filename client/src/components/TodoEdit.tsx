import React, { useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import TodoItem from "../models/todo";

interface TodoEditProps {
  todo: TodoItem;
  editTodo: (id: number) => void;
  editTodoContent: (id: number, newContent: string) => void;
}

const TodoEdit = (props: TodoEditProps): JSX.Element => {
  const { todo, editTodo, editTodoContent } = props;
  const [content, setContent] = useState(todo.content);

  // useEffect(() => {
  //   if (content !== todo.content) {
  //     editTodoContent(todo.id, content);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [content]);

  type InputEvent = React.ChangeEvent<HTMLInputElement>;
  function handleChange(e: InputEvent) {
    setContent(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (content !== todo.content && content !== undefined && content !== null) {
      editTodoContent(todo.id, content);
    } else {
      editTodo(todo.id);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todoItem2" action="">
      <input
        onChange={handleChange}
        autoFocus
        className="todoItem-content-input"
        type="text"
        value={content}
        maxLength={15}
      ></input>
      <span onClick={handleSubmit} className="todoItem-edit">
        <DoneIcon />
      </span>
    </form>
  );
};

export default TodoEdit;
