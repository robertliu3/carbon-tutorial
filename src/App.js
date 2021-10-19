import React, { Component } from 'react';
import './App.scss';
import Index from './components/Index';



class App extends Component {

  //Index class holds sub-component from carbon
  render() {
    return (
      <div className="App">
        <Index />
      </div>
    );
  }
}

export default App;
