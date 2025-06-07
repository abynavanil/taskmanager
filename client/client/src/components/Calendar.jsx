import React, { useState } from 'react';
import '../styles/Calendar.css';

const Calendar = ({ tasks = [] }) => {
  const [currentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to get all tasks for a date
  const getTasksForDate = (dateStr) =>
    tasks.filter(task => task.date === dateStr);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday start

    const days = [];
    // Previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }
    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }
    // Next month
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay++),
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-month">{monthNames[currentDate.getMonth()]}</div>
        <div className="calendar-year">{currentDate.getFullYear()}</div>
      </div>
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map((dayObj, idx) => {
          // Get local date string in YYYY-MM-DD
          const dateStr = dayObj.date.getFullYear() + '-' +
            String(dayObj.date.getMonth() + 1).padStart(2, '0') + '-' +
            String(dayObj.date.getDate()).padStart(2, '0');
          const isToday = dateStr === todayStr;
          const tasksForDate = getTasksForDate(dateStr);
          const color = tasksForDate.length > 0 ? tasksForDate[0].color : undefined;
          return (
            <div
              key={idx}
              className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              style={color ? { backgroundColor: color, color: '#fff', fontWeight: 600 } : {}}
            >
              {dayObj.date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;