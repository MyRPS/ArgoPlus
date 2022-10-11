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

const DetailCards = ({header = "", subText = "", headerColor = "#fff", subTextColor = "#fff", headerSize = 14, subTextSize = 12}) => {
  return (
    <div style={{border: "1px solid #353535", borderRadius: 5, padding: 5, marginBottom: 5}}>
      <p style={{fontSize: subTextSize, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: header != "" ? 7 : 0, color: subTextColor}}>{subText}</p>
      {/* <Divider margin={5} /> */}
      <p style={{fontSize: headerSize, marginBottom: header != "" ? 5 : 0, lineHeight: 1, color: headerColor}}>{header}</p>
    </div>
  );
}

const formatBadISO = (badISO) => {
  if (badISO.includes("T"))
  {
    return (`${badISO.substring(0, 4)}-${badISO.substring(4, 6)}-${badISO.substring(6, 8)}T${badISO.substring(9, 11)}:${badISO.substring(11, 13)}:${badISO.substring(13, 15)}`)
  }
  else{
    return (`${badISO.substring(0, 4)}-${badISO.substring(4, 6)}-${badISO.substring(6, 8)}`)
  }
}


const ICalDetails = ({title, idx, ADaysLimit = -1, incrementBy = 1, openByDefault = false, useDateStart = false}) => {
  const [iCal, setiCal] = useState([]);
  const [daysLimit, setDaysLimit] = useState(ADaysLimit);

  const refresh = () => {
    if (!chrome)
    {
      // console.log("rip chrome")
      return;
    }

    chrome.storage.sync.get(["calendarLinks"], async (result) => {
      let calendarsICS = "";
      try {
        calendarsICS = await fetch(`https://rutgersprep.myschoolapp.com${result["calendarLinks"][idx]["iCalLink"]}`).then(res => res.text());
      }
      catch (e) {
        setiCal(null);
        return;
      }

      const cal = ICalParser.toJSON(calendarsICS);

      // console.log(idx);
      // console.log(cal);

      let daysCounter = 0;
      let prevEventDateOnly = null;

      const events = cal.events.filter(event => {
        const eventDate = Date.parse(formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value));
        const now = Date.parse(formatBadISO(event.dtstamp.value));

        if (eventDate >= now)
        {
          if (prevEventDateOnly === null || prevEventDateOnly !== formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).split("T")[0])
          {
            prevEventDateOnly = formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).split("T")[0];
            daysCounter++;
          }

          if (daysLimit === -1 || daysCounter <= daysLimit)
          {
            return true;
          }
        }
        return false;
      })

      events.sort((a, b) => {
        return Date.parse(formatBadISO(a[useDateStart ? "dtstart" : "dtend"].value)) - Date.parse(formatBadISO(b[useDateStart ? "dtstart" : "dtend"].value));
      })

      setiCal(events);
      console.log(events);
    });
  }

  useEffect(refresh, [daysLimit, useDateStart, idx]);

  return (
  <>
    <details open={openByDefault}>
    <summary style={{fontSize: 26, fontWeight: "", listStyle: "none"}}>{title}<Divider /></summary>
      {iCal && iCal.map((event, index) => {

        const eventDate = Date.parse(formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value));
        const now = Date.parse(formatBadISO(event.dtstamp.value));

        const days = eventDate - now;

        const eventDateOnly = formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).split("T")[0];
        let timeString = "";

        if (formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).includes("T"))
        {
          timeString = formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).split("T")[1].split(":").slice(0, 2).join(":");
          timeString = Number(timeString.substring(0, 2)) > 12 ? Number(timeString.substring(0, 2)) - 12 + timeString.substring(2) + "PM" : timeString.startsWith("0") ? timeString.substring(1) + "AM" : timeString + "AM";
        }

        let diff = true;

        if (index >= 1)
        {
          const prevEventDateOnly = formatBadISO(iCal[index - 1][useDateStart ? "dtstart" : "dtend"].value).split("T")[0];

          diff = prevEventDateOnly !== eventDateOnly;
        }

        const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(eventDate).getDay()];

        return (
          <>
            {diff && daysLimit !== 1 &&
              <>
                <p style={{color: "#AF7EFF", marginTop: 5, marginBottom: 5, fontSize: 16}}>{dayOfWeek}, {eventDateOnly} {`(In ${Math.ceil(days / (1000 * 60 * 60 * 24))} days)`}</p>
              </>
            }
            <DetailCards key={index} header={(timeString !== "" ? (timeString + " | ") : "") + event.summary} headerColor={index === 0 && daysLimit === 1 ? "#AF7EFF" : "#fff"} subTextColor="#fff" headerSize={index === 0 && daysLimit === 1 ? 16 : 12}/>
          </>
        )
      })}
      {daysLimit != -1 && incrementBy != 0 && <button onClick={
        () => {
          setDaysLimit(daysLimit + incrementBy);
        }
      }
      style={{
        border: "1px solid #707070",
        color: "#fff",
        backgroundColor: "#292929",
        fontSize: 12,
        borderRadius: 5,
      }}
      >Load Next</button>}
      {daysLimit > incrementBy && daysLimit != -1 &&  incrementBy != 0 && <button onClick={
        () => {
          setDaysLimit(daysLimit - incrementBy);
        }
      }
      style={{
        border: "1px solid #707070",
        color: "#fff",
        backgroundColor: "#292929",
        fontSize: 12,
        borderRadius: 5,
        paddingLeft: 5,
      }}
      >Hide Last</button>}
      {
        !iCal && <p style={{color: "#fff", fontSize: 12}}>Error fetching events. Perhaps our service expired? If so, please try logging into Argonet again.</p>
      }
    </details>
  </>)
}

const Lunch = ({openByDefault}) => {

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
    <details open={openByDefault}>
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
    <div style={{width: "375px", height: "500px", padding: "25px", backgroundColor: "#292929", color: "#fff", overflowY: "scroll"}}>
      {/* <h1>Dashboard</h1> */}
      {/* <Divider /> */}
      {/* <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p> */}
      <ICalDetails title={"Up Next"} idx={2} ADaysLimit={1} incrementBy={0} openByDefault useDateStart/>
      <Lunch openByDefault={
        new Date().getHours() < 13
      }/>
      <ICalDetails title={"Assignments"} idx={1} ADaysLimit={-1} openByDefault/>
    </div>
  );
}

export default App;
