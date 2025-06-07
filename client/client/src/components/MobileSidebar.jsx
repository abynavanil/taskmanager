import React from 'react';
import Calendar from './Calendar';
import '../styles/SideBar.css';
import { useNavigate } from 'react-router-dom';
// mobile sidebar component display contents below
const MobileSidebar = ({ tasks = [], tags = [] }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const todayCount = tasks.filter(task => task.date === today).length;
  const totalCount = tasks.length;

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = tasks.filter(task => task.tags && task.tags.includes(tag)).length;
    return acc;
  }, {});

  return (
    <div className="sidebar mobile-sidebar-content" style={{ marginTop: 32 }}>
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

export default MobileSidebar;