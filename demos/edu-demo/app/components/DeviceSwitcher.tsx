import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import getChimeContext from '../context/getChimeContext';
import styles from './DeviceSwitcher.css';
import { ChimeSdkWrapper } from './ChimeProvider';
import Select from 'react-select';
const cx = classNames.bind(styles);

export default function DeviceSwitcher() {
  const chime = useContext(getChimeContext()) as ChimeSdkWrapper;
  const [deviceSwitcherState, setDeviceUpdated] = useState({
    currentAudioInputDevice: chime.currentAudioInputDevice,
    currentAudioOutputDevice: chime.currentAudioOutputDevice,
    currentVideoInputDevice: chime.currentVideoInputDevice,
    audioInputDevices: chime.audioInputDevices,
    audioOutputDevices: chime.audioOutputDevices,
    videoInputDevices: chime.videoInputDevices,
  });

  useEffect(() => {
    const devicesUpdatedCallback = () => {
      setDeviceUpdated({
        currentAudioInputDevice: chime.currentAudioInputDevice,
        currentAudioOutputDevice: chime.currentAudioOutputDevice,
        currentVideoInputDevice: chime.currentVideoInputDevice,
        audioInputDevices: chime.audioInputDevices,
        audioOutputDevices: chime.audioOutputDevices,
        videoInputDevices: chime.videoInputDevices,
      });
    };
    
    chime.subscribeToDevicesUpdated(
      devicesUpdatedCallback);
    return () => {
      chime.unsubscribeFromDevicesUpdated(
        devicesUpdatedCallback);
    };
  }, []);

  return (
    <div>
      <Select className={cx('deviceList')} 
        options={deviceSwitcherState.audioInputDevices} 
        isSearchable='false' 
        value={deviceSwitcherState.currentAudioInputDevice}
        defaultValue={deviceSwitcherState.currentAudioInputDevice} 
        onChange={(selectedOption: any)=>{
          chime.audioVideo.chooseAudioInputDevice(selectedOption.value);
        }}>
      </Select>
      <Select className={cx('deviceList')} 
        options={deviceSwitcherState.audioOutputDevices} 
        isSearchable='false' 
        value={deviceSwitcherState.currentAudioOutputDevice}
        defaultValue={deviceSwitcherState.currentAudioOutputDevice}
        onChange={(selectedOption: any)=>{
          chime.audioVideo.chooseAudioOutputDevice(selectedOption.value);
        }}>
      </Select>
      <Select className={cx('deviceList')}
        options={deviceSwitcherState.videoInputDevices}
        isSearchable='false'
        value={deviceSwitcherState.currentVideoInputDevice}
        defaultValue={deviceSwitcherState.currentVideoInputDevice}
        onChange={(selectedOption: any)=>{
          chime.audioVideo.chooseVideoInputDevice(selectedOption.value);
        }}>
      </Select>
    </div>);
}