import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Start Working On Your Menu-bar Electron App</p>
        </header>
      </div>
    );
  }
}

export default App;
