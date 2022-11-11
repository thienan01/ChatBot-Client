import React from 'react'
import Helmet from '../components/Helmet/Helmet';
import init from '../components/Script/editor'
const Training = () => {
  return <Helmet title='Training'>
    <div style={{ textAlign: "left", width: "100%", height: "70vh" }}>
        <div ref={el => init(el)} />
      </div>
  </Helmet>
}

export default Training