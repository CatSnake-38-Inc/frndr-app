/**
 * ************************************
 *
 * @module  Chatroom.jsx
 * @author Evan and Rebecca
 * @date
 * @description render Chatroom
 *
 * ************************************
 */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const socket = io();

const Chatroom = (props) => {
  // console.log("chatroom rendered");
  // userMap will contain: // {_id : {_id, statusName, firstName, lastName, phoneNumber,email, username, location, statusname, picture}
  // const userMap = useSelector((state) => state.frndr.userMap);

 
  // use useState to create local state
  const [inputValue, setInputValue] = useState("");
  const [messages, addMessages] = useState([]);
  const [msgSent, addMsgSent] = useState(" ");
  const [ownMessage, changeOwnMessage] = useState([]);
  const [msgReceived, addMsgReceived] = useState("");
  const [lengthOfAddMessages, changeLengthOfAddMessages] = useState(1);
  const [maxLengthOfAddMessages, changeMaxLengthOfAddMessages] = useState(1);

  // listen for incoming messages and update state
  socket.on("chat message", (msg) => {
    // console.log("client-side chat message received: ", msg);
    if (messages[messages.length - 1] !== msg) {
      const newArray = [...messages];
      newArray.push(msg);
      addMsgReceived(newArray[newArray.length - 1]);
      addMessages(newArray);
      if (newArray.length > messages.length) {
        changeLengthOfAddMessages(newArray.length);
      }
      //   console.log("in socket on conditional");
    }
  });

  useEffect(() => {
    if (msgReceived === msgSent) {
      const newArray = [...ownMessage];
      if (newArray.length < messages.length) {
        newArray.push("ownMessage");
      }
      changeOwnMessage([...newArray]);
    } else {
      const newArray = [...ownMessage];
      if (newArray.length < messages.length) {
        newArray.push("notOwnMessage");
      }
      changeOwnMessage([...newArray]);
      //   console.log("ownMessage at end of useEffect: ", ownMessage);
    }
  }, [lengthOfAddMessages]);

  return (
    <>
      <div className="chatBox">
        <div
          className="exit"
          onClick={() => {
            document.querySelector('.chatBox').style.display = 'none';
          }}
        >x</div>
        
        <div id="messages">
          {messages.map((el, i) => (
            <p key={i} className={ownMessage[i]}>
              {el}
            </p>
          ))}
        </div>

        <div id="anchor"></div>

        <div className="input-button">
          <input
            id="input"
            type="text"
            name="input"
            value={inputValue}
            //   autoComplete="off"
            onChange={(e) => {
              setInputValue(e.target.value);
              //   console.log(inputValue);
            }}
          />
          <button
            onClick={(e) => {
              const msg = inputValue;
              socket.emit("chat message", msg);
              setInputValue("");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
            </svg>
          </button>
        </div>
      </div>

      <div
        className="open-chat"
        onClick={() => {
          document.querySelector('.chatBox').style.display = 'block';
        }}
      >
        Open chat
      </div>
    </>
  );
};

export default Chatroom;
