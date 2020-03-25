import React, { useContext, useEffect, useState } from 'react';

import getChimeContext from '../context/getChimeContext';
import getRosterContext from '../context/getRosterContext';

type Props = {
  children: ReactNode;
};

export default function RosterProvider(props: Props) {
  const { children } = props;
  const [roster, setRoster] = useState(null);
  const chime = useContext(getChimeContext());
  const RosterContext = getRosterContext();

  useEffect(() => {
    const callback = (newRoster: RosterType) => {
      setRoster({
        ...newRoster
      });
    };
    chime.subscribeToRosterUpdate(callback);
    return () => {
      chime.unsubscribeFromRosterUpdate(callback);
    };
  }, []);

  return (
    <RosterContext.Provider value={roster}>{children}</RosterContext.Provider>
  );
}
