import classNames from 'classnames/bind';
import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';

import routes from '../constants/routes.json';
import getUIStateContext from '../context/getUIStateContext';
import ClassMode from '../enums/ClassMode';
import styles from './CreateOrJoin.css';

const cx = classNames.bind(styles);

export default function CreateOrJoin() {
  const [state] = useContext(getUIStateContext());
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const history = useHistory();
  const region = 'us-east-1';
  const intl = useIntl();

  return (
    <div className={cx('createOrJoin')}>
      <div className={cx('formWrapper')}>
        <h1 className={cx('title')}>
          {state.classMode === ClassMode.Teacher
            ? <FormattedMessage id="CreateOrJoin.teacherTitle" />
            : <FormattedMessage id="CreateOrJoin.studentTitle" />}
        </h1>
        <form
          className={cx('form')}
          onSubmit={event => {
            event.preventDefault();
            if (title && name && region) {
              history.push(
                `/teacher-room?title=${encodeURIComponent(
                  title
                )}&name=${encodeURIComponent(name)}&region=${region}`
              );
            }
          }}
        >
          <input
            className={cx('titleInput')}
            onChange={event => {
              setTitle(event.target.value);
            }}
            placeholder={intl.formatMessage({ id: 'CreateOrJoin.titlePlaceholder' })}
          />
          <input
            className={cx('nameInput')}
            onChange={event => {
              setName(event.target.value);
            }}
            placeholder={intl.formatMessage({ id: 'CreateOrJoin.namePlaceholder' })}
          />
          <button className={cx('button')} type="submit">
            <FormattedMessage id="CreateOrJoin.continueButton" />
          </button>
        </form>
        <Link className={cx('loginLink')} to={routes.LOGIN}>
          {state.classMode === ClassMode.Teacher
            ? <FormattedMessage id="CreateOrJoin.notTeacherLink" />
            : <FormattedMessage id="CreateOrJoin.notStudentLink" />}
        </Link>
      </div>
    </div>
  );
}
