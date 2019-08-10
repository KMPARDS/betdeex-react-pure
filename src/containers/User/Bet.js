import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Spinner } from 'react-bootstrap';
import createBetInstance from '../../ethereum/betInstance';

const ethers = require('ethers');

class Bet extends Component {
  betInstance = createBetInstance(
    this.props.address,
    this.props.store.walletInstance
  );

  state = {
    amountChoice: [],
    // isBetEnded: 0, // 0 => checking, 1 => no, 2 => yes
    querying: false,
    userPrize: undefined,
    queryErrorMessage: '',
    withdrawing: 0,
    withdrawErrorMessage: '',
    withdrawDone: false,
    alreadyClaimed: false
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

    // console.log('address', this.props.store.walletInstance.address);

    const alreadyClaimed = await this.betInstance.functions.bettorHasClaimed(this.props.store.walletInstance.address);

    // console.log('alreadyClaimed', alreadyClaimed);

    this.setState({ alreadyClaimed });

    // const endTimestamp = await this.betInstance.functions.endTimestamp();
    // this.setState({ isBetEnded: endTimestamp.gt(0) ? 2 : 1 });
  };

  queryWinnings = async() => {
    this.setState({ querying: true, queryErrorMessage: '' });
    let userPrize;
    try {
      userPrize = await this.betInstance.functions.seeWinnerPrize(this.props.store.walletInstance.address);
      this.setState({ userPrize });
    } catch (err) {
      this.setState({ queryErrorMessage: err.reason });
    }
    this.setState({ querying: false });
  }

  withdrawWinnings = async() => {
    this.setState({ withdrawing: 1, withdrawErrorMessage: '' });
    try {
      const tx = await this.betInstance.functions.withdrawPrize();
      this.setState({ withdrawing: 2 });
      tx.wait();
      this.setState({ withdrawing: 3 });
    } catch (err) {
      this.setState({ withdrawErrorMessage: err });
    }
    this.setState({ withdrawing: 0 });
  }

  render() {
    return (
      <Card>
        <p>{this.props.address}</p>
        <p>My Betting on Yes: {this.state.amountChoice[0] + ' ES' || 'Loading...'}</p>
        <p>My Betting on No: {this.state.amountChoice[1] + ' ES' || 'Loading...'}</p>
        <p>My Betting on Draw: {this.state.amountChoice[2] + ' ES' || 'Loading...'}</p>
        {this.state.alreadyClaimed
          ? 'You have already claimed this betting'
          : <>{
        this.state.queryErrorMessage ?
          'Error from smart contract: ' + this.state.queryErrorMessage
        : (this.state.userPrize === undefined
          ? <Button
          disabled={this.state.querying}
          onClick={this.queryWinnings}
        >
          {this.state.querying ?
          <><Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            style={{marginRight: '2px'}}
          />Querying</>: 'Query Winnings'}
        </Button>
          : ethers.utils.formatEther(this.state.userPrize || 0) + ' ES'
          )
        }

      {  this.state.withdrawErrorMessage ?
          <><br />{'Error from smart contract: ' + this.state.withdrawErrorMessage}</>
        :
          (this.state.userPrize !== undefined
          ? <Button
            disabled={this.state.withdrawing}
            onClick={this.withdrawWinnings}
          >
            {this.state.withdrawing ?
            <><Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{marginRight: '2px'}}
            />Withdrawing</>
            : 'Withdraw Winnings'}
          </Button>
          : null)
        }</>}
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(Bet);
