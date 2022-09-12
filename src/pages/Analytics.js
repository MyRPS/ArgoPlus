import { useState } from "react";
import Blocked from "../components/Blocked";
import Divider from "../components/Divider";

export default function Analytics({}){
    return (
        <div style={{width: "100%", height: "100%", color: "#999" }}>
            <h1 style={{ fontSize: 100, paddingRight: 20, height: "100%", color: "#999" }}>
                Analytics
            </h1>

            <Divider text="Bypasseses" width="100%" />

            <Divider text="Time Log" width="100%" />
        </div>
    );
}