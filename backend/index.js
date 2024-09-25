const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: './.env.test' });
} else {
    dotenv.config();
}

const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userRouter = require('./routes/users');
const todoRouter = require('./routes/todos');
const { connectToDatabase } = require('./data/data-manager');

const app = express()
const PORT = process.env.PORT

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todos API',
            version: '0.0.1',
            description: 'A simple Express Todos API',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({ name: "Todos backend", author: "Ali Naqi Al-Musawi", version: "0.0.1" });
});

app.use('/users', userRouter);
app.use('/todos', todoRouter);

if (process.env.NODE_ENV !== 'test') {
    const startServer = async () => {
        try {
            await connectToDatabase();
            console.log('Successfully connected to the database');
            app.listen(PORT, () => {
                console.log(`Server is listening on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            process.exit(1);
        }
    };

    startServer();
}

module.exports = app;