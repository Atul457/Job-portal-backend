const APP_LOG_MESSAGES = {
    SERVER_LISTENING: "Express server listening",
    SERVER_LISTENING_ON: "Express server listening on port:",
    SOCKET_SERVER_REPLY: "Hello from socket server",
    FILE_SAVED_SUCCESSFULLY: "File saved successfully",
    FILE_CONVERTED_SUCCESSFULLY: "File converted successfully"
};
const RESPONSE_MESSAGES = {
    UN_AUTHORIZED: "Unauthorized",
    JOB_NOT_FOUND: "Job not found",
    USER_NOT_FOUND: "User not found",
    NO_FILE_SENT: "No file was sent",
    LOGGED_OUT: "Logged out successfully",
    INVALID_DATA_SENT: "Invalid data sent",
    COMPANY_NOT_FOUND: "Company not found",
    JOB_APPLIED: "Job applied successfully",
    JOB_UPDATED: "Job updated successfully",
    JOB_DELETED: "Job deleted successfully",
    JOB_CREATED: "Job created successfully",
    INVALID_USER: "You are not a valid user",
    NO_COMPANIES_FOUND: "No companies found",
    INVALID_PASSWORD: "Password in incorrect",
    SOMETHING_WENT_WRONG: "Something went wrong",
    COMPANY_DELETED: "Company deleted successfully",
    PROFILE_UPDATED: "Profile updated successfully",
    COMPANY_CREATED: "Company created successfully",
    COMPANY_UPDATED: "Company updated successfully",
    PASSWORD_UPDATED: "Password updated successfully",
    CANT_APPLY_TO_OWN_JOB: "You can't apply to your own job",
    JOB_NOT_BELONGS_TO_YOU: "This job doesn't belongs to you",
    JOB_ALREADY_APPLIED: "Your already have applied for the job",
    AUTHORIZATION_HEADER_NOT_SENT: "Authorization header not sent",
    INVALID_AUTHORIZATION_HEADER: "Authorization header is invalid",
    USER_ALREADY_EXIST_WITH_EMAIL_WITH_EMAIL: "User already exists same email",
    USER_ALREADY_EXIST_WITH_EMAIL_WITH_PHONE: "User already exists same phone number",
    CAN_NOT_CREATE_COMPANY_USER_NOT_FOUND: "Unable to create company since you are not a authorized user",
};
const GOOGLE_CLOUD_CONSOLE = {
    SCOPES: ['https://www.googleapis.com/auth/drive'],
    FOLDER_ID: "1X1Te-mDWb8Z3vQ8W_1AOAmx6XhLYVmSx"
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
};
const TABLES = {
    JOBS: "jobs",
    USERS: "users",
    COMPANIES: "companies",
    JOBS_APPLIED: "jobsApplied",
    NOTIFICATIONS: "notifications"
};
export const CONSTANTS = {
    APP_LOG_MESSAGES,
    RESPONSE_MESSAGES,
    HTTP_RESPONSE_CODE,
    TABLES,
    FILE_EXTENSIONS,
    GOOGLE_CLOUD_CONSOLE
};
//# sourceMappingURL=constants.js.map