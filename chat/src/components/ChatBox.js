import React, { useState, useEffect } from 'react';
import socket from '../socket';
import MessagePanel from './MessagePanel';
// import User from "./User"

function ChatBox(props) {
   const [userMessages, setUserMessages] = useState([]);

   const [destUserData, setDestUserData] = useState({});

   // useEffect(() => {
   //    socket.on('private message', ({ content, from, to }) => {
   //       onReceiveMessage(content, from, destUserData.userID)
   //    });
   // }, []);

   useEffect(() => {
      socket.on('connect', () => {
         console.log(props.username);
         socket.emit('user is online', props.destUsername);
      });

      return function cleanup() {
         socket.off('connect');
         socket.off('user online');
         socket.off('private message');
      }
   }, []);

   useEffect(() => {
      socket.on('private message', ({ content, from, to }) => {
         onReceiveMessage(content, from, destUserData.userID)
      });

      socket.on("user online", (userData) => {
			if(userData) {
				setDestUserData(userData)
			}
		});

   }, [destUserData.userID])

   useEffect(() => {
      const timer = setInterval(() => {
         socket.emit('user is online', props.destUsername);
      }, 5000);

      return function cleanup() {
         clearInterval(timer);
      };
   }, [props.destUsername]);

   function onMessage(content, to) {
      console.log(`Mensagem ${content} enviada para ${to}`);
      socket.emit('private message', {
         content,
         to,
      });
      setUserMessages(userMessages => [
         ...userMessages,
         {
            content,
            fromSelf: true,
         },
      ]);
   }

   function onReceiveMessage(content, from, destUserId) {
      console.log(from, destUserId)
      if (from == destUserData.userID) {
         setUserMessages(userMessages => [
            ...userMessages,
            {
               content,
               fromSelf: false,
            },
         ]);
      };
   }

   return (
      <div>
         <p>
            UserId: {destUserData.userID}     Username: {props.destUsername}{' '}
            {destUserData.connected ? '(ONLINE)' : '(OFFLINE)'}
         </p>
         <MessagePanel
            username={props.username}
            destUsername={props.destUsername}
            destUserData={destUserData}
            userMessages={userMessages}
            onMessage={onMessage}
         ></MessagePanel>
      </div>
   );
}

export default ChatBox;