import React, { Component } from 'react';
import { InputGroup, FormControl, Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { betdeex } from '../../env.js';
import TransactionModal from '../TransactionModal/TransactionModal';

const ethers = require('ethers');

class User extends Component {
  state = {
    userAddress: undefined,
    ethBalance: undefined,
    esBalance: undefined,
    esAllowance: undefined,
    updateAllowance: false,
    newAllowance: undefined,
    badAllowanceValue: false,
    bettingsArray: [],
    loadingBettingsArray: true
  }
  componentDidMount = async () => {
    if(Object.entries(this.props.store.walletInstance).length) {
      window.walletInstance = this.props.store.walletInstance;
      this.setState({ userAddress: await this.props.store.walletInstance.getAddress() });
      this.refreshBalances();
      this.showUserBettings();
    }

  }
  refreshBalances = () => {
    (async() => {
      const ethBalance = await this.props.store.walletInstance.getBalance();
      this.setState({ ethBalance: ethers.utils.formatEther(ethBalance || ethers.bigNumberify(0)) });
    })();

    (async() => {
      const esBalance = await this.props.store.esInstance.balanceOf(this.props.store.walletInstance.address);
      this.setState({ esBalance: ethers.utils.formatEther(esBalance || ethers.bigNumberify(0)) });
    })();

    (async() => {
      const esAllowance = ethers.utils.formatEther(
        await this.props.store.esInstance.allowance(
          this.props.store.walletInstance.getAddress(),
          betdeex.address
        )
      );
      this.setState({ esAllowance, newAllowance: esAllowance });
    })();
  };

  showUserBettings = async() => {
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
      bettingsArray.push(
        <tr key={'bettings-'+index}>
          <td>{index}</td>
          <td onClick={() => this.props.history.push('/bet/'+betAddress)}>{betAddress.slice(0, 6) + '...' + betAddress.slice(betAddress.length - 2)}</td>
          <td>{choice}</td>
          <td>{ethers.utils.formatEther(ethers.utils.bigNumberify(log.data))} ES</td>
          <td>{block.timestamp}</td>
          <td>Not released</td>
        </tr>
      );
    }

    this.setState({ bettingsArray, loadingBettingsArray: false });
  }

  render() {
    return (
      <div>
        {
          this.state.userAddress ?
          <>
            <p>User address: {this.state.userAddress ? this.state.userAddress : 'Please sign in'}</p>
            <p>ETH balance: {this.state.ethBalance ? this.state.ethBalance + ' ETH' : 'Loading...'}</p>
            <p>User Main ES balance: {this.state.esBalance ? this.state.esBalance + ' ES' : 'Loading...'}</p>
            {!this.state.updateAllowance
              ? <p>
                ES Allowance to BetDeEx:
                {this.state.esAllowance
                  ? <>
                    {this.state.esAllowance + ' ES'}
                    <Button onClick={() => this.setState({ updateAllowance: true })} variant="outline-primary">Update Allowance</Button>
                  </>
                  : 'Loading...'
                }
              </p>
              : <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Enter allowance in ES"
                    aria-label="Enter allowance in ES"
                    value={this.state.newAllowance}
                    onChange={event => {
                      let newAllowance;
                      try {
                        newAllowance = event.target.value;
                        ethers.utils.parseEther(newAllowance);
                        this.setState({ newAllowance, badAllowanceValue:false });
                      } catch (e) {
                        this.setState({ badAllowanceValue: true, newAllowance })
                      }

                    }}
                    style={this.state.badAllowanceValue ? {
                      border: '1px solid #f77'
                    } : {}}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-primary">Update now</Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => this.setState({ updateAllowance: false })}
                    >
                      Not now
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              }

              {this.state.loadingBettingsArray
                ? 'Please wait loading your previous bettings...'
                : <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bet</th>
                    <th>Choice</th>
                    <th>Amount</th>
                    <th>Betting time</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.bettingsArray}
                </tbody>
              </Table>
              }

          </>
          : 'Please sign in by clicking on Era Swap Wallet'
        }
        {/*<TransactionModal

        />*/}
      </div>
    );
  }
}

export default connect(state => {return{store: state}})(User);
