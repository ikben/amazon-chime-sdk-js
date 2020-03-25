import classNames from 'classnames/bind';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import routes from '../constants/routes.json';
import getUIStateContext from '../context/getUIStateContext';
import styles from './Home.css';

const cx = classNames.bind(styles);

export default function Home() {
  const [state] = useContext(getUIStateContext());
  return (
    <div className={cx('home')}>
      {state.classMode ? (
        <Redirect to={routes.CREATE_OR_JOIN} />
      ) : (
        <Redirect to={routes.LOGIN} />
      )}
    </div>
  );
}
