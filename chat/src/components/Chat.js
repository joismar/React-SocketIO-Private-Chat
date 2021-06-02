import React, { useState, useEffect } from 'react';
import socket from '../socket';
import MessagePanel from './MessagePanel';
// import User from "./User"

function Chat(props) {
   const [userMessages, setUserMessages] = useState([]);

   const [destUserData, setDestUserData] = useState({});

   const [onReceived, setOnReceived] = useState(true);

   // useEffect(() => {
   //    socket.on('private message', ({ content, from, to }) => {
   //       if (onReceived) {
   //          setOnReceived(false);
   //          onReceiveMessage(content, from);
   //       }
   //    });

   //    // console.log(userMessages)

   //    return () => {
   //       setOnReceived(true);
   //    };
   // }, [userMessages]);

   useEffect(() => {
      socket.on('private message', ({ content, from, to }) => {
         console.log(userMessages)
         if (from != socket.userID) {
            setUserMessages(userMessages => [
               ...userMessages,
               {
                  content,
                  fromSelf: false,
               },
            ]);
            // console.log('PASSOU AQUI')
            // onReceiveMessage(content, from);
         };
      });
   }, []);

   useEffect(() => {
      socket.on('connect', () => {
         console.log(props.username);
         socket.emit('user is online', props.destUsername);
      });

      socket.on("user online", (userData) => {
			if(userData) {
				setDestUserData(userData)
			}
		})

      return function cleanup() {
         socket.off('connect');
         socket.off('user online');
         socket.off('private message');
      }
   }, [props.destUsername]);

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
      setUserMessages([
         ...userMessages,
         {
            content,
            fromSelf: true,
         },
      ]);
   }

   function onReceiveMessage(content, from) {
      console.log(`Mensagem ${content} recebida de ${from}`);
      console.log('Mensagens antes: ', userMessages)
      setUserMessages([
         ...userMessages,
         {
            content,
            fromSelf: false,
         },
      ]);
      console.log('Mensagens depois: ', userMessages)
   }

   return (
      <div>
         <p>
            UserId: {destUserData.userID}     Username: {props.destUsername}{' '}
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

export default Chat;
