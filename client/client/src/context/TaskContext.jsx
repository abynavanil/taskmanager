import React, { createContext, useContext, useState, useEffect } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  // fetchTasks function to retrieve tasks from the server
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setTasks([]); // Not logged in, no tasks to show
        return;
      }
      const res = await fetch('http://localhost:8080/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        setTasks([]); // Unauthorized, clear tasks
        return;
      }
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setTasks([]);
      console.error('Error fetching tasks:', err);
    }
  };
  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};