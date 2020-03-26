import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';

import getChimeContext from '../context/getChimeContext';
import styles from './DeviceSwitcher.css';

const cx = classNames.bind(styles);

export default function DeviceSwitcher() {
  const chime = useContext(getChimeContext()) as ChimeSdkWrapper;
  const [deviceSwitcherState, setDeviceUpdated] = useState({
    currentAudioInputDevice: chime.currentAudioInputDevice,
    currentAudioOutputDevice: chime.currentAudioOutputDevice,
    currentVideoInputDevice: chime.currentVideoInputDevice,
    audioInputDevices: chime.audioInputDevices,
    audioOutputDevices: chime.audioOutputDevices,
    videoInputDevices: chime.videoInputDevices
  });

  useEffect(() => {
    const devicesUpdatedCallback = () => {
      setDeviceUpdated({
        currentAudioInputDevice: chime.currentAudioInputDevice,
        currentAudioOutputDevice: chime.currentAudioOutputDevice,
        currentVideoInputDevice: chime.currentVideoInputDevice,
        audioInputDevices: chime.audioInputDevices,
        audioOutputDevices: chime.audioOutputDevices,
        videoInputDevices: chime.videoInputDevices
      });
    };

    chime.subscribeToDevicesUpdated(devicesUpdatedCallback);
    return () => {
      chime.unsubscribeFromDevicesUpdated(devicesUpdatedCallback);
    };
  }, []);

  return (
    <div className={cx('deviceList')}>
      <Select
        className={cx('selectContainer')}
        classNamePrefix={cx('select')}
        value={deviceSwitcherState.currentAudioInputDevice}
        options={deviceSwitcherState.audioInputDevices}
        isSearchable={false}
        defaultValue={deviceSwitcherState.currentAudioInputDevice}
        onChange={(selectedOption: { value: string }) => {
          chime.audioVideo.chooseAudioInputDevice(selectedOption.value);
          setDeviceUpdated({
            ...deviceSwitcherState,
            currentAudioInputDevice: selectedOption
          });
        }}
      />
      <Select
        className={cx('selectContainer')}
        classNamePrefix={cx('select')}
        value={deviceSwitcherState.currentAudioOutputDevice}
        options={deviceSwitcherState.audioOutputDevices}
        isSearchable={false}
        defaultValue={deviceSwitcherState.currentAudioOutputDevice}
        onChange={(selectedOption: { value: string }) => {
          chime.audioVideo.chooseAudioOutputDevice(selectedOption.value);
          setDeviceUpdated({
            ...deviceSwitcherState,
            currentAudioOutputDevice: selectedOption
          });
        }}
      />
      <Select
        className={cx('selectContainer')}
        classNamePrefix={cx('select')}
        value={deviceSwitcherState.currentVideoInputDevice}
        options={deviceSwitcherState.videoInputDevices}
        isSearchable={false}
        defaultValue={deviceSwitcherState.currentVideoInputDevice}
        onChange={(selectedOption: { value: string }) => {
          chime.audioVideo.chooseVideoInputDevice(selectedOption.value);
          setDeviceUpdated({
            ...deviceSwitcherState,
            currentVideoInputDevice: selectedOption
          });
        }}
      />
    </div>
  );
}
