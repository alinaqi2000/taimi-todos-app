const { storeData, getData, updateData, deleteData } = require('./data-manager')
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'todos';

async function saveTodo(todoData) {
    return await storeData(COLLECTION_NAME, todoData);
}

async function updateTodo(id, todoData) {
    return await updateData(COLLECTION_NAME, id, todoData);
}

async function getTodos(userId) {
    const todos = await getData(COLLECTION_NAME);
    return todos.filter(t => t.userId === userId);
}

async function getTodoById(id) {
    const todos = await getData(COLLECTION_NAME);
    return todos.filter(t => t._id.toString() === id);
}

async function deleteTodo(id) {
    return await deleteData(COLLECTION_NAME, id);
}

module.exports = { saveTodo, getTodos, getTodoById, updateTodo, deleteTodo }