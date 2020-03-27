import { useContext, useEffect, useState } from 'react';
import FullDeviceInfoType from '../types/FullDeviceInfoType';

import getChimeContext from '../context/getChimeContext';

export default function useDevices() {
  const chime = useContext(getChimeContext());
  const [deviceSwitcherState, setDeviceUpdated] = useState({
    currentAudioInputDevice: chime.currentAudioInputDevice,
    currentAudioOutputDevice: chime.currentAudioOutputDevice,
    currentVideoInputDevice: chime.currentVideoInputDevice,
    audioInputDevices: chime.audioInputDevices,
    audioOutputDevices: chime.audioOutputDevices,
    videoInputDevices: chime.videoInputDevices
  });
  useEffect(() => {
    const devicesUpdatedCallback = (fullDeviceInfo: FullDeviceInfoType) => {
      setDeviceUpdated({
        ...fullDeviceInfo
      });
    };

    chime.subscribeToDevicesUpdated(devicesUpdatedCallback);
    return () => {
      chime.unsubscribeFromDevicesUpdated(devicesUpdatedCallback);
    };
  }, []);
  return deviceSwitcherState;
}
