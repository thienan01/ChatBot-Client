import React, { Component } from "react";
import logo from '../../../assets/logo.png'

export default class Avatar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="avatar">
        <div className="avatar-img">
          <img src={logo} alt="#" />
        </div>
        <span className={`isOnline ${this.props.isOnline}`}></span>
      </div>
    );
  }
}