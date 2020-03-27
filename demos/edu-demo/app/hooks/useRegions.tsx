import { useContext, useEffect, useState } from 'react';
import getChimeContext from '../context/getChimeContext';
import FullRegionInfoType from '../types/FullRegionInfoType';

export default function useRegions() {
  const chime = useContext(getChimeContext());
  const [regionsState, setRegionsState] = useState({
    currentRegion: chime.region,
    supportedChimeRegions: chime.supportedChimeRegions
  });

  useEffect(() => {
    const regionChangedCallback = (fullRegionInfo: FullRegionInfoType) => {
      setRegionsState({
        currentRegion: fullRegionInfo.currentRegion,
        supportedChimeRegions: fullRegionInfo.supportedChimeRegions,
      });
    };
    
    chime.subscribeToRegionChanged(
      regionChangedCallback);
    return () => {
      chime.unsubscribeFromRegionChanged(
        regionChangedCallback);
    };
  }, []);

  return regionsState;
}
