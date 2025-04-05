import { useState } from 'react';

import './App.css';
import { Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login.jsx';
import Signup from './components/SignUp.jsx';
import Dashboard from './components/Dashboard.jsx';
import ShowDetail from './components/ShowDetail.jsx';
// import PageNotFound from './components/PageNotFound';
// import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navigation from './components/Navigation.jsx';
import Watchlist from './components/Watchlist.jsx';

function App() {

  return (
    <AuthProvider>

      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Mini Netflix Clone</h1>
          <Navigation />
        </header>
        <div className='App-body'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shows/:id" element={<ShowDetail />} />
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>

    </AuthProvider>
  );
}

export default App;
