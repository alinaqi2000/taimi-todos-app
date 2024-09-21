const request = require('supertest');
const app = require('../../index');
const { getTodos, saveTodo, updateTodo } = require('../../data/todo-manager');

jest.mock('../../data/todo-manager');

const EXISTING_TODO = { id: '123456', userId: '123344', title: 'Some Task', completed: false }

let server
beforeEach(() => {
    const port = Math.floor(Math.random() * 40000) + 10000;
    server = app.listen(port)
});
afterEach(async () => {
    await server.close();
});

describe('GET /todos/all/:userId', () => {

    it('should return all user todos', async () => {
        getTodos.mockResolvedValue([EXISTING_TODO]);

        const res = await request(app)
            .get('/todos/all/' + EXISTING_TODO['userId']);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('todos', [EXISTING_TODO]);
    });
});


describe('POST /todos/create', () => {
    it('should create a new todo for user successfully', async () => {
        const newTodo = { userId: '123344', title: 'New Task', completed: false }

        saveTodo.mockResolvedValue({ id: '123455', ...newTodo });

        const res = await request(app)
            .post('/todos/create')
            .send(newTodo);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('todo', { id: '123455', ...newTodo })
    });

    it('should send error: Please provide all the fields', async () => {
        const newTodo = { userId: '123344', title: '', completed: false }

        const res = await request(app)
            .post('/todos/create')
            .send(newTodo);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Please provide all the fields.');
    });
});

describe('PUT /todos/update/:id', () => {
    it('should update a todo for user successfully', async () => {
        updateTodo.mockResolvedValue({ ...EXISTING_TODO, title: 'New Task' });

        const res = await request(app)
            .put(`/todos/update/${EXISTING_TODO['id']}`)
            .send({ ...EXISTING_TODO, title: "New Task" });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('todo', { ...EXISTING_TODO, title: "New Task" })
    });

    it('should send error: Please provide all the fields', async () => {
        const newTodo = { userId: '123344', title: '', completed: false }

        const res = await request(app)
            .put(`/todos/update/${EXISTING_TODO['id']}`)
            .send({ ...EXISTING_TODO, title: "" });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Please provide all the fields.');
    });
});