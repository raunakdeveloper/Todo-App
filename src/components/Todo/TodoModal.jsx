import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { addTodo, updateTodo } from "../../services/todoService";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { isAfter, parseISO } from "date-fns";

export default function TodoModal({ isOpen, onClose, todoToEdit, onSuccess }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description || "");
      setDueDate(todoToEdit.dueDate);
      setPriority(todoToEdit.priority);
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
    }
  }, [todoToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length > 15) {
      toast.error("Title cannot exceed 15 characters");
      return;
    }

    const now = new Date();
    const selectedDate = parseISO(dueDate);

    if (!isAfter(selectedDate, now)) {
      toast.error("Due date must be in the future");
      return;
    }

    setLoading(true);
    try {
      const todoData = {
        title,
        description,
        dueDate,
        priority,
        completed: false,
      };

      if (todoToEdit) {
        await updateTodo(user.uid, todoToEdit.id, todoData);
        toast.success("Todo updated successfully!");
      } else {
        await addTodo(user.uid, todoData);
        toast.success("Todo created successfully!");
      }

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        todoToEdit ? "Failed to update todo" : "Failed to create todo"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-white rounded-lg p-4 w-full max-w-xs shadow-xl space-y-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-gray-800">
            {todoToEdit ? "Edit Todo" : "Create New Todo"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20} // Allows slight over-typing for UX
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-xs py-2 pl-3 pr-3"
                required
              />
              <p
                className={`text-xs mt-1 ${
                  title.length > 15 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {15 - title.length} characters remaining
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Description
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-xs py-2 pl-3 pr-3 h-20 resize-none overflow-auto"
                rows="2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Due Date
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-xs py-2 pl-3 pr-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Priority
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 sm:text-xs py-2 pl-3 pr-3 appearance-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none"
            >
              {loading
                ? "Saving..."
                : todoToEdit
                ? "Update Todo"
                : "Create Todo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
