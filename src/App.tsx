import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {store} from "../store/index"
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TeamBuilderPage from './pages/TeamBuilderPage';
import PokemonDetailPage from './pages/PokemonDetailPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-white dark:bg-pokemon-dark text-black dark:text-white">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/team-builder/:teamId?" 
                element={
                  <ProtectedRoute>
                    <TeamBuilderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pokemon/:id" 
                element={
                  <ProtectedRoute>
                    <PokemonDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App
