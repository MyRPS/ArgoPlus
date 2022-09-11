/* global chrome */

import { useState } from "react";
import Blocked from "../components/Blocked";
import Divider from "../components/Divider";

export default function Time({}){

    const [blockedList, setBlockedList] = useState([]);

    console.log("wtf")
    chrome.storage.sync.get(["blockedSites"], (result) => {
        
        console.log("getted: " + result);

        if (!result || !result.blockedSites)
        {
            return;
        }

        console.log("it not null: " + result.blockedSites);
        
        setBlockedList(result.blockedSites);
    });

    const delSite = (index) => {

        let newTasks = blockedList;

        for (var i = 0; i < newTasks.length; i++)
        {
            if (i === index)
            {
                newTasks.splice(i, 1);
            }
        }

        chrome.storage.sync.set({blockedSites: newTasks});
    }

    return (
        <div style={{width: "100%", height: "100%", color: "#999" }}>
            <h1 style={{ fontSize: 100, paddingRight: 20, height: "100%", color: "#999" }}>
            Time
            </h1>

            <Divider text="Blocked Sites" width="100%" />

            <div className="blocked-site-list top-no-bar"
            style={{
                width: "100%",
                height: "auto",
                maxHeight: "300px",
                overflowY: "scroll"
            }}
            >
                {blockedList.length !== 0 ? blockedList.map((site, index) => <Blocked link={site.domain} quote={site.message} time={site.time} deleteCallback={() => delSite(index)}/>) : <p>No restrictions yet...</p>}
            </div>

            <Divider text="Add" />

            <div className="block-site-add">
            <textarea
                id="motivating-note"
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
                id="website-link"
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
                id="time-limit"
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
                onClick={() => {

                    console.log("try to set");

                    const toAdd = {
                        message: document.getElementById("motivating-note").value,
                        domain: document.getElementById("website-link").value,
                        time: Number(document.getElementById("time-limit").value),
                    };

                    document.getElementById("motivating-note").value = "";
                    document.getElementById("website-link").value = "";
                    document.getElementById("time-limit").value = "";

                    chrome.storage.sync.set({blockedSites: [...blockedList, toAdd]}, () => {
                        console.log("setted to " + toAdd);
                    });
                }}
            >
                Add Site Restriction
            </button>
            </div>
        </div>
    );
}