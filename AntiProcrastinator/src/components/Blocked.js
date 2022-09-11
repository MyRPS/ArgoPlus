import { useState } from "react";
import Divider from "./Divider";

export default function Blocked({
  link = "",
  quote = "",
  time = "",
  deleteCallback = null
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ paddingBottom: 5 }}>
      <div
        className="Blocked"
        style={{
          display: "flex",
          height: "32px",
          width: "100%",
          backgroundColor: "#232323",
        }}
      >
        <textarea
          style={{
            width: "100%",
            backgroundColor: "#303030",
            color: "#999",
            borderBottomLeftRadius: open ? 0 : 5,
            borderTopLeftRadius: 5,
            border: "none",
            outline: "none",
            paddingLeft: 10,
            resize: "none",
          }}
          value={link}
          readOnly
        />
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "40px",
            backgroundColor: "#282828",
            color: "#999",
            borderTopRightRadius: 5,
            borderBottomRightRadius: open ? 0 : 5,
            border: "none",
            outline: "none",
            marginStart: 20,
          }}
        >
          {open ? "-" : "+"}
        </button>
      </div>
      {open && (
        <center
          style={{
            backgroundColor: "#303030",
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            padding: 15,
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%" }}>
            {quote && (
              <>
                <Divider text="Quote" />
                <p style={{ color: "#999" }}> {quote}</p>
              </>
            )}
            {time && (
              <>
                <Divider text="Limit" />
                <p style={{ color: "#999" }}>{time} minutes / day</p>
              </>
            )}
            <button
              style={{
                bottom: -15,
                left: -30,
                color: "#faa",
                backgroundColor: "#CB4F4F",
                position: "relative",
                width: "325px",
                border: 0,
              }}
              onClick={() => {
                if (deleteCallback) deleteCallback();
                setOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </center>
      )}
    </div>
  );
}
