const APP_LOG_MESSAGES = {
  SERVER_LISTENING: "Express server listening",
  SERVER_LISTENING_ON: "Express server listening on port:",
  SOCKET_SERVER_REPLY: "Hello from socket server",
  FILE_SAVED_SUCCESSFULLY: "File saved successfully",
  FILE_CONVERTED_SUCCESSFULLY: "File converted successfully"
};

const RESPONSE_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong",
  USER_ALREADY_EXIST: "User already exists",
  USER_NOT_FOUND: "User not found",
  UN_AUTHORIZED: "Unauthorized",
  INVALID_PASSWORD: "Password in incorrect",
  NO_FILE_SENT: "No file was sent",
  INVALID_DATA_SENT: "Invalid data sent"
};

const HTTP_RESPONSE_CODE = {
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
};

const FILE_EXTENSIONS = {
  JPG: "jpg",
  JPG_WITH_DOT: ".jpg",
  JPEG: "jpeg",
  JPEG_WITH_DOT: ".jpeg",
  PNG: "png",
  PNG_WITH_DOT: ".png",
  WEBP: "webp",
  WEBP_WITH_DOT: ".webp"
}

const TABLES = {
  USERS: "users",
};

export const CONSTANTS = {
  APP_LOG_MESSAGES,
  RESPONSE_MESSAGES,
  HTTP_RESPONSE_CODE,
  TABLES,
  FILE_EXTENSIONS
};