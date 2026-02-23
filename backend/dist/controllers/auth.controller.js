import {} from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../services/token.services.js";
import bcrypt from "bcrypt";
export const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }
    // 1. Verify token exists in Database (Revocation check)
    const savedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });
    if (!savedToken || savedToken.expiresAt < new Date()) {
        return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
    }
    // 2. Generate new pair (Rotation strategy)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(savedToken.userId);
    // 3. Delete old token and save new one
    await prisma.refreshToken.delete({ where: { id: savedToken.id } });
    await prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: savedToken.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    // 4. Set new cookie and return new access token
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = generateTokens(user.id);
    // Store refresh token in DB for rotation/revocation logic
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });
    // Set Refresh Token in httpOnly Cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Access Token goes in the JSON body
    res.json({ accessToken, user: { id: user.id, email: user.email } });
};
export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};
export const register = async (req, res) => {
    const { email, password } = req.body;
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    // 2. Hash password (Salt rounds: 10 is standard for performance vs security)
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3. Create user in database
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    // 4. Generate tokens so user is logged in immediately after signup
    const { accessToken, refreshToken } = generateTokens(user.id);
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
        message: "User created successfully",
        accessToken,
        user: { id: user.id, email: user.email },
    });
};
//# sourceMappingURL=auth.controller.js.map