import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import generateUUID from "../helpers/uuid";
import { Todo } from "../model/Todo";
import { TodoRequest } from "../model/TodoRequest";

export default function useTodos() {
  // const sessionId = localStorage.getItem("todos-sessionId") || crypto.randomUUID();
  const sessionId = Cookies.get("todos-sessionId") || generateUUID();
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    // localStorage.setItem("todos-sessionId", sessionId);
    Cookies.set("todos-sessionId", sessionId, {
      expires: 365,
      path: "/",
      secure: true,
      sameSite: "strict",
    });
    fetchTodosFromServer(sessionId, setTodos);
  }, [sessionId]);

  async function setTodoCompleted(id: string, completed: boolean) {
    if (await setTodoCompletedOnServer(sessionId, id, completed)) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo,
        ),
      );
    }
  }

  async function addTodo(title: string) {
    const newId = await addTodoToServer(sessionId, title);
    if (newId) {
      setTodos((preveToDos) => [
        {
          id: newId,
          title,
          completed: false,
        },
        ...preveToDos,
      ]);
    }
  }

  async function deleteTodo(id: string) {
    if (await deleteTodoFromServer(sessionId, id)) {
      setTodos((prevToDos) => prevToDos.filter((todo) => todo.id !== id));
    }
  }

  async function deleteAllCompletedTodos() {
    // setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    deleteCompletedTodosOnServer(sessionId, setTodos);
  }

  return {
    todos,
    setTodoCompleted,
    addTodo,
    deleteTodo,
    deleteAllCompletedTodos,
  };
}

async function deleteCompletedTodosOnServer(
  sessionId: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
) {
  const getTodosRequest: TodoRequest = {
    SessionID: sessionId,
    Action: "DeleteAllCompleted",
    Param: "",
  };
  try {
    const response = await makeRemoteRequest(getTodosRequest);
    if (response.ok) {
      const responseJson = (await response.text()) || "[]";
      const newTodos: Todo[] = JSON.parse(responseJson);
      setTodos(newTodos);
    }
  } catch (error) {
    alert("Error: " + error);
    setTodos([]);
  }
}

async function deleteTodoFromServer(
  sessionId: string,
  todo: string,
): Promise<boolean> {
  const deleteTodoRequest: TodoRequest = {
    SessionID: sessionId,
    Action: "DeleteTodo",
    Param: todo,
  };
  try {
    const response = await makeRemoteRequest(deleteTodoRequest);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    alert("Error: " + error);
    return false;
  }
}

async function setTodoCompletedOnServer(
  sessionId: string,
  todo: string,
  completed: boolean,
): Promise<boolean> {
  const setTodoCompleteRequest: TodoRequest = {
    SessionID: sessionId,
    Action: "SetTodoCompleted",
    Param: todo,
    Completed: completed,
  };
  try {
    const response = await makeRemoteRequest(setTodoCompleteRequest);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    alert("Error: " + error);
    return false;
  }
}

async function addTodoToServer(
  sessionId: string,
  todo: string,
): Promise<string> {
  const addTodoRequest: TodoRequest = {
    SessionID: sessionId,
    Action: "AddTodo",
    Param: todo,
  };
  try {
    const response = await makeRemoteRequest(addTodoRequest);
    if (response.ok) {
      return await response.text();
    } else {
      return "";
    }
  } catch (error) {
    alert("Error: " + error);
    return "";
  }
}

async function fetchTodosFromServer(
  sessionId: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
) {
  const getTodosRequest: TodoRequest = {
    SessionID: sessionId,
    Action: "GetTodos",
    Param: "",
  };
  try {
    const response = await makeRemoteRequest(getTodosRequest);
    if (response.ok) {
      const responseJson = (await response.text()) || "[]";
      const newTodos: Todo[] = JSON.parse(responseJson);
      setTodos(newTodos);
    }
  } catch (error) {
    alert("Error: " + error);
    setTodos([]);
  }
}

async function makeRemoteRequest(todoRequest: TodoRequest) {
  return await fetch("todolist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoRequest),
  });
}
