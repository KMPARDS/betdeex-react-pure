import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import axios from 'axios';

import createBetInstance from '../../ethereum/betInstance';

const ethers = require('ethers');
const BigNumber = require('bignumber.js');

class TransactionModal extends Component {
  state = {
    currentScreen: 0,
    esTokensToBet: 0,
    estimating: false,
    estimatedGas: 0,
    ethGasStation: {}
  }
  // componentDidUpdate = async prevProps => {
  //   if(this.props.show && ( prevProps.show != this.props.show )) {
  //     // const estimatedGas = (await this.props.ethereum.estimator(...this.props.ethereum.arguments)).toNumber();
  //     // const ethGasStationResponse = (await axios.get('https://ethgasstation.info/json/ethgasAPI.json')).data;
  //     // console.log(ethGasStationResponse);
  //     // this.setState({
  //     //   ethGasStation: [
  //     //     ethGasStationResponse['safeLow'],
  //     //     ethGasStationResponse['average'],
  //     //     ethGasStationResponse['fast'],
  //     //     ethGasStationResponse['fastest']
  //     //   ],
  //     //   estimatedGas
  //     // });
  //   }
  //
  //   //console.log(await this.props.estimator() );
  //
  //   //
  //   // let data = ethers.utils.hexDataSlice(ethers.utils.id('fee()'), 0, 4);
  //   //
  //   // let transaction = {
  //   //     to: address,
  //   //     data: data
  //   // }
  //   //
  //   // let callPromise = defaultProvider.call(transaction);
  //
  // }

  estimateGasScreen = async () => {
    this.setState({ estimating: true });

    try {
      const betTokensInExaEs = ethers.utils.bigNumberify(this.state.esTokensToBet).mul(10**15).mul(10**3);
      window.sohammm = betTokensInExaEs;
      const estimatedGas = (await this.props.ethereum.estimator(...this.props.ethereum.arguments, betTokensInExaEs)).toNumber();
      const ethGasStationResponse = (await axios.get('https://ethgasstation.info/json/ethgasAPI.json')).data;
      console.log(ethGasStationResponse);
      this.setState({
        ethGasStation: [
          ethGasStationResponse['safeLow'],
          ethGasStationResponse['average'],
          ethGasStationResponse['fast'],
          ethGasStationResponse['fastest']
        ],
        estimatedGas
      });

      this.setState({ currentScreen: 1 });
    } catch (e) {

    }
  }

  render() {
    let screenContent;
    if(Object.entries(this.props.store.walletInstance).length === 0) {
      screenContent = (
        <Modal.Body style={{textAlign: 'center'}}>
          <h5>You need to load your wallet to place a prediction.</h5>
          <Button onClick={() => {window.redirectHereAfterLoadWallet=this.props.location.pathname;this.props.history.push('/load-wallet')}}>Load my wallet</Button>
          <hr />
          <h5>If you don't yet have a wallet, create it now.</h5>
          <Button onClick={() => this.props.history.push('/create-wallet')}>Create wallet</Button>
        </Modal.Body>
      );
    } else if(this.state.currentScreen === 0) {
      screenContent = (
        <div>
          <Modal.Body>
            <h5>Enter the amount of ES to bet on {this.props.ethereum.arguments[0] === 0 ? 'No' : (this.props.ethereum.arguments[0] === 1 ? 'Yes' : 'Draw')}</h5>
            <InputGroup className="mb-3">
              <FormControl onKeyUp={ ev => this.setState({ esTokensToBet: ev.target.value }) }
                placeholder={`Minimum is ${this.props.ethereum.minimumBetInEs} ES`}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">ES</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer style={{display:'block', textAlign: 'center'}}>
            <Button onClick={this.estimateGasScreen} disabled={this.state.estimating}>
            {this.state.estimating ?
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{marginRight: '2px'}}
            /> : null}
              {this.state.estimating ? 'Estimating Gas' : 'Estimate Network Fees'}
            </Button>
          </Modal.Footer>
        </div>
      );
    } else {
      screenContent = (
        <div>
          <Modal.Body>
          <p>
            Ethereum Network Fee: <br />
            Slow Safe: {this.state.estimatedGas * this.state.ethGasStation[0] * 0.1 * 0.000000001} ETH
            <br />
            Average: {this.state.estimatedGas * this.state.ethGasStation[1] * 0.1 * 0.000000001} ETH
            <br />
            Fast: {this.state.estimatedGas * this.state.ethGasStation[2] * 0.1 * 0.000000001} ETH
            <br />
            Fastest: {this.state.estimatedGas * this.state.ethGasStation[3] * 0.1 * 0.000000001} ETH
            <br />
            Click below button to sign your transaction and submit it to the blockchain.
          </p>
          </Modal.Body>
          <Modal.Footer style={{display:'block', textAlign: 'center'}}>
            <Button>Sign and send transaction</Button>
          </Modal.Footer>
        </div>
      );
    }


    return (
      <Modal
        {...this.props}
        onHide={() => {
          this.props.hideFunction();
          setTimeout(() => {
            this.setState({
              currentScreen: 0,
              esTokensToBet: 0,
              estimating: false,
              estimatedGas: 0,
              ethGasStation: {}
            });
          }, 500);
        }}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Era Swap Wallet
          </Modal.Title>
        </Modal.Header>

        {screenContent}
      </Modal>
    );
  }
}

export default withRouter(TransactionModal);
