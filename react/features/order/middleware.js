// @flow

import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from '../base/app';
import { MiddlewareRegistry } from '../base/redux';

import { setLanguages, getLanguagesForOrders } from './actions';

MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
    case APP_WILL_MOUNT:
        store.dispatch(getLanguagesForOrders());
        break;
    case APP_WILL_UNMOUNT:
        store.dispatch(setLanguages(null));
        break;
    }

    return result;
});
