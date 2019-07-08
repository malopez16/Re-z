import React from 'react';
import { hot } from 'react-hot-loader';

class Notification extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
        <div id = "unread-notification" className="notification">
        <a href={this.props.link} onClick= {() => this.props.onClick()} target="_blank" > 
        {this.props.title} 
        </a>
      </div>
    );
  }
}

export default hot(module)(Notification);
