import logo from "./logo.svg";
import "./App.css";

/* global chrome */

import { useEffect, useState } from "react";
import ICalParser from "ical-js-parser";

const Divider = ({margin = 10, ...props}) => {
  return (
    <div style={{width: "100%", height: "1px", backgroundColor: "#454545", marginBottom: margin}} {...props}>
    </div>
  )
}

const DetailCards = ({header = "", subText = "", headerColor = "#fff", subTextColor = "#fff"}) => {
  return (
    <div style={{border: "1px solid #454545", borderRadius: 5, padding: 5, marginBottom: 5}}>
      <p style={{fontSize: 12, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: 7, color: subTextColor}}>{subText}</p>
      {/* <Divider margin={5} /> */}
      <p style={{fontSize: 16, marginBottom: 5, lineHeight: 1, color: headerColor}}>{header}</p>
    </div>
  );
}


const ICalDetails = ({title, idx}) => {
  const [iCal, setiCal] = useState([]);

  if (!chrome)
  {
    console.log("rip chrome")
    return;
  }

  chrome.storage.sync.get(["calendarLinks"], async (result) => {
    // console.log(result);

    const calendarsICS = await fetch(`https://rutgersprep.myschoolapp.com${result["calendarLinks"][idx]["iCalLink"]}`).then(res => res.text());

    const events = ICalParser.toJSON(calendarsICS);

    console.log(events)
  });

  return (
  <>
    <details>
    <summary style={{fontSize: 26, fontWeight: "", listStyle: "none"}}>{title}<Divider /></summary>

    </details>
  </>)
}

const Lunch = () => {

  const [menuItems, setMenuItems] = useState(null);

  const lunchAPI = `https://corsanywhere.herokuapp.com/https://www.sagedining.com/microsites/getMenuItems?menuId=113592&date=${new Date().toISOString().split("T")[0]}&meal=Lunch`;

  useEffect(() => {
    try {
      fetch(lunchAPI).then(res => res.json()).then(data => {
        setMenuItems(data);
      });
    }
    catch (e) {
      return <p style={{fontSize: 26, fontWeight: "", listStyle: "none", color: "#fff"}}>Failed to fetch lunch menu.</p>
    }
  }, []);

  // console.log(menuItems);
  
  return (
    <details>
      <summary style={{fontSize: 26, fontWeight: "", listStyle: "none", color: "#fff"}}>Lunch<Divider /></summary>
      
      { menuItems &&
        Object.keys(menuItems).map((itemName, index) => {
          // console.log(itemName + " " + menuItems[itemName]);

          if (menuItems[itemName].length === 0)
            return null;

          return (
            <div style={{border: "1px solid #454545", borderRadius: 5, padding: 5, marginBottom: 5}}>
              <details key={index} open>
                <summary style={{fontSize: 15, listStyle: "none", marginBottom: 5, color: "#AF7EFF"}}>{itemName}</summary>
                <Divider />
                {menuItems[itemName].map(item => <p style={{fontSize: 12}}>{item.name}</p>)}
              </details>
            </div>
          )
        })
      }
    </details>
  );
}

const Assignments = () => {

  if (!chrome)
  {
    return;
  }

  return (
  <>
    <details>
    <summary style={{fontSize: 26, fontWeight: "", listStyle: "none"}}>Assignments<Divider /></summary>
      {Array(5).fill(<DetailCards />)}
    </details>
  </>)
}

function App() {
  return (
    <div style={{width: "500px", height: "500px", padding: "25px", backgroundColor: "#292929", color: "#fff", overflowY: "scroll"}}>
      {/* <h1>Dashboard</h1> */}
      {/* <Divider /> */}
      {/* <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p> */}
      <ICalDetails title={"Up Next"} idx={2}/>
      <Lunch />
      <ICalDetails title={"Assignments"} idx={1}/>
    </div>
  );
}

export default App;
