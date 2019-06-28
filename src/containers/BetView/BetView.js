import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

import { categoryArray, subCategoryArray } from '../../env';
import createBetInstance from '../../ethereum/betInstance';
const provider = require('../../ethereum/provider');
const ethers = require('ethers');
const BigNumber = require('bignumber.js');

class BetView extends Component {

  // using undefined instead of placeholder values because undefined is required for inequalities
  state = {
    description: undefined,
    isDrawPossible: undefined,
    category: undefined,
    subCategory: undefined,
    creationTimestamp: undefined,
    pauseTimestamp: undefined,
    endTimestamp: undefined,
    minimumBetInExaEs: undefined,
    pricePercentPerThousand: undefined,
    totalPrize: undefined,
    totalBetTokensInExaEsByChoice: [undefined,undefined,undefined],
    getNumberOfChoiceBettors: [undefined,undefined,undefined]
  }

  async componentDidMount() {
    const address = this.props.match.params.address;
    const betInstance = createBetInstance(address);

    const loadMy = async (property, outsideValue, shouldItloadAgain) => {

      // loads old data first then tries for updated values
      if(shouldItloadAgain && this.props.store.betsMapping[address]!==undefined && this.props.store.betsMapping[address][property]!==undefined) {
        this.setState({ [property]: this.props.store.betsMapping[address][property] });
      }
      if(Array.isArray(outsideValue)) {
        outsideValue = [
          await outsideValue[0],
          await outsideValue[1],
          await outsideValue[2]
        ]
        console.log('Array.isArray',property, outsideValue);
      }
      if(this.props.store.betsMapping[address]===undefined || this.props.store.betsMapping[address][property]===undefined) {
        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-'+property.toUpperCase(),
          payload: {
            address: address,
            value: await outsideValue || await eval('betInstance.'+property+'()')
          }
        });
      }
      this.setState({ [property]: this.props.store.betsMapping[address][property] });
    }

    loadMy('description');
    loadMy('isDrawPossible');
    loadMy('category');
    loadMy('subCategory');

    loadMy('finalResult');
    loadMy('endedBy');

    loadMy('creationTimestamp');
    loadMy('pauseTimestamp');
    loadMy('endTimestamp');
    //
    loadMy('minimumBetInExaEs', betInstance.minimumBetInExaEs());

    loadMy('pricePercentPerThousand', betInstance.pricePercentPerThousand());

    loadMy('totalPrize', betInstance.totalPrize(), true);

    loadMy('totalBetTokensInExaEsByChoice', [
      betInstance.totalBetTokensInExaEsByChoice(0),
      betInstance.totalBetTokensInExaEsByChoice(1),
      betInstance.totalBetTokensInExaEsByChoice(2)
    ], true);

    loadMy('getNumberOfChoiceBettors', [
      betInstance.getNumberOfChoiceBettors(0),
      betInstance.getNumberOfChoiceBettors(1),
      betInstance.getNumberOfChoiceBettors(2)
    ], true);

    localStorage.setItem('betdeex-betsMapping', JSON.stringify(this.props.store.betsMapping));

    window.sohamm = this.state;
    ;
  }

  render() {
    const fees = this.state.pricePercentPerThousand!==undefined  ? (1000 - ethers.utils.bigNumberify(this.state.pricePercentPerThousand).toNumber()) / 10 : undefined;

    const minimumBetInEs = this.state.minimumBetInExaEs!==undefined ? (new BigNumber(ethers.utils.bigNumberify(this.state.minimumBetInExaEs))).dividedBy(10**18).toFixed() : undefined;

    const totalPrizeInEs = this.state.totalPrize!==undefined ? (new BigNumber(ethers.utils.bigNumberify(this.state.totalPrize))).dividedBy(10**18).toFixed() : undefined;

    const totalBetTokensInEsByChoice = [
      this.state.totalBetTokensInExaEsByChoice[0]!==undefined ? (new BigNumber(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[0]))).dividedBy(10**18).toFixed() : undefined,
      this.state.totalBetTokensInExaEsByChoice[1]!==undefined ? (new BigNumber(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[1]))).dividedBy(10**18).toFixed() : undefined,
      this.state.totalBetTokensInExaEsByChoice[2]!==undefined ? (new BigNumber(ethers.utils.bigNumberify(this.state.totalBetTokensInExaEsByChoice[2]))).dividedBy(10**18).toFixed() : undefined
    ];
    return (
      <Card style={{margin: '15px 0'}}>
        <Card.Body>
          <p>Bet Address: {this.props.address}</p>
          <p>Category: {
            this.state.category !== undefined && this.state.subCategory !== undefined
            ? `${categoryArray[this.state.category]} / ${subCategoryArray[this.state.category][this.state.subCategory]}`
            : null
            }</p>
          <p>Description: {this.state.description}</p>
          <p>Start Time: {new Date(this.state.creationTimestamp * 1000).toLocaleString() + ' (in your local timezone)'}</p>
          <p>Pause Time: {new Date(this.state.pauseTimestamp * 1000).toLocaleString() + ' (in your local timezone)'}</p>
          <p>Fees: {
            this.state.pricePercentPerThousand
            ? fees + '%'
            : 'Loading..'
          }</p>
          <p>Minimum: {
            this.state.minimumBetInExaEs
            ? minimumBetInEs
            : 'Loading..'
          }</p>
          <p>Total Prize Pool: {
            this.state.totalPrize
            ? totalPrizeInEs + ' ES'
            : 'Loading..'
          }</p>
          <p>Yes Amount: {
            this.state.totalBetTokensInExaEsByChoice[1]
            ? totalBetTokensInEsByChoice[1] + ' ES'
            : 'Loading..'
          }</p>
          <p>No Amount: {
            this.state.totalBetTokensInExaEsByChoice[0]
            ? totalBetTokensInEsByChoice[0] + ' ES'
            : 'Loading..'
          }</p>
          <p>Draw Amount: {
            this.state.totalBetTokensInExaEsByChoice[2]
            ? totalBetTokensInEsByChoice[2] + ' ES'
            : 'Loading..'
          }</p>
          Predict Now:&nbsp;
          <Button variant="success">Yes</Button>
          <Button variant="danger">No</Button>
          {
            this.state.isDrawPossible ? <Button variant="warning">Draw</Button> : null
          }
        </Card.Body>
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(BetView);
