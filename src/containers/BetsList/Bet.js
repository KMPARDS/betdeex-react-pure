import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, Button } from 'react-bootstrap';
import { categoryArray, subCategoryArray } from '../../env';
import createBetInstance from '../../ethereum/betInstance';
import { withRouter } from 'react-router-dom';

const ethers = require('ethers');

class Bet extends Component {
  state = {
    creationTime: 'Loading...',
    pauseTime: 'Loading...',
    fees: undefined,
    totalBetTokensInExaEs: 'Loading...'
  }

  async componentDidMount() {

    if(Object.entries(this.props.store.betsMapping).length === 0) {
      // if redux store is empty then try to copy the local storage if there is any data. otherwise do nothing.
      const storedBetsMapping = JSON.parse(localStorage.getItem('betdeex-betsMapping') || '{}');
      if(Object.entries(storedBetsMapping).length > 0) {
        this.props.dispatch({ type: 'LOAD-BETS-MAPPING-FROM-LOCALSTORAGE', payload: storedBetsMapping });
      }
    }

    const betInstance = createBetInstance(this.props.address);

    (async()=>{
      let creationTimestamp;

      if(this.props.store.betsMapping[this.props.address].creationTimestamp!==undefined) {
        creationTimestamp = this.props.store.betsMapping[this.props.address].creationTimestamp;
      } else {
        creationTimestamp = Number(await betInstance.creationTimestamp());
        console.log('fetching creationTimestamp from blockchain', creationTimestamp);

        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-CREATIONTIMESTAMP',
          payload: {
            address: this.props.address,
            value: creationTimestamp
          }
        });
      }

      this.setState({ creationTime: new Date(creationTimestamp * 1000).toLocaleString() + ' (in your local timezone)' });


      let pauseTimestamp;

      if(this.props.store.betsMapping[this.props.address].pauseTimestamp!==undefined) {
        pauseTimestamp = this.props.store.betsMapping[this.props.address].pauseTimestamp;
      } else {
        pauseTimestamp = Number(await betInstance.pauseTimestamp());
        console.log('fetching pauseTimestamp from blockchain', pauseTimestamp);

        this.props.dispatch({
          type: 'UPDATE-BETS-MAPPING-PAUSETIMESTAMP',
          payload: {
            address: this.props.address,
            value: pauseTimestamp
          }
        });
      }

      this.setState({ pauseTime: new Date(pauseTimestamp * 1000).toLocaleString() + ' (in your local timezone)' });

      localStorage.setItem('betdeex-betsMapping', JSON.stringify(this.props.store.betsMapping));

    })();

    (async() => {
      let fees = await betInstance.functions.prizePercentPerThousand();
      this.setState({ fees: String((1000 - fees.toNumber())/10) });
    })();

    (async() => {
      const totalBetTokensInExaEs = [
        betInstance.functions.totalBetTokensInExaEsByChoice(0),
        betInstance.functions.totalBetTokensInExaEsByChoice(1),
        betInstance.functions.totalBetTokensInExaEsByChoice(2)
      ];

      await Promise.all(totalBetTokensInExaEs);

      this.setState({
        totalBetTokensInExaEs: ethers.utils.formatEther(
                          (await totalBetTokensInExaEs[0])
                            .add(await totalBetTokensInExaEs[1])
                            .add(await totalBetTokensInExaEs[2])
        ) + ' ES'
      });
    })();

  }

  render() {
    return (
      <>
        {/*<Card bg="light" style={{margin: '15px 0'}}>
          <Card.Header>
            {this.props.address}
            <br />
            {categoryArray[this.props.category]} / {subCategoryArray[this.props.category][this.props.subCategory]}
          </Card.Header>
          <Card.Body>
            <Card.Title>{this.props.description}</Card.Title>
            <Card.Text>
            Start time: {this.state.creationTime}
            <br />
            Bet allowed till: {this.state.pauseTime}
            <br />

              <Button onClick={() => this.props.history.push(`/bet/${this.props.address}`)} variant="primary">View</Button>


            </Card.Text>
          </Card.Body>
        </Card>*/}
        <li>
          <div className="betbox">
            <div className="market-basics-styles_MarketBasics__header mb-3">
              <div className="category-tag-trail-styles_CategoryTagTrail">
                <div className="word-trail-styles_WordTrail">
                  <div className="word-trail-styles_WordTrail__label">Category</div>
                  <button onClick={() => this.props.history.push(`/explore/${categoryArray[this.props.category]}`)} className="tag-trail-button">{categoryArray[this.props.category]}</button>
                </div>
                <div className="word-trail-styles_WordTrail">
                  <div className="word-trail-styles_WordTrail__label">Sub Category</div>
                  <button onClick={() => this.props.history.push(`/explore/${categoryArray[this.props.category]}/${subCategoryArray[this.props.category][this.props.subCategory]}`)} className="tag-trail-button">{subCategoryArray[this.props.category][this.props.subCategory]}</button>
                </div>
              </div>
            </div>
            <h3 style={{textAlign:'left', fontSize: '23px', fontWeight: '600', color: '#54be58'}}>{this.props.description}</h3>
            <div className="market-preview-styles_MarketPreview__footer">
              <article>
                <section className="market-properties-styles_MarketProperties">
                  <ul className="market-properties-styles_MarketProperties__meta">
                    <li><span>Volume</span><span><span className="value_volume">{this.state.totalBetTokensInExaEs}</span></span>
                    </li>
                    <li><span>Est. Fee</span><span><span data-tip="0.01" data-event="click focus" className="value_fee">{this.state.fees || 'Loading...'}</span><span className="value-denomination-styles_ValueDenomination__denomination">{!this.state.fees || '%'}</span></span>
                    </li>
                    <li><span>Reporting Start Time</span><span className="value_expires">{this.state.creationTime}</span>
                    </li>
                    <li><span>Reporting Start Time</span><span className="value_expires">{this.state.pauseTime}</span>
                    </li>
                  </ul>
                  <div className="inn-tickers">
                    <button onClick={() => this.props.history.push(`/bet/${ethers.utils.getAddress(this.props.address)}`)} className="inn-reg-com inn-reg-book"><i className="fa fa-info-circle" aria-hidden="true" />View</button>
                  </div>
                </section>
              </article>
            </div>
          </div>
        </li>
      </>
    );
  }
}

export default connect(state => {return{store: state}})(withRouter(Bet));
