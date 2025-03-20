import { Trash2 } from "lucide-react";
import { Todo } from "../model/Todo";

interface TodoItemProps {
  todo: Todo;
  onCompleteChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({
  todo,
  onCompleteChange,
  onDelete,
}: TodoItemProps) {
  return (
    <div className="flex items-center gap-1">
      <label
        className="flex grow items-center gap-2 rounded-md border border-gray-400 bg-white p-2 hover:bg-slate-50"
        title={todo.id}
      >
        <input
          type="checkbox"
          className="scale-125"
          checked={todo.completed}
          onChange={(e) => onCompleteChange(todo.id, e.target.checked)}
        />
        <span className={todo.completed ? "text-gray-400 line-through" : ""}>
          {todo.title}
        </span>
      </label>
      <button className="p-2" onClick={() => onDelete(todo.id)}>
        <Trash2 size={20} className="text-gray-400 hover:text-gray-900" />
      </button>
    </div>
  );
}
