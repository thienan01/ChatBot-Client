import React from 'react'
import Script from '../components/Show/Script'
import '../styles/list.css'
import {Col} from "reactstrap"

const ListScript = () => {
  return (
    <div className="main__chatbody"  style={{ textAlign: "left", width: "100%", height: "100%" }}>
        <Col lg="6" md="6" sm="12" className="m-auto text-left">
        <Script/>
        </Col>
        </div>
    );
}

export default ListScript