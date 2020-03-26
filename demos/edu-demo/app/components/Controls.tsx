import classNames from 'classnames/bind';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import routes from '../constants/routes.json';
import getChimeContext from '../context/getChimeContext';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';
import ViewMode from '../enums/ViewMode';
import styles from './Controls.css';
import Tooltip from './Tooltip';

const cx = classNames.bind(styles);

enum VideoStatus {
  Disabled,
  Loading,
  Enabled
}

type Props = {
  viewMode: ViewMode;
  onClickShareButton: () => void;
};

export default function Controls(props: Props) {
  const { viewMode, onClickShareButton } = props;
  const chime = useContext(getChimeContext());
  const [state] = useContext(getUIStateContext());
  const history = useHistory();
  const [muted, setMuted] = useState(false);
  const [focus, setFocus] = useState(false);
  const [videoStatus, setVideoStatus] = useState(VideoStatus.Disabled);
  chime.audioVideo.realtimeSubscribeToMuteAndUnmuteLocalAudio((localMuted: boolean) => {
    setMuted(localMuted);
  });
  return (
    <div
      className={cx('controls', {
        roomMode: viewMode === ViewMode.Room,
        screenShareMode: viewMode === ViewMode.ScreenShare,
        videoEnabled: videoStatus === VideoStatus.Enabled,
        audioMuted: muted
      })}
    >
      {state.classMode === ClassMode.Teacher && viewMode === ViewMode.Room && (
        <Tooltip placement="top" tooltip={focus ? 'Turn off focus' : 'Turn on focus'}>
          <button
            type="button"
            className={cx('focusButton', {
              enabled: focus
            })}
            onClick={() => {
              const newFocusState = !focus;
              chime.sendMessage('focus', {focus: newFocusState});
              chime.sendMessage('chat-message', {
                attendeeId: chime.configuration.credentials.attendeeId,
                message: newFocusState ? 'Focus on' : 'Focus off'
              });
              setFocus(newFocusState);
            }}
          >
            {focus ? (
              <i className="fas fa-street-view" />
            ) : (
              <i className="fas fa-street-view" />
            )}
          </button>
        </Tooltip>
      )}
      <Tooltip placement="top" tooltip={muted ? 'Unmute' : 'Mute'}>
        <button
          type="button"
          className={cx('muteButton', {
            enabled: !muted
          })}
          onClick={async () => {
            if (muted) {
              chime.audioVideo.realtimeUnmuteLocalAudio();
            } else {
              chime.audioVideo.realtimeMuteLocalAudio();
            }
            // Adds a slight delay to close the tooltip before rendering the updated text in it
            await new Promise(resolve => setTimeout(resolve, 10));
          }}
        >
          {muted ? (
            <i className="fas fa-microphone-slash" />
          ) : (
            <i className="fas fa-microphone" />
          )}
        </button>
      </Tooltip>
      <Tooltip
        placement="top"
        tooltip={
          videoStatus === VideoStatus.Disabled
            ? 'Turn on video'
            : 'Turn off video'
        }
      >
        <button
          type="button"
          className={cx('videoButton', {
            enabled: videoStatus === VideoStatus.Enabled
          })}
          onClick={async () => {
            // Adds a slight delay to close the tooltip before rendering the updated text in it
            await new Promise(resolve => setTimeout(resolve, 10));
            if (videoStatus === VideoStatus.Disabled) {
              setVideoStatus(VideoStatus.Loading);
              const videoInputs = await chime.audioVideo.listVideoInputDevices();
              await chime.audioVideo.chooseVideoInputDevice(
                videoInputs[0].deviceId
              );
              chime.audioVideo.startLocalVideoTile();
              setVideoStatus(VideoStatus.Enabled);
            } else if (videoStatus === VideoStatus.Enabled) {
              setVideoStatus(VideoStatus.Loading);
              chime.audioVideo.stopLocalVideoTile();
              setVideoStatus(VideoStatus.Disabled);
            }
          }}
        >
          {videoStatus === VideoStatus.Enabled ? (
            <i className="fas fa-video" />
          ) : (
            <i className="fas fa-video-slash" />
          )}
        </button>
      </Tooltip>
      {state.classMode === ClassMode.Teacher && viewMode === ViewMode.Room && (
        <Tooltip placement="top" tooltip="Share screen">
          <button
            type="button"
            className={cx('shareButton')}
            onClick={() => {
              onClickShareButton();
            }}
          >
            <i className="fas fa-desktop" />
          </button>
        </Tooltip>
      )}
      {viewMode === ViewMode.Room && (
        <Tooltip placement="top" tooltip={state.classMode === ClassMode.Teacher ? 'End classroom' : 'Leave classroom'}>
          <button
            type="button"
            className={cx('endButton')}
            onClick={() => {
              chime.leaveRoom(state.classMode === ClassMode.Teacher);
              chime.leaveRoomMessaging();
              history.push(routes.HOME);
            }}
          >
            <i className="fas fa-times" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
