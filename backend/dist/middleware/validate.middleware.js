import {} from "express";
import { z, ZodError } from "zod";
export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                status: "fail",
                errors: error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        return next(error);
    }
};
//# sourceMappingURL=validate.middleware.js.map