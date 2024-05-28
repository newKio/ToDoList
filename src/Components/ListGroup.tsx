import { useState, useEffect } from "react";
import { Task, readTasks } from "./ReadTasks";

interface Props {
  heading: string;
}

export default function ListGroup({ heading }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await readTasks(); // read the tasks from the server
      setTasks(tasks); // update the tasks locally
      setIsLoading(false); // set loading to false
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

  const handleEdit = (id: number, description: string) => {
    setEditingTaskId(id);
    setEditingTaskDescription(description);
  };
  
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTaskDescription(event.target.value);
  };
  
  const handleDescriptionBlur = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/data/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: editingTaskDescription }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }
  
      const updatedTasks = tasks.map(task =>
        task.id === editingTaskId ? { ...task, task: editingTaskDescription } : task
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
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
                handleChange(task.id, 'status', task.status === 'completed' ? 'not completed' : 'completed'); // update the task status
              }}
            />

            {editingTaskId === task.id ? ( // if the task is being edited show an input field otherwise show the task description
              <input
                type="text"
                name={task.task}
                value={editingTaskDescription}
                onChange={handleDescriptionChange} // when the input value changes
                onBlur={handleDescriptionBlur} // when the input loses focus
                style={{ // style the input field with bottom border
                  border: 'none',
                  borderBottom: '1px solid black',
                  outline: 'none',
                }}
              />
              ) : (
                task.task
              )}

            <button title="Delete task" onClick={() => handleDelete(task.id)} style={{ marginLeft: '1em', border: "none", background: 'none' }}>
              <img src="/delete_icon.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
            </button>
            
            <button title="Edit task" onClick={() => handleEdit(task.id, task.task)} style={{marginLeft: '1em', border: "none", background: 'none' }}>
              <img src="/edit_icon.png" alt="Edit" style={{ width: '20px', height: '20px' }} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

// button for delete task is not working when the task is done (input field is disabled) - fix this so it can be deleted even if the task is done
// make it so there is a save button?
// when you edit, every key stroke is a new request to the server - fix this so it only sends the request when you click save