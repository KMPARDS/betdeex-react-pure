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
      const betAddress = ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(log.topics[1]), 20);
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
    <section>
        <div className="se lp">
          <div className="row">
            {/* TITLE */}
            <div className="inn-title">
            <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> User Address: <span>{this.state.userAddress ? this.state.userAddress : 'Please load your wallet'}</span></h2>
            </div>
            {/* LEFT SIDE: SPORTS EVENTS */}
            <div className="event-left col-md-12">
              {/*Sports Events in Dubai*/}
              <ul>
                <li>
                  <div className="betbox">
                    <h5 className="mt-2" style={{color:'#263846', textAlign:'left'}}>ETH balance: {this.state.userAddress ? (this.state.ethBalance ? this.state.ethBalance + ' ETH' : 'Loading...') : 'Please load wallet to see your ETH balance'}</h5>
                    <h5 className="mt-2" style={{color:'#263846', textAlign:'left'}}>User Main ES balance: {this.state.userAddress ? (this.state.esBalance ? this.state.esBalance + ' ES' : 'Loading...') : 'Please load wallet to see your ES balance'}</h5>
                    <h5 className="mt-2" style={{color:'#263846', textAlign:'left'}}>{ (!this.state.updateAllowance
                      ? <>
                        ES Allowance to BetDeEx:
                        {this.state.userAddress ? (this.state.esAllowance
                          ? <>
                            {' ' + this.state.esAllowance + ' ES '}
                            <Button onClick={() => this.setState({ updateAllowance: true })} variant="outline-primary">Update Allowance</Button>
                          </>
                          : ' Loading...') : ' Please load wallet to see your BetDeEx allowance'
                        }
                      </>
                      : <InputGroup className="mb-3">
                          <InputGroup.Prepend>
                            <InputGroup.Text>
                              EDIT ES ALLOWANCE AND PRESS UPDATE
                            </InputGroup.Text>
                          </InputGroup.Prepend>
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
                        </InputGroup>)
                      }</h5>

                    <div className="market-preview-styles_MarketPreview__footer">
                      <article>
                        <section className="market-properties-styles_MarketProperties">

                          <div className="inn-tickers">
                            {/*<a class="inn-reg-com inn-reg-book" style={{background: 'rgb(40, 167, 69)', padding: '10px 30px', margin:'10px', color: 'rgb(255, 255, 255)'}}> Update Allowance</a>*/}
                            <button onClick={() => this.props.history.push('/user/history')} className="inn-reg-com inn-reg-book" style={{background: 'rgb(40, 167, 69)', padding: '10px 30px', margin:'10px', color: 'rgb(255, 255, 255)'}}>View History of Betting transactions</button>
                          </div>
                        </section>
                      </article>
                    </div>
                  </div>
                </li>


              </ul>
            </div>
            {/* RIGHT SIDE: FEATURE EVENTS */}
          </div>
        </div>
    </section>
    <section>
        <div className="se lp">
          <div className="row">
            {/* TITLE */}
            <div className="inn-title">
            <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> Your Participations in bets:</h2>
            </div>
            <br></br>
            </div>
            {/* LEFT SIDE: SPORTS EVENTS */}
            <div className="row">
            {this.state.loadingBettingsArray ? 'Please wait loading your bet participations...' : (this.state.bettingBetAddressArray.length ?
              this.state.bettingBetAddressArray.map(
              address => <Bet address={address} history={this.props.history} />
            ) : 'No bet participations' )}

            </div>
            {/* RIGHT SIDE: FEATURE EVENTS */}
          </div>
    </section>




          </>
          : 'Please sign in by clicking on Connect to wallet'
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
      </div>
    );
  }
}

export default connect(state => {return{store: state}})(User);
