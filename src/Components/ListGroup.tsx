import { useState, useEffect } from "react";
import { Task, readTasks } from "./ReadTasks";

interface Props {
  heading: string;
}

export default function ListGroup({ heading }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await readTasks(); // read the tasks from the server
      setTasks(tasks); // update the tasks
      setIsLoading(false);
    };
    fetchTasks();
  }, []);

  const handleChange = async (id: number, field: string, value: string) => {
    const newTasks = tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    );
    setTasks(newTasks); // update the tasks locally

    // Update the task on the server
    const updatedTask = newTasks.find(task => task.id === id);
    try {
      const response = await fetch(`http://localhost:3001/api/data/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const message = await response.text();
      console.log(message);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);

    try {
      const response = await fetch(`http://localhost:3001/api/data/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }

      const message = await response.text();
      console.log(message);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{heading}</h1>
      {tasks.length === 0 && <p>No items found</p>}
      <ul className="list-group">
        {tasks.map((task, index) => (
          <li className={`list-group-item ${task.status === 'completed' ? 'disabled' : ''}`} key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
            <input
              className="form-check-input me-1"
              type="checkbox"
              value=""
              id={`checkbox${index}`}
              checked={task.status === 'completed'}
              onChange={(e) => {
                e.stopPropagation(); // prevent the item click event from firing
                // handleCheckboxClick(index);
                handleChange(task.id, 'status', task.status === 'completed' ? 'not completed' : 'completed');
              }}
            />

            {/* <input
              id={index.toString()}
              type="text"
              value={task.task}
              onChange={e => handleChange(task.id, 'task', e.target.value)}
              style={{ marginRight: '1em' }}
            /> */}

            {task.task}

            {/* <button onClick={() => handleDelete(task.id)} style={{ marginRight: '1em', border: "none", background: 'none' }}>
              <img src="/saveButton.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
            </button> */}

            <button title="Delete task" onClick={() => handleDelete(task.id)} style={{ marginLeft: '1em', border: "none", background: 'none' }}>
              <img src="/delete_icon.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
            </button>
            
            <button title="Edit task" style={{marginLeft: '1em', border: "none", background: 'none' }}>
              <img src="/edit_icon.png" alt="Edit" style={{ width: '20px', height: '20px' }} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// change this code so its like your old one with the checkboxes and have button to edit then the user can edit the task, not imediately be able to change it
// only after clicking the save button save the chagnes to the server
// remove borders from the buttons




// when you used chatgpt to change how the list is displayed, it fucked up the code, so you need to fix it (check old code if you have to to remember how it should look)
// make so it uses that input tag when you are editing the task, but once done, it returns to the normal way of displaying the task
// remove the border from the input, just one bar at the bottom is possible

// you have the first button in each list item that is supposed to only show when you are editing the task, fix this. What needs to happen is when you press edit, the task becomes an 
// input field (you have the code commented for this) and when the user presses the save button, it saves the changes and goes back to normal text, not input form