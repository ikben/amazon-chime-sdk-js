import React, { useReducer } from 'react';

import localStorageKeys from '../constants/localStorageKeys.json';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';

let classMode: ClassMode = localStorage.getItem(localStorageKeys.CLASS_MODE);
if (!classMode) {
  localStorage.setItem(localStorageKeys.CLASS_MODE, ClassMode.Student);
  classMode = ClassMode.Student;
}

const initialState = {
  classMode
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
