import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';

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
      <Dropdown
        className={cx('dropdown')}
        controlClassName={cx('control')}
        placeholderClassName={cx('placeholder')}
        menuClassName={cx('menu')}
        arrowClassName={cx('arrow')}
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
        placeholder="Select a device"
      />
      <Dropdown
        className={cx('dropdown')}
        controlClassName={cx('control')}
        placeholderClassName={cx('placeholder')}
        menuClassName={cx('menu')}
        arrowClassName={cx('arrow')}
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
        placeholder="Select a device"
      />
      <Dropdown
        className={cx('dropdown')}
        controlClassName={cx('control')}
        placeholderClassName={cx('placeholder')}
        menuClassName={cx('menu')}
        arrowClassName={cx('arrow')}
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
        placeholder="Select a device"
      />
    </div>
  );
}
