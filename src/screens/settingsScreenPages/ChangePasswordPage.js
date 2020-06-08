import React from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import RestTemplate from '../../RestTemplate';
import { parseErrorResponse, updateProfileAndGoBack, printMessage } from '../../Utils';
import { InputItem } from '../../elements/InputItem';

export class ChangePasswordPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
        this.buttonPressedHandler = this.buttonPressedHandler.bind(this);
    }

    buttonPressedHandler() {
        const that = this;
        RestTemplate.post('/rest/profile/password', {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
        }).then(({ data, requestInfo }) => {
            printMessage(requestInfo, data, 'Вы успешно обновили пароль!');
            if (requestInfo.isOk) {
                updateProfileAndGoBack(that.props.navigation, false);
            }
        });
    }

    saveAble() {
        return this.state.oldPassword.length !== 0
            && this.state.newPassword.length !== 0
            && this.state.confirmPassword.length !== 0
            && this.state.newPassword === this.state.confirmPassword;
    }

    render() {
        return (
            <View style={{ padding: 5 }}>
                <InputItem title='Введите старый пароль'>
                    <TextInput style={style.input} secureTextEntry={true} 
                            value={this.state.oldPassword} onChangeText={oldPassword => this.setState({ oldPassword })} />
                </InputItem>

                <InputItem title='Введите новый пароль'>
                    <TextInput style={style.input} secureTextEntry={true}
                            value={this.state.newPassword} onChangeText={newPassword => this.setState({ newPassword })} />
                </InputItem>

                <InputItem title='Повторите новый пароль'>
                    <TextInput style={style.input} secureTextEntry={true} 
                            value={this.state.confirmPassword} onChangeText={confirmPassword => this.setState({ confirmPassword })} />
                </InputItem>

                <Button disabled={!this.saveAble()} onPress={this.buttonPressedHandler} title='Сохранить' />
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