import React from 'react';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import { authorize } from 'react-native-app-auth';
import {oauth as oauthSettings} from '../app.json';

import {
    Button, SafeAreaView, Alert, StyleSheet, Image, View, TouchableHighlight, Text
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
                const user = result.tokenAdditionalParameters.user;
                that.props.onData({
                    user,
                    token: result.accessToken,
                    expireOn: result.accessTokenExpirationDate,
                    refreshToken: result.refreshToken
                });
            });
    }

    render() {
        return (
            <SafeAreaView>
                <View style={loginStyle.center}>
                    <Image source={require('../img/grand.png')} style={loginStyle.logo} />
                </View>
                <View>
                    <TouchableHighlight onPress={this.authorize} style={s.btnTouchAble}>
                        <View style={[s.btn, s.btnPrimary]}>
                            <Text style={[s.btnText, s.btnTextPrimary]}>Войти</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        )
    }
}

const bootstrapStyleSheet = new BootstrapStyleSheet({}, {});
const s = bootstrapStyleSheet.create();

const loginStyle = StyleSheet.create({
    logo: {
        top: '50%',
        alignSelf: 'center'
    },

    center: {
        height: '90%'
    }
});