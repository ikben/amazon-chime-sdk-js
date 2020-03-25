import { VideoTileState } from 'amazon-chime-sdk-js';
import classNames from 'classnames/bind';
import React, { useContext, useEffect, useRef, useState } from 'react';

import getChimeContext from '../context/getChimeContext';
import styles from './LocalVideo.css';

const cx = classNames.bind(styles);

export default function LocalVideo() {
  const [enabled, setEnabled] = useState(false);
  const chime = useContext(getChimeContext());
  const videoElement = useRef(null);

  useEffect(() => {
    chime.audioVideo.addObserver({
      videoTileDidUpdate: (tileState: VideoTileState): void => {
        if (!tileState.boundAttendeeId || !tileState.localTile) {
          return;
        }
        chime.audioVideo.bindVideoElement(
          tileState.tileId,
          videoElement.current
        );
        setEnabled(tileState.active);
      }
    });
  }, []);

  return (
    <div
      className={cx('localVideo', {
        enabled
      })}
    >
      <video muted ref={videoElement} className={cx('video')} />
    </div>
  );
}
