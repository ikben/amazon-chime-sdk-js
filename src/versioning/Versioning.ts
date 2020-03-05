// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import DefaultBrowserBehavior from '../browserbehavior/DefaultBrowserBehavior';

export default class Versioning {
  static X_AMZN_VERSION = 'X-Amzn-Version';
  static X_AMZN_USER_AGENT = 'X-Amzn-User-Agent';

  /**
   * Return string representation of SDK version
   */
  static get sdkVersion(): string {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    return '1.2.4';
=======
    return '1.1.18';
>>>>>>> dfbc904... MeetingSessionPOSTLogger source and test
=======
    return '1.1.19';
>>>>>>> a31f41e... Fix example code in the getting started guide
=======
    return '1.1.20';
>>>>>>> 795512c... Add observer event for content sharing
=======
    return '1.1.21';
>>>>>>> 7e534a9... Integrate MeetingSessionPOSTLogger to demo app
=======
    return '1.2.3';
>>>>>>> 59c9ebd... Remove unimplemented callbacks
  }

  /**
   * Return low-resolution string representation of SDK user agent (e.g. `chrome-78`)
   */
  static get sdkUserAgentLowResolution(): string {
    const browserBehavior = new DefaultBrowserBehavior();
    return `${browserBehavior.name()}-${browserBehavior.majorVersion()}`;
  }

  /**
   * Return URL with versioning information appended
   */
  static urlWithVersion(url: string): string {
    const urlWithVersion = new URL(url);
    urlWithVersion.searchParams.append(Versioning.X_AMZN_VERSION, Versioning.sdkVersion);
    urlWithVersion.searchParams.append(
      Versioning.X_AMZN_USER_AGENT,
      Versioning.sdkUserAgentLowResolution
    );
    return urlWithVersion.toString();
  }
}
