import classNames from 'classnames/bind';
import React, { useContext } from 'react';

import getRosterContext from '../context/getRosterContext';
import styles from './ScreenShareHeader.css';

const cx = classNames.bind(styles);

type Props = {
  onClickStopButton: () => void;
};

export default function ScreenShareHeader(props: Props) {
  const roster = useContext(getRosterContext());
  const { onClickStopButton } = props;
  return (
    <div className={cx('screenShareHeader')}>
      <button
        className={cx('stopButton')}
        type="button"
        onClick={onClickStopButton}
      >
        Stop sharing
      </button>
      <div className={cx('description')}>
        {roster ? `${Object.keys(roster).length - 1} online` : ` `}
      </div>
    </div>
  );
}
