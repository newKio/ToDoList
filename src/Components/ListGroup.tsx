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
      const tasks = await readTasks();
      setTasks(tasks);
    };
    fetchTasks();
  }, []);

  const handleCheckboxClick = (index: number) => {
    const newTasks = [...tasks];
    newTasks[index].status = 'completed';
    setTasks(newTasks);
  }

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  }

  return (
    <>
      <h2>{heading}</h2>

      {tasks.length === 0 && <p>No item found</p>}

      <ul className="list-group">
        {tasks.map((task, index) => (
          <li className={`list-group-item ${task.status === 'completed' ? 'disabled' : ''}`} key={task.id}
              onClick={() => handleItemClick(index)}>
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
// for some reason it tells the user the tasks 2 times