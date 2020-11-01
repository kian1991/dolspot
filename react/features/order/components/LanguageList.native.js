// @flow

import React from 'react';
import { Text, View, TextInput } from 'react-native';
import type { Dispatch } from 'redux';

import { getDefaultURL } from '../../app/functions';
import { openDialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import { getLocalParticipant } from '../../base/participants';
import { AbstractPage, NavigateSectionList, Container } from '../../base/react';
import { connect } from '../../base/redux';
import abListstyles from '../../recent-list/components/styles';
import _styles, { PLACEHOLDER_TEXT_COLOR } from '../../welcome/components/styles';
import { toDisplayableList } from '../functions.native';

import OrderDailog from './OrderDailog.native';
import styles from './styles.native';


/**
 * The type of the React {@code Component} props of {@link RecentList}
 */
type Props = {

    /**
     * Renders the list disabled.
     */
    disabled: boolean,

    /**
     * The redux store's {@code dispatch} function.
     */
    dispatch: Dispatch<any>,

    /**
     * The translate function.
     */
    t: Function,

    /**
     * The default server URL.
     */
    _defaultServerURL: string,

    /**
     * The recent list from the Redux store.
     */
    _recentList: Array<Section>,

    /**
     * The Local participant object.
     */
    _localParticipant: Object
};

/**
 * A class that renders the list of the recently joined rooms.
 *
 */
class LanguageList extends AbstractPage<Props> {

    /**
     * Initializes a new {@code LanguageList} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            language: ''
        };

        this._onPress = this._onPress.bind(this);
        this._getRenderListEmptyComponent = this._getRenderListEmptyComponent.bind(this);
        this._onLanguageFilter = this._onLanguageFilter.bind(this);
    }

    /**
     * Implements the React Components's render method.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        const languages = [
            'Albanisch',
            'Amharisch',
            'Arabisch',
            'Aramäisch',
            'Armenisch',
            'Aserbaidschanisch',
            'Kurdisch - Bahdini',
            'Dari',
            'Englisch',
            'Farsi',
            'Französisch',
            'Georgisch',
            'Hindi',
            'Italienisch ',
            'Kurdisch - Kurmanci',
            'Oromo',
            'Pashto',
            'Polnisch',
            'Punjabi',
            'Rumänisch',
            'Russisch',
            'Somali',
            'Kurdisch - Sorani',
            'Support',
            'Swahili',
            'Tigrinya',
            'Turkisch',
            'Urdu',
            'Vietnamesisch',
            'Kurdisch - Zazaki'
        ];

        const languageList = toDisplayableList(languages, t, this.state.language);

        console.log('render language list ', languageList);

        return (
            <View style = { styles.container }>
                <View style = { [ _styles.joinControls, styles.green ] } >
                    <Text style = { _styles.enterRoomText }>
                        { t('welcomepage.searchlanguage') }
                    </Text>
                    <TextInput
                        autoCapitalize = 'none'
                        autoComplete = 'off'
                        autoCorrect = { false }
                        autoFocus = { false }
                        onChangeText = { this._onLanguageFilter }
                        placeholder = { t('welcomepage.language') }
                        placeholderTextColor = { PLACEHOLDER_TEXT_COLOR }
                        returnKeyType = { 'go' }
                        style = { _styles.textInput }
                        underlineColorAndroid = 'transparent'
                        value = { this.state.language } />
                </View>
                <NavigateSectionList
                    disabled = { false }
                    onPress = { this._onPress }
                    renderListEmptyComponent
                        = { this._getRenderListEmptyComponent() }
                    sections = { languageList }
                    style = { styles.container } />
            </View>
        );
    }

    _getRenderListEmptyComponent: () => React$Node;

    /**
     * Returns a list empty component if a custom one has to be rendered instead
     * of the default one in the {@link NavigateSectionList}.
     *
     * @private
     * @returns {React$Component}
     */
    _getRenderListEmptyComponent() {
        const { t } = this.props;

        return (
            <Container
                className = 'meetings-list-empty'
                style = { abListstyles.emptyListContainer }>
                <Text
                    className = 'description'
                    style = { abListstyles.emptyListText }>
                    { t('welcomepage.recentListEmpty') }
                </Text>
            </Container>
        );
    }

    _onPress: string => void;

    /**
     * Handles the list's navigate action.
     *
     * @private
     * @param {string} url - The url string to navigate to.
     * @returns {void}
     */
    _onPress(url) {
        const { dispatch, t, _localParticipant } = this.props;

        dispatch(openDialog(OrderDailog, {
            _language: url,
            t,
            _localParticipant
        }));

        // sendAnalytics(createRecentClickedEvent('recent.meeting.tile'));
    }

    _onLanguageFilter: string => void;

    /**
     * Change the language state to filter from the list.
     *
     * @inheritdoc
     */
    _onLanguageFilter(val) {
        console.log(val);
        this.setState({
            language: val
        });
    }
}

/**
 * Maps redux state to component props.
 *
 * @param {Object} state - The redux state.
 * @returns {{
    *     _defaultServerURL: string,
    *     _recentList: Array
    * }}
    */
export function _mapStateToProps(state: Object) {
    return {
        _defaultServerURL: getDefaultURL(state),
        _localParticipant: getLocalParticipant(state),
        _recentList: state['features/recent-list']
    };
}

export default translate(connect(_mapStateToProps)(LanguageList));
