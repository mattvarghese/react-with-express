import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import TodoSummary from "./components/TodoSummary";
import useTodos from "./hooks/useTodos";

function App() {
  const {
    todos,
    setTodoCompleted,
    addTodo,
    deleteTodo,
    deleteAllCompletedTodos,
  } = useTodos();

  return (
    <main className="h-screen space-y-5 overflow-y-auto py-10">
      <ParentComponent>
        <h1 className="text-center text-3xl font-bold">Your Todos</h1>
        <div className="mx-auto max-w-lg space-y-5 rounded-md bg-slate-100 p-5">
          <AddTodoForm onSubmit={addTodo} />
          <TodoList
            todos={todos}
            onCompleteChange={setTodoCompleted}
            onDelete={deleteTodo}
          />
        </div>
        <TodoSummary
          todos={todos}
          deleteAllCompleted={deleteAllCompletedTodos}
        />
      </ParentComponent>
    </main>
  );
}

// ParentComponent now has a typed children prop
interface ParentComponentProps {
  children: React.ReactNode;  // React.ReactNode is the type for any valid React child
}

// Completely unnecessary component solely to demonstrate passing children
const ParentComponent: React.FC<ParentComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default App;
