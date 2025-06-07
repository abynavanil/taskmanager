import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTasks } from '../context/TaskContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { fetchTasks } = useTasks();

  const validate = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      toast.error('Enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
  // Use VITE_API_URL from .env for the backend URL
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      );
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        name: user?.name || formData.name,
        email: user?.email || formData.email
      }));

      toast.success('User registered successfully');
      setFormData({ name: '', email: '', password: '' });

      await fetchTasks();
      setTimeout(() => {
        navigate('/NewTask');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2500} />
      <Navbar />
      <div className="register-container">
        {/* Background */}
        <svg className="wave-background" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#bfdbfe" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.9" />
          <path d="M0,450 Q250,350 500,450 T1000,450 Q1100,400 1200,450 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.9" />
          <path d="M0,500 Q200,400 400,500 T800,500 Q1000,450 1200,500 L1200,800 L0,800 Z" fill="url(#waveGradient)" opacity="0.9" />
          <path d="M0,0 L1200,0 L1200,200 Q1000,150 800,200 T400,200 Q200,250 0,200 Z" fill="url(#waveGradient)" opacity="0.9" />
          <path d="M0,0 L1200,0 L1200,150 Q900,100 600,150 T0,150 Z" fill="url(#waveGradient)" opacity="0.9" />
        </svg>

        {/* Register Card */}
        <div className="register-card">
          <h2 className="register-title">Register</h2>
          <p className="register-subtitle">
            Welcome ! Sign in using your social<br />
            account or email to continue us
          </p>

          <div className="social-icons">
            <div className="social-icon facebook">
              <FaFacebookF />
            </div>
            <div className="social-icon google">
              <FaGoogle />
            </div>
            <div className="social-icon apple">
              <FaApple />
            </div>
          </div>

          {/* Form */}
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
            <button type="submit" className="register-button">
              Register
            </button>
          </form>

          <p className='login-link' style={{ marginTop: "16px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;