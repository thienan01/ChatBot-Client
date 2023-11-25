import React from "react";
import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import heroImg from "../assets/images/chatbot-HR.gif";
import heroImg1 from "../assets/images/ezgif-3-d79bab7cdc.gif";
import "../styles/hero-section.css";
import "../styles/home1.css";
import "../styles/home.css";
import featureImg01 from "../assets/images/servive-01.png";
import featureImg02 from "../assets/images/servive-02.png";
import featureImg03 from "../assets/images/servive-03.png";
import { Link } from "react-router-dom";
import kitsCategoryImg01 from "../assets/images/category-011.png";
import kitsCategoryImg02 from "../assets/images/category-022.png";
import kitsCategoryImg03 from "../assets/images/category-044.png";
import whyImg from "../assets/images/Chatbot.gif";
import Footer from "../components/Footer/Footer.jsx";
const featureData = [
  {
    title: "Convenient",
    imgUrl: featureImg01,
  },
  {
    title: "Quick Replies",
    imgUrl: featureImg02,
  },
  {
    title: "Secure",
    imgUrl: featureImg03,
  },
];

const Home = () => {
  return (
    <Helmet title="Home">
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h5 className="mb-3">Easy to TRAINING</h5>
                <h1 className="mb-4 hero__title">
                  Welcome to <span> Chatbot Service</span>
                </h1>
                <p>
                  &nbsp;&nbsp;Chatbot is a tool that can communicate and
                  interact with humans through pre-programmed artificial
                  intelligence. In most cases, chatbots are used via messaging
                  apps to talk to humans.{" "}
                </p>
                <div className="hero__btns d-flex align-items-center gap-5 mt-4">
                  <Link to="/dashboard">
                    <button className="order__btn d-flex align-items-center justify-content-between">
                      Training now <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </Link>
                </div>
                <div className="hero__service d-flex align-items-center gap-5 mt-5">
                  <p className="d-flex align-items-center gap-2">
                    <span className="shipping__icon">
                      <i className="ri-money-dollar-circle-line"></i>
                    </span>
                    No training charge
                  </p>
                  <p className="d-flex align-items-center gap-2">
                    <span className="shipping__icon">
                      <i className="ri-shield-check-line"></i>
                    </span>
                    100% secure
                  </p>
                </div>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="hero__img">
                {<img src={heroImg} alt="hero-img" className="w-100" />}
              </div>
            </Col>
          </Row>
          <Row>
            <div className="hero__img">
              {<img src={heroImg1} alt="hero-img" className="w-100" />}
            </div>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h5 className="feature__title">
                Just looking for training intent
              </h5>
              <p className="mb-1 mt-4 feature__text">
                Chatbots have varying levels of complexity, being either
                stateless or stateful. Stateless chatbots approach each
                conversation as if interacting with a new user.
                <br /> In contrast, stateful chatbots can review past
                interactions and frame new responses in context.
              </p>
            </Col>
            {featureData.map((item, index) => (
              <Col lg="4" md="4" key={index} className="mt-5">
                <div className="feature__item text-center p-3">
                  <img
                    src={item.imgUrl}
                    alt="feature-img"
                    className="w-50 mb-3"
                  />
                  <h5 className=" fw-bold ">{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center"></Col>

            <Col lg="12">
              <div className="kits__category d-flex align-items-center justify-content-center gap-5">
                <button className={`d-flex align-items-center gap-2`}>
                  <img src={kitsCategoryImg01} alt="" />
                  Fast
                </button>
                <button className={`d-flex align-items-center gap-2`}>
                  <img src={kitsCategoryImg02} alt="" />
                  Secure
                </button>
                <button className={`d-flex align-items-center gap-2`}>
                  <img src={kitsCategoryImg03} alt="" />
                  convenient
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <img src={whyImg} alt="delivery" className="w-100" />
            </Col>
            <Col lg="6" md="6">
              <div className="why__iconic-good">
                <h2 className="iconic__good-title mb-4">Chatbot Service</h2>
                <p className="iconic__good-desc">
                  A chatbot is an automated program that interacts with
                  customers as a human would and costs little to nothing to
                  engage with. Chatbots attend to customers at all times of the
                  day and week and are not limited by time or a physical
                  location. This makes its implementation appealing to a lot of
                  businesses that may not have the manpower or financial
                  resources to keep employees working around the clock.
                </p>
                <ListGroup className="mt-5">
                  <ListGroupItem className="border-0 ps-0">
                    <p className="choose__us-title d-flex align-items-center gap-2">
                      {" "}
                      <i className="ri-checkbox-circle-line"></i> Best Service
                      &emsp; <i className="ri-checkbox-circle-line"></i>Quality
                      Support &emsp;<i className="ri-checkbox-circle-line"></i>{" "}
                      Training from any location
                    </p>
                  </ListGroupItem>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />
    </Helmet>
  );
};

export default Home;
