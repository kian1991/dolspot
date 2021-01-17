// @flow

import { ReducerRegistry, set } from '../base/redux';

import { SET_LANGUAGES } from './actionTypes';

const DEFAULT_STATE = {
    languages: null
};

/**
 * Reduces the redux actions of languages setting feature
 */
ReducerRegistry.register('features/order', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case SET_LANGUAGES:
        return set(state, 'languages', action.languages);
    }

    return state;
});
