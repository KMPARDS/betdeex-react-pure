import React, { Component } from 'react';
import { Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { betdeex } from '../../env';

import ResultElement from './ResultElement';

import createBetInstance from '../../ethereum/betInstance';
const ethers = require('ethers');

class Results extends Component {
  state = {
    loadingEndedBetsArray: true,
    betResultArray: []
  }
  componentDidMount = async() => {
    this.setState({ loadingEndedBetsArray: true });
    console.log(this.props.store);
    const endBettingEventSig = ethers.utils.id("EndBetContract(address,address,uint8,uint256,uint256)");
    console.log('endBettingEventSig', endBettingEventSig);
    const topics = [endBettingEventSig];
    console.log('topics', topics);

    const logs = await this.props.store.providerInstance.getLogs({
      address: betdeex.address,
      fromBlock: 0,
      toBlock: 'latest',
      topics
    });

    console.log('fetching logs from blockchain', logs);

    this.setState({
      loadingEndedBetsArray: false,
      betResultArray: logs.map(log => {
        const betAddress = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(log.topics[2]), 20);
        const result = Number(log.data.slice(0,66));
        const prizePool = ethers.utils.bigNumberify('0x'+log.data.slice(2).slice(64,64*2))
          .sub(ethers.utils.bigNumberify('0x'+log.data.slice(2).slice(64*2,64*3)));

        return {
          betAddress, result, prizePoolString: ethers.utils.formatEther(prizePool)
        };
      })
    });
  }
  render() {
    return (
      <>
        <section>
        <div className="lp">
          <div>
            {/* TRAINING BENEFITS */}
            <div className="events ev-po-2 ev-po-com">
                <div className="row">
                  <div className="inn-title">
                      <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" />Results of Previous Events</h2>
                  </div>
                <br></br>
                </div>
              {this.state.loadingEndedBetsArray
                ? 'Please wait loading your previous predictions...'
                : <Table responsive className="myTable">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Predictions</th>
                    <th>Prize Pool</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.betResultArray.reverse().map(
                  betResult => <ResultElement
                    betAddress={betResult.betAddress}
                    result={betResult.result}
                    prizePoolString={betResult.prizePoolString}
                    history={this.props.history}
                  />
                )}
                </tbody>
              </Table>}
            </div>
          </div>
        </div>
      </section>
      {/*<Table responsive>
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
      </Table>*/}
      </>
    );
  }
}

export default connect(state => {return{store: state}})(Results);
