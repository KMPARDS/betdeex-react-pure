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
    topics[3] = this.props.categoryId !== undefined ?
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
      betsToDisplay: betsArray.slice(0,5).map(
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
        <section>
              {/* LEFT SIDE NAVIGATION MENU */}
              <div className="menu">
                <ul>
                  {/* MAIN MENU */}
                  <li>
                    <a href="main.html"><img src="/img/icon/s1.png" alt="" /> Home</a>
                  </li>
                  <li>
                    <a href="all-sports.html" className="menu-lef-act"><img src="/img/icon/f4.png" alt="" /> Sports</a>
                  </li>
                  <li>
                    <a href="match-fixing.html"><img src="/img/icon/c7.png" alt="" /> Matchs</a>
                  </li>
                  <li>
                    <a href="events.html"><img src="/img/icon/f6.png" alt="" /> Events</a>
                  </li>
                  <li>
                    <a href="team-ranking.html"><img src="/img/icon/r1.png" alt="" /> Ranking</a>
                  </li>
                  <li>
                    <a href="team-squad.html"><img src="/img/icon/f7.png" alt="" /> Squad</a>
                  </li>
                  <li>
                    <a href="football.html"><img src="/img/icon/s7.png" alt="" /> Football</a>
                  </li>
                  <li>
                    <a href="soccer.html"><img src="/img/icon/f2.png" alt="" /> Soccer</a>
                  </li>
                  <li>
                    <a href="cricket.html"><img src="/img/icon/c3.png" alt="" /> Cricket</a>
                  </li>
                  <li>
                    <a href="body-building.html"><img src="/img/icon/g2.png" alt="" /> Bodybuild</a>
                  </li>
                  <li>
                    <a href="surfing.html"><img src="/img/icon/surf.png" alt="" /> Surfing</a>
                  </li>
                  <li>
                    <a href="boxing.html"><img src="/img/icon/s3.png" alt="" /> Boxing</a>
                  </li>
                  <li>
                    <a href="yoga.html"><img src="/img/icon/y4.png" alt="" /> Yoga</a>
                  </li>
                  <li>
                    <a href="tennis.html"><img src="/img/icon/S12.png" alt="" /> Tennis</a>
                  </li>
                  <li>
                    <a href="cycling.html"><img src="/img/icon/cy1.png" alt="" /> Cyclings</a>
                  </li>
                  <li>
                    <a href="swimming.html"><img src="/img/icon/swimming.png" alt="" /> Swimming</a>
                  </li>
                  <li>
                    <a href="athletics.html"><img src="/img/icon/y1.png" alt="" /> Athletics</a>
                  </li>
                  <li>
                    <a href="basketball.html"><img src="/img/icon/S13.png" alt="" /> Basketball</a>
                  </li>
                  <li>
                    <a href="canoe-slalom.html"><img src="/img/icon/s7.png" alt="" /> Slalom</a>
                  </li>
                  <li>
                    <a href="golf.html"><img src="/img/icon/s9.png" alt="" /> Golf</a>
                  </li>
                  <li>
                    <a href="hockey.html"><img src="/img/icon/S15.png" alt="" /> hockey</a>
                  </li>
                  <li>
                    <a href="volleyball.html"><img src="/img/icon/S5.png" alt="" /> volleyball</a>
                  </li>
                  <li>
                    <a href="training.html"><img src="/img/icon/g3.png" alt="" /> Training</a>
                  </li>
                  <li>
                    <a href="join-our-club.html"><img src="/img/icon/cy5.png" alt="" /> Join Club</a>
                  </li>
                  <li>
                    <a href="about.html"><img src="/img/icon/about.png" alt="" /> About</a>
                  </li>
                  <li>
                    <a href="contact.html"><img src="/img/icon/contact.png" alt="" /> Contact Us</a>
                  </li>
                </ul>
              </div>
              {/* RIGHT SIDE NAVIGATION MENU */}
              {/* MOBILE MENU(This mobile menu show on 0px to 767px windows only) */}
              <div className="mob-menu">
                <span><i className="fa fa-bars" aria-hidden="true" /></span>
              </div>
              <div className="mob-close">
                <span><i className="fa fa-times" aria-hidden="true" /></span>
              </div>
            </section>
          {/* <Sidebar /> */}
        </Col>
        <Col xs="11">
        <section>
        <div className="se lp">
          <div className="row">
            {/* TITLE */}
            <div className="inn-title">
              <h2 style={{textAlign:'left', textTransform:'uppercase', fontWeight:'600'}}><i className="fa fa-check" aria-hidden="true" /> Show 5<span> Bets</span></h2>
              {/* <p>Becoming a gym certified personal fitness trainer is your foundation for success. gym is the only
                personal trainer certification program that integrates
              </p> */}              
            </div>            
            {/* LEFT SIDE: SPORTS EVENTS */}
            <div className="event-left col-md-12">
              {/*Sports Events in Dubai*/}
              <ul>
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
                </li>
              </ul>
            </div>
            {/* RIGHT SIDE: FEATURE EVENTS */}
          </div>
        </div>
      </section>
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
          {this.state.betsToDisplay}
        </Col>
      </Row>
    );
  }
}

export default connect(state => {return{store: state}})(BetsList);
