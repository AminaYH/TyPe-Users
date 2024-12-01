import pool from "../database";
import { Request, Response } from "express";
import path from "node:path";
import * as fs from "node:fs";


const saveTodosToFile = (
    username: string,
    todos: { content: string; hasCompleted: boolean }[]
) => {
  const today = new Date();
  const date = today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  const todosDirectory = path.join(__dirname, "../../todos");

  // Create the todos directory if it doesn't exist
  if (!fs.existsSync(todosDirectory)) {
    fs.mkdirSync(todosDirectory);
  }

  const filePath = path.join(todosDirectory, `${username}_${date}.txt`);

  let todoContent = `Todo List for ${username} - ${date}\n\n`;

  todos.forEach((todo, index) => {
    todoContent += `Todo ${index + 1}:\n`;
    todoContent += `Content: ${todo.content}\n`;
    todoContent += `Completed: ${todo.hasCompleted ? "Yes" : "No"}\n\n`;
  });

  fs.appendFileSync(filePath, todoContent, { encoding: "utf-8" });
  console.log(`Todo list saved to ${filePath}`);
};

const todoController = {
  login: async (req: Request, res: Response) => {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ msg: "Username and email are required" });
    }

    try {
      const userSql = `SELECT * FROM "user" WHERE username = $1 AND email = $2`;
      const { rows } = await pool.query(userSql, [username, email]);

      if (rows.length === 0) {
        return res.status(404).json({ msg: "Invalid username or email" });
      }

      const user = rows[0];

      return res.json({
        msg: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ msg: "Server error", error: error.message });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const sql = `
        SELECT t.id, t.content, t.has_completed, t.created_at, u.username
        FROM todo t
        JOIN "user" u ON t.user_id = u.id
      `;
      const { rows } = await pool.query(sql);
      return res.json(rows);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const sql = `
        SELECT t.id, t.content, t.has_completed, t.created_at, u.username
        FROM todo t
        JOIN "user" u ON t.user_id = u.id
        WHERE t.id = $1
      `;
      const { rows } = await pool.query(sql, [req.params.id]);

      if (rows.length > 0) {
        return res.json(rows[0]);
      }

      return res.status(404).json({ msg: "Todo not found" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getUserTodos: async (req: Request, res: Response) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ msg: "Username is required" });
      }

      const sql = `
        SELECT t.id, t.content, t.has_completed, t.created_at
        FROM todo t
               JOIN "user" u ON t.user_id = u.id
        WHERE u.username = $1
      `;
      const { rows } = await pool.query(sql, [username]);

      if (rows.length > 0) {
        saveTodosToFile(username, rows.map((todo) => ({
          content: todo.content,
          hasCompleted: todo.has_completed,
        })));
        return res.json(rows);
      }

      return res.status(404).json({ msg: "No todos found for this user" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },

  addNewTodo: async (req: Request, res: Response) => {
    const { username, content } = req.body;

    if (!username || !content) {
      return res
          .status(400)
          .json({ msg: "Both username and content are required" });
    }

    try {
      // Find user ID by username
      const userSql = "SELECT id FROM \"user\" WHERE username = $1";
      const userResult = await pool.query(userSql, [username]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ msg: "User not found" });
      }

      const userId = userResult.rows[0].id;

      // Insert new todo
      const todoSql =
          "INSERT INTO todo (user_id, content) VALUES ($1, $2) RETURNING *";
      const { rows } = await pool.query(todoSql, [userId, content]);

      saveTodosToFile(username, [{ content, hasCompleted: false }]);

      return res.json(rows[0]);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addUser: async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }

    try {
      const userExistsSql = "SELECT id FROM \"user\" WHERE username = $1";
      const userExistsResult = await pool.query(userExistsSql, [username]);

      if (userExistsResult.rows.length > 0) {
        return res.status(409).json({ msg: "Username already exists" });
      }

      const insertUserSql =
          "INSERT INTO \"user\" (username) VALUES ($1) RETURNING *";
      const { rows } = await pool.query(insertUserSql, [username]);

      return res.status(201).json(rows[0]); // Return the newly created user
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteById: async (req: Request, res: Response) => {
    try {
      const sql = "DELETE FROM todo WHERE id = $1 RETURNING *";
      const { rows } = await pool.query(sql, [req.params.id]);

      if (rows.length > 0) {
        return res.json(rows[0]);
      }

      return res.status(404).json({ msg: "Todo not found" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateById: async (req: Request, res: Response) => {
    try {
      const { content, hasCompleted } = req.body;
      if (content) {
        const sql = "UPDATE todo set content = $1 where id = $2 RETURNING *";
        const { rows } = await pool.query(sql, [content, req.params.id]);
        res.json(rows[0]);
      } else if (hasCompleted != null && hasCompleted != undefined) {
        const sql =
            'UPDATE todo set "hasCompleted" = $1 where id = $2 RETURNING *';
        const { rows } = await pool.query(sql, [hasCompleted, req.params.id]);
        res.json(rows[0]);
      }
    } catch (error: any) {
      res.json({ msg: error.msg });
    }
  },
};


export default todoController;
