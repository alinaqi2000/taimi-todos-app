const { storeData, getCsvRecord } = require('./data-manager')
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: './.env.test' });
} else {
    dotenv.config();
}

const FILE_NAME = process.env.USERS_DATA_FILE_NAME;
const SCHEMA = [
    { id: 'id', title: 'id' },
    { id: 'name', title: 'name' },
    { id: 'email', title: 'email' },
    { id: 'password', title: 'password' },
]

async function saveUser(userData) {
    return await storeData(FILE_NAME, SCHEMA, userData);
}

async function getUsers() {
    return await getCsvRecord(FILE_NAME);
}

async function checkCredentials(email, password) {
    const users = await getUsers();
    const index = users.findIndex(u => u.email === email && u.password === password);

    if (index === -1) {
        return false;
    }

    return {
        id: users[index].id,
        name: users[index].name,
        email: users[index].email
    };
}

module.exports = { saveUser, getUsers, checkCredentials }