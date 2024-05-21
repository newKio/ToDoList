const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// get all tasks
app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'tasks.json');
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});

// update a task
app.put('/api/data/:id', (req, res) => {
  const filePath = path.join(__dirname, 'tasks.json');
  const taskId = parseInt(req.params.id, 10);
  const updatedTask = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).send('Task not found');
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

    fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
      res.send('Task updated successfully');
    });
  });
});

// delete a task
app.delete('/api/data/:id', (req, res) => {
  const filePath = path.join(__dirname, 'tasks.json');
  const taskId = parseInt(req.params.id, 10);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    const tasks = JSON.parse(data);
    const updatedTasks = tasks.filter(task => task.id !== taskId);

    fs.writeFile(filePath, JSON.stringify(updatedTasks, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Error writing file');
      }
    });
  });
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
