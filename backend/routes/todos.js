const express = require('express');
const { getTodos, saveTodo, updateTodo, getTodoById, deleteTodo } = require('../data/todo-manager');

const todoRouter = express.Router();

/**
 * @swagger
 * /todos/all/{userId}:
 *   get:
 *     summary: Get all todos for a user
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       completed:
 *                         type: boolean
 */
todoRouter.get("/all/:userId", async (req, res) => {
    const userId = req.params.userId

    const todos = await getTodos(userId);

    const newTodosList = todos.map((u) => ({
        id: u._id,
        userId: u.userId,
        title: u.title,
        completed: JSON.parse(u.completed)
    }));

    res.json({ todos: newTodosList })
});

/**
 * @swagger
 * /todos/create:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     userId:
 *                       type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
todoRouter.post("/create", async (req, res) => {
    const { title, completed, userId } = req.body

    if (!title || !userId) {
        res.status(400).json({ error: "Please provide all the fields." })
        return;
    }

    const todo = await saveTodo({ title, completed, userId })

    res.json({ todo })
});

/**
 * @swagger
 * /todos/update/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *                     userId:
 *                       type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
todoRouter.put("/update/:id", async (req, res) => {
    const { title, completed, userId } = req.body
    const id = req.params.id

    if (!title || !userId) {
        res.status(400).json({ error: "Please provide all the fields." })
        return;
    }

    const todo = await updateTodo(id, { title, completed, userId })

    res.json({
        todo: {
            ...todo,
            completed: JSON.parse(todo.completed)
        }
    })
});

/**
 * @swagger
 * /todos/delete/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Todo not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
todoRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    const todos = await getTodoById(id);

    if (!todos[0]) {
        res.status(404).json({ error: "Todo not found." });
        return;
    }

    await deleteTodo(id);

    res.json({ message: "Todo deleted successfully." });
});


module.exports = todoRouter;