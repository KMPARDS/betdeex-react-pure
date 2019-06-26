import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './containers/Navbar/Navbar';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        Hey
      </div>
    </BrowserRouter>
  );
}

export default App;
