const request = require('supertest');
const app = require('../../index')
const { getUsers, saveUser, checkCredentials } = require('../../data/user-manager');

jest.mock('../../data/user-manager');

const EXISTING_USER = { id: '123344', name: 'Taimi', email: 'taimi@gmail.com', password: 'taimi' }

let server;
beforeEach(() => {
    const port = Math.floor(Math.random() * 40000) + 10000;
    server = app.listen(port)
    getUsers.mockResolvedValue([EXISTING_USER]);
});
afterEach(async () => {
    await server.close();
});

describe('POST /users/register', () => {

    it('should register a new user successfully', async () => {
        const newUser = { name: 'John Doe', email: 'johndoe@example.com', password: 'secretpassword' };

        saveUser.mockResolvedValue({ id: '123344', ...newUser });

        const res = await request(app)
            .post('/users/register')
            .send(newUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id', '123344');
        expect(res.body.user).toHaveProperty('name', 'John Doe');
        expect(res.body.user).toHaveProperty('email', 'johndoe@example.com');
    });

    it('should send error: Please provide all the fields', async () => {
        const newUser = { name: 'John Doe', email: 'johndoe@example.com' };

        const res = await request(app)
            .post('/users/register')
            .send(newUser);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Please provide all the fields.');
    });

    it('should send error: This email is already taken', async () => {
        const res = await request(app)
            .post('/users/register')
            .send(EXISTING_USER);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'This email is already taken!');
    });
});

describe('POST /users/login', () => {
    it('should login user successfully', async () => {
        checkCredentials.mockResolvedValue(EXISTING_USER);

        const res = await request(app)
            .post('/users/login')
            .send({ email: EXISTING_USER['email'], password: EXISTING_USER['password'] });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id', EXISTING_USER['id']);
        expect(res.body.user).toHaveProperty('name', EXISTING_USER['name']);
        expect(res.body.user).toHaveProperty('email', EXISTING_USER['email']);
    });

    it('should send error: Please provide all the fields', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({ email: EXISTING_USER['email'] });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Please provide all the fields.');
    });

    it('should send error: Invalid login credentials', async () => {
        checkCredentials.mockResolvedValue(false);

        const res = await request(app)
            .post('/users/login')
            .send({ email: EXISTING_USER['email'], password: "123" });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid login credentials!');
    });
});

describe('GET /users/all', () => {
    it('should return all users', async () => {
        const res = await request(app)
            .get('/users/all');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('users', [...[EXISTING_USER].map(u => ({ id: u.id, name: u.name, email: u.email }))]);
    });
});