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
      <button className="last-img legend" onClick={() => this.props.history.push('/bet/0X685E784D7D91E5CB15D8A0FDE64625BC83B4159B')}>Click here to go to the event</button>
    </div>
  </Carousel>
);
