import React from 'react';
import { hot } from 'react-hot-loader';

class UnCheckedBell extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <div style={ {backgroundImage: "url(https://res.cloudinary.com/dajm9fvtd/image/upload/c_scale,w_35/v1560383466/notification_metdfb.png"}}
       id = "notification-state-icon" 
       className="notification"
       onClick = {()=> this.props.onClick()}
       >
      </div>
    );
  }
}

export default hot(module)(UnCheckedBell);
