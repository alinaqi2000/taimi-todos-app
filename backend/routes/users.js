
const express = require('express');
const { getUsers, saveUser, checkCredentials } = require('../data/user-manager');

const userRouter = express.Router();

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
userRouter.get("/all", async (req, res) => {

    const users = await getUsers();

    const newUsersList = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email
    }));

    res.json({ users: newUsersList })
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
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
userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400).json({ error: "Please provide all the fields." })
        return;
    }

    const users = await getUsers();
    const index = users.findIndex(u => u.email === email);
    if (index !== -1) {
        res.status(400).json({ error: "This email is already taken!" })
        return;
    }

    const user = await saveUser({ name, email, password });

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
               res.status(400).json({ error: "Please provide all the fields." })
        return;
    }

    const checkUser = await checkCredentials(email, password);
    if (checkUser === false) {
        res.status(400).json({ error: "Invalid login credentials!" })
        return;
    }

    res.json({ user: checkUser })
});

module.exports = userRouter;