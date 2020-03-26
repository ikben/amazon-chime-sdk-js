import { useContext, useEffect, useState } from 'react';

import getChimeContext from '../context/getChimeContext';

export default function useRaisedHandAttendees() {
  const chime = useContext(getChimeContext());
  const [raisedHandAttendees, setRaisedHandAttendees] = useState(new Set());
  useEffect(() => {
    const realTimeRaisedHandAttendees = new Set();
    const callback = message => {
      const { type, payload } = message;
      if (payload && payload.attendeeId) {
        if (type === 'raise-hand') {
          realTimeRaisedHandAttendees.add(payload.attendeeId);
        } else if (type === 'dismiss-hand') {
          realTimeRaisedHandAttendees.delete(payload.attendeeId);
        }
        setRaisedHandAttendees(new Set(realTimeRaisedHandAttendees));
      }
    };
    chime.subscribeToMessageUpdate(callback);
    return () => {
      chime.unsubscribeFromMessageUpdate(callback);
    };
  }, []);
  return raisedHandAttendees;
}
