import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Tabs, Tab, Table } from 'react-bootstrap';

import TransactionModal from '../TransactionModal/TransactionModal';
import ChoiceBettingsTable from './ChoiceBettingsTable';
import { categoryArray, subCategoryArray } from '../../env';

import createBetInstance from '../../ethereum/betInstance';
const provider = require('../../ethereum/provider');
const ethers = require('ethers');
// const BigNumber = require('bignumber.js');

class BetView extends Component {

  betdeexInstance = this.props.store.betdeexInstance;

  // using undefined instead of placeholder values because undefined is required for inequalities
  betInstance = createBetInstance(this.props.match.params.address, this.props.store.walletInstance);

  state = {
    isBetValid: true,
    description: undefined,
    isDrawPossible: undefined,
    category: undefined,
    subCategory: undefined,
    creationTimestamp: undefined,
    pauseTimestamp: undefined,
    endTimestamp: undefined,
    minimumBetInExaEs: undefined,
    prizePercentPerThousand: undefined,
    totalPrize: undefined,
    totalBetTokensInExaEsByChoice: [undefined,undefined,undefined],
    getNumberOfChoiceBettors: [undefined,undefined,undefined],
    showTransactionModal: false,
    userChoice: undefined,
    bettings: [],
    fetchingBettings: true
  }

  loadMy = async (property, outsideValue, shouldItloadAgain) => {
    const address = this.props.match.params.address

    // loads old data first then tries for updated values
    if(this.props.store.betsMapping[address]!==undefined && this.props.store.betsMapping[address][property]!==undefined) {
      this.setState({ [property]: this.props.store.betsMapping[address][property] });
    }
    let value;
    if(Array.isArray(outsideValue)) {
      outsideValue = [
        await outsideValue[0],
        await outsideValue[1],
        await outsideValue[2]
      ]
      value = outsideValue;
    } else {
      await outsideValue;
      value = outsideValue || await eval('betInstance.'+property+'()')
    }

    if(shouldItloadAgain || this.props.store.betsMapping[address]===undefined || this.props.store.betsMapping[address][property]===undefined) {
      this.props.dispatch({
        type: 'UPDATE-BETS-MAPPING-'+property.toUpperCase(),
        payload: {
          address: address,
          value //await outsideValue || await eval('betInstance.'+property+'()')
        }
      });
    }
    !value || await this.setState({ [property]:
        // this.props.store.betsMapping[address][property]
      await value
    });
    console.log(property, value, this.state[property]);
  };

  async componentDidMount() {
    const betdeexInstance = this.betdeexInstance;
    const betInstance = this.betInstance;
    window.betInstance = betInstance;

    const address = this.props.match.params.address;

    const isBetValid = await betdeexInstance.isBetValid(address);
    if(!isBetValid) {
      this.setState({ isBetValid: false });
      return;
    };

    this.loadMy('description');
    this.loadMy('isDrawPossible');
    this.loadMy('category');
    this.loadMy('subCategory');

    this.loadMy('finalResult');
    this.loadMy('endedBy', betInstance.endedBy(), true);

    this.loadMy('creationTimestamp');
    this.loadMy('pauseTimestamp');
    this.loadMy('endTimestamp');

    this.loadMy('minimumBetInExaEs');

    // const priz = await betInstance.prizePercentPerThousand();
    this.loadMy('prizePercentPerThousand');
    // console.log('this.state.prizePercentPerThousand', this.state.prizePercentPerThousand, priz);
    // console.log(await betInstance.totalPrize());
    // loadMy('totalPrize', betInstance.totalPrize(), true);

    await this.loadMy('totalBetTokensInExaEsByChoice', [
      betInstance.totalBetTokensInExaEsByChoice(0),
      betInstance.totalBetTokensInExaEsByChoice(1),
      betInstance.totalBetTokensInExaEsByChoice(2)
    ], true);
    // console.log('this.state.totalBetTokensInExaEsByChoice', this.state.totalBetTokensInExaEsByChoice);
    //
    this.loadMy('getNumberOfChoiceBettors', [
      betInstance.getNumberOfChoiceBettors(0),
      betInstance.getNumberOfChoiceBettors(1),
      betInstance.getNumberOfChoiceBettors(2)
    ], true);

    this.seeChoiceBettings(1);

    setTimeout(()=> {
      localStorage.setItem('betdeex-betsMapping', JSON.stringify(this.props.store.betsMapping));
    }, 5000);
  }

