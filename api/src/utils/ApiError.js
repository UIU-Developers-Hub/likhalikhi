class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong sent from api Error class"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
export { ApiError };
