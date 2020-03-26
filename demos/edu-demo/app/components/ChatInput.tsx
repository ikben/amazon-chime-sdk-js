import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';

import getChimeContext from '../context/getChimeContext';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';
import styles from './ChatInput.css';
import useFocusMode from '../hooks/useFocusMode';

const cx = classNames.bind(styles);

let timeoutId: number;

export default React.memo(function ChatInput() {
  const chime = useContext(getChimeContext());
  const [state] = useContext(getUIStateContext());
  const [inputText, setInputText] = useState('');
  const [raised, setRaised] = useState(false);
  const focusMode = useFocusMode();

  useEffect(() => {
    if (!chime.configuration) {
      return;
    }

    chime.sendMessage(raised ? 'raise-hand' : 'dismiss-hand', {
      attendeeId: chime.configuration.credentials.attendeeId
    });

    if (raised) {
      timeoutId = setTimeout(() => {
        chime.sendMessage('dismiss-hand', {
          attendeeId: chime.configuration.credentials.attendeeId
        });
        setRaised(false);
      }, 10000);
    } else {
      clearTimeout(timeoutId);
    }
  }, [raised, chime.configuration]);

  return (
    <div className={cx('chatInput')}>
      <form
        onSubmit={event => {
          event.preventDefault();
        }}
        className={cx('form')}
      >
        <input
          className={cx('input')}
          value={inputText}
          onChange={event => {
            setInputText(event.target.value);
          }}
          onKeyUp={event => {
            event.preventDefault();
            if (focusMode && state.classMode === ClassMode.Student) {
              return;
            }
            if (event.keyCode === 13) {
              const sendingMessage = inputText.trim();
              if (sendingMessage !== '') {
                chime.sendMessage('chat-message', {
                  attendeeId: chime.configuration.credentials.attendeeId,
                  message: sendingMessage
                });
              }
              setInputText('');
            }
          }}
          placeholder="Type a chat message"
        />
        {state.classMode === ClassMode.Student && (
          <button
            type="button"
            className={cx('raiseHandButton', {
              raised
            })}
            onClick={() => {
              setRaised(!raised);
            }}
          >
            <span role="img" aria-label="Raise hand">
              ✋
            </span>
          </button>
        )}
      </form>
    </div>
  );
});
