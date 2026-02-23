import {} from "express";
import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded; // Attach user to request
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Token expired or invalid" });
    }
};
//# sourceMappingURL=auth.middleware.js.map