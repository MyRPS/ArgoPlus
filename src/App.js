import logo from "./logo.svg";
import "./App.css";

/* global chrome */

import { useEffect, useState } from "react";
import ICalParser from "ical-js-parser";

const Divider = ({margin = 10, ...props}) => {
  return <p style={{marginBottom: margin, marginTop: margin}} {...props}></p>;
  return (
    <div style={{width: "100%", height: "1px", backgroundColor: "#454545", marginBottom: margin}} {...props}>
    </div>
  )
}

const AssignmentDetailCards = ({header = "", backgroundImage = "none", headerColor = "#fff", headerSize = 12}) => {

  let pills = header.includes(": ") || true;

  const className = header.split(": ")[0].split(" - ")[0];
  const teacher = header.split(": ")[0].split(" - ")[1];

  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      backgroundImage: backgroundImage,
      width: "100%",
      borderRadius: 5, padding: 15, marginBottom: 5, flex: 1}}> 
      {/* <span style={{fontSize: subTextSize, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: header != "" ? 7 : 0, color: subTextColor}}>{subText}</span> */}
      <span style={{fontSize: headerSize, marginBottom: header != "" ? 5 : 0, color: headerColor}}>{pills ? header.split(": ")[1] : header}</span>
      {pills &&
        <div style={{position: "relative", width: "100%", flexDirection: "row", flex: 1}}>
          {/* <div style={{position: "relative", width: "100%", flexDirection: "row", flex: 1}}> */}
            <span style={{fontSize: 7, lineHeight: 1, color: "white", padding: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 10}}>
            <img src={require("./icons/course.png")} style={{width: 10, height: 10, marginRight: 5, marginTop: -2}}/>
              {className}
            </span>
          {/* </div> */}
          <span style={{fontSize: 7, lineHeight: 1, color: "white", padding: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 10}}>
          <img src={require("./icons/person.png")} style={{width: 10, height: 10, marginRight: 5, marginTop: -2}}/>
            {teacher}
          </span>
        </div>
        }
    </div>
  );
}

