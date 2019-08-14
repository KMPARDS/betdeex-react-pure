import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Spinner, Card, Row, Col } from 'react-bootstrap';

import Bet from './Bet';
import Sidebar from '../Sidebar/Sidebar';

import { betdeex, categoryArray, subCategoryArray } from '../../env.js';
import provider from '../../ethereum/provider';

const ethers = require('ethers');

class BetsList extends Component {
  state = {
    betsToDisplay: [],
    betsLoading: true
  }

  componentDidMount = () => {
    this.setState({ betsLoading: true });
    this.showBets();
  }

  componentDidUpdate = prevProps => {
    if (this.props.categoryId !== prevProps.categoryId || this.props.subCategoryId !== prevProps.subCategoryId) {
      this.showBets();
    }
  }

  showBets = async () => {
    this.setState({ betsToDisplay: [], betsLoading: true });
    const newBetEventSig = ethers.utils.id("NewBetContract(address,address,uint8,uint8,string)");
    console.log('newBetEventSig', newBetEventSig);
    const topics = [
      newBetEventSig, null, null, null
    ];
    topics[2] = this.props.categoryId !== undefined ?
      '0x'+'0'.repeat(64-this.props.categoryId.toString(16).length)+this.props.categoryId.toString(16)
      : null;
    topics[3] = this.props.subCategoryId !== undefined ?
      '0x'+'0'.repeat(64-this.props.subCategoryId.toString(16).length)+this.props.subCategoryId.toString(16)
      : null;

    const logs = await this.props.store.providerInstance.getLogs({
      address: betdeex.address,
      fromBlock: 0,
      toBlock: 'latest',
      topics
    });

    console.log('fetching logs from the ethereum blockchain', logs);

    let betsArray = [];

    for (let i = logs.length - 1; i >=0; i--) {
      const log = logs[i];
      const address = '0x'+log.data.slice(26,66);
      const description = ethers.utils.toUtf8String('0x'+log.data.slice(192)).replace(/[^A-Za-z 0-9?]/g, "");
      const categoryId = +log.topics[2];
      const subCategoryId = +log.topics[3];
      //const blockNumber = log.blockNumber;

      betsArray.push(address);

      // storing for reusing it in bet page
      // initialising bet object in our mapping
      if(this.props.store.betsMapping[address]===undefined) {
        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-ADDBET',
          payload: {
            address
          }
        });
      }

