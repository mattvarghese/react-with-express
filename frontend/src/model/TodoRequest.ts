export interface TodoRequest {
  SessionID: string;
  Action: string;
  Param: string;
  Completed?: boolean;
}
