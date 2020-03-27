import {
  AudioVideoFacade,
  AudioVideoObserver,
  ConsoleLogger,
  ContentShareObserver,
  DefaultDeviceController,
  DefaultDOMWebSocketFactory,
  DefaultMeetingSession,
  DefaultModality,
  DefaultPromisedWebSocketFactory,
  DeviceChangeObserver,
  FullJitterBackoff,
  LogLevel,
  MeetingSession,
  MeetingSessionConfiguration,
  ReconnectingPromisedWebSocket
} from 'amazon-chime-sdk-js';
import React from 'react';

import getChimeContext from '../context/getChimeContext';
import DeviceType from '../types/DeviceType';
import FullDeviceInfoType from '../types/FullDeviceInfoType';
import MessageType from '../types/MessageType';
import RosterType from '../types/RosterType';
import getBaseUrl from '../utils/getBaseUrl';
import getMessagingWssUrl from '../utils/getMessagingWssUrl';

export class ChimeSdkWrapper
  implements AudioVideoObserver, ContentShareObserver, DeviceChangeObserver {
  private static WEB_SOCKET_TIMEOUT_MS = 10000;

  meetingSession: MeetingSession;

  audioVideo: AudioVideoFacade;

  title: string;

  name: string;

  region: string;

  currentAudioInputDevice: DeviceType = {};

  currentAudioOutputDevice: DeviceType = {};

  currentVideoInputDevice: DeviceType = {};

  audioInputDevices: DeviceType[] = [];

  audioOutputDevices: DeviceType[] = [];

  videoInputDevices: DeviceType[] = [];

  devicesUpdatedCallbacks: ((fullDeviceInfo: FullDeviceInfoType) => void)[] = [];

  roster: RosterType = {};

  rosterUpdateCallbacks: ((roster: RosterType) => void)[] = [];

  configuration: MeetingSessionConfiguration = null;

  messagingSocket: ReconnectingPromisedWebSocket = null;

  messageUpdateCallbacks: ((message: MessageType) => void)[] = [];

  private initializeSdkWrapper = () => {
    this.meetingSession = null;
    this.audioVideo = null;
    this.title = null;
    this.name = null;
    this.region = null;
    this.currentAudioInputDevice = {};
    this.currentAudioOutputDevice = {};
    this.currentVideoInputDevice = {};
    this.audioInputDevices = [];
    this.audioOutputDevices = [];
    this.videoInputDevices = [];
    this.roster = {};
    this.rosterUpdateCallbacks = [];
    this.configuration = null;
    this.messagingSocket = null;
    this.messageUpdateCallbacks = [];
  };

  // eslint-disable-next-line
  createRoom = async (title: string, name: string, region: string, role: string): Promise<any> => {
    const response = await fetch(
      `${getBaseUrl()}join?title=${encodeURIComponent(
        title
      )}&name=${encodeURIComponent(name)}&region=${encodeURIComponent(region)}&role=${encodeURIComponent(role)}`,
      {
        method: 'POST'
      }
    );
    const json = await response.json();
    if (json.error) {
      throw new Error(`Server error: ${json.error}`);
    }

    const { JoinInfo } = json;
    if (!JoinInfo) {
      throw new Error('Classroom does not exist');
    }
    this.configuration = new MeetingSessionConfiguration(
      JoinInfo.Meeting,
      JoinInfo.Attendee
    );
    await this.initializeMeetingSession(this.configuration);

    this.title = title;
    this.name = name;
    this.region = region;
  };

  initializeMeetingSession = async (
    configuration: MeetingSessionConfiguration
  ): Promise<void> => {
    const logger = new ConsoleLogger('SDK', LogLevel.DEBUG);
    const deviceController = new DefaultDeviceController(logger);
    this.meetingSession = new DefaultMeetingSession(
      configuration,
      logger,
      deviceController
    );
    this.audioVideo = this.meetingSession.audioVideo;

    this.audioInputDevices = [];
    (await this.audioVideo.listAudioInputDevices()).forEach(
      (mediaDeviceInfo: MediaDeviceInfo) => {
        this.audioInputDevices.push({
          label: mediaDeviceInfo.label,
          value: mediaDeviceInfo.deviceId
        });
      }
    );
    this.audioOutputDevices = [];
    (await this.audioVideo.listAudioOutputDevices()).forEach(
      (mediaDeviceInfo: MediaDeviceInfo) => {
        this.audioOutputDevices.push({
          label: mediaDeviceInfo.label,
          value: mediaDeviceInfo.deviceId
        });
      }
    );
    this.videoInputDevices = [];
    (await this.audioVideo.listVideoInputDevices()).forEach(
      (mediaDeviceInfo: MediaDeviceInfo) => {
        this.videoInputDevices.push({
          label: mediaDeviceInfo.label,
          value: mediaDeviceInfo.deviceId
        });
      }
    );
    this.publishDevicesUpdated();
    this.audioVideo.addDeviceChangeObserver(this);

    this.audioVideo.realtimeSubscribeToAttendeeIdPresence(
      (presentAttendeeId: string, present: boolean): void => {
        if (!present) {
          delete this.roster[presentAttendeeId];
          this.publishRosterUpdate();
          return;
        }

        this.audioVideo.realtimeSubscribeToVolumeIndicator(
          presentAttendeeId,
          async (
            attendeeId: string,
            volume: number | null,
            muted: boolean | null,
            signalStrength: number | null
          ) => {
            const baseAttendeeId = new DefaultModality(attendeeId).base();
            if (baseAttendeeId !== attendeeId) {
              if (
                baseAttendeeId !==
                this.meetingSession.configuration.credentials.attendeeId
              ) {
                // TODO: stop my content share
              }
              return;
            }

            if (!this.roster[attendeeId]) {
              this.roster[attendeeId] = { name: '' };
            }
            if (volume !== null) {
              this.roster[attendeeId].volume = Math.round(volume * 100);
            }
            if (muted !== null) {
              this.roster[attendeeId].muted = muted;
            }
            if (signalStrength !== null) {
              this.roster[attendeeId].signalStrength = Math.round(
                signalStrength * 100
              );
            }
            if (!this.roster[attendeeId].name) {
              const response = await fetch(
                `${getBaseUrl()}attendee?title=${encodeURIComponent(
                  this.title
                )}&attendee=${encodeURIComponent(attendeeId)}`
              );
              const json = await response.json();
              this.roster[attendeeId].name = json.AttendeeInfo.Name || '';
            }
            this.publishRosterUpdate();
          }
        );
      }
    );
  };

  joinRoom = async (element: HTMLAudioElement): Promise<void> => {
    window.addEventListener(
      'unhandledrejection',
      (event: PromiseRejectionEvent) => {
        this.logError(event.reason);
      }
    );

    const audioInputs = await this.audioVideo.listAudioInputDevices();
    if (audioInputs && audioInputs.length > 0 && audioInputs[0].deviceId) {
      this.currentAudioInputDevice = {
        label: audioInputs[0].label,
        value: audioInputs[0].deviceId
      };
      await this.audioVideo.chooseAudioInputDevice(audioInputs[0].deviceId);
    }

    const audioOutputs = await this.audioVideo.listAudioOutputDevices();
    if (audioOutputs && audioOutputs.length > 0 && audioOutputs[0].deviceId) {
      this.currentAudioOutputDevice = {
        label: audioOutputs[0].label,
        value: audioOutputs[0].deviceId
      };
      await this.audioVideo.chooseAudioOutputDevice(audioOutputs[0].deviceId);
    }

    const videoInputs = await this.audioVideo.listVideoInputDevices();
    if (videoInputs && videoInputs.length > 0 && videoInputs[0].deviceId) {
      this.currentVideoInputDevice = {
        label: videoInputs[0].label,
        value: videoInputs[0].deviceId
      };
      await this.audioVideo.chooseVideoInputDevice(videoInputs[0].deviceId);
    }

    this.publishDevicesUpdated();

    this.audioVideo.bindAudioElement(element);
    this.audioVideo.start();
  };

  joinRoomMessaging = async (): Promise<void> => {
    const messagingUrl = `${getMessagingWssUrl()}?MeetingId=${
      this.configuration.meetingId
    }&AttendeeId=${this.configuration.credentials.attendeeId}&JoinToken=${
      this.configuration.credentials.joinToken
    }`;
    this.messagingSocket = new ReconnectingPromisedWebSocket(
      messagingUrl,
      [],
      'arraybuffer',
      new DefaultPromisedWebSocketFactory(new DefaultDOMWebSocketFactory()),
      new FullJitterBackoff(1000, 0, 10000)
    );

    await this.messagingSocket.open(ChimeSdkWrapper.WEB_SOCKET_TIMEOUT_MS);

    this.messagingSocket.addEventListener('message', event => {
      try {
        const data = JSON.parse(event.data);
        const { attendeeId } = data.payload;

        let name;
        if (this.roster[attendeeId]) {
          name = this.roster[attendeeId].name;
        }

        this.publishMessageUpdate({
          type: data.type,
          payload: data.payload,
          timestampMs: Date.now(),
          name
        });
      } catch (error) {
        this.logError(error);
      }
    });
  };

  // eslint-disable-next-line
  sendMessage = (type: string, payload: any) => {
    if (!this.messagingSocket) {
      return;
    }
    const message = {
      message: 'sendmessage',
      data: JSON.stringify({ type, payload })
    };
    this.messagingSocket.send(JSON.stringify(message));
  };

  leaveRoom = async (end: boolean): Promise<void> => {
    try {
      this.audioVideo.stop();
      await this.leaveRoomMessaging();

      // eslint-disable-next-line
      if (end) {
        await fetch(
          `${getBaseUrl()}end?title=${encodeURIComponent(this.title)}`,
          {
            method: 'POST'
          }
        );
      }
    } catch (error) {
      this.logError(error);
    } finally {
      this.initializeSdkWrapper();
    }
  };

  leaveRoomMessaging = async (): Promise<void> => {
    await this.messagingSocket.close(ChimeSdkWrapper.WEB_SOCKET_TIMEOUT_MS);
  };

  /**
   * ====================================================================
   * Device
   * ====================================================================
   */

  chooseAudioInputDevice = async (device: DeviceType) => {
    try {
      await this.audioVideo.chooseAudioInputDevice(device.value);
      this.currentAudioInputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  chooseAudioOutputDevice = async (device: DeviceType) => {
    try {
      await this.audioVideo.chooseAudioOutputDevice(device.value);
      this.currentAudioOutputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  chooseVideoInputDevice = async (device: DeviceType) => {
    try {
      await this.audioVideo.chooseVideoInputDevice(device.value);
      this.currentVideoInputDevice = device;
    } catch (error) {
      this.logError(error);
    }
  };

  /**
   * ====================================================================
   * Observer methods
   * ====================================================================
   */

  audioInputsChanged(freshAudioInputDeviceList: MediaDeviceInfo[]): void {
    let hasCurrentDevice: boolean = false;
    this.audioInputDevices = [];
    freshAudioInputDeviceList.forEach((mediaDeviceInfo: MediaDeviceInfo) => {
      if (this.currentAudioInputDevice && mediaDeviceInfo.deviceId === this.currentAudioInputDevice.value) {
        hasCurrentDevice = true;
      }
      this.audioInputDevices.push({
        label: mediaDeviceInfo.label,
        value: mediaDeviceInfo.deviceId
      });
    });
    if (!hasCurrentDevice) {
      this.currentAudioInputDevice = this.audioInputDevices.length > 0 ? this.audioInputDevices[0] : null;
    }
    this.publishDevicesUpdated();
  }

  audioOutputsChanged(freshAudioOutputDeviceList: MediaDeviceInfo[]): void {
    let hasCurrentDevice: boolean = false;
    this.audioOutputDevices = [];
    freshAudioOutputDeviceList.forEach((mediaDeviceInfo: MediaDeviceInfo) => {
      if (this.currentAudioOutputDevice && mediaDeviceInfo.deviceId === this.currentAudioOutputDevice.value) {
        hasCurrentDevice = true;
      }
      this.audioOutputDevices.push({
        label: mediaDeviceInfo.label,
        value: mediaDeviceInfo.deviceId
      });
    });
    if (!hasCurrentDevice) {
      this.currentAudioOutputDevice = this.audioOutputDevices.length > 0 ? this.audioOutputDevices[0] : null;
    }
    this.publishDevicesUpdated();
  }

  videoInputsChanged(freshVideoInputDeviceList: MediaDeviceInfo[]): void {
    let hasCurrentDevice: boolean = false;
    this.videoInputDevices = [];
    freshVideoInputDeviceList.forEach((mediaDeviceInfo: MediaDeviceInfo) => {
      if (this.currentVideoInputDevice && mediaDeviceInfo.deviceId === this.currentVideoInputDevice.value) {
        hasCurrentDevice = true;
      }
      this.videoInputDevices.push({
        label: mediaDeviceInfo.label,
        value: mediaDeviceInfo.deviceId
      });
    });
    if (!hasCurrentDevice) {
      this.currentVideoInputDevice = this.videoInputDevices.length > 0 ? this.videoInputDevices[0] : null;
    }
    this.publishDevicesUpdated();
  }

  /**
   * ====================================================================
   * Subscribe and unsubscribe from SDK events
   * ====================================================================
   */

  subscribeToDevicesUpdated = (callback: () => void) => {
    this.devicesUpdatedCallbacks.push(callback);
  };

  unsubscribeFromDevicesUpdated = (callback: () => void) => {
    const index = this.devicesUpdatedCallbacks.indexOf(callback);
    if (index !== -1) {
      this.devicesUpdatedCallbacks.splice(index, 1);
    }
  };

  private publishDevicesUpdated = () => {
    this.devicesUpdatedCallbacks.forEach((callback: (fullDeviceInfo: FullDeviceInfoType) => void) => {
      callback({
        currentAudioInputDevice: this.currentAudioInputDevice,
        currentAudioOutputDevice: this.currentAudioOutputDevice,
        currentVideoInputDevice: this.currentVideoInputDevice,
        audioInputDevices: this.audioInputDevices,
        audioOutputDevices: this.audioOutputDevices,
        videoInputDevices: this.videoInputDevices
      });
    });
  };

  subscribeToRosterUpdate = (callback: (roster: RosterType) => void) => {
    this.rosterUpdateCallbacks.push(callback);
  };

  unsubscribeFromRosterUpdate = (callback: (roster: RosterType) => void) => {
    const index = this.rosterUpdateCallbacks.indexOf(callback);
    if (index !== -1) {
      this.rosterUpdateCallbacks.splice(index, 1);
    }
  };

  private publishRosterUpdate = () => {
    for (let i = 0; i < this.rosterUpdateCallbacks.length; i += 1) {
      const callback = this.rosterUpdateCallbacks[i];
      callback(this.roster);
    }
  };

  subscribeToMessageUpdate = (callback: (message: MessageType) => void) => {
    this.messageUpdateCallbacks.push(callback);
  };

  unsubscribeFromMessageUpdate = (callback: (message: MessageType) => void) => {
    const index = this.messageUpdateCallbacks.indexOf(callback);
    if (index !== -1) {
      this.messageUpdateCallbacks.splice(index, 1);
    }
  };

  private publishMessageUpdate = (message: MessageType) => {
    for (let i = 0; i < this.messageUpdateCallbacks.length; i += 1) {
      const callback = this.messageUpdateCallbacks[i];
      callback(message);
    }
  };

  /**
   * ====================================================================
   * Utilities
   * ====================================================================
   */
  private logError = (error: Error) => {
    // eslint-disable-next-line
    console.error(error);
  };
}

type Props = {
  children: ReactNode;
};

export default function ChimeProvider(props: Props) {
  const { children } = props;
  const chimeSdkWrapper = new ChimeSdkWrapper();
  const ChimeContext = getChimeContext();
  return (
    <ChimeContext.Provider value={chimeSdkWrapper}>
      {children}
    </ChimeContext.Provider>
  );
}
