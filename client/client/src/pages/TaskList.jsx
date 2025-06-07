import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SideBar';
import { useTasks } from '../context/TaskContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TaskList.css';

const TaskList = () => {
  const { tasks, fetchTasks } = useTasks();
  const navigate = useNavigate();
  const location = useLocation();

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Get date and tag from query string
  const params = new URLSearchParams(location.search);
  const filterDate = params.get('date');
  const filterTag = params.get('tag');

  // Extract unique tags from tasks
  const tags = Array.from(
    new Set(tasks.flatMap(task => Array.isArray(task.tags) ? task.tags : []))
  );

  // Filter tasks by date or tag
  let filteredTasks = tasks;
  if (filterDate) {
    filteredTasks = filteredTasks.filter(task => task.date === filterDate);
  }
  if (filterTag) {
    filteredTasks = filteredTasks.filter(task => task.tags && task.tags.includes(filterTag));
  }

  // Mark task as done/undone
  const handleToggleDone = async (task) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            ...task,
            status: task.status === 'done' ? 'pending' : 'done',
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to update task');
      await fetchTasks();
      toast.success(
        task.status === 'done' ? 'Task marked as pending!' : 'Task marked as done!'
      );
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  // Sort: pending first, then done
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === 'done') return 1;
    return -1;
  });

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      await fetchTasks();
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  // Open edit modal
  const openEditModal = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditModalOpen(true);
  };

  // Save edit
  const handleEditSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${editTask._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            ...editTask,
            title: editTitle,
            description: editDescription,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to update task');
      setEditModalOpen(false);
      setEditTask(null);
      await fetchTasks();
      toast.success('Task updated!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditTask(null);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar isTaskPage={true} />
      <div style={{ display: 'flex' }}>
        <Sidebar tasks={tasks} tags={tags} />
        <div style={{ flex: 1, padding: '40px 32px' }}>
          <button
            onClick={() => navigate('/NewTask')}
            style={{
              marginBottom: 24,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            ← Back to Create Task
          </button>
          <h2 style={{ marginBottom: 24 }}>
            {filterDate
              ? `Tasks for ${filterDate}`
              : filterTag
                ? `Tasks for "${filterTag}"`
                : 'Your Tasks'}
          </h2>
          {sortedTasks.length === 0 ? (
            <div>No tasks found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sortedTasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-card${task.status === 'done' ? ' done' : ''}`}
                  style={{ background: task.color || undefined, opacity: task.status === 'done' ? 0.6 : 1 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => handleToggleDone(task)}
                      style={{ width: 20, height: 20 }}
                    />
                    <div>
                      <div className="task-info-title">{task.title}</div>
                      <div className="task-info-desc">{task.description}</div>
                      <div className="task-info-meta">
                        Date: {task.date} | Tags: {task.tags?.join(', ') || 'None'}
                      </div>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      className="task-btn edit"
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="task-btn delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editModalOpen && (
            <div
              className="task-modal-overlay"
              onClick={handleEditCancel}
            >
              <div
                className="task-modal-content"
                onClick={e => e.stopPropagation()}
              >
                <h3>Edit Task</h3>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Task Title"
                />
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  placeholder="Task Description"
                  style={{ minHeight: 60 }}
                />
                <div className="task-modal-actions">
                  <button
                    className="cancel"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="save"
                    onClick={handleEditSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskList;