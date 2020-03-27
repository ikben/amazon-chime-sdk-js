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
            <h2>Teachers can</h2>
            <ul>
              <li>Create a classroom</li>
              <li>Share audio, video, and screen</li>
              <li>Send chat messages</li>
              <li>Toggle focus:</li>
              <ul>
                <li>Focus mutes all students</li>
                <li>Focus turns off student chat</li>
              </ul>
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
            <h2>Students can</h2>
            <ul>
              <li>Join a classroom</li>
              <li>Share video</li>
              <li>Raise hand</li>
              <li>When focus is off:</li>
              <ul>
                <li>Unmute and share audio</li>
                <li>Send chat messages</li>
              </ul>
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
