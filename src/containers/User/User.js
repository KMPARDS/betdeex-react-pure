import React, { Component } from 'react';
import { connect } from 'react-redux';
import { betdeex } from '../../env.js';

const BigNumber = require('bignumber.js');

class User extends Component {
  state = {
    userAddress: undefined,
    ethBalance: undefined,
    esBalance: undefined,
    esAllowance: undefined
  }
  componentDidMount = async () => {
    if(Object.entries(this.props.store.walletInstance).length) {
      window.walletInstance = this.props.store.walletInstance;
      this.setState({ userAddress: await this.props.store.walletInstance.getAddress() });
      this.refreshBalances();
    }

  }
  refreshBalances = async () => {

    this.setState({
      ethBalance: (new BigNumber(await this.props.store.walletInstance.getBalance())).dividedBy(10**18).toFixed(),
      esBalance: (new BigNumber(await this.props.store.esInstance.balanceOf(this.props.store.walletInstance.getAddress()))).dividedBy(10**18).toFixed(),
      esAllowance: (new BigNumber(await this.props.store.esInstance.allowance(this.props.store.walletInstance.getAddress(), betdeex.address))).dividedBy(10**18).toFixed()
    });
  }
  render() {

    return (
      <div>
        {
          this.state.userAddress ?
          <div>
            <p>User address: {this.state.userAddress ? this.state.userAddress : 'Please sign in'}</p>
            <p>ETH balance: {this.state.ethBalance ? this.state.ethBalance + ' ETH' : 'Loading...'}</p>
            <p>User Main ES balance: {this.state.esBalance ? this.state.esBalance + ' ES' : 'Loading...'}</p>
            <p>ES Allowance to BetDeEx: {this.state.esAllowance ? this.state.esAllowance + ' ES' : 'Loading...'}</p>
          </div>
          : 'Please sign in by clicking on Era Swap Wallet'
        }
      </div>
    );
  }
}

export default connect(state => {return{store: state}})(User);
