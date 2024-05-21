// import { useState, useEffect } from "react";
// import { Task, readTasks } from "./ReadTasks";

// interface Props {
//   heading: string;
// }

// function ListGroup({ heading }: Props) {
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const [tasks, setTasks] = useState<Task[]>([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const tasks = await readTasks(); // read the tasks from the server
//       setTasks(tasks); // update the tasks
//     };
//     fetchTasks();
//   }, []);

//   const handleCheckboxClick = (index: number) => {
//     const newTasks = [...tasks];
//     newTasks[index].status = 'completed'; // mark the task as completed
//     setTasks(newTasks); // update the tasks
//   }

//   return (
//     <>
//       <h2>{heading}</h2>

//       {tasks.length === 0 && <p>No item found</p>}

//       <ul className="list-group">
//         {tasks.map((task, index) => (
//           <li className={`list-group-item ${task.status === 'completed' ? 'disabled' : ''}`} key={task.id}
//               onClick={() => setSelectedIndex(index)}>
//             <input className="form-check-input me-1" type="checkbox" value="" id={`checkbox${index}`} 
//                    checked={task.status === 'completed'}
//                    onChange={(e) => {
//                      e.stopPropagation(); // prevent the item click event from firing
//                      handleCheckboxClick(index);
//                    }} />
//             <label className="form-check-label" htmlFor={`checkbox${index}`}>{task.task}</label>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

// export default ListGroup;

// import { useState, useEffect } from "react";
// import { Task, readTasks } from "./ReadTasks";

// interface Props {
//   heading: string;
// }

// function ListGroup({ heading }: Props) {
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const [tasks, setTasks] = useState<Task[]>([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       const tasks = await readTasks(); // read the tasks from the server
//       setTasks(tasks); // update the tasks
//     };
//     fetchTasks();
//   }, []);

//   const handleCheckboxClick = async (index: number) => {
//     const newTasks = [...tasks];
//     newTasks[index].status = newTasks[index].status === 'completed' ? 'not completed' : 'completed'; // toggle the task status
//     setTasks(newTasks); // update the tasks locally

//     // Update the task on the server
//     const updatedTask = newTasks[index];
//     try {
//       await fetch(`http://localhost:3001/api/data/${updatedTask.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedTask),
//       });
//     } catch (error) {
//       console.error('Error updating task:', error);
//     }
//   };

//   return (
//     <>
//       <h2>{heading}</h2>

//       {tasks.length === 0 && <p>No item found</p>}

//       <ul className="list-group">
//         {tasks.map((task, index) => (
//           <li
//             className={`list-group-item ${task.status === 'completed' ? 'disabled' : ''}`}
//             key={task.id}
//             onClick={() => setSelectedIndex(index)}
//           >
//             <input
//               className="form-check-input me-1"
//               type="checkbox"
//               value=""
//               id={`checkbox${index}`}
//               checked={task.status === 'completed'}
//               onChange={(e) => {
//                 e.stopPropagation(); // prevent the item click event from firing
//                 handleCheckboxClick(index);
//               }}
//             />
//             <label className="form-check-label" htmlFor={`checkbox${index}`}>
//               {task.task}
//             </label>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }

// export default ListGroup;


import React, { useState, useEffect } from "react";
import { Task, readTasks } from "./ReadTasks";

interface Props {
  heading: string;
}

function ListGroup({ heading }: Props) {
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
          <li className="list-group-item" key={task.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
            <input
              id={index.toString()}
              type="text"
              value={task.task}
              onChange={e => handleChange(task.id, 'task', e.target.value)}
              style={{ marginRight: '1em' }}
            />
            <select
              id={index.toString()+"status"}
              value={task.status}
              onChange={e => handleChange(task.id, 'status', e.target.value)}
              style={{ marginRight: '1em' }}
            >
              <option value="completed">Completed</option>
              <option value="not completed">Not Completed</option>
            </select>
            <button onClick={() => handleDelete(task.id)} style={{ marginRight: '1em' }}>
              <img src="/saveButton.png" alt="Delete" style={{ width: '20px', height: '20px' }} />
            </button>
            <button onClick={() => handleChange(task.id, 'status', task.status === 'completed' ? 'not completed' : 'completed')}>
              ✔️
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;

// change this code so its like your old one with the checkboxes and have button to edit then the user can edit the task, not imediately be able to change it
// only after clicking the save button save the chagnes to the server
// remove borders from the buttons