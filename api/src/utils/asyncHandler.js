// this utils file is created to handle async functions in a better way
// instead of using try catch block in every async function
// we can use this asyncHandler to wrap the async function and it will handle the error for us
// and pass it to the global error handler middleware

// const asyncHandler = (fn) => {
//   return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

import { ApiError } from "./ApiError.js";

// asyncHandler function definition
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ success: false, message: err.message });
    } else {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  });
};

export { asyncHandler };
