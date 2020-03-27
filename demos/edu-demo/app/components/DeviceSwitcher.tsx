import classNames from 'classnames/bind';
import React, { useContext, useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import { useIntl } from 'react-intl';

import DeviceType from '../types/DeviceType';
import getChimeContext from '../context/getChimeContext';
import useDevices from '../hooks/useDevices';
import styles from './DeviceSwitcher.css';

const cx = classNames.bind(styles);

export default function DeviceSwitcher() {
  const chime = useContext(getChimeContext());
  const intl = useIntl();
  const deviceSwitcherState = useDevices();

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
        disabled={!deviceSwitcherState.audioInputDevices || !deviceSwitcherState.audioInputDevices.length}
        isSearchable={false}
        onChange={async (selectedDevice: DeviceType) => {
          await chime.chooseAudioInputDevice(selectedDevice);
        }}
        placeholder={intl.formatMessage({
          id: 'DeviceSwitcher.noAudioInputPlaceholder'
        })}
      />
      <Dropdown
        className={cx('dropdown')}
        controlClassName={cx('control')}
        placeholderClassName={cx('placeholder')}
        menuClassName={cx('menu')}
        arrowClassName={cx('arrow')}
        value={deviceSwitcherState.currentAudioOutputDevice}
        options={deviceSwitcherState.audioOutputDevices}
        disabled={!deviceSwitcherState.audioOutputDevices || !deviceSwitcherState.audioOutputDevices.length}
        isSearchable={false}
        onChange={async (selectedDevice: DeviceType) => {
          await chime.chooseAudioOutputDevice(selectedDevice);
        }}
        placeholder={intl.formatMessage({
          id: 'DeviceSwitcher.noAudioOutputPlaceholder'
        })}
      />
      <Dropdown
        className={cx('dropdown')}
        controlClassName={cx('control')}
        placeholderClassName={cx('placeholder')}
        menuClassName={cx('menu')}
        arrowClassName={cx('arrow')}
        value={deviceSwitcherState.currentVideoInputDevice}
        options={deviceSwitcherState.videoInputDevices}
        disabled={!deviceSwitcherState.videoInputDevices || !deviceSwitcherState.videoInputDevices.length}
        isSearchable={false}
        onChange={async (selectedDevice: DeviceType) => {
          await chime.chooseVideoInputDevice(selectedDevice);
        }}
        placeholder={intl.formatMessage({
          id: 'DeviceSwitcher.noVideoInputPlaceholder'
        })}
      />
    </div>
  );
}
