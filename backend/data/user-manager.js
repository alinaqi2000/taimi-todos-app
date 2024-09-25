const { storeData, getData } = require('./data-manager')

const COLLECTION_NAME = 'users';

async function saveUser(userData) {
    return await storeData(COLLECTION_NAME, userData);
}

async function getUsers() {
    return await getData(COLLECTION_NAME);
}

async function checkCredentials(email, password) {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return false;
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
}

module.exports = { saveUser, getUsers, checkCredentials }
