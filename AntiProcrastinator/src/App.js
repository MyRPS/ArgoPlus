import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";
import Blocked from "./components/Blocked";
import Divider from "./components/Divider";

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
          {/* <button
            style={{
              width: "100%",
              backgroundColor: "#303030",
              color: "#999",
              border: 0,
              // borderRadius: 5,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          >
            History
          </button> */}
        </div>

        <h1 style={{ fontSize: 100, paddingRight: 20, height: "100%", color: "#999" }}>
          Time
        </h1>

        <Divider text="Blocked Sites" width="100%" />

        <div className="blocked-site-list top-no-bar"
          style={{
            width: "100%",
            height: "300px",
            overflowY: "scroll"
          }}
        >
          {Array(12).fill(<Blocked />)}
        </div>

        <Divider text="Add" />

        <div className="block-site-add">
        <textarea
            style={{
              width: "100%",
              height: "96px",
              backgroundColor: "#303030",
              color: "white",
              borderRadius: 5,
              border: "none",
              outline: "none",
              paddingLeft: 10,
              minHeight: "96px",
            }}
            placeholder="Write a motivating note to yourself to get off this website..."
          />

          <textarea
            style={{
              width: "100%",
              height: "32px",
              backgroundColor: "#303030",
              color: "white",
              borderRadius: 5,
              border: "none",
              outline: "none",
              paddingLeft: 10,
              minHeight: "32px",
            }}
            placeholder="Website Link To Block"
          />

          <textarea
            style={{
              width: "100%",
              height: "32px",
              backgroundColor: "#303030",
              color: "white",
              borderRadius: 5,
              border: "none",
              outline: "none",
              paddingLeft: 10,
              minHeight: "32px",
              resize: "none",
            }}
            placeholder="Time (in minutes) Allowed Per Day"
          />

          {/* <div style={{display: "flex"}}>
            <p>Cod Mobile</p>
          </div> */}
          <button
            style={{
              width: "100%",
              backgroundColor: "#6a6",
              color: "#afa",
              border: 0,
              marginTop: 10,
              paddingTop: 5,
              borderRadius: 5,
              paddingBottom: 5,
            }}
          >
            Add Site Restriction
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
