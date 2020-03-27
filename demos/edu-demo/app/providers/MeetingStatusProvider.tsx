import {
  MeetingSessionStatus,
  MeetingSessionStatusCode
} from 'amazon-chime-sdk-js';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import getChimeContext from '../context/getChimeContext';
import getMeetingStatusContext from '../context/getMeetingStatusContext';
import getUIStateContext from '../context/getUIStateContext';
import MeetingStatus from '../enums/MeetingStatus';
import ClassMode from '../enums/ClassMode';

type Props = {
  children: ReactNode;
};

export default function MeetingStatusProvider(props: Props) {
  const MeetingStatusContext = getMeetingStatusContext();
  const { children } = props;
  const chime = useContext(getChimeContext());
  const [meetingStatus, setMeetingStatus] = useState({
    meetingStatus: MeetingStatus.Loading
  });
  const [state] = useContext(getUIStateContext());
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const audioElement = useRef(null);

  useEffect(() => {
    const start = async () => {
      try {
        await chime.createRoom(
          query.get('title'),
          query.get('name'),
          query.get('region'),
          state.classMode === ClassMode.Student ? 'student' : 'teacher',
        );

        setMeetingStatus({
          meetingStatus: MeetingStatus.Succeeded
        });

        chime.audioVideo.addObserver({
          audioVideoDidStop: (sessionStatus: MeetingSessionStatus): void => {
            if (
              sessionStatus.statusCode() ===
              MeetingSessionStatusCode.AudioCallEnded
            ) {
              history.push('/');
            }
          }
        });

        await chime.joinRoom(audioElement.current);
      } catch (error) {
        // eslint-disable-next-line
        console.error(error);
        setMeetingStatus({
          meetingStatus: MeetingStatus.Failed,
          errorMessage: error.message
        });
      }
    };
    start();
  }, []);

  return (
    <MeetingStatusContext.Provider value={meetingStatus}>
      {/* eslint-disable-next-line */}
      <audio ref={audioElement} style={{ display: 'none' }} />
      {children}
    </MeetingStatusContext.Provider>
  );
}
