import {useState} from 'react';

export default function Divider({text, width="auto"}) {
    return (
        <div style={{display: "flex", alignContent: "center", justifyContent: "center"}}>
            <div style={{background: "#999", height: 2, width: "100%", marginTop: 17.5}}/>
            <p style={{padding: 5, width: width, color: "#999"}}>{text}</p>
            <div style={{background: "#999", height: 2, width: "100%", marginTop: 17.5}}/>
        </div>
    );
}