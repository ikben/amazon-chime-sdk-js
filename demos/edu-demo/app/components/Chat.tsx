import classNames from 'classnames/bind';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';

import getChimeContext from '../context/getChimeContext';
import styles from './Chat.css';
import ChatInput from './ChatInput';

const cx = classNames.bind(styles);

export default function Chat() {
  const chime = useContext(getChimeContext());
  const [messages, setMessages] = useState([]);
  const bottomElement = useRef(null);

  useEffect(() => {
    const joinRoomMessaging = async () => {
      await chime.joinRoomMessaging();
    };
    joinRoomMessaging();
  }, []);

  useEffect(() => {
    const realTimeMessages = [];
    const callback = message => {
      if (
        message.name &&
        (message.type === 'chat-message' || message.type === 'raise-hand')
      ) {
        realTimeMessages.push(message);
        setMessages(realTimeMessages.slice());
      }
    };
    chime.subscribeToMessageUpdate(callback);
    return () => {
      chime.unsubscribeFromMessageUpdate(callback);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      bottomElement.current.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }, [messages]);

  return (
    <div className={cx('chat')}>
      <div className={cx('messages')}>
        {messages.map(message => {
          let messageString;
          if (message.type === 'chat-message') {
            messageString = message.payload.message;
          } else if (message.type === 'raise-hand') {
            messageString = `✋`;
          }

          return (
            <div
              key={message.timestampMs}
              className={cx('messageWrapper', {
                raiseHand: message.type === 'raise-hand'
              })}
            >
              <div className={cx('senderWrapper')}>
                <div className={cx('senderName')}>{message.name}</div>
                <div className={cx('date')}>
                  {moment(message.timestampMs).format('h:mm A')}
                </div>
              </div>
              <div className={cx('message')}>{messageString}</div>
            </div>
          );
        })}
        <div className="bottom" ref={bottomElement} />
      </div>
      <div className={cx('chatInput')}>
        <ChatInput />
      </div>
    </div>
  );
}
