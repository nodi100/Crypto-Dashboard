export type WebSocketData = {
  [key: string]: string;
};

export type WebSocketHandlers = {
  handleMessage: (event: MessageEvent) => void;
  handleError: (event: Event) => void;
  handleClose: () => void;
  handleOpen: () => void;
};
