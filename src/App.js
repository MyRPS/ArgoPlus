import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";

const Divider = ({margin = 10, ...props}) => {
  return (
    <div style={{width: "100%", height: "1px", backgroundColor: "#454545", marginBottom: margin}} {...props}>
    </div>
  )
}

const DetailCards = ({header = "", subText = ""}) => {
  return (
    <div style={{border: "1px solid #454545", borderRadius: 5, padding: 5, marginBottom: 5}}>
      <p style={{fontSize: 12, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: 2}}>{subText}</p>
      {/* <Divider margin={2} /> */}
      <p style={{fontSize: 15, marginBottom: 2, lineHeight: 1}}>{header}</p>
    </div>
  );
}


const Classes = () => {
  const [classes, setClasses] = useState([]);

  return (
  <>
    <details>
      <summary style={{listStyle: "none", fontSize: 12}}><h4>Schedule</h4></summary>
      <Divider />
      {Array(5).fill(<DetailCards />)}
    </details>
  </>)
}

const Lunch = () => {

  const [menuItems, setMenuItems] = useState(null);

  const lunchAPI = `https://cors-anywhere.herokuapp.com/https://www.sagedining.com/microsites/getMenuItems?menuId=113592&date=${new Date().toISOString().split("T")[0]}&meal=Lunch`;

  // console.log(lunchAPI);

  useEffect(() => {
    fetch(lunchAPI).then(res => res.json()).then(data => {
      setMenuItems(data);
    })
  }, []);

  console.log(menuItems);
  
  return (
    <details>
      <summary style={{listStyle: "none", fontSize: 12}}><h4>Lunch</h4></summary>
      <Divider />
      { menuItems &&
        Object.keys(menuItems).map((itemName, index) => {
          // console.log(itemName + " " + menuItems[itemName]);

          if (menuItems[itemName].length === 0)
            return null;

          return (
            <details key={index} open>
              <summary style={{fontSize: 16}}>{itemName}</summary>
              {menuItems[itemName].map(item => <DetailCards subText={item.name}/>)}
            </details>
          )
        })
      }
    </details>
  );
}

function App() {
  return (
    <div style={{width: "300px", height: "500px", padding: "25px", backgroundColor: "#292929", color: "#fff", overflowY: "scroll"}}>
      <h1>Dashboard</h1>
      <Divider />
      <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p>
      <Classes />
      <Lunch />
    </div>
  );
}

export default App;
