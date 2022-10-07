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
      <p style={{fontSize: 12, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: header != "" ? 7 : 0, color: subTextColor}}>{subText}</p>
      {/* <Divider margin={5} /> */}
      <p style={{fontSize: 16, marginBottom: header != "" ? 5 : 0, lineHeight: 1, color: headerColor}}>{header}</p>
    </div>
  );
}

const formatBadISO = (badISO) => {
  return (`${badISO.substring(0, 4)}-${badISO.substring(4, 6)}-${badISO.substring(6, 8)}T${badISO.substring(9, 11)}:${badISO.substring(11, 13)}:${badISO.substring(13, 15)}`)
}


const ICalDetails = ({title, idx, daysLimit = -1, openByDefault = false}) => {
  const [iCal, setiCal] = useState([]);

  const refresh = () => {
    if (!chrome)
    {
      // console.log("rip chrome")
      return;
    }

    chrome.storage.sync.get(["calendarLinks"], async (result) => {
      const calendarsICS = await fetch(`https://rutgersprep.myschoolapp.com${result["calendarLinks"][idx]["iCalLink"]}`).then(res => res.text());
      const cal = ICalParser.toJSON(calendarsICS);

      console.log(idx);
      console.log(cal);

      let daysCounter = 0;
      let prevDate = null;

      const events = cal.events.filter(event => {
        const eventDate = Date.parse(formatBadISO(event.dtstart.value));
        const now = Date.parse(formatBadISO(event.dtstamp.value));

        if (eventDate >= now)
        {
          if (prevDate === null || prevDate !== formatBadISO(event.dtstart.value).split("T")[0])
          {
            prevDate = formatBadISO(event.dtstart.value).split("T")[0];
            daysCounter++;
          }

          if (daysLimit === -1 || daysCounter <= daysLimit)
          {
            return true;
          }
        }
        return false;
      })

      // console.log(events)
      setiCal(events);
    });
  }

  useEffect(refresh, []);

  return (
  <>
    <details open={openByDefault}>
    <summary style={{fontSize: 26, fontWeight: "", listStyle: "none"}}>{title}<Divider /></summary>
      {iCal.map((event, index) => {

        let dateString = formatBadISO(event.dtstart.value).split("T")[1].split(":").slice(0, 2).join(":");
        let diff = true;

        const currDate = formatBadISO(event.dtstart.value).split("T")[0];

        if (index >= 1)
        {
          const prevDate = formatBadISO(iCal[index - 1].dtstart.value).split("T")[0];

          diff = prevDate !== currDate;
        }

        return (
          <>
            {diff &&
              <>
                <p style={{color: "#AF7EFF", marginTop: 5}}>{currDate}</p>
              </>
            }
            <DetailCards key={index} subText={dateString + " | " + event.summary} headerColor="#fff" subTextColor="#fff" />
          </>
        )
      })}
      <button onClick={
        () => {
          if (daysLimit === 1)
          {
            daysLimit = 7;
            refresh();
            return;
          }
          daysLimit += 7;
          refresh();
        }
      }>Load More</button>
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

function App() {
  return (
    <div style={{width: "500px", height: "500px", padding: "25px", backgroundColor: "#292929", color: "#fff", overflowY: "scroll"}}>
      {/* <h1>Dashboard</h1> */}
      {/* <Divider /> */}
      {/* <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p> */}
      <ICalDetails title={"Up Next"} idx={2} daysLimit={1} openByDefault/>
      <Lunch />
      <ICalDetails title={"Assignments"} idx={1} openByDefault/>
    </div>
  );
}

export default App;
