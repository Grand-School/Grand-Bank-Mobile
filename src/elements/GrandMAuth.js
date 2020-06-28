import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';
import Spinner from 'react-native-spinkit';
import RestTemplate from '../RestTemplate';
import { showMessage } from 'react-native-flash-message';
import { getTypeMessage, parseErrorResponse, printMessage } from '../Utils';

export class GrandMAuth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            loading: false,
            loginInformaton: null
        };

        this.closeModal = this.closeModal.bind(this);
        this.openToken = this.openToken.bind(this);
        this.confirmToken = this.confirmToken.bind(this);
    }

    closeModal() {
        this.setState({ token: null })
    }

    openToken(token) {
        this.setState({ token, loading: true });

        const that = this;
        RestTemplate.get('/rest/profile/authorize/' + token)
            .then(({ requestInfo, data }) => {
                if (!requestInfo.isOk) {
                    that.setState({ token: null });
                    showMessage({
                        message: getTypeMessage(data),
                        description: parseErrorResponse(data),
                        type: 'danger'
                    });
                } else {
                    that.setState({ loginInformaton: data, loading: false })
                }
            });
    }

    confirmToken() {
        this.setState({ loading: true });

        const that = this;
        RestTemplate.post('/rest/profile/authorize/' + this.state.token)
            .then(({ requestInfo, data }) => {
                printMessage(requestInfo, data, 'Вы успешно подтвердили вход!');
                that.closeModal();
            });
    }

    render() {
        let body;
        if (this.state.loading) {
            body = (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner type='Wave' size={50} />
                </View>
            );
        } else if (this.state.loginInformaton) {
            let data = this.state.loginInformaton;
            body = (
                <View>
                    <Text style={{ fontSize: 24 }}>Подтвердите вход:</Text>
                    <Text style={style.text}>IP адресс: <Text style={style.b}>{data.ip}</Text></Text>
                    {data.device && <Text style={style.text}>Устройство: <Text style={style.b}>{data.device}</Text></Text>}
                    {data.browser && <Text style={style.text}>Браузер: <Text style={style.b}>{data.browser}</Text></Text>}
                    {(data.city || data.country) && <Text style={style.text}>Страна: <Text style={style.b}>{(data.country ? data.country + ', ' : '') + (data.city ? data.city : '')}</Text></Text>}
                    <Button title='Подтвердить' onPress={this.confirmToken} />
                    <Button title='Отклонить' onPress={this.closeModal} />
                </View>
            );
        }

        return (
            <Modal 
                isVisible={this.state.token !== null} 
                onSwipeComplete={this.closeModal} 
                swipeDirection={['down']} 
                style={style.modal}>
                <SafeAreaView style={style.modalView}>
                    <View style={{ margin: 15 }}>
                        {body}
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}

let INSTANCE = null;

export default function askForToken(token) {
    INSTANCE.openToken(token)
}

export function setInstance(newInstance) {
    INSTANCE = newInstance
}

const style = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0
    },

    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },

    b: {
        fontWeight: '600'
    },

    text: {
        fontSize: 20
    }
})