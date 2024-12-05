import { useState, useEffect } from "react";
import {
  Check,
  Trash2,
  Clock,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDistanceToNow, isPast, format } from "date-fns";

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isExpired, setIsExpired] = useState(isPast(new Date(todo.dueDate)));
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExpired(isPast(new Date(todo.dueDate)));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [todo.dueDate]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const isDescriptionLong = todo.description && todo.description.length > 30;

  // Slice the description if it's longer than 100 characters
  const truncatedDescription = todo.description?.slice(0, 25);

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        todo.completed ? "bg-green-50" : "bg-white"
      } hover:bg-gray-50 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3 flex-grow">
          <button
            onClick={() => !todo.completed && onToggle(todo.id)}
            className={`p-2 rounded-full flex-shrink-0 ${
              todo.completed
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            disabled={todo.completed} // Disable the button if completed
          >
            <Check className="w-5 h-5" />
          </button>
          <div className="flex-grow min-w-0">
            <h3
              className={`text-lg font-medium break-words ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <div className="text-gray-600 text-sm mt-1">
                <p className={showFullDescription ? "" : "line-clamp-2"}>
                  {showFullDescription
                    ? todo.description
                    : truncatedDescription}
                </p>
                {isDescriptionLong && !todo.completed && (
                  <button
                    onClick={toggleDescription}
                    className="text-indigo-600 mt-1 md:hidden flex items-center text-xs font-medium"
                  >
                    {showFullDescription ? (
                      <>
                        Hide <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        See more <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          {!todo.completed && (
            <>
              <button
                onClick={() => onEdit(todo)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
          {todo.completed && (
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {!todo.completed && todo.dueDate && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              todo.priority
            )}`}
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
          <span
            className={`flex items-center ${
              isExpired ? "text-red-500" : "text-gray-500"
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            {isExpired ? (
              <>Expired {formatDistanceToNow(new Date(todo.dueDate))} ago</>
            ) : (
              <>Due {format(new Date(todo.dueDate), "dd MMM yyyy HH:mm")}</>
            )}
          </span>
        </div>
      )}

      {/* Remove priority and due date display for completed tasks */}
      {todo.completed && !isExpired && (
        <div className="mt-4 text-sm text-green-500">Completed</div>
      )}

      {/* Expired tasks show expired text */}
      {todo.completed && isExpired && (
        <div className="mt-4 text-sm text-red-500">Expired</div>
      )}
    </div>
  );
};

export default TodoItem;
