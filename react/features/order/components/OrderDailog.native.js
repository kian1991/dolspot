// @flow

import React, { Component } from 'react';

import { ConfirmDialog, hideDialog, AlertDialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { LoadingIndicator} from '../../base/react';
import { ColorPalette } from '../../base/styles';
import { View, Text } from 'react-native';
import styles from './styles';
import { appNavigate } from '../../app/actions';

/**
 * The type of the React {@code Component} props of
 * {@link OrderDialog}.
 */
export type Props = {

    /**
     * The language for the new conference.
     */
    _language: string,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * React Component for getting confirmation to start a new interpreter conference.
 *
 * @extends Component
 */
class OrderDialog extends Component<Props> {

    /**
     * Initializes a new {@code AbstrStopRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: P) {
        super(props);

        this.state = {
            loading: false
        }

        // Bind event handler so it is only bound once for every instance.
        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { t, _language, _localParticipant } = this.props;
        const alert = _localParticipant.email == '' || _localParticipant.email === undefined;
        return (
            alert ? 
                <AlertDialog
                    contentKey = { t('dialog.addEmailNotification') } />
            :
             this.state.loading ? 
                <View
                    style = { styles.loadingContainer } >
                    <LoadingIndicator
                        color = { ColorPalette.black }
                        size = 'small' />
                    <Text
                        style = { styles.loadingText }>
                        { 'Please wait.' } 
                    </Text>
                </View>
                : <ConfirmDialog
                    contentKey = { t('dialog.startOrderConfirmation', { language: _language })}
                    okKey = { 'dialog.Yes' }
                    onSubmit = { this._onSubmit } />

        );
    }

    _onSubmit: () => boolean;

    /**
     * Stops the recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        // Show the loader.
        const _t = this;
        
        _t.setState({
            loading: true
        });
        
        const { _localParticipant, _language } = _t.props;

        if (_localParticipant.email == '' || _localParticipant.email === undefined) {
            return true;
        }

        const x = new Date(), _date = `${x.getDate()}.${x.getMonth() + 1}.${x.getFullYear()}`,
            _time = `${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`;
        // Submit the post request to get the meeting name.
        const data = JSON.stringify({
            "email": _localParticipant.email,
            "name": _localParticipant.name,
            "languages":[_language],
            "address":"Online",
            "date": _date,
            "time": _time,
            "reference":"Nest",
            "notes":"videoanruf",
            "customer":"/",
            "phone":""
        });
        console.log('body =>', data);
        $.ajax({
            url: 'https://script.google.com/macros/s/AKfycbzU_4_ctXyPf7U-6S3Aq165DR4bDqoOUHxoNUVdykJbUwUSr-c/exec',
            type: 'POST',
            data: data,
            success(res) {
                console.log('result =>', res);
                const _res = JSON.parse(res);
                if (_res.status == '200') {
                    // room name to join for interpreter.
                    _t.props.dispatch(appNavigate(_res.roomName));
                }
                _t.setState({
                    loading: false
                });
                _t.props.dispatch(hideDialog());
            },
            error(error) {
                console.log('error =>', error);
                _t.setState({
                    loading: false
                });
                _t.props.dispatch(hideDialog());
            }
        })
        // Submit the post request to get the meeting name.
        // fetch('https://script.google.com/macros/s/AKfycbzU_4_ctXyPf7U-6S3Aq165DR4bDqoOUHxoNUVdykJbUwUSr-c/exec', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: data
        // })
        // .then((res) => {
            
        // })
        // .catch((error) => {
        //     console.log('error =>', error);
        // });
        // return true;
    }
}

export default translate(connect()(OrderDialog));
