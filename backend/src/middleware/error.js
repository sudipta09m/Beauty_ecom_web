import { ZodError } from "zod";

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map((issue) => ({
      field: issue.path.join(".") || "form",
      message: issue.message
    }));

    return res.status(400).json({
      message: fieldErrors.map((item) => `${item.field}: ${item.message}`).join(" "),
      errors: fieldErrors
    });
  }

  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Something went wrong."
  });
};
