// @flow
/* global $ */

import React, { Component } from "react";
import { View, Text } from "react-native";

import { appNavigate } from "../../app/actions";
import { ConfirmDialog, hideDialog, AlertDialog } from "../../base/dialog";
import { translate } from "../../base/i18n";
import { LoadingIndicator } from "../../base/react";
import { connect } from "../../base/redux";
import { ColorPalette } from "../../base/styles";

import styles from "./styles";

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
    t: Function,

    /**
     * The localParticipant object.
     */
    _localParticipant: Object,

    /**
     * The redux dispatch function.
     */
    dispatch: Function,
};

const getRandomColor = () => {
    const colors = [
        "Blau",
        "Grün",
        "Pink",
        "Violett",
        "Weiß",
        "Braun",
        "Lila",
        "Rot",
        "Gelb",
    ];

    return colors[Math.floor(Math.random() * colors.length)];
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
            loading: false,
        };

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
        const alert =
            _localParticipant.email === "" ||
            _localParticipant.email === undefined;

        return alert ? (
            <AlertDialog contentKey={t("dialog.addEmailNotification")} />
        ) : this.state.loading ? (
            <View style={styles.loadingContainer}>
                <LoadingIndicator color={ColorPalette.black} size="small" />
                <Text style={styles.loadingText}>{t("order.pleasewait")}</Text>
                <Text style={styles.loadingText}>
                    {t("order.pleasewaitTitle")}
                </Text>
                <Text style={styles.loadingText}>
                    {t("order.pleasewaitDescription")}
                </Text>
            </View>
        ) : (
            <ConfirmDialog
                contentKey={t("dialog.startOrderConfirmation", {
                    language: _language,
                })}
                okKey={"dialog.Yes"}
                onSubmit={this._onSubmit}
            />
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
        this.setState({
            loading: true,
        });

        const { _localParticipant, _language } = this.props;

        if (
            _localParticipant.email === "" ||
            _localParticipant.email === undefined
        ) {
            return true;
        }

        const x = new Date();
        const _date = `${x.getDate()}.${x.getMonth() + 1}.${x.getFullYear()}`,
            _time = `${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`;

        // _reference = `${_language} - ${_date} ${_time}`;
        const _reference = `${_language}ImRaum${getRandomColor()}${x.getSeconds()}${x.getMinutes()}`;

        // Submit the post request to get the meeting name.
        const data = JSON.stringify({
            email: _localParticipant.email,
            name: _localParticipant.name,
            languages: [_language],
            address: "Online",
            date: _date,
            time: _time,
            reference: _reference,
            notes: "videoanruf",
            customer: "/",
            phone: "",
            isDirectCall: true,
        });

        // console.log('body =>', data);
        $.ajax({
            // For development
            // url: 'https://script.google.com/macros/s/AKfycbzU_4_ctXyPf7U-6S3Aq165DR4bDqoOUHxoNUVdykJbUwUSr-c/exec',
            // For production, Use only Support language.
            url:
                "https://script.google.com/macros/s/AKfycbyzvb3gFDWIrNw3zSWlYdXpMzqxzHqx14v70GrvcZM5vuci7Dg/exec",
            type: "POST",
            data,
            success() {
                /* / console.log('result =>', res);
                const _res = JSON.parse(res);
                if (_res.status == "200") {
                    // room name to join for interpreter.
                    //_t.props.dispatch(appNavigate(_res.roomName));
                }
                /*_t.setState({
                    loading: false,
                });
                _t.props.dispatch(hideDialog());*/
            },
            error() {
                // console.log('error =>', error);
                /* _t.setState({
                    loading: false,
                });
                _t.props.dispatch(hideDialog());*/
            },
        });

        // Switch to room immediately (not waiting for ajax call to be finished)
        this.props.dispatch(appNavigate(_reference));
        this.setState({
            loading: false,
        });
        this.props.dispatch(hideDialog());
    }
}

export default translate(connect()(OrderDialog));
