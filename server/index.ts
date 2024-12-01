import express from "express";
import session from "express-session";
import * as crypto from "crypto";
import cors from "cors";
import { ISession } from "./types/custom";
import pool from "./database";
import router from "./routers/todo.router";
const app = express();
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default-secret", // Provide fallback secret
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === "production" },
    })
);

const generateSessionSecret = (username: string): string => {
    const baseSecret = process.env.SESSION_SECRET;

    if (!baseSecret) {
        throw new Error("SESSION_SECRET is not defined in environment variables");
    }

    return crypto
        .createHmac("sha256", baseSecret)
        .update(username)
        .digest("hex");
};

app.use(cors());
app.use('/', router);

//
// app.post("/login", async (req, res) => {
//     const { username, email } = req.body;
//
//     if (!username || !email) {
//         return res.status(400).json({ msg: "Username and email are required" });
//     }
//
//     try {
//         // Query the database to validate the user
//         const query = "SELECT * FROM users WHERE username = $1 AND email = $2";
//         const values = [username, email];
//         const result = await pool.query(query, values);
//
//         if (result.rows.length === 0) {
//             return res.status(404).json({ msg: "User not found" });
//         }
//
//         // User exists, generate session secret
//         const userSecret = generateSessionSecret(username);
//         (req.session as unknown as ISession).userSecret = userSecret;
//         (req.session as unknown as ISession).username = username;
//
//         res.status(200).json({ msg: "Login successful", username });
//     } catch (err) {
//         // @ts-ignore
//         console.error("Error during login:", err.message);
//         res.status(500).json({ msg: "Internal server error" });
//     }
// });

app.listen(8000, async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to PostgreSQL successfully!");
        client.release();
        console.log("Server Started on port 8000");
    } catch (err) {
        // @ts-ignore
        console.error("Failed to connect to the database:", err.message);
        process.exit(1);
    }
});
