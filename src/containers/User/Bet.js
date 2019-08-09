import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Spinner } from 'react-bootstrap';
import createBetInstance from '../../ethereum/betInstance';

const ethers = require('ethers');

class Bet extends Component {
  betInstance = createBetInstance(this.props.address);

  state = {
    amountChoice: [],
    isBetEnded: 0, // 0 => checking, 1 => no, 2 => yes
    querying: false
  };

  componentDidMount = async() => {
    const amountChoice = [];
    (async() => {
      await Promise.all([
        (async() => {
          amountChoice[0] = ethers.utils.formatEther(await this.betInstance.functions.bettorBetAmountInExaEsByChoice(this.props.store.walletInstance.address, 0));
        })(),
        (async() => {
          amountChoice[1] = ethers.utils.formatEther(await this.betInstance.functions.bettorBetAmountInExaEsByChoice(this.props.store.walletInstance.address, 1));
        })(),
        (async() => {
          amountChoice[2] = ethers.utils.formatEther(await this.betInstance.functions.bettorBetAmountInExaEsByChoice(this.props.store.walletInstance.address, 2));
        })()
      ]);
      this.setState({ amountChoice });
    })();

    const endTimestamp = await this.betInstance.functions.endTimestamp();
    this.setState({ isBetEnded: endTimestamp.gt(0) ? 2 : 1 });
  };

  render() {
    return (
      <Card>
        <p>{this.props.address}</p>
        <p>My Betting on Yes: {this.state.amountChoice[0] + ' ES' || 'Loading...'}</p>
        <p>My Betting on No: {this.state.amountChoice[1] + ' ES' || 'Loading...'}</p>
        <p>My Betting on Draw: {this.state.amountChoice[2] + ' ES' || 'Loading...'}</p>
        {this.state.isBetEnded === 0
          ? 'Please wait checking status of the bet...'
            : (this.state.isBetEnded === 1
              ? 'This bet is not yet ended'
                : <Button>
        {this.state.querying ?
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          style={{marginRight: '2px'}}
        /> : null}
          Query Winnings
        </Button>)}
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(Bet);
