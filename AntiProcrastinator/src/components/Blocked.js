
import {useState} from 'react';

export default function Blocked() {
    return (
        <div className="Blocked" style={{display: "flex", height: "32px", width: "500px", backgroundColor: "#101010"}}>
            <textarea 
            style={{width: '100%', backgroundColor: '#303030', color: 'white', borderRadius: 0, border: "none", outline: "none", paddingLeft: 10}}
            placeholder="Website Link To Block"
            >

            </textarea>
            {/* <button style={{width: '35px', backgroundColor: '#303030', color: 'red', borderRadius: 0, border: "none", outline: "none", marginStart: 20}}>
            
            </button> */}
            <button style={{width: '70px', backgroundColor: '#282828', color: '#999', borderRadius: 0, border: "none", outline: "none", marginStart: 20}}>
            Delete
            </button>
        </div>
    );
}  