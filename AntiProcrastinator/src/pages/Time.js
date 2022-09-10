/* global chrome */

import { useState } from "react";
import Blocked from "../components/Blocked";
import Divider from "../components/Divider";

export default function Time({}){

    const [blockedList, setBlockedList] = useState([]);

    chrome.storage.sync.get(["blockedSites"], (result) => {
        
        if (!result || !result.key)
        {
            return;
        }
        
        setBlockedList(result.key);

        console.log(result);

    });

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
                {blockedList !== [] ? blockedList.map((site, index) => <p>{index}</p>) : <p>No restrictions yet...</p>}
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
                    chrome.storage.sync.set({blockedSites: [...blockedList, {
                        message: "ahh be molotov",
                        domain: "https://youtube.com",
                        time: 10,
                    }]});
                }}
            >
                Add Site Restriction
            </button>
            </div>
        </div>
    );
}