      if(this.props.store.betsMapping[address].description===undefined) {
        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-DESCRIPTION',
          payload: {
            address,
            value: description
          }
        });
      }

      if(this.props.store.betsMapping[address].category===undefined) {
        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-CATEGORY',
          payload: {
            address,
            value: categoryId
          }
        });
      }

      if(this.props.store.betsMapping[address].subCategory===undefined) {
        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-SUBCATEGORY',
          payload: {
            address,
            value: subCategoryId
          }
        });
      }
    }

    // betsArray.forEach(address => {
    //   console.log('soham',this.props.store.betsMapping[address]);
    // });



    this.setState({
      betsToDisplay: betsArray
        // .slice(0,5) // shows only 5 latest bets
        .map(
        address =>
          <Bet
            key={address}
            address={address}
            description={this.props.store.betsMapping[address].description}
            category={this.props.store.betsMapping[address].category}
            subCategory={this.props.store.betsMapping[address].subCategory}
          />
        ),
      betsLoading: false
     });

    //localStorage.setItem('betdeex-betsArray', betsArray);
    localStorage.setItem('betdeex-betsMapping', JSON.stringify(this.props.store.betsMapping));
  }

  render() {
    return (
      <Row>
        <Col>
          <Sidebar />
        </Col>
        <Col xs="11">
        <section>
        <div className="se lp">
          <div className="row">
            {/* TITLE */}{console.log(this.props)}
            <div className="inn-title">
              <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> {this.props.subCategoryId !== undefined ? subCategoryArray[this.props.categoryId][this.props.subCategoryId] : (this.props.categoryId !== undefined ? categoryArray[this.props.categoryId] : 'All')}<span> Bets</span></h2>
              {/* <p>Becoming a gym certified personal fitness trainer is your foundation for success. gym is the only
                personal trainer certification program that integrates
              </p> */}
            </div>
            {/* LEFT SIDE: SPORTS EVENTS */}
            <div className="event-left col-md-12">
              {/*Sports Events in Dubai*/}
              <ul>
                {/*<li>
                  <div className="betbox">
                    <div className="market-basics-styles_MarketBasics__header mb-3">
                      <div className="category-tag-trail-styles_CategoryTagTrail">
                        <div className="word-trail-styles_WordTrail">
                          <div className="word-trail-styles_WordTrail__label">Category</div>
                          <button data-testid="Category-0" className="tag-trail-button">SPORTS</button>
                        </div>
                        <div className="word-trail-styles_WordTrail">
                          <div className="word-trail-styles_WordTrail__label">Tags</div>
                          <button data-testid="Tags-0" className="tag-trail-button">UEFA</button><button data-testid="Tags-1" className="tag-trail-button">SOCCER</button>
                        </div>
                      </div>
                    </div>
                    <h3 style={{textAlign:'left', fontSize: '23px', fontWeight: '600', color: '#54be58'}}>Will Liverpool win the UEFA Champions League title against Tottenham on
                      June 1st?
                    </h3>
                    <div className="market-preview-styles_MarketPreview__footer">
                      <article>
                        <section className="market-properties-styles_MarketProperties">
                          <ul className="market-properties-styles_MarketProperties__meta">
                            <li><span>Volume</span><span><span className="value_volume">2.0000
                                  ETH</span></span>
                            </li>
                            <li><span>Open Interest</span><span><span className="value_volume">2.0000
                                  ETH</span></span>
                            </li>
                            <li><span>Est. Fee</span><span><span data-tip="0.01" data-event="click focus" className="value_fee">0.0100</span><span className="value-denomination-styles_ValueDenomination__denomination">%</span></span>
                            </li>
                            <li><span>Reporting Start Time</span><span className="value_expires">May 31,
                                2019 7:00 AM (UTC 0)</span><span className="market-properties-styles_MarketProperties_value_small">May
                                31, 2019 12:30 PM (GMT+5:30) (Your timezone)</span>
                            </li>
                          </ul>
                          <div className="inn-tickers">
                            <a href="booking.html" className="inn-reg-com inn-reg-book" data-toggle="modal" data-target="#betmodal"><i className="fa fa-exchange" aria-hidden="true" /> Place a Bet</a>
                          </div>
                        </section>
                      </article>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="betbox">
                    <div className="market-basics-styles_MarketBasics__header mb-3">
                      <div className="category-tag-trail-styles_CategoryTagTrail">
                        <div className="word-trail-styles_WordTrail">
                          <div className="word-trail-styles_WordTrail__label">Category</div>
                          <button data-testid="Category-0" className="tag-trail-button">SPORTS</button>
                        </div>
                        <div className="word-trail-styles_WordTrail">
                          <div className="word-trail-styles_WordTrail__label">Tags</div>
                          <button data-testid="Tags-0" className="tag-trail-button">UEFA</button><button data-testid="Tags-1" className="tag-trail-button">SOCCER</button>
                        </div>
                      </div>
                    </div>
                    <h3 style={{textAlign:'left', fontSize: '23px', fontWeight: '600', color: '#54be58'}}>Will Liverpool win the UEFA Champions League title against Tottenham on
                      June 1st?
                    </h3>
                    <div className="market-preview-styles_MarketPreview__footer">
                      <article>
                        <section className="market-properties-styles_MarketProperties">
                          <ul className="market-properties-styles_MarketProperties__meta">
                            <li><span>Volume</span><span><span className="value_volume">2.0000
                                  ETH</span></span>
                            </li>
                            <li><span>Open Interest</span><span><span className="value_volume">2.0000
                                  ETH</span></span>
                            </li>
                            <li><span>Est. Fee</span><span><span data-tip="0.01" data-event="click focus" className="value_fee">0.0100</span><span className="value-denomination-styles_ValueDenomination__denomination">%</span></span>
                            </li>
                            <li><span>Reporting Start Time</span><span className="value_expires">May 31,
                                2019 7:00 AM (UTC 0)</span><span className="market-properties-styles_MarketProperties_value_small">May
                                31, 2019 12:30 PM (GMT+5:30) (Your timezone)</span>
                            </li>
                          </ul>
                          <div className="inn-tickers">
                            <a href="booking.html" className="inn-reg-com inn-reg-book" data-toggle="modal" data-target="#betmodal"><i className="fa fa-exchange" aria-hidden="true" /> Place a Bet</a>
                          </div>
                        </section>
                      </article>
                    </div>
                  </div>
                </li>*/}
                {this.state.betsLoading ? 'Please wait fetching bet contracts from blockchain...' : (this.state.betsToDisplay.length ? this.state.betsToDisplay : 'No bets available')}
              </ul>
            </div>
            {/* RIGHT SIDE: FEATURE EVENTS */}
          </div>
        </div>
      </section>
        {/*<>
          <Card>Showing 5 bets
          <h2 style={{fontWeight:'800', textTransform:'uppercase'}}> Show <span>5 Bets</span></h2>

          {
            (this.props.categoryId !== undefined
            ? ` of ${categoryArray[this.props.categoryId]}`
            : null)
          }{
            (this.props.subCategoryId !== undefined
            ? `/${subCategoryArray[this.props.categoryId][this.props.subCategoryId]}`
            : null)
          }</Card>
          { this.state.betsLoading ?
            <Spinner animation="border" role="status" style={{marginTop: '15px'}}>
              <span className="sr-only">Loading...</span>
            </Spinner>
            : null
          }
          </>*/}

        </Col>
      </Row>
    );
  }
}

export default connect(state => {return{store: state}})(BetsList);
