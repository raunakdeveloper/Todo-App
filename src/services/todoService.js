// Utility to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const addTodo = async (userId, todo) => {
  try {
    const todos = getTodos(userId);
    const newTodo = {
      id: generateId(),
      ...todo,
      userId,
      createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
    return newTodo;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const getTodos = (userId) => {
  try {
    const todos = localStorage.getItem(`todos_${userId}`);
    return todos ? JSON.parse(todos) : [];
  } catch (error) {
    console.error('Error getting todos:', error);
    return [];
  }
};

export const updateTodo = async (userId, todoId, updates) => {
  try {
    const todos = getTodos(userId);
    const index = todos.findIndex(todo => todo.id === todoId);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
      return todos[index];
    }
    throw new Error('Todo not found');
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (userId, todoId) => {
  try {
    const todos = getTodos(userId);
    const filteredTodos = todos.filter(todo => todo.id !== todoId);
    localStorage.setItem(`todos_${userId}`, JSON.stringify(filteredTodos));
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};