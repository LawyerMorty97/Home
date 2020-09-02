import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';

import WindowBar from './WindowComponents/windowbar';
import Background from './WindowComponents/background';

import electron from 'electron';

const Square = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: red;
  border-radius: 15px;
  position: absolute;
`;

function App() {
  return(
    <>
      <Background color="blue">
        <WindowBar title="Homekit"/>
      </Background>
    </>
  );
  /*return (
    <>
      <Square/>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );*/
}

export default App;
