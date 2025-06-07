import React from 'react';
import Calendar from './Calendar';
import '../styles/SideBar.css';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext'; // Import the context

// Sidebar component displays the sidebar content on larger screens
const Sidebar = () => {
  const { tasks } = useTasks(); // Get tasks from context
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  // Extract tags from the latest tasks
  const tags = Array.from(
    new Set(tasks.flatMap(task => Array.isArray(task.tags) ? task.tags : []))
  );

  const todayCount = tasks.filter(task => task.date === today).length;
  const totalCount = tasks.length;

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = tasks.filter(task => task.tags && task.tags.includes(tag)).length;
    return acc;
  }, {});

  return (
    <div className="sidebar">
      <Calendar tasks={tasks} />
      <div className="sidebar-section">
        <div className="sidebar-title">Tasks</div>
        <div
          className="sidebar-item"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/tasks?date=${today}`)}
        >
          <span>Today</span>
          <span className="task-count">{todayCount}</span>
        </div>
        <div
          className="sidebar-item"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/tasks')}
        >
          <span>Total Tasks</span>
          <span className="task-count">{totalCount}</span>
        </div>
      </div>
      <div className="sidebar-section">
        <div className="sidebar-title">Lists</div>
        {tags.map(tag => (
          <div
            className="sidebar-item"
            key={tag}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/tasks?tag=${encodeURIComponent(tag)}`)}
          >
            <span>{tag}</span>
            <span className="task-count">{tagCounts[tag]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;