import React, { Component } from 'react';
import axios from 'axios';
import { categoryArray, subCategoryArray, timeswappersServerUrl } from '../../env';
import './DayswappersView.css';
const ethers = require('ethers');

class DayswapperView extends Component {
  state = {
    description: '',
    untilTimestamp: 0,
    pauseTimeRemaining: 0,
    currentTimestamp: Math.floor(Date.now()/1000),
    name: '',
    avatar: '',
    details: null,
    loadingDayswappers: true
  }

  componentDidMount = async() => {
    const description = this.props.description.slice(0,this.props.description.length-4);
    (async() => {
      const response = await axios.get((true?'https://eraswap.technology':'http://localhost:3000')+'/dayswappers/getDetailsOfLeader?input='+window.z_ascii_to_hex(description).toLowerCase());
      this.setState({ details: response.data.data.details ? response.data.data.details : null, loadingDayswappers: false });
    })();
    const untilTimestampArray = this.props.description.substr(this.props.description.length-4,4).split('').map(char => char.charCodeAt(0));
    let untilTimestamp = 0;
    let power = 3;
    console.log(untilTimestampArray);
    untilTimestampArray.forEach(number => {
      untilTimestamp += number * 256 ** power--;
    });
    console.log('untilTimestamp',untilTimestamp);

    console.log('soham', Number(this.props.pauseTimestamp ? this.props.pauseTimestamp._hex : 0),Math.floor(Date.now()/1000));
    const pauseTimeRemaining =  Number(this.props.pauseTimestamp ? this.props.pauseTimestamp._hex : 0) - Math.floor(Date.now()/1000);

    this.setState({ description, untilTimestamp, pauseTimeRemaining });

    const formData = new FormData();
    formData.append('user',window.z_ascii_to_hex(description).toLowerCase());
    const response = await axios.post(timeswappersServerUrl+'/api/users/by-walletaddress', formData);
    this.setState({ name: response.data.name, imageUrl: response.data.avatar && (timeswappersServerUrl + '/' +response.data.avatar.slice(0)) });

    setInterval(() => this.setState({ currentTimestamp: Math.floor(Date.now()/1000) }), 1000);
  }