  seeChoiceBettings = async choice => {
    this.setState({ fetchingBettings: true });

    const newBettingEventSig = ethers.utils.id("NewBetting(address,address,uint8,uint256)");
    console.log('newBettingEventSig', newBettingEventSig);
    const topics = [
      newBettingEventSig,
      ethers.utils.hexZeroPad(this.betInstance.address, 32),
      null,
      ethers.utils.hexZeroPad(ethers.utils.bigNumberify(choice)._hex, 32)
    ];
    console.log('topics', topics);
    // console.log('othertopic', [
    //   newBettingEventSig,
    //   ethers.utils.hexZeroPad(this.betInstance.address, 32),
    //   ethers.utils.hexZeroPad(ethers.utils.bigNumberify(choice)._hex, 32), null
    // ]);

    const logs = await this.props.store.providerInstance.getLogs({
      address: this.betdeexInstance.address,
      fromBlock: 0,
      toBlock: 'latest',
      topics
    });

    console.log('choice bettors', logs);

    const bettings = [];

    for(const log of logs) {
      bettings.push({
        address: ethers.utils.hexStripZeros(log.topics[2]),
        amount: ethers.utils.formatEther(ethers.utils.bigNumberify(log.data))
      });
    }

    this.setState({ bettings, fetchingBettings: false });
  }

