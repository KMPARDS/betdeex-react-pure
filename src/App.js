import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
//import { connect } from 'react-redux'; // this is for accessing the store\
import { Row, Col } from 'react-bootstrap';

import Navbar from './containers/Navbar/Navbar';
import Sidebar from './containers/Sidebar/Sidebar';
import CreateWallet from './containers/CreateWallet/CreateWallet';
import LoadWallet from './containers/LoadWallet/LoadWallet';
import logo from './logo.svg';
import './App.css';

function App(props) {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Row>
          <Col>
            <Sidebar />
          </Col>
          <Col xs="9">
            <Route path="/create-wallet" exact component={CreateWallet} />
            <Route path="/load-wallet" component={LoadWallet} />
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

//export default connect(state => {return{store: state}})(App); // this is for accessing the store
export default App;
