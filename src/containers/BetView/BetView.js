import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Tabs, Tab, Table, Row, Col } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
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
    fetchingBettings: true,
    managerChoice: undefined,
    managerMessage: ''
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


    const bettings = this.state.bettings.map((betting, index) => (
      <>
      {/*<tr>
        <td>{betting.address}</td>
        <td>{betting.amount} ES</td>
      </tr>*/}
        <tr>
          <td>{index + 1}</td>
          <td>
            <div className="h-tm-ra">
              <h4>{betting.address}</h4>
              {/*<span>specials: active, fast run, Good stamina</span>*/}
            </div>
          </td>
          <td>{betting.amount} ES</td>
        </tr>
      </>
    ));
    return (
      <Row>
      <Col>
          <Sidebar/>
        </Col>
     <Col xs="12">
      <Card>
      {this.props.store.managerPrivileges ? <div className="se lp">
        <h4>Manager section</h4>
        <input type="text" placeholder="ChoiceId (0/1/2)" onKeyUp={event => this.setState({ managerChoice: event.target.value })} />
        <button onClick={async() => {
          this.setState({ managerMessage: 'Sending transaction...' });
          try {
            const tx = await this.betInstance.functions.endBet(+this.state.managerChoice);
            this.setState({ managerMessage: 'Tx send waiting for confirmation...' });
            await tx.wait();
            this.setState({ managerMessage: 'Success!' });
          } catch (err) {
            this.setState({ managerMessage: 'Error: '+err.message });
          }
        }}>End this bet</button>
        {this.state.managerMessage && <p>{this.state.managerMessage}</p>}
      </div> : null}
    <section>
        <div className="se lp" style={{background:'#eee'}}>
          <div className="row">
            {/* TITLE */}
            <div className="inn-title">
              <h2 style={{textAlign:'left', fontSize:'15px', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> Address<span style={{fontSize:'15px'}}> {window.innerWidth > 1100 ? this.props.match.params.address : this.props.match.params.address.slice(0,6) + '...'+this.props.match.params.address.slice(38,42)}</span></h2>

            </div>
            {/* LEFT SIDE: SPORTS EVENTS */}
            <div className="event-left ex1" >
              {/*Sports Events in Dubai*/}
              <ul>
                <li style={{ borderBottomColor: '#eee'}}>
                  <div className="betbox">
                    <div className="market-basics-styles_MarketBasics__header mb-3">
                      <div className="category-tag-trail-styles_CategoryTagTrail">
                        <div className="word-trail-styles_WordTrail">
                          <div className="word-trail-styles_WordTrail__label">Category</div>

                            <button
                              onClick={() => this.props.history.push(`/explore/${categoryArray[this.state.category].toLowerCase()}`)}
                              className="tag-trail-button">{
                              this.state.category !== undefined
                              ? categoryArray[this.state.category]
                              : 'Loading...'
                            }</button>

                            <button
                              onClick={() => this.props.history.push(`/explore/${categoryArray[this.state.category || 0].toLowerCase()}/${subCategoryArray[this.state.category || 0][this.state.subCategory || 0].toLowerCase()}`)}
                              className="tag-trail-button">{
                             this.state.category !== undefined && this.state.subCategory !== undefined
                              ? subCategoryArray[this.state.category][this.state.subCategory]
                              : 'Loading...'
                              }
                            </button>

                        </div>
                      </div>
                    </div>
                    <h3 style={{textAlign:'left', fontSize: '2rem', fontWeight: '600', color: '#981802'}}>{this.state.description || 'Loading...'}</h3>
                    <div className="market-preview-styles_MarketPreview__footer">
                      <article>
                        <section className="market-properties-styles_MarketProperties">
                          <ul className="market-properties-styles_MarketProperties__meta">
                            {/*<li><span>Volume</span><span><span className="value_volume">2.0000
                                  ETH</span></span>
                            </li>*/}
                            <li><span>Minimum</span><span><span className="value_volume">
                              {
                                minimumBetInEs
                                ? minimumBetInEs + ' ES'
                                : 'Loading..'
                              }
                            </span></span>
                            </li>
                            <li><span>Platfrom Fee</span><span><span className="value_fee">{
                              fees
                              ? fees + '%'
                              : 'Loading..'
                            }</span></span>
                            </li>
                            <li><span>Start Time</span><span className="value_expires">{this.state.creationTimestamp ? new Date((typeof(this.state.creationTimestamp) === 'object' ? +this.state.creationTimestamp._hex : this.state.creationTimestamp) * 1000).toLocaleString() : 'Loading...'}</span>{/*<span className="market-properties-styles_MarketProperties_value_small">May
                                31, 2019 12:30 PM (GMT+5:30) (Your timezone)</span>*/}
                            </li>
                            <li><span>Pause Time</span><span className="value_expires">{this.state.pauseTimestamp ? new Date((typeof(this.state.pauseTimestamp) === 'object' ? +this.state.pauseTimestamp._hex : this.state.pauseTimestamp) * 1000).toLocaleString() : 'Loading...'}</span>{/*<span className="market-properties-styles_MarketProperties_value_small">May
                                31, 2019 12:30 PM (GMT+5:30) (Your timezone)</span>*/}
                            </li>
                          </ul>
                          {/* <div className="inn-tickers">
                            <a href="booking.html" className="inn-reg-com inn-reg-book" data-toggle="modal" data-target="#betmodal"><i className="fa fa-exchange" aria-hidden="true" /> Place a Bet</a>
                          </div> */}
                        </section>
                          <div class="inn-all-com">
                              <div class="inn-ev-date">
                                  <div class="inn-ev-date-left">
                                      <h4 style={{fontSize:'52px'}}>{
                                        totalPrizePool
                                        ? totalPrizePool + ' ES'
                                        : '...'
                                      }</h4>
                                      <span>Total Prize Pool</span>
                                  </div>
                                  <div class="inn-ev-date-rig total-amount">
                                      <ul>
                                          <li> <h4>{
                                            totalBetTokensInEsByChoice[1]
                                            ? totalBetTokensInEsByChoice[1] + ' ES'
                                            : 'Loading..'
                                          }</h4>
                                        <span>Yes Amount</span>
                                          </li>
                                          <li> <h4>{
                                            totalBetTokensInEsByChoice[0]
                                            ? totalBetTokensInEsByChoice[0] + ' ES'
                                            : 'Loading..'
                                          }</h4>
                                        <span>No Amount</span>
                                          </li>
                                          <li> <h4>{
                                            totalBetTokensInEsByChoice[2]
                                            ? totalBetTokensInEsByChoice[2] + ' ES'
                                            : 'Loading..'
                                          }</h4>
                                        <span>Draw Amount</span>
                                          </li>
                                      </ul>
                                  </div>
                              </div>
                          </div>

                      </article>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            {/* RIGHT SIDE: FEATURE EVENTS */}
          </div>
          {console.log('this.state.pauseTimestamp',this.state.pauseTimestamp)}
          {this.state.pauseTimestamp ? (Number(this.state.pauseTimestamp._hex) * 1000 > Date.now() ? <>
          <div className="inn-title">
              <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}>Predict<span> Now</span></h2>
              {/* <p>Becoming a gym certified personal fitness trainer is your foundation for success. gym is the only
                personal trainer certification program that integrates
              </p> */}
            </div>
          <div class="share-btn">
              {/*<div className="col-md-12">
            <div className="row">
              <div className="col-md-3"><button style={{background:'#28a745', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 1 })}}> Yes</button></div>
              <div className="col-md-3"><button style={{background:'#dc3545', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 0 })}}>No</button></div>
              <div className="col-md-3"><button style={{background:'#ffc107', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 2 })}}>Draw</button></div>
            </div>
            </div>*/}
             <ul>
                  <li><button style={{background:'#28a745', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 1 })}}> Yes</button>
                  </li>
                  <li><button style={{background:'#dc3545', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 0 })}}>No</button>
                  </li>
                  <li><button style={{background:'#ffc107', padding:'10px 30px 10px 30px'}} class="inn-reg-com inn-reg-book" onClick={()=>{this.setState({ showTransactionModal: true, userChoice: 2 })}}>Draw</button>
                  </li>
              </ul>
            </div>
          </> : <p>The prediction time for this event has expired, now it is not possible to place a prediction.</p>) : <p>Please wait loading...</p>}

          <br></br>
          <div>
            <ul className="nav nav-tabs com-tab" role="tablist">
              <li className="nav-item" onClick={() => this.seeChoiceBettings(1)}>
                <a className="nav-link active" href="#profile" role="tab" data-toggle="tab">Yes</a>
              </li>
              <li className="nav-item" onClick={() => this.seeChoiceBettings(0)}>
                <a className="nav-link" href="#buzz" role="tab" data-toggle="tab">No</a>
              </li>
              <li className="nav-item" onClick={() => this.seeChoiceBettings(2)}>
                <a className="nav-link" href="#references" role="tab" data-toggle="tab">Draw</a>
              </li>
            </ul>
            {/* Tab panes */}
            <div className="tab-content">
              <div role="tabpanel" className="tab-pane active" id="profile">
              {!this.state.fetchingBettings ? <table className="myTable table-responsive">
              <tbody>
                <tr>
                  <th>Sr</th>
                  <th>Address</th>
                  <th>Amount</th>
                </tr>
                {Object.values(bettings).length ? bettings : 'There are no bettings on Yes choice'}
                </tbody>
                </table> : 'Please wait fetching bettings on the contract from blockchain...'}
              </div>
              <div role="tabpanel" className="tab-pane fade" id="buzz">
              {!this.state.fetchingBettings ? <table className="myTable table-responsive">
              <tbody>
                <tr>
                  <th>Sr</th>
                  <th>Address</th>
                  <th>Amount</th>
                </tr>
                {Object.values(bettings).length ? bettings : 'There are no bettings on No choice'}
                </tbody>
                </table> : 'Please wait fetching bettings on the contract from blockchain...'}

              </div>
              <div role="tabpanel" className="tab-pane fade" id="references">
              {!this.state.fetchingBettings ? <table className="myTable table-responsive">
              <tbody>
                <tr>
                  <th>Sr</th>
                  <th>Address</th>
                  <th>Amount</th>
                </tr>
                {Object.values(bettings).length ? bettings : 'There are no bettings on Draw choice'}
                </tbody>
                </table> : 'Please wait fetching bettings on the contract from blockchain...'}
              </div>
            </div>
          </div>
          <br></br>

        </div>

      </section>


        <TransactionModal
          show={this.state.showTransactionModal}
          hideFunction={modalClose}
          ethereum={{
            transactor: this.betInstance.functions.enterBet,
            estimator: this.betInstance.estimate.enterBet,
            contract: this.betInstance,
            arguments: [this.state.userChoice],
            minimumBetInEs,
            continueFunction: this.componentDidMount
          }}
          />
      </Card>
      </Col>
      </Row>
    );
  }
}

export default connect(state => {return{store: state}})(BetView);
