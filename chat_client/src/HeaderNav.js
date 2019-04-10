import React, { Component } from 'react';
import './HeaderNav.css';

class HeaderNav extends Component {
  // This state is for the purpose of controlling the
  // value of the input box
  constructor(props) {
    super(props);

    this.state = {
      username: '',
    };
  }

  // Updating the value in the state everytime the
  // input box content changes
  handleChange = evt => {
    const inputContent = evt.target.value;
    this.setState({ username: inputContent });
  };

  // Triggered on every key stroke
  // updating the username in App only when pressing Enter
  handleKeyUp = evt => {
    if (evt.key === 'Enter') {
      // calling updateUsername that's declared in the parent (App)
      this.props.updateUsername(this.state.username);
      this.setState({ username: '' });
    }
  };

  render() {
    return (
      <header>
        <nav>
          <div className="intro">
            <h1>Awesome Chat</h1>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange}
                onKeyUp={this.handleKeyUp}
              />
            </div>
          </div>
          <div>
            <div className="user-info">
              <h4 style={{ color: this.props.color }}>
                Username: {this.props.username || 'Anonymous'}
              </h4>
              <h4>Status: offline</h4>

              <button className="btn btn-primary">Close</button>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default HeaderNav;
