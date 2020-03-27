import React from 'react';
import { hot } from 'react-hot-loader/root';
import { HashRouter } from 'react-router-dom';

import I18nProvider from '../providers/I18nProvider';
import ChimeProvider from '../providers/ChimeProvider';
import UIStateProvider from '../providers/UIStateProvider';
import Routes from '../Routes';

const Root = () => (
  <HashRouter>
    <I18nProvider>
      <ChimeProvider>
        <UIStateProvider>
          <Routes />
        </UIStateProvider>
      </ChimeProvider>
    </I18nProvider>
  </HashRouter>
);

export default hot(Root);
