import classNames from 'classnames/bind';
import { desktopCapturer } from 'electron';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from './LoadingSpinner';
import styles from './ScreenPicker.css';

const cx = classNames.bind(styles);

enum ShareType {
  Screen,
  Window
}

type Props = {
  onClickShareButton: (selectedSourceId: string) => void;
  onClickCancelButton: () => void;
};

export default function ScreenPicker(props: Props) {
  const { onClickCancelButton, onClickShareButton } = props;
  const [sources, setSources] = useState(null);
  const [shareType, setShareType] = useState(ShareType.Window);
  const [selectedSourceId, setSelectedSourceId] = useState(null);

  useEffect(() => {
    desktopCapturer
      .getSources({
        types: ['screen', 'window'],
        thumbnailSize: { width: 600, height: 600 }
      })
      .then(async desktopCapturerSources => {
        setSources(desktopCapturerSources);
        return null;
      })
      .catch(error => {
        // eslint-disable-next-line
        console.error(error);
      });
  }, []);

  const { screenSources, windowSources } = (sources || []).reduce(
    (result, source) => {
      if (source.name === document.title) {
        return result;
      }

      if (source.id.startsWith('screen')) {
        result.screenSources.push(source);
      } else {
        result.windowSources.push(source);
      }
      return result;
    },
    {
      screenSources: [],
      windowSources: []
    }
  );

  const selectedSources =
    shareType === ShareType.Screen ? screenSources : windowSources;

  return (
    <div
      className={cx('screenPicker', {
        screenShareType: shareType === ShareType.Screen,
        windowShareType: shareType === ShareType.Window
      })}
    >
      <div className={cx('window')}>
        <div className={cx('top')}>
          <h1 className={cx('header')}>Share your screen</h1>
          <div className={cx('tabs')}>
            <button
              type="button"
              className={cx('windowTab', {
                selected: shareType === ShareType.Window
              })}
              onClick={() => {
                setShareType(ShareType.Window);
              }}
            >
              Application window
            </button>
            <button
              type="button"
              className={cx('screenTab', {
                selected: shareType === ShareType.Screen
              })}
              onClick={() => {
                setShareType(ShareType.Screen);
              }}
            >
              Your entire screen
            </button>
          </div>
        </div>
        <div
          className={cx('middle', {
            loading: !sources
          })}
        >
          {!sources && <LoadingSpinner />}
          {sources && selectedSources && !selectedSources.length && (
            <div className={cx('noScreen')}>No screen</div>
          )}
          {sources &&
            selectedSources &&
            selectedSources.map(source => (
              <div
                key={source.id}
                className={cx('source', {
                  selected: source.id === selectedSourceId
                })}
                onClick={() => {
                  setSelectedSourceId(source.id);
                }}
                onKeyPress={() => {}}
                role="button"
                tabIndex="0"
              >
                <div className={cx('image')}>
                  <img src={source.thumbnail.toDataURL()} alt={source.name} />
                </div>
                <div className={cx('caption')}>{source.name}</div>
              </div>
            ))}
        </div>
        <div className={cx('bottom')}>
          <div className={cx('buttonContainer')}>
            <button
              type="button"
              className={cx('cancelButton')}
              onClick={() => {
                onClickCancelButton();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedSourceId}
              className={cx('shareButton', {
                enabled: !!selectedSourceId
              })}
              onClick={() => {
                onClickShareButton(selectedSourceId);
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
