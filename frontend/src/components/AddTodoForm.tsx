import { Plus } from "lucide-react";
import { useRef, useState } from "react";

interface AddTodoFormProps {
  onSubmit: (title: string) => void;
}

export default function AddTodoForm({ onSubmit }: AddTodoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page refresh
    if (!input.trim()) {
      setInput(""); // Clear the form
      inputRef.current?.focus();
      return; // don't do anything on whitespace
    }
    onSubmit(input); // add the new todo item
    setInput(""); // Clear the form
    inputRef.current?.focus();
  }

  return (
    <form className="flex" onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What needs to be done?"
        className="grow rounded-s-md border border-gray-400 p-2"
        ref={inputRef}
      />
      <button
        type="submit"
        className="flex w-25 items-center justify-center space-x-2 rounded-e-md bg-slate-500 text-white hover:bg-slate-800"
      >
        <Plus size={20} className="text-green-500" />
        <span>Add</span>
      </button>
    </form>
  );
}
