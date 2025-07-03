import React, { useReducer } from "react";
import Dropdown from "./TaskStatus";

const SET_TITLE = "SET_TITLE";
const SET_DESCRIPTION = "SET_DESCRIPTION";
const RESET_FORM = "RESET_FORM";
const SET_STATUS = "SET_STATUS";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_TITLE:
      return { ...state, title: action.payload };
    case SET_DESCRIPTION:
      return { ...state, description: action.payload };
    case SET_STATUS:
      return { ...state, status: action.payload };
    case RESET_FORM:
      return initialState;
    default:
      return state;
  }
};
const initialState = { title: "", description: "", status: "TODO" };

function TaskModal({ isOpen, onClose, onCreate }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = () => {
    if (!state.title.trim()) return;
    // Send data to parent
    onCreate({
      title: state.title,
      description: state.description,
      status: state.status,
    });
    dispatch({ type: RESET_FORM });
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {/* Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Title</h2>
        <input
          type="text"
          placeholder="Write a title..."
          value={state.title}
          onChange={(e) =>
            dispatch({
              type: "SET_TITLE",
              payload: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <textarea
          placeholder="Write a description..."
          value={state.description}
          onChange={(e) =>
            dispatch({
              type: "SET_DESCRIPTION",
              payload: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <div className="flex justify-between items-center mb-4">
          {" "}
          <Dropdown
            selected={state.status}
            onChange={(value) =>
              dispatch({ type: "SET_STATUS", payload: value })
            }
          />
        </div>

        <div className="flex justify-end items-center">
          <button
            onClick={handleSubmit}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
export default TaskModal;
