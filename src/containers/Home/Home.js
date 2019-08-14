import React from 'react';

const Home = props => (
  <>
  <div>
        {/* ./Page header */}
    <header className="header online-payment-header section color-1 alpha-9" style={{backgroundImage: 'url(/img/banner-bg.jpg)',
    backgroundSize: 'cover', zIndex: '9', height: '500px', backgroundPositionY: 'center'}}>
          {/* <div id="stripes"></div> */}
          {/* <img src="/img/Bdx_web-02.jpg"></img> */}
          <div className="container overflow-hidden bring-to-front" style={{paddingBottom: 0, }}>
            <div className="row">
              <div className="col-lg-6 mx-auto text-center text-lg-left" style={{margin:'50px', paddingLeft: '27px'}}>
                <h1 className="light display-4 color-1">Welcome to the  <span className="bold d-block" style={{fontSize:'42px', color:'#fff', lineHeight:'44px'}}>Future of Prediction</span></h1>
                <p className="color-1 lead alpha-8 my-5" style={{fontSize:'18px',}}>"Luck Becomes Limitless Opportunity with Confident Preparation <br></br><br></br>
                <b style={{fontWeight:'800', fontStyle:'italic'}}>Decentralized, Transparent & Trustless</b>
                
                  {/* <br> No Login, No Hassle, No Limits.*/}</p>
                  <button onClick={() => props.history.push('/explore')} class="btn btn-rounded btn-lg btn-accent text-center ml-3"> Explore Events now</button>
              </div>
              <div className="col-lg-6 col-md-9 mx-md-auto mx-lg-0 pr-lg-0" data-aos="fade-left">
                <img src="img/betdeex-logo.png" alt="Dashcore" className="d-blocks" style={{height:'40%'}} />
                <b style={{fontWeight:'800', fontStyle:'italic', marginBottom:'50px'}}>Powered by Era Swap</b>                
              </div>
             </div>
          </div>
    </header>
        {/*Cycle  */}

        <section>
        <div className="lp spe-bot-red-3" style={{zIndex:'9', paddingLeft: '65px'}}>
          <div className="inn-title">
            <h2 style={{fontWeight:'800', textTransform:'uppercase'}}><i className="fa fa-check" aria-hidden="true" /> All predictions <img src="/img/era-icon.png"/><span>events 2019</span></h2>
            <p>An 'event' is a prediction event. Now, you can choose an event from the list of multiple events</p>
          </div>
          <div className="hom-top-trends row">
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/1.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="#">
                    <h4>SPORTS</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/3.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="canoe-slalom.html">
                    <h4>POLITICS</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/2.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="yoga.html">
                    <h4>MOVIES</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/5.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="body-building.html">
                    <h4>TECH</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="hom-top-trends row">
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/trends/6.jpeg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="tennis.html">
                    <h4>SCIENCE</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/6.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="athletics.html">
                    <h4>ENTERTAINMENT</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/trends/9.jpeg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="surfing.html">
                    <h4>CELEBRATIES</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend pad-red-bot-0">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/4.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                  <a href="cycling.html">
                    <h4>CURRENT</h4>
                  </a>
                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
          </div>
          </div>
      </section>
        {/* Use Cases for Betdeex */}
        <section className="section bg-6 bg-6-gradient edge bottom-right">
          <div className="container bring-to-front" style={{padding:'0px'}}>
            <img src="/img/era-icon.png"/>
            <div id="demo" className="carousel slide" data-ride="carousel">
              {/* Indicators */}
              <ul className="carousel-indicators">
                <li data-target="#demo" data-slide-to={0} className="active" />
                <li data-target="#demo" data-slide-to={1} />
                <li data-target="#demo" data-slide-to={2} />
              </ul>
              {/* The slideshow */}
              <div className="carousel-inner">
                <div className="carousel-item active">
                <section className="section singl-testimonial bg-1 edge top-left">
                    <div className="shape-wrapper"><img src="img/shps/abs-shp-1.svg" className="absolute top right h-100" alt="..." /></div>
                    <div className="container-wide bring-to-front" > 
                      <div className="row gap-y align-items-center">
                        <div className="col-12 col-lg-7 mx-auto">
                          <h2 style={{textAlign:'justify'}}>Propose a prediction event and get rewards</h2>
                          <p className="lead color-2">
                            You can propose an Event on Swappers Wall. Events will be voted by community for likes. Top 10 Event proposals with maximum number of likes upto 25 August 2019 on Swappers Wall will be selected with the Reward of 1000 ES in liquid and 1000 ES in TimeAlly to proposers of each of these 10 Events.
                          </p>
                          <p>
                          </p>
                        </div>
                        <div className="col-10 col-lg-5 pr-0">
                          <div className="device browser" data-aos="fade-left">
                            <div className="screen"><img src="img/screen1.jpg" alt="" className="img-responsive shadow" /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="carousel-item">
                <section className="section singl-testimonial bg-1 edge top-left">
                  <div className="shape-wrapper"><img src="img/shps/abs-shp-1.svg" className="absolute top right h-100" alt="..." /></div>
                  <div className="container-wide bring-to-front">
                    <div className="row gap-y align-items-center">
                      <div className="col-12 col-lg-6 mx-auto">
                        <h2 style={{textAlign:'justify'}}>Predict on Events</h2>
                        <p className="lead color-2">Once there are events on BetDeEx, you can select your favourite event(s) and start prediction based on your skills.</p>
                      </div>
                      <div className="col-10 col-lg-5 pr-0">
                        <div className="device browser" data-aos="fade-left">
                          <div className="screen"><img src="img/screen1.jpg" alt="" className="img-responsive shadow" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                </div>
                <div className="carousel-item">
                <section className="section singl-testimonial bg-1 edge top-left">
                  <div className="shape-wrapper"><img src="img/shps/abs-shp-1.svg" className="absolute top right h-100" alt="..." /></div>
                  <div className="container-wide bring-to-front">
                    <div className="row gap-y align-items-center">
                      <div className="col-12 col-lg-7 mx-auto">
                        <h2 style={{textAlign:'justify'}}>Use your Skills to Win</h2>
                        <p className="lead color-2">Once you have predicted the outcome and you got sucess, you can win. You can predict multiple events at the same time to win.</p>
                      </div>
                      <div className="col-10 col-lg-5 pr-0">
                        <div className="device browser" data-aos="fade-left">
                          <div className="screen"><img src="img/screen1.jpg" alt="" className="img-responsive shadow" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                </div>
              </div>
              {/* Left and right controls */}
              <a className="carousel-control-prev" style={{color:'#000'}} href="#demo" data-slide="prev">
                <span className="carousel-control-prev-icon" />
              </a>
              <a className="carousel-control-next" href="#demo" data-slide="next">
                <span className="carousel-control-next-icon" />
              </a>
            </div>
          </div>
        </section>
        {/*Currencies of Betdeex */}

        {/* Benefits of Betdeex*/}
       <hr></hr>
        {/*Join The Betdeex Ecosystem*/}
        <section className="section bg-6 b-b edge" style={{zIndex:'1111111'}}>
          <div className="container">
            <div className="section-heading text-center">
              <h2>Join The  <span className="bold" style={{fontSize:'48px'}}>Era  <img src="/img/era-icon.png"/> Swap Ecosystem</span></h2>
              <p className="color-2 lead">Era Swap Ecosystem includes interlinked multiple platforms where Era Swap Tokens can
                be utilized for exchange of services, availing discounts, getting rewards and other utilities. Era Swap Team will identify and help build more such platforms
                in future which are built for the community and willing to incorporate ES reward system.</p>
            </div>
            <div className="ecosystem row gap-y text-center text-md-left d-flex justify-content-center align-items-center ">
            <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
             <a href="https://eraswap.life/" target="_blank"><div className="card-body  text-center">
                  <img src="img/icons/9.png" />
                  <p className="bold"> Affiliate Program </p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank">    <div className="card-body  text-center">
                  <img src="img/icons/3.png" />
                  <p className="bold"> Education</p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"><div className="card-body  text-center">
                  <img src="img/icons/2.png" />
                  <p className="bold"> Marketplace</p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"><div className="card-body  text-center">
                  <img src="img/icons/5.png" />
                  <p className="bold"> Prediction</p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"><div className="card-body  text-center">
                  <img src="img/icons/1.png" />
                  <p className="bold"> Peer to Peer</p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"> <div className="card-body  text-center">
                  <img src="img/icons/7.png" />
                  <p className="bold">Lend and Borrow </p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"> <div className="card-body text-center">
                  <img src="img/icons/6.png" />
                  <p className="bold"> Multi Exchange Solution </p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"> <div className="card-body  text-center">
                  <img src="img/icons/11.png" />
                  <p className="bold"> Merchants and Shoppers</p>
                </div></a>
              </div>
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank">  <div className="card-body text-center">
                  <img src="img/icons/10.png" />
                  <p className="bold"> Token Vesting</p>
                </div></a>
              </div>
              {/* <div class="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
                     <div class="card-body  text-center">
                        <img src="img/icons/4.png">
                        <p class="bold"> Charity</p>
                     </div>
                  </div> */}
              <div className="card shadow-lg off-left-background border-0 mr-3 mb-10 col-md-2 py-4 rounded shadow-hover">
              <a href="https://eraswap.life/" target="_blank"><div className="card-body  text-center">
                  <img src="img/icons/10.png" />
                  <p className="bold">  Decentralized Wallet</p>
                </div></a>
              </div>
            </div>
          </div>
        </section>
        {/* ./CTA - Create Account */}
        
        {/* ./Footer - Simple */}
        <footer className="site-footer section bg-1 color-1 block bg-1">
          <div className="container py-4">
            <div className="row gap-y text-center text-md-left">
              <div className="col-md-4 mr-auto">
                <img src="img/betdeex-logo.png" alt="" className="logo" />
                <p>Please read the Disclaimer, Terms and Conditions, Legal Terms carefully before strating with BetdeEx.</p>
              </div>
              <div className="col-md-3">
                <nav className="nav flex-column">
                  <a className="nav-item py-2 color-1" href="index.html">Home</a>
                  <a className="nav-item py-2 color-1" href="faqs.html">FAQ</a>
                  <a className="nav-item py-2 color-1" href="disclaimer.html">Disclaimer</a>
                </nav>
              </div>
              <div className="col-md-3">
                <nav className="nav flex-column">
                  <a className="nav-item py-2 color-1" href="pdf/terms-and-condition.pdf" target="_blank">Terms &amp; Conditions</a>
                  <a className="nav-item py-2 color-1" href="pdf/privacy-policy.pdf" target="_blank">Privacy Policy</a>
                </nav>
              </div>
              <div className="col-md-2">
                <h6 className="py-2 small">Follow us</h6>
                <nav className="nav justify-content-between">
                  <a href="https://www.facebook.com/pages/BetDeEx/808455639538643" className="btn btn-circle btn-sm brand-facebook"><i className="fa fa-facebook" /></a>
                  {/* <a href="#" class="btn btn-circle btn-sm brand-twitter"><i class="fab fa-twitter"></i></a> */}
                </nav>
              </div>
            </div>
            <hr className="mt-5 bg-2 op-5" />
            <div className="row small align-items-center">
              <div className="col-md-4">
                <p className="mt-2 mb-0">© 2019 Betdeex. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  </>
);

export default Home
