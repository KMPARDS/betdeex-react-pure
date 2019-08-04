import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, InputGroup, FormControl, Spinner, Alert, Badge, Card, ListGroup, Row, Col } from 'react-bootstrap';
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
    exaEsTokensToBet: {},
    estimating: false,
    estimationError: '',
    estimatedGas: 0,
    ethGasStation: {},
    selectedGwei: 0,
    sendingTx: false,
    txHash: '',
    pending: true,
    pendingTime: 0.0
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
      const estimatedGas = await this.props.ethereum.estimator(...this.props.ethereum.arguments, this.state.exaEsTokensToBet);
      const ethGasStationResponse = (await axios.get('https://ethgasstation.info/json/ethgasAPI.json')).data;
      console.log(ethGasStationResponse);
      this.setState({
        ethGasStation: [
          ethGasStationResponse['safeLow'],
          ethGasStationResponse['average'],
          ethGasStationResponse['fast'],
          ethGasStationResponse['fastest']
        ],
        estimatedGas,
        selectedGwei: ethGasStationResponse['fast'] / 10,
        currentScreen: 1
      });

      this.setState({ currentScreen: 1 });
    } catch (e) {
      this.setState({ estimating: false, estimationError: 'There was this error while estimating: ' + e.message })
    }
  }

  sendTransaction = async () => {
    await this.setState({ sendingTx: true });
    const start = new Date();
    const betTokensInExaEs = ethers.utils.bigNumberify(this.state.exaEsTokensToBet);
    const response = await this.props.ethereum.transactor(...this.props.ethereum.arguments, betTokensInExaEs);
    console.log(response, `time taken: ${new Date() - start}`);
    this.setState({
      sendingTx: false,
      currentScreen: 3,
      txHash: response.hash,
      pending: true,
      pendingTime: 0.0
    });
    const intervalId = setInterval(() => {
      this.setState({ pendingTime: this.state.pendingTime+0.01 })
    }, 10);
    await response.wait();
    clearInterval(intervalId);
    await this.setState({ pending: false });
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
            <FormControl onKeyUp={ ev => {
              try {
                this.setState({ exaEsTokensToBet: ethers.utils.parseEther(ev.target.value), estimationError: '' });
              } catch(e) {
                this.setState({ estimationError: 'Please enter the amount properly' })
              }
            } }
              placeholder={`Minimum is ${this.props.ethereum.minimumBetInEs} ES`}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">ES</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>

          {
            this.state.estimationError
            ? <Alert variant="danger">
                {this.state.estimationError}
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
      let gasEtherString = ethers.utils.formatEther(this.state.estimatedGas.mul(
        ethers.utils.parseUnits(String(this.state.selectedGwei), 'gwei')
      ));

      const decimalPos = gasEtherString.indexOf('.');
      if(decimalPos !== -1 && gasEtherString.length > 9 && gasEtherString.length - 1 - decimalPos > 7) {
        gasEtherString = gasEtherString.slice(0,10)
      }

      screenContent = (
        <Modal.Body style={{padding: '15px'}}>
          From: Your address <strong>{this.state.userAddress.slice(0,6) + '..' + this.state.userAddress.slice(this.state.userAddress.length - 3)}</strong><br />
          To: Bet address <strong>{this.state.contractAddress.slice(0,6) + '..' + this.state.contractAddress.slice(this.state.contractAddress.length - 3)}</strong>

          <Card style={{display:'block', padding: '15px 15px 30px', marginTop: '5px'}}>
            New betting on <Badge variant={this.props.ethereum.arguments[0] === 0 ? 'danger' : (this.props.ethereum.arguments[0] === 1 ? 'success' : 'warning')}>{this.props.ethereum.arguments[0] === 0 ? 'NO' : (this.props.ethereum.arguments[0] === 1 ? 'YES' : 'DRAW')}</Badge>
            <span style={{display: 'block', fontSize: '1.8rem'}}>
              {ethers.utils.formatEther(this.state.exaEsTokensToBet)}<strong>ES</strong>
            </span>
            + estimated gas fee of network
            <span style={{display: 'block', fontSize: '1.8rem'}}>
            {gasEtherString}<strong style={{display: 'inline-block', wordBreak: 'keep-all'}}>ETH</strong>
            </span>
            <span onClick={()=>this.setState({currentScreen: 2})} style={{display: 'inline-block', float:'right', fontSize: '0.8rem'}}>Advanced settings</span>
          </Card>

          <Row style={{marginTop: '12px'}}>
            <Col style={{paddingRight: '6px'}}>
              <Button variant="secondary" size="lg" block>Reject</Button>
            </Col>
            <Col style={{paddingLeft: '6px'}}>
              <Button variant="primary" size="lg" block onClick={this.sendTransaction} disabled={this.state.sendingTx}>
              {this.state.sendingTx ?
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{marginRight: '2px'}}
              /> : null}
              Proceed</Button>
            </Col>
          </Row>

        </Modal.Body>
      );
    }


    else if(this.state.currentScreen === 2) {
      screenContent = (
        <Modal.Body style={{padding: '15px'}}>
          <h5>Advanced gas settings</h5>
          {[
            {name: 'Slow', gwei: this.state.ethGasStation[0] / 10, time: 'around 30 mins to confirm'},
            {name: 'Average', gwei: this.state.ethGasStation[1] / 10, time: 'around 10 mins to confirm' },
            {name: 'Fast', gwei: this.state.ethGasStation[2] / 10, time: 'around 2 mins to confirm' },
            {name: 'Faster', gwei: this.state.ethGasStation[3] / 10, time: 'around 30 secs to confirm'}
          ].map(plan => (
            <Card key={'advanced-'+plan.name} style={{margin: '10px 0', padding:'10px'}} onClick={() => {
              // update the gwei being used
              // change screen to 1
              this.setState({
                selectedGwei: plan.gwei,
                currentScreen: 1
              });
            }}>
              <Card.Title>{plan.name}</Card.Title>
              <Card.Subtitle>{Math.round(this.state.estimatedGas * plan.gwei) / 10**9}</Card.Subtitle>
              <Card.Text>{plan.time}</Card.Text>
            </Card>
          ))}
        </Modal.Body>
      );
    }


    else if(this.state.currentScreen === 3) {
      // after the transaction is sent
      const url = `https://rinkeby.etherscan.io/tx/${this.state.txHash}`;

      screenContent = (
        <div>
          <Modal.Body>
            <p>{
              this.state.pending
              ? `Your transaction is pending... (${(Math.round(this.state.pendingTime * 100) / 100).toFixed(2)})`
              : `Your transaction is confirmed! It took like ${(Math.round(this.state.pendingTime * 100) / 100)} seconds`
            }</p>
            <p>You can view your transaction on&nbsp;<a href={url} target="_blank" style={{wordBreak: 'keep-all'}}>Etherscan</a>.</p>
          </Modal.Body>
        </div>
      );
    } else {

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
