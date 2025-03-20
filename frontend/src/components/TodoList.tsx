import { Todo } from "../model/Todo";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onCompleteChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({
  todos,
  onCompleteChange,
  onDelete,
}: TodoListProps) {
  const sortedTodos = todos.sort((a, b) => {
    if (a.completed === b.completed) {
      if (a.id === b.id) return 0;
      return a.title > b.title ? 1 : -1;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <>
      <div className="space-y-2">
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onCompleteChange={onCompleteChange}
            onDelete={onDelete}
          />
        ))}
      </div>
      {todos.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No todos yet. Add a new one above.
        </p>
      )}
    </>
  );
}
