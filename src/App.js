import logo from "./logo.svg";
import "./App.css";

import { useState } from "react";

const Divider = ({margin = 10, ...props}) => {
  return (
    <div style={{width: "100%", height: "1px", backgroundColor: "#454545", marginBottom: margin}} {...props}>
    </div>
  )
}

const ClassDetail = ({name = "Class Name", timeStart = "12:00 PM", timeEnd = "1:00PM"}) => {
  return (
    <div style={{border: "1px solid #454545", borderRadius: 5, padding: 5, marginBottom: 5}}>
      <p style={{fontSize: 12, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: 2}}>{timeStart} - {timeEnd}</p>
      {/* <Divider margin={2} /> */}
      <p style={{fontSize: 15, marginBottom: 2, lineHeight: 1}}>{name}</p>
    </div>
  );
}


const Classes = () => {
  const [classes, setClasses] = useState([]);

  return (
  <>
    <ClassDetail />
    <details>
      <summary style={{listStyle: "none", fontSize: 12}}><u>Show More</u></summary>
      {Array(5).fill(<ClassDetail />)}
    </details>
  </>)
}

const Lunch = () => {

  const [menu, setMenuItems] = useState(null);

  fetch(`https://www.sagedining.com/microsites/getMenuItems?menuId=113592&date=${new Date().toISOString().split("T")[0]}&meal=Lunch `).then(res => res.json()).then(data => {
    setMenuItems(data);
  });
  
  return (
    
  );
}

function App() {
  return (
    <div style={{width: "300px", height: "500px", padding: "25px", backgroundColor: "#292929", color: "#fff", overflowY: "scroll"}}>
      <h1>Dashboard</h1>
      <Divider />
      <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p>
      <h4>Next Up</h4>
      <Divider />
      <Classes />
      <h4>Lunch</h4>
      <Divider />
      <Lunch />
    </div>
  );
}

export default App;
