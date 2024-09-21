const { storeData, getCsvRecord, updateData } = require('./data-manager')


const FILE_NAME = 'todos';
const SCHEMA = [
    { id: 'id', title: 'id' },
    { id: 'userId', title: 'userId' },
    { id: 'title', title: 'title' },
    { id: 'completed', title: 'completed' },
]

async function saveTodo(todoData) {
    return await storeData(FILE_NAME, SCHEMA, todoData);
}

async function updateTodo(id, todoData) {
    return await updateData(FILE_NAME, SCHEMA, id, todoData);
}

async function getTodos(userId) {
    return (await getCsvRecord(FILE_NAME)).filter(t => t.userId === userId);
}

module.exports = { saveTodo, getTodos, updateTodo }