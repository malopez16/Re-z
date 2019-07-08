import React from 'react';
import { hot } from 'react-hot-loader';

class CheckedBell extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
        <div style={ {backgroundImage: "url(https://res.cloudinary.com/dajm9fvtd/image/upload/c_scale,w_35/v1560395315/bell_y2bhl5.png"}} id = "notification-state-icon" className="notification">
      </div>
    );
  }
}

export default hot(module)(CheckedBell);
