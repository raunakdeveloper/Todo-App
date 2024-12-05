import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTodos, updateTodo, deleteTodo } from "../../services/todoService";
import TodoItem from "./TodoItem";
import TodoModal from "./TodoModal";
import Spinner from "../UI/Spinner";
import { isPast } from "date-fns";
import { Plus, AlertCircle } from "lucide-react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const userTodos = await getTodos(user.uid);
      const sortedTodos = userTodos.sort((a, b) => {
        if (isPast(new Date(a.dueDate)) !== isPast(new Date(b.dueDate))) {
          return isPast(new Date(a.dueDate)) ? 1 : -1;
        }
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      setTodos(sortedTodos);
    } catch (err) {
      setError("Failed to load todos. Please try again.");
      console.error("Error loading todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId) => {
    const todo = todos.find((t) => t.id === todoId);
    if (isPast(new Date(todo.dueDate))) return;

    setLoading(true);
    setError(null);
    try {
      await updateTodo(user.uid, todoId, { completed: true });
      loadTodos();
    } catch (err) {
      setError("Failed to toggle todo. Please try again.");
      console.error("Error toggling todo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTodo(user.uid, todoId);
      loadTodos();
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTodoToEdit(null);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Todos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 mt-1 py-1 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition-all"
        >
          <Plus size={20} />
          <span>Create Todo</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">
                Hello, {user.displayName}
              </p>
              <p className="mt-2 text-gray-700">Welcome to Todo App!</p>
              <p className="text-gray-500 mt-1">
                Click the "Create Todo" button to get started.
              </p>
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-700">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Guidelines
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 text-left">
                  <li>Create todos with title, description, due date, and priority.</li>
                  <li>Complete todos before the due date to avoid expiration.</li>
                  <li>Expired todos can still be edited or deleted.</li>
                  <li>Completed todos cannot be edited or uncompleted.</li>
                  <li>Deleted todos cannot be recovered.</li>
                </ul>
              </div>
              <p className="text-xs mt-4 text-gray-500">Made with ❤️ by RaunakKaushal</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={(todo) => {
                  setTodoToEdit(todo);
                  setIsModalOpen(true);
                }}
              />
            ))
          )}
        </div>
      )}

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        todoToEdit={todoToEdit}
        onSuccess={loadTodos}
      />
    </div>
  );
}
