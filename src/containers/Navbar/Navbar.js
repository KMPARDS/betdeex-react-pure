import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { esContract, betdeex } from '../../env';

const ethers = require('ethers');

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

        const provider = userAddress ? action.payload : this.props.store.providerInstance;

        // update es instance
        this.props.dispatch({ type: 'LOAD-ES-INSTANCE', payload: new ethers.Contract(esContract.address, esContract.abi, provider) });

        // update betdeex instance
        this.props.dispatch({ type: 'LOAD-BETDEEX-INSTANCE', payload: new ethers.Contract(betdeex.address, betdeex.abi, provider) });

        const isManager = this.props.store.walletInstance.address
        ? await this.props.store.betdeexInstance.functions.isManager(
          this.props.store.walletInstance.address) : false;
        // UPDATE-MANAGER-PRIVILEGES
        this.props.dispatch({ type: 'UPDATE-MANAGER-PRIVILEGES', payload: isManager });
      }
    };
  }

  render() {
    return (
      <Navbar style={{background:'linear-gradient(to right, #270101 0%, #981802 100%)'}} >

        <Link to="/">
          <Navbar.Brand>
            <img
              src="/betdeex-logo.png"
              width="180 "
              height="55"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
        </Link>


        {/*<Nav.Link
          style={{color:'#fff', fontWeight:'600'}}
          onClick={() => this.props.history.push('/explore')}
        >
          Explore
        </Nav.Link>*/}


        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav.Link style={{color:'#fff', fontWeight:'600'}} >How to Play?</Nav.Link>
          <DropdownButton alignRight id="dropdown-basic-button" title={this.state.userAddress ? `Welcome ${String(this.state.userAddress).substr(0,6)}...` : 'Connect to a wallet'} variant="outline-light" drop="down">

            {/*<Dropdown.Header>Your HD Accounts</Dropdown.Header>
            <Dropdown.Item>Signed in as 0x124B7... (23.75 ES)</Dropdown.Item>*/}

            {/* show if not signed in*/
            !this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/create-wallet')}>Create Wallet</Dropdown.Item> : null}

            {/* show if not signed in*/
            !this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/load-wallet')}>Load Wallet</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/user')}>Account page</Dropdown.Item> : null}

            {/* show if have manager privileges in*/
            this.props.store.managerPrivileges ? <Dropdown.Item onClick={() => this.props.history.push('/manager-panel')}>Manager Panel</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => {
              this.props.dispatch({ type: 'LOAD-WALLET-INSTANCE', payload: {} });
              window.historyy = this.props.history;
              this.props.history.push('/logout');
            }}>Log out</Dropdown.Item> : null}
          </DropdownButton>
        </Navbar.Collapse>

      </Navbar>
    );
  }
}

export default connect(state => {return{store: state}})(withRouter(NavbarComponent));
