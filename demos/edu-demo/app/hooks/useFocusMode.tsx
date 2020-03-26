import { useContext, useEffect, useState } from 'react';

import getChimeContext from '../context/getChimeContext';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';

export default function useFocusMode() {
  const chime = useContext(getChimeContext());
  const [focusMode, setFocusMode] = useState(false);
  const [state] = useContext(getUIStateContext());
  useEffect(() => {
    const callback = message => {
      if (state.classMode === ClassMode.Teacher) {
        return;
      }
      const { type, payload } = message;
      if (type === 'focus' && payload) {
        chime.audioVideo.realtimeSetCanUnmuteLocalAudio(!payload.focus);
        if (payload.focus === true) {
          chime.audioVideo.realtimeMuteLocalAudio();
        }
        setFocusMode(!!payload.focus);
      }
    };
    chime.subscribeToMessageUpdate(callback);
    return () => {
      chime.unsubscribeFromMessageUpdate(callback);
    };
  }, []);
  return focusMode;
}
