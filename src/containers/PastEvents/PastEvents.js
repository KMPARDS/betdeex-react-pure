import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export default () => (
  <Carousel infiniteLoop autoPlay emulateTouch={true} showArrows={false} >
    <div>
      <img src="/img/BetDeEx_Infographic_01.jpg"  />
      <button className="legend" onClick={() => this.props.history.push('/bet/0x8F7f501f399323239C61449bE99b4ee9A02E2E4e')}>Click here to go to the event</button>
    </div>
    <div>
      <img src="/img/BetDeEx_Infographic_02.jpg" />
      <button className="legend" onClick={() => this.props.history.push('/bet/0x8F7f501f399323239C61449bE99b4ee9A02E2E4e')}>Click here to go to the event</button>
    </div>
    <div>
      <img src="/img/BetDeEx_Infographic_03.jpg" />
      <button className="legend" onClick={() => this.props.history.push('/bet/0x8F7f501f399323239C61449bE99b4ee9A02E2E4e')}>Click here to go to the event</button>
    </div>
    <div>
      <img src="/img/BetDeEx_Infographic_04.jpg" />
      <button className="last-img legend" onClick={() => this.props.history.push('/bet/0x8F7f501f399323239C61449bE99b4ee9A02E2E4e')}>Click here to go to the event</button>
    </div>
    <div>
      <img src="/img/wildfire.jpg" />
      <button className="last-img legend" onClick={() => this.props.history.push('/bet/0x685e784d7d91e5cb15d8a0fde64625bc83b4159b')}>Click here to go to the event</button>
    </div>
  </Carousel>
);
