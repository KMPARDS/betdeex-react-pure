import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { betdeex } from '../../env';
import createBetInstance from '../../ethereum/betInstance';
const ethers = require('ethers');
class History extends Component {
  state = {
    loadingBettingsArray: true,
    bettingsArray: []
  }
  componentDidMount = async() => {
    this.setState({ loadingBettingsArray: true });
    console.log(this.props.store)
    const newBettingEventSig = ethers.utils.id("NewBetting(address,address,uint8,uint256)");
    console.log('newBettingEventSig', newBettingEventSig);
    const topics = [
      newBettingEventSig, null, ethers.utils.hexZeroPad(this.props.store.walletInstance.address, 32), null
    ];
    console.log('topics', topics);

    const logs = await this.props.store.providerInstance.getLogs({
      address: betdeex.address,
      fromBlock: 0,
      toBlock: 'latest',
      topics
    });

    console.log('fetching logs from blockchain', logs);

    const bettingsArray = [];

    for(let index = 0; index < logs.length; index++) {
      const log = logs[index];
      const block = await this.props.store.providerInstance.getBlock(log.blockNumber);
      const betAddress = ethers.utils.hexStripZeros(log.topics[1]);
      const choiceId = Number(log.topics[3]);
      const choice = choiceId === 0 ? 'No' : (
        choiceId === 1 ? 'Yes' : 'Draw'
      );
      // const betInstance = createBetInstance(betAddress);
      // const endTimestamp = await betInstance.functions.endTimestamp();
      // console.log('endedBy', endedBy);
      bettingsArray.push(
        <tr key={'bettings-'+index}>
          <td>{index}</td>
          <td onClick={() => this.props.history.push('/bet/'+betAddress)}>{betAddress.slice(0, 6) + '...' + betAddress.slice(betAddress.length - 2)}</td>
          <td>{choice}</td>
          <td>{ethers.utils.formatEther(ethers.utils.bigNumberify(log.data))} ES</td>

          <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>
        </tr>
      );
      this.setState({ bettingsArray });
    }
    this.setState({ loadingBettingsArray: false })
  }
  render() {
    return (
      <>
      {this.state.loadingBettingsArray
        ? 'Please wait loading your previous bettings...'
        : <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Bet Address</th>
            <th>Choice</th>
            <th>Amount</th>
            <th>Betting time</th>
          </tr>
        </thead>
        <tbody>
          {this.state.bettingsArray}
        </tbody>
      </Table>
      }
      </>
    );
  }
}

export default connect(state => {return{store: state}})(History);
