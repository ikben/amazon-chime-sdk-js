import React from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';

import ChimeProvider from '../providers/ChimeProvider';
import UIStateProvider from '../providers/UIStateProvider';
import Routes from '../Routes';

const Root = () => (
  <HashRouter>
    <ChimeProvider>
      <UIStateProvider>
        <Routes />
      </UIStateProvider>
    </ChimeProvider>
  </HashRouter>
);

export default hot(Root);
