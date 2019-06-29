import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, Button } from 'react-bootstrap';
import { categoryArray, subCategoryArray } from '../../env';
import createBetInstance from '../../ethereum/betInstance';
import { withRouter } from 'react-router-dom';

class Bet extends Component {
  state = {
    creationTime: 'Loading...',
    pauseTime: 'Loading...'
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


  }

  render() {
    return (
      <Card bg="light" style={{margin: '15px 0'}}>
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
      </Card>
    );
  }
}

export default connect(state => {return{store: state}})(withRouter(Bet));
