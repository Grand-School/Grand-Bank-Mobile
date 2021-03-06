import React from 'react';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { authorize } from 'react-native-app-auth';
import { oauth as oauthSettings } from '../../app.json';

import {
    SafeAreaView, StyleSheet, Image, View, TouchableOpacity, Text
} from 'react-native';

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.authorize = this.authorize.bind(this);
    }

    authorize() {
        const that = this;
        authorize(oauthSettings)
            .then(result => {
                const settings = parseAuthorization(result);
                that.props.onData(settings);
            });
    }

    render() {
        return (
            <>
                <View style={loginStyle.logoView}>
                    <Image source={require('../../img/grand.png')} />
                </View>
                <View>
                    <TouchableOpacity onPress={this.authorize} style={s.btnTouchAble}>
                        <View style={[s.btn, s.btnPrimary]}>
                            <Text style={[s.btnText, s.btnTextPrimary]}>Войти</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

export function parseAuthorization(authorization) {
    return {
        token: authorization.accessToken,
        expireOn: authorization.accessTokenExpirationDate,
        refreshToken: authorization.refreshToken
    };
}

const bootstrapStyleSheet = new BootstrapStyleSheet({}, {});
const s = bootstrapStyleSheet.create();

const loginStyle = StyleSheet.create({
    logoView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '92%'
    }
});