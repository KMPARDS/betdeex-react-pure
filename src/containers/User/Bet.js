import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Spinner } from 'react-bootstrap';
import createBetInstance from '../../ethereum/betInstance';

const ethers = require('ethers');

class Bet extends Component {
  betInstance = createBetInstance(
    ethers.utils.getAddress(this.props.address),
    this.props.store.walletInstance
  );

  state = {
    amountChoice: [],
    // isBetEnded: 0, // 0 => checking, 1 => no, 2 => yes
    querying: false,
    userPrize: undefined,
    queryErrorMessage: '',
    withdrawing: 0, // 3 => done
    withdrawErrorMessage: '',
    withdrawDone: false,
    alreadyClaimed: undefined
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

    console.log('alreadyClaimed', alreadyClaimed);

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
      this.props.refreshBalances();
    } catch (err) {
      this.setState({ withdrawErrorMessage: err });
    }
    // this.setState({ withdrawing: 4 });
  }

  render() {
    return (
      <>
      <div className="col-md-12 my-4">
          <div className="betbox">
            <h5 onClick={() => this.props.history.push('/bet/'+ethers.utils.getAddress(this.props.address))} className="mt-2" style={{color:'#28a745', textAlign:'left', fontWeight:'900'}}>Bet Address: {this.props.address}</h5>
            <hr></hr>
            <div class="inn-all-com">
                <div class="inn-ev-date">
                    <div class="inn-ev-date-left">
                        <h4>{
                          ethers.utils.formatEther(
                            ethers.utils.parseEther(
                              this.state.amountChoice[0] || '0.0'
                            ).add(
                              ethers.utils.parseEther(
                                this.state.amountChoice[1] || '0.0'
                              )
                            ).add(
                              ethers.utils.parseEther(
                                this.state.amountChoice[2] || '0.0'
                              )
                            )
                          )}</h4>
                        <span>Total Invested in Bet</span>
                    </div>
                    <div class="inn-ev-date-rig">
                        <ul>
                            <li> <h4>{this.state.amountChoice[1] ? this.state.amountChoice[1] + ' ES' : 'Loading...'}</h4>
                          <span>Yes Amount</span>
                            </li>
                            <li> <h4>{this.state.amountChoice[0] ? this.state.amountChoice[0] + ' ES' : 'Loading...'}</h4>
                          <span>No Amount</span>
                            </li>
                            <li> <h4>{this.state.amountChoice[2] ? this.state.amountChoice[2] + ' ES' : 'Loading...'}</h4>
                          <span>Draw Amount</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="market-preview-styles_MarketPreview__footer">
              <article>
                <section className="market-properties-styles_MarketProperties">
                  <div className="inn-tickers">
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
                    ? (this.state.withdrawing === 3 ? <Button
                      disabled={this.state.withdrawing}
                      onClick={this.withdrawWinnings}
                    >
                      <>

                      {this.state.withdrawing && this.state.withdrawing !== 3 ? <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{marginRight: '2px'}}
                      /> : null}

                      {this.state.withdrawing === 0 ? 'Withdraw'
                        : (this.state.withdrawing === 1 ? 'Sending tx...'
                          : (this.state.withdrawing === 2 ? 'Waiting for confirmation...'
                            : 'Done!'
                        )
                        )}
                      </>

                    </Button> : <p>Your withdrawl is successful!</p>)
                    : null)
                  }</>}
                  </div>
                </section>
              </article>
            </div>
          </div>
      </div>
      {/*<Card>
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
      </Card>*/}
      </>
    );
  }
}

export default connect(state => {return{store: state}})(Bet);
