
import logo from './logo.svg';
import './App.css';

import {useState} from 'react';
import Blocked from './components/Blocked';

function App() {

  return (
    <div style={{width: '500px', color: "white", backgroundColor: '#232323'}}>
      <div style={{display: "flex", overflowX: "scroll"}}>
        <h1 style={{fontSize: 50, paddingRight: 20}}>Time</h1>
        <h1 style={{fontSize: 100, paddingRight: 20}}>Stats</h1>
        <h1 style={{fontSize: 50, paddingRight: 20}}>Manage</h1>
        {/* <h1 style={{fontSize: 50, paddingRight: 20}}>Stats</h1> */}
      </div>
      <div className="blocked-site-list">
        {Array(2).fill(<Blocked />) }
      </div>
      <div className="block-site-add" style={{paddingTop: 20}}>
        <textarea 
          style={{width: '100%', height: "32px", backgroundColor: '#303030', color: 'white', borderRadius: 0, border: "none", outline: "none", paddingLeft: 10}}
          placeholder="Website Link To Block"
        />
        <button style={{width: "100%", backgroundColor: "#282828", color: "#999", border: 0, paddingTop: 5, paddingBottom:5}}>Add Blocked Site</button>
      </div>
    </div>
  );
}

export default App;
