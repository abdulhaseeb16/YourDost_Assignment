const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "data", "todos.json");

app.use(cors());
app.use(express.json());

// Helper function to read/write todos
const readTodos = async () => {
  const data = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(data || "[]");
};

const writeTodos = async (todos) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
};

// GET /todos - get all todos
app.get("/todos", async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

// POST /todos - create a new todo
app.post("/todos", async (req, res) => {
  const { title, completed = false } = req.body;

  // Validation
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required and must be a string" });
  }

  const todos = await readTodos();
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title,
    completed: Boolean(completed),
  };

  todos.push(newTodo);
  await writeTodos(todos);

  res.status(201).json(newTodo);
});

// PUT /todos/:id - update a todo
app.put("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const todos = await readTodos();
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (title && typeof title !== "string") {
    return res.status(400).json({ error: "Title must be a string" });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Completed must be a boolean" });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...(title !== undefined ? { title } : {}),
    ...(completed !== undefined ? { completed } : {}),
  };

  await writeTodos(todos);

  res.json(todos[todoIndex]);
});

// DELETE /todos/:id - delete a todo
app.delete("/todos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const todos = await readTodos();

  const newTodos = todos.filter((t) => t.id !== id);

  if (todos.length === newTodos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  await writeTodos(newTodos);

  res.status(200).json({ message: "Todo deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/todos`);
});
