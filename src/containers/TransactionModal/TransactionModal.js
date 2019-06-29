import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import createBetInstance from '../../ethereum/betInstance';

class TransactionModal extends Component {
  state = {
    estimatedGas: ''
  }
  componentDidUpdate = async () => {
    if(this.props.show) {
      window.estimator = this.props.ethereum.estimator;
      console.log((await this.props.ethereum.estimator(...this.props.ethereum.arguments)).toNumber());
    }

    //console.log(await this.props.estimator() );

    //
    // let data = ethers.utils.hexDataSlice(ethers.utils.id('fee()'), 0, 4);
    //
    // let transaction = {
    //     to: address,
    //     data: data
    // }
    //
    // let callPromise = defaultProvider.call(transaction);

  }
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Place bet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Send your transaction</h4>
          <p>
            Your transaction is signed. Please use the below button to submit it to the blockchain. Estimated Gas: {this.state.estimatedGas}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TransactionModal;
