import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Classroom from './components/Classroom';
import CreateOrJoin from './components/CreateOrJoin';
import Home from './components/Home';
import Login from './components/Login';
import routes from './constants/routes.json';
import getUIStateContext from './context/getUIStateContext';
import MeetingStatusProvider from './providers/MeetingStatusProvider';
import RosterProvider from './providers/RosterProvider';

export default function Routes() {
  const [state] = useContext(getUIStateContext());

  // eslint-disable-next-line
  const PrivateRoute = ({ children, ...rest }) => {
    return (
      // eslint-disable-next-line
      <Route {...rest}>
        {state.classMode ? children : <Redirect to={routes.LOGIN} />}
      </Route>
    );
  };

  return (
    <App>
      <Switch>
        <PrivateRoute path={routes.TEACHER_ROOM}>
          <MeetingStatusProvider>
            <RosterProvider>
              <Classroom />
            </RosterProvider>
          </MeetingStatusProvider>
        </PrivateRoute>
        <PrivateRoute path={routes.CREATE_OR_JOIN}>
          <CreateOrJoin />
        </PrivateRoute>
        <Route path={routes.LOGIN}>
          <Login />
        </Route>
        <Route path={routes.HOME}>
          <Home />
        </Route>
      </Switch>
    </App>
  );
}
