import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navbar from './containers/Navbar/Navbar';
import CreateWallet from './containers/CreateWallet/CreateWallet';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route path="/create-wallet" component={CreateWallet} />
      </div>
    </BrowserRouter>
  );
}

export default App;
