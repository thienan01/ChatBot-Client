import React, { Component } from "react";
import Avatar from "../ChatList/Avatar";

export default class ChatItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let today = new Date();
    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return (
      <div className={`chat__item ${this.props.user ? this.props.user : ""}`}>
        <div className="chat__item__content">
          <div
            className="chat__msg"
            dangerouslySetInnerHTML={{ __html: this.props.msg }}
          ></div>
          <div className="chat__meta">
            <span
              className={
                this.props.user === "other" ? "text-black" : "text-white"
              }
            >
              {time}
            </span>
          </div>
        </div>
        <Avatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}
