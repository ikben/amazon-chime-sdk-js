import classNames from 'classnames/bind';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import localStorageKeys from '../constants/localStorageKeys.json';
import routes from '../constants/routes.json';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';
import styles from './Login.css';

const cx = classNames.bind(styles);

export default function Login() {
  const [, dispatch] = useContext(getUIStateContext());
  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
    dispatch({
      type: 'SET_CLASS_MODE',
      payload: {
        classMode: null
      }
    });
  }, []);

  return (
    <div className={cx('login')}>
      <div className={cx('content')}>
        <h1 className={cx('title')}>Tell me about you</h1>
        <div className={cx('selection')}>
          <div className={cx('teacher')}>
            <h2>Teacher</h2>
            <ul>
              <li>Can create a classroom</li>
              <li>Can share screen</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(
                  localStorageKeys.CLASS_MODE,
                  ClassMode.Teacher
                );
                dispatch({
                  type: 'SET_CLASS_MODE',
                  payload: {
                    classMode: ClassMode.Teacher
                  }
                });
                history.push(routes.CREATE_OR_JOIN);
              }}
            >
              I&apos;m a teacher
            </button>
          </div>
          <div className={cx('student')}>
            <h2>Student</h2>
            <ul>
              <li>Can join a classroom</li>
              <li>Can raise hands</li>
            </ul>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(
                  localStorageKeys.CLASS_MODE,
                  ClassMode.Student
                );
                dispatch({
                  type: 'SET_CLASS_MODE',
                  payload: {
                    classMode: ClassMode.Student
                  }
                });
                history.push(routes.CREATE_OR_JOIN);
              }}
            >
              I&apos;m a student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
