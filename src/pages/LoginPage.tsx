import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/features/auth/authSlice';
import { toggleTheme } from '../../store/features/theme/themeSlice';
import { Moon, Sun } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication
    if (username && password) {
      dispatch(login({
        id: Date.now().toString(),
        username
      }));
      navigate('/dashboard');
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-pokemon-dark">
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleThemeToggle}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
        >
          {/* Theme toggle icon */}
          {document.documentElement.classList.contains('dark') ? (
            <Sun className="text-yellow-500" />
          ) : (
            <Moon className="text-blue-500" />
          )}
        </button>
      </div>
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-pokemon-primary">
          Pokémon Team Manager
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
              focus:outline-none focus:ring-pokemon-primary focus:border-pokemon-primary 
              dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
              focus:outline-none focus:ring-pokemon-primary focus:border-pokemon-primary 
              dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-pokemon-primary text-white rounded-md hover:bg-red-600 
            transition duration-300 dark:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;