const ScheduleDetailCards = ({header = "", backgroundImage = "none", headerColor = "#fff", headerSize = 12}) => {

  //9:50AM Study Hall - Hussian (6)

  let useHeaderOnly = false;
  let periodNumber;
  let teacher;
  let className;
  let time;
  try {
    periodNumber = header.split(" - ")[1].split(" ")[1].replace("(", "").replace(")", "");
    teacher = header.split(" - ")[1].split(" ")[0];
    className = header.split(" - ")[0].split(" ").slice(1).join(" ");
    time = header.split(" ")[0];
  } catch (e) {
    useHeaderOnly = true;
  }

  return (
    <div style={{
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      backgroundImage: backgroundImage,
      width: "100%",
      borderRadius: 5, padding: 15, marginBottom: 5, flex: 1}}> 
      {/* <span style={{fontSize: subTextSize, lineHeight: 1, textAlign: "left", paddingLeft: 0, marginBottom: header != "" ? 7 : 0, color: subTextColor}}>{subText}</span> */}
      <span style={{fontSize: headerSize, marginBottom: header != "" ? 5 : 0, color: headerColor}}>{useHeaderOnly ? header : (className)}</span>
        {!useHeaderOnly && <div style={{position: "relative", width: "100%", flexDirection: "row", flex: 1}}>
          {/* <div style={{position: "relative", width: "100%", flexDirection: "row", flex: 1}}> */}
            <span style={{fontSize: 7, lineHeight: 1, color: "white", padding: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 10}}>
            <img src={require("./icons/clock.png")} style={{width: 10, height: 10, marginRight: 5, marginTop: -2}}/>
              {time}
            </span>
          {/* </div> */}
          <span style={{fontSize: 7, lineHeight: 1, color: "white", padding: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 10}}>
          <img src={require("./icons/person.png")} style={{width: 10, height: 10, marginRight: 5, marginTop: -2}}/>
            {teacher}
          </span>
          <span style={{fontSize: 7, lineHeight: 1, color: "white", padding: 5, marginRight: 5, paddingLeft: 10, paddingRight: 10, backgroundColor: "rgba(0, 0, 0, 0.25)", borderRadius: 10}}>
          <img src={require("./icons/hash.png")} style={{width: 10, height: 10, marginRight: 5, marginTop: -2}}/>
            {periodNumber}
          </span>
        </div>
        }
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


const ICalDetails = ({title, idx, ADaysLimit = -1, incrementBy = 1, openByDefault = false, useDateStart = false, margin=false}) => {
  const [iCal, setiCal] = useState([]);
  const [daysLimit, setDaysLimit] = useState(ADaysLimit);

  const refresh = () => {
    if (!chrome)
    {
      // chrome = {
      //   storage: {
      //     sync: {
      //       calendarLinks: [

      //       ]
      //     }
      //   }
      // }
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
    <details open={openByDefault} style={{marginLeft: margin ? 25 : 0}}>
    <summary style={{fontSize: 26, fontWeight: "", listStyle: "none"}}>{title}<Divider /></summary>
      {iCal && iCal.map((event, index) => {

        const eventDate = Date.parse(formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value));
        const now = Date.parse(formatBadISO(event.dtstamp.value));

        const days = eventDate - now;

        let eventDateOnly = formatBadISO(event[useDateStart ? "dtstart" : "dtend"].value).split("T")[0];
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

        eventDateOnly = eventDateOnly.replace(new Date().getFullYear() + "-", "").replace("-", "/");

        // if (!eventDate.includes("-"))
        // {
        //   eventDate = eventDate + "th";
        // }

        return (
          <>
            {diff && daysLimit !== 1 &&
              <>
                <p style={{color: "#FFF", marginTop: 15, marginBottom: 5, fontSize: 16}}>{dayOfWeek}, {eventDateOnly.replace("-", "/")} {`(In ${Math.ceil(days / (1000 * 60 * 60 * 24))} Days)`}</p>
              </>
            }
            {daysLimit !== 1 ? 
              <AssignmentDetailCards key={index} backgroundImage={"none"} header={(timeString !== "" ? (timeString + " \n ") : "") + event.summary} headerColor={index === 0 && daysLimit === 1 ? "#fff" : "#fff"} headerSize={12}/>
              :
              <ScheduleDetailCards key={index} backgroundImage={index === 0 ? "linear-gradient(to bottom right, #6d5ced, #5c96ed)" : "none"} header={(timeString !== "" ? (timeString + " \n ") : "") + event.summary} headerColor={index === 0 && daysLimit === 1 ? "#fff" : "#fff"} headerSize={12}/>
            }
          </>
        )
      })}
      {daysLimit > incrementBy && daysLimit != -1 &&  incrementBy != 0 && <button onClick={
        () => {
          setDaysLimit(daysLimit - incrementBy);
        }
      }
      style={{
        border: "none",
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        fontSize: 12,
        borderRadius: 5,
        padding: 5,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        marginRight: 15,
      }}
      >{"Hide Last " + incrementBy}</button>}
      {daysLimit != -1 && incrementBy != 0 && <button onClick={
        () => {
          setDaysLimit(daysLimit + incrementBy);
        }
      }
      style={{
        border: "none",
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        fontSize: 12,
        borderRadius: 5,
        padding: 5,
        marginTop: 15,
        paddingLeft: 15,
        paddingRight: 15
      }}
      >{"Load " + incrementBy + " More"}</button>}
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
      <a href="https://www.sagedining.com/sites/rutgerspreparatory/menu" target="_blank">Click for lunch menu (if tray doesn't display)</a>
      
      { menuItems &&
        Object.keys(menuItems).map((itemName, index) => {
          // console.log(itemName + " " + menuItems[itemName]);

          if (menuItems[itemName].length === 0)
            return null;

          return (
            <div style={{border: "1px solid #454545", borderRadius: 5, padding: 5, marginBottom: 5}}>
              <details key={index} open>
                <summary style={{fontSize: 15, listStyle: "none", marginBottom: 5, color: "#FFF"}}>{itemName}</summary>
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

const QuickLinkButton = ({icon, text, link}) => {
  return (
    <button style={{border: "none", textAlign: "left", color: "#fff", backgroundColor: "rgba(255, 255, 255, 0.15)", width:"100%", height: 50, fontSize: 12, borderRadius: 7, marginBottom: 5}} onClick={
      () => {
        window.open(link, "_blank").focus();
      }}
    >
      <div style={{position: "relative", width: "100%", flexDirection: "row", flex: 1}}>
        <img src={icon} style={{width: 15, height: 15, marginLeft: 15, marginRight: 15}} />
        <span>{text}</span>
        <img src={require("./icons/arrow.png")} style={{position: "absolute", width: 15, height: 15, right: 15, alignSelf: "right"}} />
      </div>
    </button>
  )
}

const QuickLinks = () => {
  return (
    <details open>
      <summary style={{fontSize: 26, fontWeight: "", listStyle: "none", color: "#fff"}}>Quick Access<Divider /></summary>
        <QuickLinkButton icon={require("./icons/food.png")} text="Lunch Menu" link="https://www.sagedining.com/sites/rutgerspreparatory/menu"/>
        <QuickLinkButton icon={require("./icons/calendar.png")} text="Assignment Calendar" link="https://rutgersprep.myschoolapp.com/app/student#studentmyday/assignment-center"/>
        <QuickLinkButton icon={require("./icons/grades.png")} text="My Grades" link="https://rutgersprep.myschoolapp.com/app/student#studentmyday/progress"/>
    </details>
  );
}

function App() {
  return (
    <div style={{width: "800px", height: "800px", padding: "25px", 
    backgroundImage: "linear-gradient(to bottom right, #0a222b, #0a172b)"
    , color: "#fff", 
    }}>
      {/* <h1>Dashboard</h1> */}
      {/* <Divider /> */}
      {/* <p>School day's over, what you see is for tomorrow. <a href={""} style={{fontSize: 12}}>See today.</a></p> */}
      <table style={{border: "none"}}>
        <tr>
          <td style={{width: "40%", verticalAlign: "top"}}>
            <ICalDetails title={"Next Up"} idx={2} ADaysLimit={1} incrementBy={0} openByDefault useDateStart/>
            <QuickLinks />
          </td>
          <td style={{width: "60%", verticalAlign: "top"}}>
            <ICalDetails margin title={"Due Soon"} idx={1} ADaysLimit={10} incrementBy={10} openByDefault/>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default App;
