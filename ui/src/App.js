// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AppNavbar from "./common/AppNavbar";
import Logout from "./components/Logout";
import Deposit from "./components/Deposit";

function App() {

  return (
      <Router>
              <AppNavbar />
              <div className="container">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/logout" element={<Logout />} />
                      <Route path="/deposit" element={<Deposit />} />
                  </Routes>
              </div>
      </Router>
  );
}

export default App;
