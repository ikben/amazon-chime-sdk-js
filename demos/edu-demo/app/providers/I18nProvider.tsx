import React, { useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

const DEFAULT_LOCALE = 'en-US'

const messages = {
  [DEFAULT_LOCALE]: require('../i18n/en-US').default
};

type Props = {
  children: ReactNode;
};

export default function I18nProvider(props: Props) {
  const { children } = props;
  return (
    <IntlProvider
      locale={(navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages[DEFAULT_LOCALE]}>
      {children}
    </IntlProvider>
  );
}