  render() {
    window.betInstance = this.betInstance;

console.log(this.state);
    // Have to bigNumberify the this.state.prizePercentPerThousand in fees because
    // it can be coming from local storage too.
    const fees
      = this.state.prizePercentPerThousand !== undefined
        ? (1000 - ethers.utils.bigNumberify(this.state.prizePercentPerThousand).toNumber()) / 10
        : undefined;

    const minimumBetInEs
      = this.state.minimumBetInExaEs !== undefined
        ? ethers.utils.formatEther(ethers.utils.bigNumberify(this.state.minimumBetInExaEs) || ethers.utils.bigNumberify(0))
        : undefined;

    // const totalPrizeInEs
    //   = this.state.totalPrize !== undefined
    //     ? ethers.utils.formatEther(ethers.utils.bigNumberify(this.state.totalPrize._hex) || ethers.utils.bigNumberify(0))
    //     : undefined;

    const totalBetTokensInEsByChoice = [
      // Object.entries(this.state.totalBetTokensInExaEsByChoice[0])
      this.state.totalBetTokensInExaEsByChoice[0] !== undefined
        ? ethers.utils.formatEther(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[0]) || ethers.utils.bigNumberify(0))
        : undefined,
      // Object.entries(this.state.totalBetTokensInExaEsByChoice[1])
      this.state.totalBetTokensInExaEsByChoice[1] !== undefined
        ? ethers.utils.formatEther(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[1]) || ethers.utils.bigNumberify(0))
        : undefined,
      // Object.entries(this.state.totalBetTokensInExaEsByChoice[2])
      this.state.totalBetTokensInExaEsByChoice[2] !== undefined
        ? ethers.utils.formatEther(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[2]) || ethers.utils.bigNumberify(0))
        : undefined
    ];
    //
    const totalPrizePool //= 1
      = this.state.totalBetTokensInExaEsByChoice[0] !== undefined
      && this.state.totalBetTokensInExaEsByChoice[1] !== undefined
      && this.state.totalBetTokensInExaEsByChoice[2] !== undefined
        ? ethers.utils.formatEther(
          ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[0] || 0)
            .add(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[1] || 0))
            .add(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[2] || 0))
            .mul(ethers.utils.bigNumberify(this.state.prizePercentPerThousand || 0))
            .div(1000)
            || '0'
        ) : null;



    let modalClose = () => this.setState({ showTransactionModal: false });


    const bettings = this.state.bettings.map(betting => (
      <tr>
        <td>{betting.address}</td>
        <td>{betting.amount} ES</td>
      </tr>
    ));




    return (
      <Card>
        { this.state.isBetValid ?
        <Card.Body>
          <p>Bet Address: {this.props.match.params.address}</p>
          <p>Category: {
            this.state.category !== undefined && this.state.subCategory !== undefined
            ? `${categoryArray[this.state.category]} / ${subCategoryArray[this.state.category][this.state.subCategory]}`
            : null
            }</p>
          <p>Description: {this.state.description}</p>
          <p>Start Time: {this.state.creationTimestamp ? new Date(this.state.creationTimestamp * 1000).toLocaleString() + ' (in your local timezone)' : 'Loading...'}</p>
          <p>Pause Time: {this.state.pauseTimestamp ? new Date(this.state.pauseTimestamp * 1000).toLocaleString() + ' (in your local timezone)' : 'Loading...'}</p>
          <p>Fees: {
            fees
            ? fees + '%'
            : 'Loading..'
          }</p>
          <p>Minimum: {
            minimumBetInEs
            ? minimumBetInEs + ' ES'
            : 'Loading..'
          }</p>
          <p>Total Prize Pool: {
            totalPrizePool
            ? totalPrizePool + ' ES'
            : 'Loading..'
          }</p>
          <p>Yes Amount: {
            totalBetTokensInEsByChoice[1]
            ? totalBetTokensInEsByChoice[1] + ' ES'
            : 'Loading..'
          }</p>
          <p>No Amount: {
            totalBetTokensInEsByChoice[0]
            ? totalBetTokensInEsByChoice[0] + ' ES'
            : 'Loading..'
          }</p>
          {
            this.state.isDrawPossible
            ? (<p>Draw Amount: {
              totalBetTokensInEsByChoice[2]
                ? totalBetTokensInEsByChoice[2] + ' ES'
                : 'Loading..'
                }</p>)
              : null
          }
          <>
            Predict Now:&nbsp;
            <Button variant="success" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 1 })}}>Yes</Button>
            <Button variant="danger" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 0 })}}>No</Button>
            <Button variant="warning" disabled={!this.state.isDrawPossible} onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 2 })}}>Draw</Button>
          </>

          <>
            <Tabs defaultActiveKey="yes" id="uncontrolled-tab-example"
            onSelect={key => this.seeChoiceBettings(key === 'yes' ? 1 : (key === 'no' ? 0 : 2))}>
              <Tab title="Yes" eventKey="yes">
                {!this.state.fetchingBettings ? <ChoiceBettingsTable>{Object.values(bettings).length ? bettings : 'There are no bettings on Yes'}</ChoiceBettingsTable> : 'Please wait fetching bettings on the contract from blockchain...'}
              </Tab>
              <Tab title="No" eventKey="no">
                {!this.state.fetchingBettings ? <ChoiceBettingsTable>{Object.values(bettings).length ? bettings : 'There are no bettings'}</ChoiceBettingsTable> : 'Please wait fetching bettings on the contract from blockchain...'}
              </Tab>
              <Tab title="Draw" eventKey="draw">
                {!this.state.fetchingBettings ? <ChoiceBettingsTable>{Object.values(bettings).length ? bettings : 'There are no bettings'}</ChoiceBettingsTable> : 'Please wait fetching bettings on the contract from blockchain...'}
              </Tab>
            </Tabs>
          </>

        </Card.Body>
        : 'This bet address is not valid'
        }

        <TransactionModal
          show={this.state.showTransactionModal}
          hideFunction={modalClose}
          ethereum={{
            transactor: this.betInstance.functions.enterBet,
            estimator: this.betInstance.estimate.enterBet,
            contract: this.betInstance,
            arguments: [this.state.userChoice],
            minimumBetInEs
          }}
          />
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(BetView);
