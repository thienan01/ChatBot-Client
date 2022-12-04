import React from 'react'
import '../styles/list.css'
import {Col} from "reactstrap"
import Pattern from '../components/Show/Pattern'

const ListPattern = () => {
  return (
    <div className="main__chatbody"  style={{ textAlign: "left", width: "100%", height: "100%" }}>
        <Col lg="6" md="6" sm="12" className="m-auto text-left">
        <Pattern/>
        </Col>
        </div>
    );
}

export default ListPattern