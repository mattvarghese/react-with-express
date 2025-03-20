import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import generateUUID from './helpers/uuid';
import { AppSettings, Todo, TodoRequest } from './model';

const app = express(); // Initialize Express app properly
const port = 3000;

const allowedOrigins = ['http://localhost', 'https://localhost'];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      const regex = new RegExp(allowedOrigin.replace('*', '.*'));
      return regex.test(origin);
    });
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Sample app settings, you can load this from a config file or environment variable
const appSettings: AppSettings = {
  dataFolder: '../data' // Make sure this folder exists or is configurable
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Helper function to get the file path based on the session ID
const getFilePath = (request: TodoRequest): string => {
  if (!request.SessionID) {
    throw new Error("SessionID cannot be null");
  }
  if (!appSettings.dataFolder) {
    throw new Error("DataFolder path not configured");
  }
  ensureDirectoryExists(appSettings.dataFolder);
  return path.join(appSettings.dataFolder, `${request.SessionID}.json`);
};

// Helper funciton to make sure directory exists
function ensureDirectoryExists(directoryPath: string): void {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// GET route to return data folder path (similar to the C# code)
app.get('/todolist', (req: Request, res: Response) => {
  res.status(200).send(`Data folder path is: ${appSettings.dataFolder}`);
});

// POST route for handling different actions (GetTodos, AddTodo, SetTodoCompleted, DeleteTodo, DeleteAllCompleted)
app.post('/todolist', (req: Request, res: Response): void => {
  const todoRequest: TodoRequest = req.body;

  try {
    switch (todoRequest.Action) {
      case 'GetTodos':
        const todos = getTodos(todoRequest);
        res.status(200).json(todos);
        break;

      case 'AddTodo':
        const newTodoId = addTodo(todoRequest);
        res.status(200).send(newTodoId);
        break;

      case 'SetTodoCompleted':
        setTodoCompleted(todoRequest);
        res.status(200).send("done");
        break;

      case 'DeleteTodo':
        deleteTodo(todoRequest);
        res.status(200).send("done");
        break;

      case 'DeleteAllCompleted':
        const updatedTodos = deleteAllCompleted(todoRequest);
        res.status(200).json(updatedTodos);
        break;

      default:
        res.status(500).send("Unrecognized Action");
        break;
    }
  } catch (error) {
    res.status(500).send("Error: " + error);
  }
});

// Helper functions for each action
const getTodos = (request: TodoRequest): Todo[] => {
  const filePath = getFilePath(request);
  let fileContents = '[]';
  if (fs.existsSync(filePath)) {
    fileContents = fs.readFileSync(filePath, 'utf-8');
  }
  return JSON.parse(fileContents) || [];
};

const addTodo = (request: TodoRequest): string => {
  if (!request.Param || request.Param.trim() === "") {
    throw new Error("Param must not be null or whitespace for AddTodo");
  }

  const newTodo: Todo = {
    id: generateUUID(),
    title: request.Param,
    completed: false,
  };

  const todos = getTodos(request);
  todos.push(newTodo);

  const newFileContentJson = JSON.stringify(todos, null, 2);
  fs.writeFileSync(getFilePath(request), newFileContentJson, 'utf-8');

  return newTodo.id;
};

const setTodoCompleted = (request: TodoRequest): void => {
  if (!request.Param || request.Param.trim() === "") {
    throw new Error("Param must not be null or whitespace for SetTodoCompleted");
  }

  if (request.Completed === undefined) {
    throw new Error("Value undefined for Completed");
  }

  const todos = getTodos(request);
  const todo = todos.find(t => t.id.trim() === request.Param?.trim());

  if (todo) {
    todo.completed = request.Completed || false;
    const newFileContentJson = JSON.stringify(todos, null, 2);
    fs.writeFileSync(getFilePath(request), newFileContentJson, 'utf-8');
  } else {
    throw new Error("Matching todo not found");
  }
};

const deleteTodo = (request: TodoRequest): void => {
  if (!request.Param || request.Param.trim() === "") {
    throw new Error("Param must not be null or whitespace for DeleteTodo");
  }

  let todos = getTodos(request);
  todos = todos.filter(todo => todo.id !== request.Param);

  const newFileContentJson = JSON.stringify(todos, null, 2);
  fs.writeFileSync(getFilePath(request), newFileContentJson, 'utf-8');
};

const deleteAllCompleted = (request: TodoRequest): Todo[] => {
  const todos = getTodos(request);
  const remainingTodos = todos.filter(todo => !todo.completed);

  const newFileContentJson = JSON.stringify(remainingTodos, null, 2);
  fs.writeFileSync(getFilePath(request), newFileContentJson, 'utf-8');

  return remainingTodos;
};

// Start the server and listen on a specific port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
