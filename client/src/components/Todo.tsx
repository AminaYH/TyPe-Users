import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TodoItem from "../models/todo";
import { useEffect, useState } from "react";

interface TodoProps {
  todo: TodoItem;
  deleteTodo: (id: number) => void;
  handleEdit: (id: number) => void;
  editTodoHasCompleted: (id: number, state: boolean) => void;
}

const Todo = (props: TodoProps): JSX.Element => {
  const { todo, deleteTodo, handleEdit, editTodoHasCompleted } = props;
  const [hasCompleted, setHasCompleted] = useState(todo.hasCompleted);

  useEffect(() => {
    editTodoHasCompleted(todo.id, hasCompleted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompleted]);

  function handleClick() {
    setHasCompleted(!hasCompleted);
  }

  return (
    <div className="todoItem">
      <input
        onClick={handleClick}
        className="todoItem-input"
        type="checkbox"
        defaultChecked={todo.hasCompleted}
      ></input>
      <p
        className="todoItem-content-p"
        style={{
          textDecorationLine: hasCompleted ? "line-through" : "none",
        }}
      >
        {todo.content}
      </p>
      <span
        onClick={() => {
          handleEdit(todo.id);
        }}
        className="todoItem-edit"
      >
        <EditIcon />
      </span>
      <span
        onClick={() => {
          deleteTodo(todo.id);
        }}
        className="todoItem-delete"
      >
        <DeleteIcon />
      </span>
    </div>
  );
};

export default Todo;
