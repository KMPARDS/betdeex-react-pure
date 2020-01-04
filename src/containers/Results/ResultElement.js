import React, { Component } from 'react';
import createBetInstance from '../../ethereum/betInstance';

import './Result.css';

const ethers = require('ethers');

class ResultElement extends Component {
  state = {
    description: '',
    timestamp: null
  };

  componentDidMount = async() => {
    const betInstance = createBetInstance(ethers.utils.getAddress(this.props.betAddress.toLowerCase()));

    const descriptionPromise = betInstance.functions.description();
    const endTimestampPromise = betInstance.functions.endTimestamp();
    const categoryIdPromise = betInstance.functions.category();

    await Promise.all([descriptionPromise, endTimestampPromise, categoryIdPromise]);

    let description = await descriptionPromise;
    const timestamp = (new Date((await endTimestampPromise).toNumber() * 1000)).toLocaleString();
    // console.log('await categoryIdPromise', await categoryIdPromise);
    const categoryId = (await categoryIdPromise);

    if(categoryId === 11) {
      description = 'DSBELT Challenge of '+window.z_ascii_to_hex(description).toUpperCase();
    }

    this.setState({
      description, timestamp
    });
  }
  render = () => {
    let resultText = '';
    switch(this.props.result) {
      case 0:
        resultText = 'No';
        break;
      case 1:
        resultText = 'Yes';
        break;
      case 2:
        resultText = 'Draw';
        break;
      default:
        resultText = String(this.props.result);
        break;
    }

    let color = '', opacity = '2';
    switch(this.props.result) {
      case 0:
        color = '#f00'+opacity;
        break;
      case 1:
        color = '#0f0'+opacity;
        break;
      case 2:
        color = '#00f'+opacity;
        break;
      default:
        color = '#fff';
        break;

    }
    return (
      <tr style={{backgroundColor: color, cursor: 'pointer'}} onClick={() => this.props.history.push('/bet/'+this.props.betAddress)}>
        <td>{/*<img src="images/coun/t3.png" alt="" />*/}
          <div className="h-tm-ra">
            <h4>{this.state.description || 'Loading...'}</h4><span>Smart Contract Address: {this.props.betAddress}</span>
          </div>
        </td>
        <td><span className="result-key"></span>{resultText}</td>
        <td>{this.props.prizePoolString} ES</td>
        <td>{this.state.timestamp || 'Loading...'}</td>

      </tr>
    );
  }
}

export default ResultElement;
