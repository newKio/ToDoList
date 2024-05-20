import { useState, useEffect } from "react";
import { readTasks, Task } from "./ReadTasks";

interface Props {
  heading: string;
}

function ListGroup({ heading }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await readTasks(); // read the tasks from the server
      setTasks(tasks); // update the tasks
    };
    fetchTasks();
  }, []);

  const handleCheckboxClick = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].status = 'completed'; // mark the task as completed
    setTasks(newTasks); // update the tasks
  }

  return (
    <>
      <h2>{heading}</h2>

      {tasks.length === 0 && <p>No item found</p>}

      <ul className="list-group">
        {tasks.map((task, index) => (
          <li className={`list-group-item ${task.status === 'completed' ? 'disabled' : ''}`} key={task.id}
              onClick={() => setSelectedIndex(index)}>
            <input className="form-check-input me-1" type="checkbox" value="" id={`checkbox${index}`} 
                   checked={task.status === 'completed'}
                   onChange={(e) => {
                     e.stopPropagation(); // prevent the item click event from firing
                     handleCheckboxClick(index);
                   }} />
            <label className="form-check-label" htmlFor={`checkbox${index}`}>{task.task}</label>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;

// make use of an external file to store the tasks and which ones are done
// make node js server with express to save and read the tasks then you can make a post request to save the tasks