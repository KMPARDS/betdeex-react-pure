import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { esContract, betdeex } from '../../env';

const ethers = require('ethers');

class NavbarComponent extends Component {
  state = {
    userAddress: ''
  };
  componentDidMount = () => {
    window.updateTheNavbar = async action => {
      window.zHistory = this.props.history;
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
      <Navbar class="headerbtn" style={{background:'linear-gradient(to right, #000 0%, #981802 100%)', zIndex: 999}} >

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

          <Dropdown class="dropdown custom-left">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" >
             <i class="fa fa-th dropbtn fadropbtn"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-overflow">
              <Dropdown.Item href="https://eraswaptoken.io" target="_blank">
              <img width="32px" src="/img/es-green.png" className="d-inline-block align-top" alt="Logo" style={{margin:'0 3px 0 0'}} />Decentralized Utility Token</Dropdown.Item>
              <Dropdown.Item href="https://timeswappers.com/swapperswall" target="_blank">
              <img src="/img/icons/12.png" className="d-inline-block align-top" alt="Logo"/>
              Social Community Platform
              </Dropdown.Item>
              <Dropdown.Item href="https://www.timeally.io/" target="_blank">
              <img src="/img/icons/12.png" className="d-inline-block align-top" alt="Logo"/> Decentralized Token Vesting </Dropdown.Item>
              <Dropdown.Item href="https://eraswapwallet.com/" target="_blank">
              <img src="/img/icons/10.png" className="d-inline-block align-top" alt="Logo"/> Decentralized Wallet</Dropdown.Item>
              <Dropdown.Item href="https://timeswappers.com/" target="_blank">
              <img src="/img/icons/2.png" className="d-inline-block align-top" alt="Logo"/> P2P Marketplace Platform</Dropdown.Item>
              <Dropdown.Item href="http://dayswappers.com/" target="_blank">
              <img src="/img/icons/9.png" className="d-inline-block align-top" alt="Logo"/> Affiliate Programme</Dropdown.Item>
              <Dropdown.Item href="https://buzcafe.com/" target="_blank">
              <img src="/img/icons/11.png" className="d-inline-block align-top" alt="Logo"/> Merchants &amp; Shoppers e-Retail</Dropdown.Item>
              <Dropdown.Item href="https://eraswap.academy/" target="_blank">
               <img src="/img/icons/3.png" className="d-inline-block align-top" alt="Logo"/> eLearning Platform</Dropdown.Item>
              <Dropdown.Item href="https://www.betdeex.com/" target="_blank">
              <img src="/img/icons/5.png" className="d-inline-block align-top" alt="Logo"/> Decentralized Prediction Platform </Dropdown.Item>
              <Dropdown.Item href="https://computeex.net/" target="_blank">
              <img src="/img/icons/7.png" className="d-inline-block align-top" alt="Logo"/> P2P Lend &amp; Borrow </Dropdown.Item>
              <Dropdown.Item href="https://computeex.net/" target="_blank">
              <img src="/img/icons/6.png" className="d-inline-block align-top" alt="Logo"/>  Multi Exchange Solution</Dropdown.Item>
              <Dropdown.Item href="http://valueoffarmers.org/" target="_blank">
              <img src="/img/icons/12.png" className="d-inline-block align-top" alt="Logo"/>  Farming Community </Dropdown.Item>
              <Dropdown.Item href="http://dateswappers.com/" target="_blank">
              <img src="/img/icons/12.png" className="d-inline-block align-top" alt="Logo"/>  Next Gen Dating and Match-Making</Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
        {/*<Nav.Link
          style={{color:'#fff', fontWeight:'600'}}
          onClick={() => this.props.history.push('/explore')}
        >
          Explore
        </Nav.Link>*/}


        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav.Link style={{color:'#fff', fontWeight:'600'}} onClick={() => this.props.history.push('/past-events')}>PAST EVENTS</Nav.Link>
          <Nav.Link style={{color:'#fff', fontWeight:'600'}} onClick={() => this.props.history.push('/results')}>RESULTS</Nav.Link>
          {!this.state.userAddress
            ? <Button variant="outline-light" onClick={() => this.props.history.push('/load-wallet')}>Connect to a wallet</Button>
          :
          <DropdownButton alignRight id="dropdown-basic-button" title={this.state.userAddress ? `Welcome ${String(this.state.userAddress).substr(0,6)}...` : 'Connect to a wallet'} variant="outline-light" drop="down">

            {/*<Dropdown.Header>Your HD Accounts</Dropdown.Header>
            <Dropdown.Item>Signed in as 0x124B7... (23.75 ES)</Dropdown.Item>*/}

            {/* show if not signed in*/
            /*
            !this.state.userAddress  ? <Dropdown.Item onClick={() => this.props.history.push('/create-wallet')}>Create Wallet</Dropdown.Item> : null*/}

            {/* show if not signed in*/
            !this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/load-wallet')}>Load Wallet</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => this.props.history.push('/user')}>Account page</Dropdown.Item> : null}

            {/* show if have manager privileges in*/
            this.state.userAddress && this.props.store.managerPrivileges ? <Dropdown.Item onClick={() => this.props.history.push('/manager-panel')}>Manager Panel</Dropdown.Item> : null}

            {/* show if not signed in*/
            this.state.userAddress ? <Dropdown.Item onClick={() => {
              this.props.dispatch({ type: 'LOAD-WALLET-INSTANCE', payload: {} });
              window.historyy = this.props.history;
              this.props.history.push('/logout');
            }}>Log out</Dropdown.Item> : null}
          </DropdownButton>}


        </Navbar.Collapse>

      </Navbar>
    );
  }
}

export default connect(state => {return{store: state}})(withRouter(NavbarComponent));
