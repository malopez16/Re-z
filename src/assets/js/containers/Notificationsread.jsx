import React from 'react';
import { hot } from 'react-hot-loader';


class Notificationread extends React.Component {
    render() {
      return (
        <div id = "read-notification" className="notification">
          <a href={this.props.link} onClick= {() => this.props.onClick()} target="_blank" > 
          {this.props.title}
          </a>
        </div>
      );
    }
  }

export default hot(module)(Notificationread);
