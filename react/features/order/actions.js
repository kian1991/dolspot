// @flow

import { SET_LANGUAGES } from './actionTypes';

/**
 * Sets languages from the API response.
 *
 * @param {?string} languages - The string of the languages array.
 * @returns {{
 *     type: SET_LANGUAGES,
 *     languages: string
 * }}
 */
export function setLanguages(languages: ?string) {
    return {
        type: SET_LANGUAGES,
        languages
    };
}

/**
 * Starts the process for inviting people. Dpending on the sysstem config it
 * may use the system share sheet or the invite peoplee dialog.
 *
 * @returns {Function}
 */
export function getLanguagesForOrders() {
    return async (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const apiUrl = `https://script.googleusercontent.com/a/macros/
            dolspot.de/echo?user_content_key=RPj5Hf2I68hZ9El532clWWiZrDIH8EXA
            Ge5xQ_hhF3_b3zYtF2aD2xeZ461jLZE4479qiQqj4XBL0UWAAlnGIeU1exP4Otwmm
            5_BxDlH2jW0nuo2oDemN9CCS2h10ox_nRPgeZU6HP_slw4cC29QOcS6MkkzCEWWmh
            HGzAGa1FVMJY106xjMgoTxh5XI1sDA9V0o7UDuWjvTjHZ8lpRuQL0L0jXTxuI-_-a
            frXbtMZpcy6pr-Oj0FQ&lib=M6VGHHIJoqJC6ip2OEK12zKGM60klw0Z8`;
        let languages = state['features/order'].languages;

        if (languages === null) {
            try {
                const response = await fetch(apiUrl);

                if (response.status === 200) {
                    languages = await response.text();
                    languages = await JSON.parse(languages);
                    dispatch(setLanguages(languages));
                }
            } catch (e) {
                console.warn('fetch Error: ', e);
            }
        }
    };
}
