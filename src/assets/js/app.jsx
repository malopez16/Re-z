import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import SearchApp from './components/Search';
import Notification from './containers/Notifications';
import Notificationread from './containers/Notificationsread';
import CheckedBell from './containers/CheckedBell';
import UnCheckedBell from './containers/UnCheckedBell';
import { request } from 'http';

const reactAppContainer = document.getElementById('react-app');
const reactSearchAppContainer = document.getElementById('container-search-app')

if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}

if (reactSearchAppContainer) {
  console.log("entro aqui")
  ReactDOM.render(<SearchApp />, reactSearchAppContainer);
}

const Notificationelement = document.getElementById('notifications');

class NotificationPanel extends React.Component {
  // We declare the state for the smart component
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    fetch('/notifications/API', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({ data });
      });
  }

  // eslint-disable-next-line class-methods-use-this
  renderNotification(title,link, id) {
    return (
      <Notification
      title={title}
      link={link}
      onClick = {()=> this.notificationRead(id)}
      id = {id}
      />
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderReadNotification(title, link, id) {
    return (
      <Notificationread
      title={title}
      link={link}
      onClick = {()=> this.notificationRead(id)}
      id = {id}
      />
    );
  }


  notificationRead(id){
    fetch(`/notifications/API/read/${id}`, {
      method:"POST",
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(data => {console.log(data);
      this.componentDidMount();
    }
    );


    const link = `notifications/API/read/${id}`;
    console.log(link);
    request(link, (error, response, body) => {
      const data = JSON.parse(body);
      this.setState(this.state);
    })
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        {data.map(title => (title.checked
         ? <div> {
           this.renderReadNotification(
             title.contents,
             title.link,
             title.id,
             )}
         </div> :
          <div> {
          this.renderNotification(
            title.contents,
            title.link,
            title.id,
            )}
          </div>)
        )}
      </div>
    );
  }
}


if (Notificationelement) {
  ReactDOM.render(
    <NotificationPanel />,
    Notificationelement,
  );
}

const BellIcon = document.getElementById('notification-state-icon');

class Notificationsymbol extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      allchecked : true,
    };
  };
  componentDidMount() {
    fetch('/notifications/API', {
      credentials: 'same-origin',
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({ data });
        let allchecked_answer = true;
        data.forEach(notification => {
          if (!(notification.checked)){
            allchecked_answer = false
          }
        });
        this.setState({allchecked: allchecked_answer})
      });
  }

  handleClick(){
    this.setState({allchecked: true})
  }

  renderCheckedBell(){
    return(
      <CheckedBell/>
    );
  }

  renderUnCheckedBell(){
    return(
      <UnCheckedBell
      onClick ={() => this.handleClick()}
      />
    );
  }

  render(){
    if(this.state.allchecked){
      return (
        <div> {this.renderCheckedBell()}</div>
      )
    }else{
      return (
        <div> {this.renderUnCheckedBell()}</div>
      )
    }
  }

}

if (BellIcon){
  ReactDOM.render(
    <Notificationsymbol />,
    BellIcon,
  );
}
