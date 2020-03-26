import DeviceType from './DeviceType';

type FullDeviceInfoType = {
  currentAudioInputDevice: DeviceType,
  currentAudioOutputDevice: DeviceType,
  currentVideoInputDevice: DeviceType,
  audioInputDevices: DeviceType[],
  audioOutputDevices: DeviceType[],
  videoInputDevices: DeviceType[]
};

export default FullDeviceInfoType;
