import { useReducer } from "react";
import { ADD_TASK, MOVE_TASK } from "../constants/constants";

// 1. DEFINE THE REDUCER
function columnsReducer(state, action) {
  switch (action.type) {
    case ADD_TASK: {
      // 1. GET THE INFO FROM ACTION.`PAYLOAD
      const { columnId, taskName } = action.payload;

      // 2. ITERATE OVER EVERY COLUMN AND IF WE MATCH A COLUMN, THEN WE GENERATE A NEW TASK
      return state.map((column) =>
        column.id === columnId
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  id: Date.now(),
                  name: taskName,
                  position: column.tasks.length,
                },
              ],
            }
          : column
      );
    }

    case MOVE_TASK: {
      const { taskId, direction } = action.payload;
      const oldColumnIndex = state.findIndex((column) =>
        column.tasks.some((task) => task.id === taskId)
      );
      const newColumnIndex =
        (oldColumnIndex + direction + state.length) % state.length;
      const task = state[oldColumnIndex].tasks.find(
        (task) => task.id === taskId
      );
      const newOldColumn = {
        ...state[oldColumnIndex],
        tasks: state[oldColumnIndex].tasks
          .filter((t) => t.id !== taskId)
          .map((t, index) => ({ ...t, position: index })),
      };
      const newTasks = [...state[newColumnIndex].tasks]
        .map((t) => {
          if (t.position >= task.position) {
            return { ...t, position: t.position + 1 };
          }
          return t;
        })
        .concat({
          ...task,
          position: state[newColumnIndex].tasks.length ? task.position : 0,
        })
        .sort((a, b) => a.position - b.position)
        .map((t, index) => ({ ...t, position: index }));
      const newColumn = {
        ...state[newColumnIndex],
        tasks: newTasks,
      };
      return state.map((column, index) => {
        if (index === oldColumnIndex) return newOldColumn;
        if (index === newColumnIndex) return newColumn;
        return column;
      });
    }

    default:
      return;
  }
}

// 2. GENERATE THE CUSTOM HOOK
export const useTasks = (initialColumns) => {
  console.log(initialColumns);
  const [columns, dispatch] = useReducer(columnsReducer, initialColumns);

  const addTask = (columnId, taskName) => {
    dispatch({ type: ADD_TASK, payload: { columnId, taskName } });
  };

  const moveTask = (taskId, direction) => {
    dispatch({ type: MOVE_TASK, payload: { taskId, direction } });
  };

  return { columns, addTask, moveTask };
};
