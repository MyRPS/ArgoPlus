import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";
import Blocked from "./components/Blocked";
import Divider from "./components/Divider";
import Time from "./pages/Time";

function App() {
  return (
    <div className="top-no-bar" style={{ width: "350px", padding: "25px", paddingTop: 0, backgroundColor: "#232323" }}>
      <div style={{ width: "300px", color: "white"}}>
        <div style={{display: "flex"}}>
          <button
            style={{
              width: "100%",
              height: 40,
              backgroundColor: "#303030",
              color: "#999",
              border: 0,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
            }}
          >
            Time
          </button>
          <button
            style={{
              width: "100%",
              height: 25,
              backgroundColor: "#282828",
              color: "#999",
              border: 0,
              // borderRadius: 5,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
            }}
          >
            Analysis
          </button>
        </div>

        <Time />
      </div>
    </div>
  );
}

export default App;
