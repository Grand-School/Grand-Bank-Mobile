import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { UserCard } from '../../elements/UserCard';
import DataStorage from '../../DataStorage';
import RestTemplate from '../../RestTemplate';
import { updateProfileAndGoBack, printMessage } from '../../Utils';
import { PinCodeModal } from '../../elements/PinCodeModal';
import { CardInput } from '../../elements/CardInput';

const STORAGE_PRICE_KEY = 'updateCardNumberPrice';

export class ChangeCardNumberPage extends React.Component {
    constructor(props) {
        super(props);
        this.inputs = [];
        this.state = {
            typedInput: '',
            price: null,
            askPinCode: false
        };

        if (DataStorage.includes(STORAGE_PRICE_KEY)) {
            this.state.price = DataStorage.getByKey(STORAGE_PRICE_KEY);
        } else {
            const that = this;
            RestTemplate.get('/rest/api/updateCardNumber/price')
                .then(({ data: price }) => {
                    that.setState({ price });
                    DataStorage.put(STORAGE_PRICE_KEY, price);
                });
        }

        this.updateNumberButtonHandler = this.updateNumberButtonHandler.bind(this);
        this.onPinCode = this.onPinCode.bind(this);
    }

    updateNumberButtonHandler() {
        this.setState({ askPinCode: true });
    }

    onPinCode(pinCode) {
        const newCardNumber = this.state.typedInput;
        const that = this;
        RestTemplate.post('/rest/profile/updateCardNumber', {
            newCardNumber, pinCode
        })
            .then(({ data, requestInfo }) => {
                that.setState({ askPinCode: false });
                printMessage(requestInfo, data, 'Вы успешно изменили номер карты');

                if (requestInfo.isOk) {
                    updateProfileAndGoBack(that.props.navigation);
                }
            });
    }

    render() {
        let buttonDisabled = this.state.typedInput.length !== 12;

        return (
            <View style={styles.viewParrent}>
                <View>
                    <Text>Пожалуйста, введите номер карты</Text>
                </View>
                <View style={styles.card}>
                    <UserCard ref={userCard => this.userCardElement = userCard}>
                        <View style={styles.inputParrent}>
                            <CardInput onType={typedInput => this.setState({ typedInput })} />
                        </View>
                    </UserCard>
                </View>
                {this.state.price && (
                    <View style={styles.afterCardParrent}>
                        <Text style={styles.priceText}>Стоимость смены номера карты: <Text style={styles.textBold}>{this.state.price} грандиков</Text>.</Text>
                        <Button title='Сменить номер' disabled={buttonDisabled} onPress={this.updateNumberButtonHandler} />
                    </View>
                )}
                <PinCodeModal isVisible={this.state.askPinCode} onPinCode={this.onPinCode} onCloseAsk={() => this.setState({ askPinCode: false })} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewParrent: {
        padding: 5
    },

    inputParrent: {
        marginLeft: 10,
        alignItems: 'center',
        marginTop: -10
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