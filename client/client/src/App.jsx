import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import NewTask from './pages/NewTask'; import './App.css'
import Sidebar from './components/SideBar';
import { TaskProvider } from './context/TaskContext.jsx';
import TaskList from './pages/TaskList';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route to Login page */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> {/* Added Login route */}
        <Route path="/NewTask" element={<NewTask />} />
        <Route path="/tasks" element={<TaskList />} />


      </Routes>
    </Router>
  );
}

export default App;
