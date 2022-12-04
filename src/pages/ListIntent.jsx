import React from 'react'
import '../styles/list.css'
import {Col} from "reactstrap"
import Intent from '../components/Show/Intent'

const ListIntent = () => {
  return (
    <div className="main__chatbody"  style={{ textAlign: "left", width: "100%", height: "100%" }}>
        <Col lg="6" md="6" sm="12" className="m-auto text-left">
        <Intent/>
        </Col>
        </div>
    );
}

export default ListIntent 