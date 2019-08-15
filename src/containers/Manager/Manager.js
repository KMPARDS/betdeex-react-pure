import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

const ethers = require('ethers');

class ManagerPanel extends Component {
  state = {
    description: '',
    categoryId: '',
    subCategoryId: '',
    minimumBet: '',
    prizePercentPerThousand: '',
    isDrawPossible: '',
    pauseTimestamp: '',
    message: '',
    isSuperManager: false,
    inputAddress: '',
    inputIsManager: 0, // 0 => nothing, 1 => not a manager, 2 => yes
    messageSuper: ''
  }

  componentDidMount = async() => {
    const superManager = await this.props.store.betdeexInstance.functions.superManager();
    if(this.props.store.walletInstance.address.toLowerCase() === superManager.toLowerCase()) {
      this.setState({ isSuperManager: true });
    }
  }

  checkManager = async() => {
    this.setState({ messageSuper: 'checking if entered message is manager...' });
    try {
      const isManager = await this.props.store.betdeexInstance.functions.isManager(this.state.inputAddress);
      this.setState({ messageSuper: `${this.state.inputAddress} is ${!isManager ? 'not ' : ''}a manager`, inputIsManager: isManager ? 2 : 1 });
    } catch (err) {
      this.setState({ messageSuper: 'Error: ' + err.message });
    }
  }

  addManager = async() => {
    this.setState({ messageSuper: 'sending addManager transaction...' });
    try {
      const tx = await this.props.store.betdeexInstance.functions.addManager(this.state.inputAddress);
      await tx.wait();
      this.setState({ messageSuper: 'Success!' });
    } catch (err) {
      this.setState({ messageSuper: 'Error: ' + err.message });
    }
  }

  removeManager = async() => {
    this.setState({ messageSuper: 'sending removeManager transaction...' });
    try {
      const tx = await this.props.store.betdeexInstance.functions.removeManager(this.state.inputAddress);
      await tx.wait();
      this.setState({ messageSuper: 'Success!' });
    } catch (err) {
      this.setState({ messageSuper: 'Error: ' + err.message });
    }
  }

  deployBet = async() => {
    this.setState({ message: 'Preparing transaction...' });
    try {
      const args = {
        description: this.state.description,
        categoryId: +this.state.categoryId,
        subCategoryId: +this.state.subCategoryId,
        minimumBet: ethers.utils.parseEther(this.state.minimumBet),
        prizePercentPerThousand: +this.state.prizePercentPerThousand,
        isDrawPossible: !!this.state.isDrawPossible,
        pauseTimestamp: +this.state.pauseTimestamp
      };
      this.setState({ message: 'Sending to blockchain...' });
      const tx = await this.props.store.betdeexInstance.functions.createBet(...Object.values(args));
      this.setState({ message: 'Sent to blockchain...' });
      console.log(tx);
      const receipt = await tx.wait();
      const newAddress = ethers.utils.hexZeroPad(
        ethers.utils.hexStripZeros(
          receipt.logs[0].data.slice(0,66)
        ),
        20
      );
      this.setState({ message:
        <>{'Confirmed! New bet address is: '}
          <button onClick={() => this.props.history.push('/bet/'+newAddress)}>{newAddress}</button>
        </>
      });
      console.log(receipt);
    } catch (err) {
      this.setState({ message: 'Error: ' + err.message });
    }
  };

  render() {
    return (
      <>
        {this.state.isSuperManager ? <>
          <p>This is superManagerPanel</p>
          <input onKeyUp={event => this.setState({ inputAddress: event.target.value })} type="text" placeholder="Enter address of other wallet" />
          <button onClick={this.checkManager}>Check manager privileges</button>
          {this.state.messageSuper ? <p>{this.state.messageSuper}</p> : null}
          {this.state.inputIsManager === 2 ? <>
              <button onClick={this.removeManager}>Remove this manager</button>
            </> : null}

          {this.state.inputIsManager === 1 ? <>
              <button onClick={this.addManager}>Add as a manager</button>
            </> : null}
        </> : null}

        <p>This is ManagerPanel:</p>
        <input
          type="text"
          placeholder="Enter Bet Question"
          onKeyUp={event => this.setState({ description: event.target.value })}
        />
        <input
          type="text"
          placeholder="Enter Category Id"
          onKeyUp={event => this.setState({ categoryId: event.target.value })}
        />
        <input
          type="text"
          placeholder="Enter subCategory Id"
          onKeyUp={event => this.setState({ subCategoryId: event.target.value })}
        />
        <input
          type="text"
          placeholder="Enter Minimum Bet In ES"
          onKeyUp={event => this.setState({ minimumBet: event.target.value })}
        />
        <input
          type="text"
          placeholder="Enter Prize percent per thousand (980 for 2%)"
          onKeyUp={event => this.setState({ prizePercentPerThousand: event.target.value })}
        />
        <input
          type="text"
          placeholder="Is draw possible?"
          onKeyUp={event => this.setState({ isDrawPossible: event.target.value })}
        />
        <input
          type="text"
          placeholder="Pause timestamp"
          onKeyUp={event => this.setState({ pauseTimestamp: event.target.value })}
        />
        <br />
        {this.state.message ? <p>{this.state.message}</p> : null}
        <Button onClick={this.deployBet}>Deploy bet</Button>
      </>
    );
  }
}

export default connect(state => {return{store: state}})(ManagerPanel);
