import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "secret_a";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "secret_r";
export const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};
//# sourceMappingURL=token.services.js.map