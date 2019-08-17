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
      let block;
      const betAddress = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(log.topics[1]), 20);
      const choiceId = Number(log.topics[3]);
      const choice = choiceId === 0 ? 'No' : (
        choiceId === 1 ? 'Yes' : 'Draw'
      );
      const betInstance = createBetInstance(ethers.utils.getAddress(betAddress.toLowerCase()));
      let description;
      // await Promise.all([
        description = await betInstance.functions.description()
        block = await this.props.store.providerInstance.getBlock(log.blockNumber)
      // ]);
      // const endTimestamp = await betInstance.functions.endTimestamp();
      // console.log('endedBy', endedBy);
      bettingsArray.push(
        <>
        {/*<tr key={'bettings-'+index}>
          <td>{index}</td>
          <td onClick={() => this.props.history.push('/bet/'+ethers.utils.getAddress(betAddress))}>{betAddress.slice(0, 6) + '...' + betAddress.slice(betAddress.length - 2)}</td>
          <td>{choice}</td>
          <td>{ethers.utils.formatEther(ethers.utils.bigNumberify(log.data))} ES</td>

          <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>
        </tr>*/}
        <tr>
          <td>{index}</td>
          <td><img src="images/coun/t3.png" alt="" />
            <div className="h-tm-ra">
              <h4>{description}</h4><span>{betAddress}</span>
            </div>
          </td>
          <td>{choice}</td>
          <td>{ethers.utils.formatEther(ethers.utils.bigNumberify(log.data))} ES</td>
          <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>

        </tr>
        </>
      );
      this.setState({ bettingsArray });
    }
    this.setState({ loadingBettingsArray: false })
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
                      <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> View History of Betting Transactions:</h2>
                  </div>
                <br></br>
                </div>
              {this.state.loadingBettingsArray
                ? 'Please wait loading your previous predictions...'
                : <Table responsive className="myTable">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Bet Address</th>
                    <th>Choice</th>
                    <th>Amount</th>
                    <th>Betting time</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.bettingsArray}
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

export default connect(state => {return{store: state}})(History);
