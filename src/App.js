import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";
import Blocked from "./components/Blocked";
import Divider from "./components/Divider";
import Time from "./pages/Time";
import Analytics from "./pages/Analytics";

function App() {

  const [page, setPage] = useState("Time");

  return (
    <div className="top-no-bar" style={{ width: page === "Time" ? "350px" : "500px", padding: "25px", paddingTop: 0, backgroundColor: "#232323" }}>
      <div style={{ width: "300px", color: "white"}}>
        <div style={{display: "flex"}}>
          <button
            style={{
              width: "100%",
              height: page === "Time" ? 40 : 25,
              backgroundColor: "#303030",
              color: "#999",
              border: 0,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
            }}
            onClick = {() => {setPage("Time")}}
          >
            Time
          </button>
          <button
            style={{
              width: "100%",
              height: page === "Analytics" ? 40 : 25,
              backgroundColor: "#282828",
              color: "#999",
              border: 0,
              // borderRadius: 5,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
            }}
            onClick = {() => {setPage("Analytics")}}
          >
            Analysis
          </button>
        </div>

        {page === "Time" && <Time />}
        {page === "Analytics" && <Analytics />}
      
      </div>
    </div>
  );
}

export default App;
