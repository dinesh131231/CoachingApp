import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import Signup from './pages/signup.jsx'
// import Login from './pages/login.jsx'
// import Admin from './pages/Admin.jsx'
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
// import Note from './component/Note.jsx'
// import ProtectedRoute from './component/ProtectedRoute.jsx'










createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>

  </StrictMode>,
)
