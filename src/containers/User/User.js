import React, { Component } from 'react';
import { InputGroup, FormControl, Button, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { betdeex } from '../../env.js';
import TransactionModal from '../TransactionModal/TransactionModal2';
import Bet from './Bet';
import createBetInstance from '../../ethereum/betInstance';

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
    bettingBetAddressArray: [],
    loadingBettingsArray: true,
    showUpdateAllowanceTransactionModal: false,
    showWithdrawTransactionModal: false,
    // bettingWinnings:
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

    const bettingBetAddressArray = [];

    for(const log of logs) {
      const betAddress = ethers.utils.hexStripZeros(log.topics[1]);
      if(!bettingBetAddressArray.includes(betAddress)) {
        bettingBetAddressArray.push(betAddress);
      }
    }

    console.log('bettingBetAddressArray', bettingBetAddressArray);

    this.setState({ bettingBetAddressArray, loadingBettingsArray: false });
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
                    <Button variant="outline-primary"
                      onClick={() => this.setState({ showUpdateAllowanceTransactionModal: true })}
                    >Update now</Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => this.setState({ updateAllowance: false })}
                    >
                      Not now
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              }

              <Button
                variant="outline-danger"
                onClick={() => this.props.history.push('/user/history')}
              >
                View Betting History
              </Button>

              {this.state.bettingBetAddressArray.map(
                address => <Bet address={address} />
              )}

          </>
          : 'Please sign in by clicking on Era Swap Wallet'
        }
        <TransactionModal
          show={this.state.showUpdateAllowanceTransactionModal}
          hideFunction={() => this.setState({ showUpdateAllowanceTransactionModal: false })}
          ethereum={{
            transactor: this.props.store.esInstance.functions.approve,
            estimator: this.props.store.esInstance.estimate.approve,
            contract: this.props.store.esInstance,
            contractName: 'EraSwap',
            arguments: [
              this.props.store.betdeexInstance.address, ethers.utils.parseEther(this.state.newAllowance || '0')
            ],
            ESAmount: this.state.newAllowance,
            headingName: 'Approve Function',
            functionName: 'Approve',
            directGasScreen: true,
            continueFunction: () => {
              this.refreshBalances();
              this.setState({ showUpdateAllowanceTransactionModal: false, updateAllowance: false });
            }
          }}
          />

          <TransactionModal
            show={this.state.showUpdateAllowanceTransactionModal}
            hideFunction={() => this.setState({ showUpdateAllowanceTransactionModal: false })}
            ethereum={{
              transactor: this.props.store.esInstance.functions.approve,
              estimator: this.props.store.esInstance.estimate.approve,
              contract: this.props.store.esInstance,
              contractName: 'EraSwap',
              arguments: [
                this.props.store.betdeexInstance.address, ethers.utils.parseEther(this.state.newAllowance || '0')
              ],
              ESAmount: this.state.newAllowance,
              headingName: 'Approve Function',
              functionName: 'Approve',
              directGasScreen: true,
              continueFunction: () => {
                this.refreshBalances();
                this.setState({ showUpdateAllowanceTransactionModal: false, updateAllowance: false });
              }
            }}
            />
      </div>
    );
  }
}

export default connect(state => {return{store: state}})(User);
