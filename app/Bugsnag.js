// @flow

import { Client, Configuration } from 'bugsnag-react-native';

const configuration = new Configuration('2c13948834758fc456512cb0248ffc73');
configuration.appVersion = '0.0.1';
configuration.codeBundleId = '0.0.1';

const bugsnag = new Client(configuration);

export function setUser({
                            id = '',
                            email = '',
                        }: {
    id: string,
    email: string,
}) {
    bugsnag.setUser(id, email);
}

export function notify(not: Error | string) {
    bugsnag.notify(not);
}
