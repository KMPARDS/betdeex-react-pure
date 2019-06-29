import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';

class NavbarComponent extends Component {
  state = {
    userAddress: ''
  };

  componentDidMount = () => {
    window.updateTheNavbar = async action => {
      if(action.type === 'LOAD-WALLET-INSTANCE') {
        let userAddress = '';
        if(Object.entries(action.payload).length) {
          userAddress = await action.payload.getAddress();
        }
        this.setState({ userAddress });
      }
    };
  }

  render() {
    return (
      <Navbar style={{backgroundColor: '#070707'}}>

        <Link to="/">
          <Navbar.Brand>
            <img
              src="/betdeex-logo.png"
              width="100 "
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </Link>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav.Link style={{color: 'white'}}>How to Play?</Nav.Link>
          <DropdownButton alignRight id="dropdown-basic-button" title={this.state.userAddress ? `Welcome ${String(this.state.userAddress).substr(0,6)}...` : 'Era Swap Wallet'} variant="outline-light" drop="down">

            {/*<Dropdown.Header>Your HD Accounts</Dropdown.Header>
            <Dropdown.Item>Signed in as 0x124B7... (23.75 ES)</Dropdown.Item>*/}

            {/* show if not signed in*/
            !this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/create-wallet')}>Create Wallet</Dropdown.Item> : null}

            {/* show if not signed in*/
            !this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/load-wallet')}>Load Wallet</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/user')}>Account page</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => {
              this.props.dispatch({ type: 'LOAD-WALLET-INSTANCE', payload: {} });
            }}>Log out</Dropdown.Item> : null}
          </DropdownButton>
        </Navbar.Collapse>

      </Navbar>
    );
  }
}

export default connect(state => {return{store: state}})(withRouter(NavbarComponent));
