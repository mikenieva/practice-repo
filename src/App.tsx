import "./App.css";
import { useTasks } from "./hooks/useTasks";

// 1. TASK
function Task({ task, moveTask }) {
  console.log(task);
  return (
    <div>
      <p>{task.name}</p>
      <button onClick={() => moveTask(task.id, -1)}>LEFT</button>
      <button onClick={() => moveTask(task.id, 1)}>RIGHT</button>
    </div>
  );
}

// 2. COLUMN
function Column({ column, addTask, moveTask }) {
  const handleAddTask = () => {
    const taskName = window.prompt("Add your task");

    if (taskName) {
      addTask(column.id, taskName);
    }
  };

  return (
    <div>
      <h1>{column.author}</h1>
      {column.tasks.map((task) => {
        return <Task key={task.id} task={task} moveTask={moveTask} />;
      })}

      <button onClick={handleAddTask}>Add task</button>
    </div>
  );
}

function App() {
  const initialColumns = [
    { id: 1, name: "Column1", author: "Mike", tasks: [] },
    { id: 2, name: "Column1", author: "Mike", tasks: [] },
    { id: 3, name: "Column1", author: "Mike", tasks: [] },
    { id: 4, name: "Column1", author: "Mike", tasks: [] },
  ];

  const { columns, addTask, moveTask } = useTasks(initialColumns);

  return (
    <>
      <div style={{ display: "flex", gap: "100px" }}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            addTask={addTask}
            moveTask={moveTask}
          />
        ))}
      </div>
    </>
  );
}

export default App;
