import {} from "express";
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "error",
        message: err.message || "Internal Server Error",
    });
};
//# sourceMappingURL=error.middleware.js.map