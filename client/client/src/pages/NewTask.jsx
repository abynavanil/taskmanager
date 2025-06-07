import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import '../styles/NewTask.css';
import Sidebar from '../components/SideBar';
import Calendar from '../components/Calendar';
import { useTasks } from '../context/TaskContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useIsMobile = () => window.innerWidth <= 900;

const NewTask = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#a855f7');
  const [repeatEnabled, setRepeatEnabled] = useState(true);
  const [frequency, setFrequency] = useState('Weekly');
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [selectedTags, setSelectedTags] = useState(['Daily Routine']);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { tasks, fetchTasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState('');
  const [isMobile, setIsMobile] = useState(useIsMobile());

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const handleResize = () => setIsMobile(useIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Extract unique tags from all tasks
  const tags = Array.from(
    new Set(tasks.flatMap(task => Array.isArray(task.tags) ? task.tags : []))
  );

  const colors = [
    '#d1fae5', '#a855f7', '#fed7aa', '#a7f3d0', '#fef08a',
    '#84cc16', '#67e8f9', '#3b82f6', '#8b5cf6', '#ec4899',
    '#ef4444', '#d1d5db'
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const frequencies = ['Daily', 'Weekly', 'Monthly'];

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddMoreClick = () => {
    setShowTagInput(true);
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      toast.error('Task name is required!');
      return;
    }
    if (!selectedDate) {
      toast.error('Task date is required!');
      return;
    }

    const taskData = {
      title: taskName,
      description: taskDescription,
      color: selectedColor,
      status: 'pending',
      repeat: {
        enabled: repeatEnabled,
        frequency: frequency.toLowerCase(),
        days: selectedDays,
      },
      tags: selectedTags,
      date: selectedDate,
    };

    try {
      const res = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      await fetchTasks();
      toast.success('Task successfully created!');
      setTaskName('');
      setTaskDescription('');
      setSelectedColor('#a855f7');
      setRepeatEnabled(true);
      setFrequency('Weekly');
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
      setSelectedTags(['Daily Routine']);
      setShowTagInput(false);
      setNewTag('');
      setSelectedDate('');
    } catch (err) {
      toast.error('Error creating task');
    }
  };

  // Sidebar content for mobile
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar isTaskPage={true} />
      <div className="newtask-main-container">
        {!isMobile && <Sidebar tasks={tasks} tags={tags} />}
        <div className="task-form">
          <div className="form-header">
            <h1 className="form-title">New Task</h1>
            <span className="emoji"> <FontAwesomeIcon icon={faList} size="lg" /></span>
          </div>

          <div className="form-group">
            <label className="section-title">Select Date</label>
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Name your new task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-input form-textarea"
              placeholder="Describe your new task"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>

          <div className="color-section">
            <h3 className="section-title">Card Color</h3>
            <div className="color-grid">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="repeat-section">
            <div className="repeat-group">
              <div className="repeat-toggle">
                <div
                  className={`toggle-switch ${repeatEnabled ? 'active' : ''}`}
                  onClick={() => setRepeatEnabled(!repeatEnabled)}
                >
                  <div className="toggle-knob" />
                </div>
                <span className="toggle-label">Set a cycle for your task</span>
              </div>

              {repeatEnabled && (
                <>
                  <div className="frequency-tabs">
                    {frequencies.map((freq) => (
                      <div
                        key={freq}
                        className={`frequency-tab ${frequency === freq ? 'active' : ''}`}
                        onClick={() => setFrequency(freq)}
                      >
                        {freq}
                      </div>
                    ))}
                  </div>

                  <div className="days-grid">
                    {days.map((day) => (
                      <button
                        key={day}
                        className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="repeat-info">
                    <span>Repeat</span>
                    <span>Every {frequency.toLowerCase()} →</span>
                  </div>
                </>
              )}
            </div>

            <div className="repeat-group">
              <div className="toggle-label" style={{ marginBottom: '15px' }}>Set a tag for your task</div>
              <div className="tag-options">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))}
                {showTagInput ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="New tag"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleAddTag();
                      }}
                      autoFocus
                      style={{ width: '100px' }}
                    />
                    <button type="button" className="add-more-button" onClick={handleAddTag}>
                      Add
                    </button>
                    <button type="button" className="add-more-button" onClick={() => setShowTagInput(false)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" className="add-more-button" onClick={handleAddMoreClick}>
                    Add More +
                  </button>
                )}
              </div>
            </div>
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            <Check size={24} />
          </button>

          {/* Mobile Sidebar Content */}
          {isMobile && (
            <div className="mobile-sidebar-content">
              <Calendar tasks={tasks} />
              <div className="sidebar-section">
                <div className="sidebar-title">Tasks</div>
                <div
                  className="sidebar-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.location.href = `/tasks?date=${today}`;
                  }}
                >
                  <span>Today</span>
                  <span className="task-count">
                    {tasks.filter(task => task.date === today).length}
                  </span>
                </div>
                <div
                  className="sidebar-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.location.href = '/tasks'}
                >
                  <span>Total Tasks</span>
                  <span className="task-count">{tasks.length}</span>
                </div>
              </div>
              <div className="sidebar-section">
                <div className="sidebar-title">Lists</div>
                {tags.map(tag => (
                  <div
                    className="sidebar-item"
                    key={tag}
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = `/tasks?tag=${encodeURIComponent(tag)}`}
                  >
                    <span>{tag}</span>
                    <span className="task-count">
                      {tasks.filter(task => task.tags && task.tags.includes(tag)).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewTask;