import { OctagonX } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Todo } from "../model/Todo";

interface TodoSummaryProps {
  todos: Todo[];
  deleteAllCompleted: () => void;
}
export default function TodoSummary({
  todos,
  deleteAllCompleted,
}: TodoSummaryProps) {
  const completedTodos = todos.filter((todo) => todo.completed);
  const todoCount = todos.length - completedTodos.length;
  const titleString = todoCount + ((1 === todoCount) ? " Thing to do!" : " Things to do!");

  return (
    <>
      <Helmet>
        <title>{titleString}</title>
      </Helmet>
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium">
          {completedTodos.length}/{todos.length} todos completed
        </p>
        {completedTodos.length > 0 && (
          <button
            onClick={deleteAllCompleted}
            className="rounded-md border border-yellow-100 bg-yellow-50 text-sm font-medium text-red-500 hover:underline"
          >
            <span className="flex items-center justify-center space-x-2">
              {" "}
              {/* This CSS makes content vertically and horizontally centered */}
              <OctagonX size={20} className="text-yellow-400" />
              <span>Delete all completed todo items</span>
              <OctagonX size={20} className="text-yellow-400" />
            </span>
          </button>
        )}
      </div>
    </>
  );
}
