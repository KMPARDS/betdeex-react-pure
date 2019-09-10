import React from 'react';

const Home = props => (
  <>
  <div>
        {/* ./Page header */}
    <header className="header online-payment-header section color-1 alpha-9" style={{backgroundImage: 'url(/img/banner-bg.jpg)',
    backgroundSize: 'cover', zIndex: '9', height: '500px', backgroundPositionY: 'center'}}>
          {/* <div id="stripes"></div> */}
          {/* <img src="/img/Bdx_web-02.jpg"></img> */}
          <div className="container overflow-hidden bring-to-front banner" style={{paddingBottom: 0, }}>
            <div className="row">
              <div className="col-lg-6 mx-auto text-center text-lg-left banner-text" style={{margin:'50px'}}>
                <h1 className="light display-4 color-1">Welcome to the  <span className="bold d-block" style={{fontSize:'48px', color:'#fff', lineHeight:'44px'}}>Future of Prediction</span></h1>
                <p className="color-1 lead alpha-8 my-5" style={{fontSize:'18px',}}>"Luck Becomes Limitless Opportunity with Confident Preparation <br></br>
                <b style={{fontWeight:'800', fontStyle:'italic'}}>Decentralized, Transparent & Trustless</b>

                  {/* <br> No Login, No Hassle, No Limits.*/}</p>
                  <button onClick={() => props.history.push('/explore')} class="btn btn-rounded btn-lg btn-accent text-center ml-0 my-3"> Explore Events now</button>
              </div>
              <div className="col-lg-6 col-md-9 mx-md-auto mx-lg-0 pr-lg-0 pc" data-aos="fade-left">
                <img src="img/betdeex-logo.png" alt="Dashcore" className="d-blocks img-responsive logo" />
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
            <div onClick={() => props.history.push('/explore/sports')}  className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/1.jpg" alt="" />
                </div>
                <div className="hom-trend-con inn-title">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>SPORTS</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/politics')}   className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/3.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>POLITICS</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/movies')}   className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/2.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>MOVIES</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/tech')}   className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/5.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>TECH</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
          </div>
          <div  onClick={() => props.history.push('/explore/science')}   className="hom-top-trends row">
            {/*TOP TRENDINGS*/}
            <div className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/7.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>SCIENCE</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/entertainment')}   className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/6.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}} >ENTERTAINMENT</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/celebrities')}   className="col-md-3">
              <div className="hom-trend">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/8.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}

                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>CELEBRATIES</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
            {/*TOP TRENDINGS*/}
            <div  onClick={() => props.history.push('/explore/current')}   className="col-md-3">
              <div className="hom-trend pad-red-bot-0">
                <div className="hom-trend-img">
                  <img className="img-responsive" src="/img/4.jpg" alt="" />
                </div>
                <div className="hom-trend-con">
                  {/* <span><i className="fa fa-futbol-o" aria-hidden="true" /> 2rd augest 2017</span> */}
                    <h2 style={{fontWeight: '800', textTransform: 'uppercase', fontSize: '16px'}}>CURRENT</h2>

                  {/* <p>The Sports Games also celebrated and showcased sport, thanks to the city’s stunning setting</p> */}
                </div>
              </div>
            </div>
          </div>
          </div>
      </section>
        {/* Use Cases for Betdeex */}
        <section className="section bg-6 bg-6-gradient edge bottom-right play-slider">
          <div className="container bring-to-front">
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
                        <div className="col-12 col-lg-6 mx-auto">
                          <h2 style={{textAlign:'justify'}}>Propose a prediction event and get rewards</h2>
                          <p className="lead color-2">
                            You can propose an Event on Swappers Wall. Events will be voted by community for likes. Top 10 Event proposals with maximum number of likes on Swappers Wall will be selected with the Reward of 1000 ES in liquid and 1000 ES in TimeAlly to proposers of each of these 10 Events.
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
                      <div className="col-12 col-lg-6 mx-auto">
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

        {/* ./CTA - Create Account */}
        <section className="section bg-6 b-b edge" style={{zIndex:'1111111', marginTop: '-93px'}}>
          <div className="container">
            <div className="section-heading text-center">
              <h2>FAQ's</h2>
              {/* <p className="color-2 lead">Era Swap Ecosystem includes interlinked multiple platforms where Era Swap Tokens can
                be utilized for exchange of services, availing discounts, getting rewards and other utilities. Era Swap Team will identify and help build more such platforms
                in future which are built for the community and willing to incorporate ES reward system.</p> */}
            </div>
            <div className="">

                <section className="section bg-6">
                  <div className="container" style={{marginTop:'-64px'}}>
                    <div className="row gap-y">
                      <div className="col-md-12">
                        <div className="accordion accordion-clean" id="faqs-accordion">
                          <div className="card mb-3">
                            <div className="card-header"><a href="#" className="card-title btn" data-toggle="collapse" data-target="#v1-q1">Do you store my private keys, Keystore or mnemonic?</a></div>
                            <div id="v1-q1" className="collapse" data-parent="#faqs-accordion">
                              <div className="card-body">When you load Wallet in the BetDeEx ÐApp, your private keys stay only on your computer. The BetDeEx ÐApp directly talks with blockchain hence any centralized intermediate server is not at all required and hence any of your data is NOT sent to our servers (we are also not recording any usage data). Your computer signs any transactions you authorise and only the signed transaction is submitted to blockchain for being included in blocks by miners who are mining in Ethereum. When you logout or even refresh page your private keys are erased from computer’s memory. The BetDeEx ÐApp source code is open source and anyone can check what is happening.</div>
                            </div>
                          </div>
                          <div className="card mb-3">
                            <div className="card-header"><a href="#" className="card-title btn" data-toggle="collapse" data-target="#v1-q2">What is Gas Fee / Network Fee?</a></div>
                            <div id="v1-q2" className="collapse" data-parent="#faqs-accordion">
                              <div className="card-body">Ethereum is a decentralized and immutable platform. Tens of thousands of miners dedicate their computers to maintain the Ethereum network. For compensation, the concept of the gas fee is there. All transactions on Ethereum Network cost gas and this fee is transferred to miners in ETH. Users can choose to pay less or more gas to miners. A miner can choose which transactions to mine, and generally, they give priority to those transactions which give them more fees. You can customize your gas fees in the advanced settings while making staking, withdrawal or any transaction.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
            </div>
          </div>
        </section>

        {/* ./Footer - Simple */}
        <footer className="site-footer section bg-1 color-1 block bg-1">
          <div className="container py-4">
            <div className="row gap-y text-center text-md-left">
              <div className="col-md-4 mr-auto">
                <img src="img/betdeex-logo.png" alt="" className="logo" />
                <p>Please read the Disclaimer, Terms and Conditions, Legal Terms carefully before strating with BetDeEx.</p>
              </div>
              {/* <div className="col-md-3">
                <nav className="nav flex-column">
                  <a className="nav-item py-2 color-1" href="index.html">Home</a>
                  <a className="nav-item py-2 color-1" href="faqs.html">FAQ</a>
                  <a className="nav-item py-2 color-1" href="disclaimer.html">Disclaimer</a>
                </nav>
              </div> */}
              <div className="col-md-3">
                <nav className="nav flex-column">
                  <a className="nav-item py-2 color-1" href="/pdf/t&c.pdf" target="_blank"><span style={{color:'#848080'}}>Terms &amp; Conditions</span></a>
                  <a className="nav-item py-2 color-1" href="/pdf/privacy.pdf" target="_blank"><span style={{color:'#848080'}}>Privacy Policy</span></a>
                  <a className="nav-item py-2 color-1" href="https://etherscan.io/address/0x42225682113E6Ed3616B36B4A72BbaE376041D7c#code" target="_blank"><span style={{color:'#848080'}}>BetDeEx DApp Smart Contract</span></a>
                </nav>
              </div>

            </div>
            <hr className="mt-5 bg-2 op-5" />
            <div className="row small align-items-center">
              <div className="col-md-4">
                <p className="mt-2 mb-0">© 2019 BetDeEx. All Rights Reserved</p>
              </div>
              <div className="col-md-8">
                 <nav className="nav ">
                  <a href="https://www.facebook.com/pages/BetDeEx/808455639538643" target="_blank" className="btn btn-circle btn-sm brand-facebook"><i className="fa fa-facebook" /></a> |
                  <a href="https://github.com/KMPARDS/betdeex-react.git" target="_blank" className="btn btn-circle btn-sm brand-github"><i className="fa fa-github" /></a> |
                  <a href="https://twitter.com/BetDeEx" target="_blank" className="btn btn-circle btn-sm brand-facebook"><i className="fa fa-twitter" /></a>
                </nav>
              </div>
            </div>
          </div>
        </footer>
      </div>
  </>
);

export default Home
