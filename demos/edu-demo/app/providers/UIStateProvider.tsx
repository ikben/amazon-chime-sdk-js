import React, { useReducer } from 'react';

import localStorageKeys from '../constants/localStorageKeys.json';
import getUIStateContext from '../context/getUIStateContext';

const initialState = {
  classMode: localStorage.getItem(localStorageKeys.CLASS_MODE) || null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CLASS_MODE':
      return {
        classMode: action.payload.classMode
      };
    default:
      throw new Error();
  }
};

type Props = {
  children: ReactNode;
};

export default function UIStateProvider(props: Props) {
  const { children } = props;
  const UIStateContext = getUIStateContext();
  return (
    <UIStateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </UIStateContext.Provider>
  );
}
