import React, { useReducer, useState } from "react";
import TaskModal from "./CreateTask";
import Dropdown from "./TaskStatus";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const statuses = ["TODO", "IN_PROGRESS", "IN_QA", "DONE", "DEPLOYED"];

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.payload];

    case "MOVE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.newStatus }
          : task
      );

    case "REORDER": {
      const { sourceIndex, destinationIndex, droppableId } = action.payload;

      // Filter tasks for the current column
      const columnTasks = state.filter((t) => t.status === droppableId);
      const draggedTask = columnTasks[sourceIndex];

      // Reorder within column
      const newColumnTasks = [...columnTasks];
      newColumnTasks.splice(sourceIndex, 1);
      newColumnTasks.splice(destinationIndex, 0, draggedTask);

      // Combine with other tasks outside this column
      const otherTasks = state.filter((t) => t.status !== droppableId);
      return [...otherTasks, ...newColumnTasks];
    }

    case "UPDATE_STATUS":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.newStatus }
          : task
      );

    default:
      return state;
  }
}

function MyLayout() {
  const [showModal, setShowModal] = useState(false);
  const [createdTasks, dispatch] = useReducer(taskReducer, []);

  const handleCreateTask = (task) => {
    const taskWithId = { ...task, id: uuidv4() };
    dispatch({ type: "ADD_TASK", payload: taskWithId });
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      dispatch({
        type: "REORDER",
        payload: {
          droppableId: source.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        },
      });
    } else {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          id: draggableId,
          newStatus: destination.droppableId,
        },
      });
    }
  };

  return (
    <>
      <div className="p-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Task
        </button>

        <TaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto px-6 space-x-4">
          {statuses.map((status) => {
            // Sort tasks to match full order
            const tasksForStatus = createdTasks
              .filter((task) => task.status === status)
              .sort(
                (a, b) => createdTasks.indexOf(a) - createdTasks.indexOf(b)
              );

            return (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="h-[30rem] w-64 bg-amber-600 flex flex-col p-2 rounded"
                  >
                    <h1 className="text-white font-bold bg-amber-800 py-2 rounded">
                      {status.replace("_", " ")}
                    </h1>
                    <ul className="mt-2 overflow-y-auto px-2 space-y-2 flex-1">
                      {tasksForStatus.map((task, idx) => (
                        <Draggable
                          draggableId={task.id}
                          index={idx}
                          key={task.id}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border p-4 rounded bg-white shadow flex flex-col space-y-2"
                            >
                              <h3 className="font-bold">{task.title}</h3>
                              <p>{task.description}</p>
                              <Dropdown
                                selected={task.status}
                                onChange={(newStatus) => {
                                  dispatch({
                                    type: "UPDATE_STATUS",
                                    payload: {
                                      id: task.id,
                                      newStatus,
                                    },
                                  });
                                }}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}

export default MyLayout;
