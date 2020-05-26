import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { UserCard } from './UserCard';
import DataStorage from '../../DataStorage';
import RestTemplate from '../../RestTemplate';
import { parseErrorResponse, updateProfileAndGoBack } from '../../Utils';

const STORAGE_PRICE_KEY = 'updateCardNumberPrice';

export class ChangeCardNumberPage extends React.Component {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.state = {
            numberInputs: ['', '', ''],
            price: null
        };

        if (DataStorage.includes(STORAGE_PRICE_KEY)) {
            this.state.price = DataStorage.getByKey(STORAGE_PRICE_KEY);
        } else {
            const that = this;
            RestTemplate.get('/rest/profile/updateCardNumber/price')
                .then(({ data: price }) => {
                    that.setState({ price });
                    DataStorage.put(STORAGE_PRICE_KEY, price);
                });
        }

        this.changeText = this.changeText.bind(this);
        this.updateNumberButtonHandler = this.updateNumberButtonHandler.bind(this);
    }

    changeText(text, inputIndex) {
        if (text !== '' && (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(+text[text.length - 1])
                || text.length > 4)) {
            return;
        }

        let numberInputs = this.state.numberInputs;
        numberInputs[inputIndex] = text;

        this.setState({ numberInputs });

        if (text.length === 4 && inputIndex !== 2) {
            this.inputs[inputIndex + 1].focus();
        } else if (text.length === 0 && inputIndex !== 0) {
            this.inputs[inputIndex - 1].focus();
        }
    }

    updateNumberButtonHandler() {
        const newCardNumber = this.state.numberInputs.join('');
        const that = this;
        const buyCardCallback = pinCode => {
            RestTemplate.post('/rest/profile/updateCardNumber', {
                newCardNumber, pinCode
            })
                .then(({ data, requestInfo }) => {
                    Alert.alert(requestInfo.isOk ? 'Успех!' : 'Неуспех', requestInfo.isOk ? null : parseErrorResponse(data));
                    if (requestInfo.isOk) {
                        updateProfileAndGoBack(that.props.navigation);
                    }
                });
        };
        Alert.prompt('Введите пин-код', 'Для смены номер, введите пин-код', buyCardCallback);
    }

    render() {
        let buttonDisabled = this.state.numberInputs.join('').length !== 12;

        return (
            <View style={styles.viewParrent}>
                <View>
                    <Text>Пожалуйста, введите номер карты</Text>
                </View>
                <View style={styles.card}>
                    <UserCard ref={userCard => this.userCardElement = userCard}>
                        <View style={styles.inputParrent}>
                            <TextInput onChangeText={e => this.changeText(e, 0)} ref={input => this.inputs[0] = input}
                                    value={this.state.numberInputs[0]} style={styles.input} keyboardType='number-pad' />
                            
                            <TextInput onChangeText={e => this.changeText(e, 1)} ref={input => this.inputs[1] = input}
                                    value={this.state.numberInputs[1]} style={[styles.input, { left: 110 }]} keyboardType='number-pad' />

                            <TextInput onChangeText={e => this.changeText(e, 2)} ref={input => this.inputs[2] = input}
                                    value={this.state.numberInputs[2]} style={[styles.input, { left: 220 }]} keyboardType='number-pad' />
                        </View>
                    </UserCard>
                </View>
                {this.state.price && (
                    <View style={styles.afterCardParrent}>
                        <Text style={styles.priceText}>Стоимость смены номера карты: <Text style={styles.textBold}>{this.state.price} грандиков</Text>.</Text>
                        <Button title='Сменить номер' disabled={buttonDisabled} onPress={this.updateNumberButtonHandler} />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewParrent: {
        padding: 5
    },

    inputParrent: {
        marginLeft: 10
    },

    input: {
        position: 'absolute',
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: 80,

        letterSpacing: 2,
        color: '#fff',
        textAlign: 'center',
        fontSize: 25,
    },

    card: {
        alignItems: 'center', 
        marginTop: 15,
        height: 190
    },

    afterCardParrent: {
        marginTop: 15
    },

    textBold: {
        fontWeight: '600'
    },

    priceText: {
        marginBottom: 5
    }
});