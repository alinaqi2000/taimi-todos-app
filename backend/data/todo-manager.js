const { storeData, getCsvRecord, updateData, replaceAllData } = require('./data-manager')


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

async function getTodoById(id) {
    return (await getCsvRecord(FILE_NAME)).filter(t => t.id === id);
}

async function deleteTodo(id) {
    const todos = (await getCsvRecord(FILE_NAME)).filter(t => t.id !== id);
    return await replaceAllData(FILE_NAME, SCHEMA, todos)
}

module.exports = { saveTodo, getTodos, getTodoById, updateTodo, deleteTodo }