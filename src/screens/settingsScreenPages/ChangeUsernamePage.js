import React from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import DataStorage from '../../DataStorage';
import RestTemplate from '../../RestTemplate';
import { parseErrorResponse, printMessage } from '../../Utils';

export class ChangeUsernamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: DataStorage.getByKey('user').username
        }
        this.buttonPressedHandler = this.buttonPressedHandler.bind(this);
    }

    buttonPressedHandler() {
        RestTemplate.post(`/rest/profile/login?login=${this.state.login}`)
            .then(({ requestInfo, data }) => {
                if (requestInfo.isOk) {
                    DataStorage.getByKey('handlers').instanceLogout();
                }

                printMessage(requestInfo, data, 'Вы успешно изменили имя пользователя!');
            });
    }

    render() {
        return (
            <View style={{ padding: 5 }}>
                <Text>После смены логина, вам придется заново авторизоваться.</Text>
                <Text>Введите новый логин:</Text>
                <TextInput style={style.input} value={this.state.login} onChangeText={login => this.setState({ login })} />
                <View style={{ marginTop: 5 }}>
                    <Button onPress={this.buttonPressedHandler} title='Обновить' />
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    input: {
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: '80%',
        color: 'black',
        textAlign: 'center',
        fontSize: 25,
        alignSelf: 'center',
        marginTop: 15
    }
});