  render() {
    const pauseTimeRemaining =  Number(this.props.pauseTimestamp ? this.props.pauseTimestamp._hex : 0) - this.state.currentTimestamp;

    const days = Math.floor(pauseTimeRemaining/60/60/24);
    const hours = Math.floor((pauseTimeRemaining - days * 60 * 60 * 24) / 60 / 60);
    const minutes = Math.floor((pauseTimeRemaining - days * 60 * 60 * 24 - hours * 60 * 60) / 60);
    const seconds = pauseTimeRemaining - days * 60 * 60 * 24 - hours * 60 * 60 - minutes * 60;

    const leaderAddress = window.z_ascii_to_hex(this.state.description).toUpperCase();

    return (
      <div className="betbox">
      <div className="media dayswapper-card" style={{cursor: 'pointer'}} onClick={() => window.open('https://timeswappers.com/swapperswall/'+leaderAddress.toLowerCase(),'_blank')}>
          <a className="media-left media-middle" href="#">
            <img width="60px" height="60px" className="dayswapper-image" src={this.state.imageUrl || 'https://via.placeholder.com/60'} />
          </a>
          <div className="dayswapper-data">
            <div className="dayswapper-name">
              {this.state.name === '' ? 'Loading...' : (
                this.state.name === 'User' ? 'Anonymous Leader'
                : this.state.name.split(' ').map(word => {
                  const charactersArray = word.split('');
                  charactersArray[0] = charactersArray[0].toUpperCase();
                  return charactersArray.join('');
                }).join(' ')
              )}
              &nbsp;<span style={{fontWeight: '400'}}>({this.state.name === '' ? 'fetching from' : (this.state.name === 'User' ? 'Leader can update their profile on' : 'profile on')} SwappersWall)</span>
            </div>
            <div className="dayswapper-address">
              {this.state.description ? window.z_ascii_to_hex(this.state.description) : 'Loading...'}
            </div>
          </div>
        </div>
        <h3 style={{textAlign:'left', fontSize: '2rem', fontWeight: '600', color: '#981802'}}>
          {(
            this.props.description
              ? <>
                Will {
                  this.state.description
                    ? (
                      this.state.name && this.state.name !== 'User'
                        ? <>{this.state.name} ({leaderAddress}) </> : <>{leaderAddress}</>) : <>Loading...</>} have <font style={{textDecoration: 'underline'}}>3 {this.props.categoryId !== undefined && this.props.subCategoryId !== undefined
       ? subCategoryArray[this.props.categoryId][this.props.subCategoryId]
       : <>Loading...</>} levels</font> in dayswapper directs by <em>{String(new Date(this.state.untilTimestamp*1000))}</em>?</> : <>Loading...</>)}</h3>

      <div className="market-preview-styles_MarketPreview__footer">
        <article>
          <section className="market-properties-styles_MarketProperties">
            <ul className="market-properties-styles_MarketProperties__meta">
              {/*<li><span>Volume</span><span><span className="value_volume">2.0000
                    ETH</span></span>
              </li>*/}
              <li><span>Minimum</span><span><span className="value_volume">
                {
                  this.props.minimumBetInEs
                  ? this.props.minimumBetInEs + ' ES'
                  : 'Loading..'
                }
              </span></span>
              </li>
              {/*<li><span>Platform Fee</span><span><span className="value_fee">{
                this.props.fees
                ? this.props.fees + '%'
                : 'Loading..'
              }</span></span>
              </li>*/}
              <li><span>Time Remaining</span><span className="value_expires">
                {pauseTimeRemaining ? (pauseTimeRemaining > 0 ? `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds` : `Finished on ${new Date(Number(this.props.pauseTimestamp ? this.props.pauseTimestamp._hex : 0) * 1000)}`) : 'Calculating...'}
              </span>
              </li>
            </ul>
            {/* <div className="inn-tickers">
              <a href="booking.html" className="inn-reg-com inn-reg-book" data-toggle="modal" data-target="#betmodal"><i className="fa fa-exchange" aria-hidden="true" /> Place a Bet</a>
            </div> */}
          </section>
          <div className="dayswapper-card2" style={{overflow:'scroll',maxHeight:'8rem'}}>
            <p style={{margin:'0'}}>Live Progress of Leader's Team in Dayswappers:</p>
            {this.state.loadingDayswappers
              ? <p>Please wait loading...</p>
              : (this.state.details.length ? <>
                  <p style={{marginTop:'0'}}>Only KYC Approved Direct Team members are shown:</p>
                  {this.state.details.map(detail => {
                  return <div style={{padding:'.5rem'}}>
                    {detail.name === detail.address
                      ? <><strong>Direct's Address:</strong> {detail.address}</>
                      : <><strong>Direct's Name & Address:</strong> {detail.name} ({detail.address})</>
                    }<br/>
                    <strong>Team Count:</strong> {detail.teamCount}, <strong>KYCs:</strong> {detail.kycCount}, <strong>Actives:</strong> {detail.activeCount}

                  </div>
                })}</> : 'No directs with KYC approved'
              )}
          </div>
            <div class="inn-all-com">
                <div class="inn-ev-date">
                    <div class="inn-ev-date-left" style={{paddingTop: '.7rem'}}>
                        <h4 style={{fontSize:'52px'}}>{
                          this.props.totalPrizePool
                          ? this.props.totalPrizePool + ' ES'
                          : '...'
                        }</h4>
                        <span>Total Prize Pool</span>
                    </div>
                    <div class="inn-ev-date-rig total-amount">
                        <ul>
                            <li> <h4>{
                              this.props.totalBetTokensInEsByChoice[1]
                              ? this.props.totalBetTokensInEsByChoice[1] + ' ES'
                              : 'Loading..'
                            }</h4>
                          <span>Yes Amount</span><span style={{marginTop:0}}>(Supporting)</span>
                            </li>
                            <li> <h4>{
                              this.props.totalBetTokensInEsByChoice[0]
                              ? this.props.totalBetTokensInEsByChoice[0] + ' ES'
                              : 'Loading..'
                            }</h4>
                          <span>No Amount</span><span style={{marginTop:0}}>(Against)</span>
                            </li>
                            {this.props.isDrawPossible ? <li> <h4>{
                              this.props.totalBetTokensInEsByChoice[2]
                              ? this.props.totalBetTokensInEsByChoice[2] + ' ES'
                              : 'Loading..'
                            }</h4>
                          <span>Draw Amount</span>
                            </li> : null}
                        </ul>
                    </div>
                </div>
            </div>

        </article>
      </div>
      <p >To learn more about the DSBELT Challenge, please read the <a style={{textDecoration: 'underline'}} target="_blank" href="/pdf/dsbelt.pdf">announcement</a>. There is 2% platform fee of BetDeEx.</p>
      <div>
        <a href={'whatsapp://send?text='+window.location.href} target="_blank"><img src="/img/share/whatsapp.png" width="32" /></a>

        <a href={'https://twitter.com/intent/tweet?text='+window.location.href} target="_blank" ><img src="/img/share/twitter.png" /></a>

        <a href={'https://plus.google.com/share?text='+window.location.href} target="_blank" ><img src="/img/share/google+.jpg" width="32" /></a>

        <a href={'https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u='+window.location.href} target="_blank" ><img src="/img/share/facebook.png" /></a>

        <a href={'https://www.linkedin.com/cws/share/?url='+window.location.href} target="_blank" ><img src="/img/share/linkedin.png" /></a>

        <a href={'https://telegram.me/share/url?url='+window.location.href} target="_blank"><img src="/img/share/telegram.png" height="36" /></a>
      </div>

     </div>
    );
  }
}

export default DayswapperView;
