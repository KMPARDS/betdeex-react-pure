import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, InputGroup, FormControl, Spinner, Alert, Badge, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

import { betdeex } from '../../env';
import createBetInstance from '../../ethereum/betInstance';

const ethers = require('ethers');
const BigNumber = require('bignumber.js');

class TransactionModal extends Component {
  state = {
    userAddress: '',
    contractAddress: '',
    currentScreen: 0,
    esTokensToBet: 0,
    estimating: false,
    estimationError: '',
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

  showEstimateGasScreen = async () => {
    this.setState({
      estimating: true,
      estimationError: '',
      userAddress: (await this.props.store.walletInstance.getAddress()).toLowerCase(),
      contractAddress: await this.props.ethereum.contract.address
    });

    try {
      const amountStringArray = this.state.esTokensToBet.split('.');

      let betTokensInExaEsString;
      if(amountStringArray[0].length === this.state.esTokensToBet.length) {
        // no decimal point
        betTokensInExaEsString = this.state.esTokensToBet + '0'.repeat(18);
      } else {
        // decimal point is entered
        if(amountStringArray[1].length > 18 || amountStringArray[2]) {
          throw new Error('Can have only upto 18 decimal points');
        } else {
          // between 1 and 18 decimals
          betTokensInExaEsString = amountStringArray[0] + amountStringArray[1] + '0'.repeat(18 - amountStringArray[1].length);
        }
      }

      const betTokensInExaEs = ethers.utils.bigNumberify(betTokensInExaEsString)//.mul(10**15).mul(10**3);
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
      this.setState({ estimating: false, estimationError: e.message })
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
    }


    else if(this.state.currentScreen === 0) {
      screenContent = (
        <Modal.Body>
          <h5>Enter the amount of ES to bet on {this.props.ethereum.arguments[0] === 0 ? 'NO' : (this.props.ethereum.arguments[0] === 1 ? 'YES' : 'DRAW')}</h5>
          <InputGroup className="mb-3">
            <FormControl onKeyUp={ ev => this.setState({ esTokensToBet: ev.target.value }) }
              placeholder={`Minimum is ${this.props.ethereum.minimumBetInEs} ES`}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">ES</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>

          {
            this.state.estimationError
            ? <Alert variant="danger">
                There was this error while estimating: {this.state.estimationError}
              </Alert>
            : null
          }

          <div style={{display:'block', textAlign: 'center'}}>
          <Button onClick={this.showEstimateGasScreen} disabled={this.state.estimating}>
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
          </div>
        </Modal.Body>
      );
    }


    else if(this.state.currentScreen === 1) {
      screenContent = (
        <Modal.Body style={{padding: '15px'}}>
          From: Your address <strong>{this.state.userAddress.slice(0,6) + '..' + this.state.userAddress.slice(this.state.userAddress.length - 3)}</strong><br />
          To: Bet address <strong>{this.state.contractAddress.slice(0,6) + '..' + this.state.contractAddress.slice(this.state.contractAddress.length - 3)}</strong>

          <Card style={{display:'block', padding: '15px', marginTop: '5px'}}>
            New betting on <Badge variant={this.props.ethereum.arguments[0] === 0 ? 'danger' : (this.props.ethereum.arguments[0] === 1 ? 'success' : 'warning')}>{this.props.ethereum.arguments[0] === 0 ? 'NO' : (this.props.ethereum.arguments[0] === 1 ? 'YES' : 'DRAW')}</Badge>
            <span style={{display: 'block', fontSize: '1.8rem'}}>
              {this.state.esTokensToBet}<strong>ES</strong>
            </span>
            + network fee of Ethereum
            <span style={{display: 'block', fontSize: '1.8rem'}}>
              {Math.round(this.state.estimatedGas * ( this.state.ethGasStation[2] / 10 )) / 10**9}<strong>ETH</strong>
            </span>
            <span onClick={()=>this.setState({currentScreen: 2})} style={{display: 'block', textAlign:'right', fontSize: '0.8rem'}}>Advanced settings</span>
          </Card>

        </Modal.Body>
      );
    }


    else if(this.state.currentScreen === 2) {
      screenContent = (
        <Modal.Body style={{padding: '15px'}}>
          <h5>Advanced gas settings</h5>
          {[
            {name: 'Slow', eth: Math.round(this.state.estimatedGas * ( this.state.ethGasStation[0] / 10 )) / 10**9, time: 'around 30 mins to confirm'},
            {name: 'Average', eth: Math.round(this.state.estimatedGas * ( this.state.ethGasStation[1] / 10 )) / 10**9, time: 'around 10 mins to confirm' },
            {name: 'Fast', eth: Math.round(this.state.estimatedGas * ( this.state.ethGasStation[2] / 10 )) / 10**9, time: 'around 2 mins to confirm' },
            {name: 'Faster', eth: Math.round(this.state.estimatedGas * ( this.state.ethGasStation[3] / 10 )) / 10**9, time: 'around 30 secs to conirm'}
          ].map(plan => (
            <Card key={'advanced-'+plan.name} onClick={() => {
              // update the gwei being used
              // change screen to 1
            }}>
              <Card.Title>{plan.name}</Card.Title>
              <Card.Subtitle>{plan.eth}</Card.Subtitle>
              <Card.Text>{plan.time}</Card.Text>
            </Card>
          ))}
        </Modal.Body>
      );
    }


    else {
      screenContent = (
        <div>
          <Modal.Body>
            <p>
              Ethereum Network Fee: <br />
              Slow Safe: {Math.round(this.state.estimatedGas * ( this.state.ethGasStation[0] / 10 )) / 10**9} ETH
              <br />
              Average: {Math.round(this.state.estimatedGas * ( this.state.ethGasStation[1] / 10 )) / 10**9} ETH
              <br />
              Fast: {Math.round(this.state.estimatedGas * ( this.state.ethGasStation[2] / 10 )) / 10**9} ETH
              <br />
              Fastest: {Math.round(this.state.estimatedGas * ( this.state.ethGasStation[3] / 10 )) / 10**9} ETH
              <br />
              Click below button to sign your transaction and submit it to the blockchain.
            </p>
            <div style={{display:'block', textAlign: 'center'}}>
              <Button>Sign and send to Blockchain</Button>
            </div>
          </Modal.Body>
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

export default connect(state => {return{store: state}})(withRouter(TransactionModal));
