import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button } from 'react-bootstrap';

import { categoryArray, subCategoryArray } from '../../env';
import createBetInstance from '../../ethereum/betInstance';
const provider = require('../../ethereum/provider');

class BetView extends Component {

  state = {
    description: 'Loading...',
    category: 'Loading...',
    subCategory: 'Loading...',
    creationTime: 'Loading...',
    pauseTime: 'Loading...',
    fees: 'Loading...',
    totalBetAmount: 'Loading...',
    noAmount: 'Loading...',
    yesAmount: 'Loading...',
    drawAmount: 'Loading...'
  }

  async componentDidMount() {
    const betInstance = createBetInstance(this.props.address);

    // loading description
    (async()=>{
      if(this.props.store.betsMapping[this.props.address] && this.props.store.betsMapping[this.props.address].description) {
        this.setState({ description: this.props.store.betsMapping[this.props.address].description });
      } else {
        const description = await betInstance.description();
        this.setState({ description:  description });
        window.betsMapping[this.props.address].description = description;
        // this.props.dispatch({
        //   type:
        // });
      }
    })();

    // loading the category and sub category
    (async()=>{
      let categoryId = await betInstance.category(),
        subCategoryId = await betInstance.subCategory();
      // if(window.betsMapping[this.props.address].categoryId && window.betsMapping[this.props.address].subCategoryId) {
      //   categoryId = window.betsMapping[this.props.address].category;
      //   subCategoryId = window.betsMapping[this.props.address].subCategory;
      // } else {
      //   categoryId = await betInstance.category();
      //   subCategoryId = await betInstance.subCategory();
      //   window.betsMapping[this.props.address].categoryId = categoryId;
      //   window.betsMapping[this.props.address].subCategoryId = subCategoryId;
      // }
      this.setState({ category: categoryArray[categoryId], subCategory: subCategoryArray[categoryId][subCategoryId] });
    })();

    // loading the creation and pause time
    (async()=>{
      let creationBlockNumber;

      if(window.betsMapping[this.props.address].creationBlockNumber) {
        creationBlockNumber = window.betsMapping[this.props.address].creationBlockNumber;
      } else {
        creationBlockNumber = Number(await betInstance.creationBlockNumber());
        window.betsMapping[this.props.address].creationBlockNumber = creationBlockNumber;
      }

      const creationBlock = await provider.getBlock(creationBlockNumber);
      this.setState({ creationTime: new Date(creationBlock.timestamp * 1000).toLocaleString() + ' (in your local timezone)' });

      let pauseBlockNumber;

      if(window.betsMapping[this.props.address].pauseBlockNumber) {
        pauseBlockNumber = window.betsMapping[this.props.address].pauseBlockNumber;
      } else {
        pauseBlockNumber = Number(await betInstance.pauseBlockNumber());
      }

      const pauseBlock = await provider.getBlock(pauseBlockNumber);
      console.log('pause block',pauseBlock);
      if(pauseBlock) {
        this.setState({ pauseTime: new Date(pauseBlock.timestamp * 1000).toLocaleString() + ' (in your local timezone)' });
      } else {
        const blockdiff = pauseBlockNumber - creationBlockNumber;
        console.log(blockdiff);
        const estimatedPauseTimeStamp = creationBlock.timestamp + blockdiff*15;
        this.setState({ pauseTime: new Date(estimatedPauseTimeStamp * 1000).toLocaleString() + ' (approx) (in your local timezone)' });
      }
    })();

    // load fees
    (async () => {
      const pricePercentPerThousand = await betInstance.pricePercentPerThousand();
      this.setState({ fees: `${(1000-pricePercentPerThousand)/10}%` });
    })();

    (async () => {
      const totalBetAmount = Number(await betInstance.betBalanceInExaEs());
      this.setState({ totalBetAmount: `${totalBetAmount} ES` });
    })();

    (async () => {
      const noAmount = await betInstance.totalBetTokensInExaEsByChoice(0);
      this.setState({ noAmount: `${noAmount} ES` });
    })();

    (async () => {
      const yesAmount = await betInstance.totalBetTokensInExaEsByChoice(1);
      this.setState({ yesAmount: `${yesAmount} ES` });
    })();

    (async () => {
      const drawAmount = await betInstance.totalBetTokensInExaEsByChoice(2);
      this.setState({ drawAmount: `${drawAmount} ES` });
    })();
  }

  render() {
    return (
      <Card style={{margin: '15px 0'}}>
        <Card.Body>
          <p>Bet Address: {this.props.address}</p>
          <p>Category: {this.state.category} / {this.state.subCategory}</p>
          <h3>Description: {this.state.description}</h3>
          <p>Start Time: {this.state.creationTime}</p>
          <p>Pause Time: {this.state.pauseTime}</p>
          <p>Fees: {this.state.fees}</p>
          <p>Total Bet Amount: {this.state.totalBetAmount}</p>
          <p>Yes Amount: {this.state.yesAmount}</p>
          <p>No Amount: {this.state.noAmount}</p>
          <p>Draw Amount: {this.state.drawAmount}</p>
          Predict Now:&nbsp;
          <Button variant="success">Yes</Button>
          <Button variant="danger">No</Button>
          <Button variant="warning">Draw</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(BetView);
