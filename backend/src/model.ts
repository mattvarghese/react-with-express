export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoRequest {
  Action: string;
  Param?: string;
  Completed?: boolean;
  SessionID: string;
}

export interface AppSettings {
  dataFolder: string;
}
