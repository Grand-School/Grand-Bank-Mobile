import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from 'react-native';
import { CardInput } from '../../elements/CardInput';
import { PinCodeModal } from '../../elements/PinCodeModal';
import RestTemplate from '../../RestTemplate';
import { updateProfileAndGoBack, parseErrorResponse } from '../../Utils';

export class TranslatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sendType: null,
            card: '',
            price: '',
            message: null,
            askPinCode: false
        };

        this.sendData = this.sendData.bind(this);
        this.send = this.send.bind(this);
    }

    isDataValid() {
        return this.state.sendType !== null && this.state.card.length === 12 && this.state.price !== '';
    }

    sendData(pinCode) {
        const that = this;
        let additionalUrl = this.state.sendType === 'Запросить' ? '/request' : '';
        let data = this.state.sendType === 'Запросить' ? {
            to: this.state.card,
            message: this.state.message,
            price: this.state.price
        } : {
            to: this.state.card,
            sum: this.state.price,
            pinCode,
            message: this.state.message
        }
        RestTemplate.post('/rest/profile/transaction' + additionalUrl, data)
            .then(({ data, requestInfo }) => {
                that.setState({ askPinCode: false });
                if (requestInfo.isOk) {
                    updateProfileAndGoBack(that.props.navigation);
                } else {
                    Alert.alert('Ошибка перевода!', parseErrorResponse(data));
                }
            });
    }

    send() {
        if (this.state.sendType === 'Запросить') {
            this.sendData(null);
        } else {
            this.setState({ askPinCode: true });
        }
    }

    render() {
        return (
            <View style={style.form}>
                <Switch items={['Отправить', 'Запросить']} onSwitch={sendType => this.setState({ sendType })} />
                <CardNumberInput onType={card => this.setState({ card })} />
                <PriceInput onPrice={price => this.setState({ price })} />
                <MessageInput onChangeText onMessage={message => this.setState({ message })} />
                <Button title='Отправить' disabled={!this.isDataValid()} onPress={this.send} />
                <PinCodeModal isVisible={this.state.askPinCode} onCloseAsk={() => this.setState({ askPinCode: false })} onPinCode={this.sendData} />
            </View>
        );
    }
}

class CardNumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            card: '',
            findText: null
        };
        this.onType = this.onType.bind(this);
    }

    onType(card) {
        this.props.onType(card);
        
        if (card.length === 12) {
            const that = this;
            RestTemplate.get('/rest/users/card/' + card)
                .then(({ data, requestInfo }) => {
                    if (requestInfo.isOk) {
                        that.setState({ findText: data.name + ' ' + data.surname });
                    } else if (requestInfo.status === 422 && data.type === 'DATA_NOT_FOUND') {
                        that.setState({ findText: 'Пользователь не найден' });
                    }
                });
        } else {
            this.setState({ findText: null });
        }
    }

    render() {
        const additionalTitle = this.state.findText 
                ? <>: <Text style={{ fontWeight: '600' }}>{this.state.findText}</Text></> 
                : <></>;
        const title = <Text>Введите номер карты{additionalTitle}</Text>
        return (
            <Item title={title}>
                <View style={{ alignItems: 'center' }}>
                    <CardInput onType={this.onType} textColor='black' />
                </View>
            </Item>
        );
    }
}

class PriceInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { price: '' };
        this.onChangeTextHandler = this.onChangeTextHandler.bind(this);
    }

    onChangeTextHandler(price) {
        if (price !== '' 
            && !['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].includes(price[price.length - 1])) {
            return;
        }

        if (price.includes('.') && price.substring(price.indexOf('.')).length > 3) {
            return;
        }

        this.setState({ price });
        this.props.onPrice(price);
    }

    render() {
        return (
            <Item title='Введите сумму' style={{ alignItems: 'center' }}>
                <TextInput onChangeText={this.onChangeTextHandler} value={this.state.price} 
                    keyboardType='numeric' style={style.input} />
            </Item>
        );
    }
}

const Item = props => (
    <View style={style.cardInputView}>
        {typeof props.title === 'string' ? <Text>{props.title}</Text> : props.title}
        <View style={[style.cardInput, props.style ? props.style : {}]}>{props.children}</View>
    </View>
);

class Switch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: null };
        this.select = this.select.bind(this);
    }

    select(index) {
        this.setState({ selected: index });
        this.props.onSwitch(this.props.items[index]);
    }

    render() {
        return (
            <View style={style.switch}>
                {this.props.items.map((item, index) => (
                    <SwitchableButton onPress={() => this.select(index)} key={item}
                        selected={this.state.selected === index}>{item}</SwitchableButton>
                ))}
            </View>
        );
    }
}

class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(message) {
        if (message.length > 300) {
            return;
        }

        this.setState({ message });
        this.props.onMessage(message);
    }

    render() {
        return (
            <Item title='Введите сообщение (не обязательно)' style={{ alignItems: 'center' }}>
                <TextInput value={this.state.message} onChangeText={this.handleChange} style={style.input} />
            </Item>
        );
    }
}

const SwitchableButton = props => (
    <TouchableOpacity style={[style.switchItem, props.selected && style.selectedItem]} onPress={props.onPress}>
        <Text style={[style.switchItemText, props.selected && style.selectedItemText]}>{props.children}</Text>
    </TouchableOpacity>
);

const style = StyleSheet.create({
    form: {
        alignItems: 'center',
        padding: 15
    },

    switch: {
        flexWrap: 'wrap', 
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1
    },

    switchItem: {
        width: '50%',
        borderWidth: 1,
        borderColor: 'black',
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 5,
        borderWidth: 0
    },

    switchItemText: {
        textAlign: 'center'
    },

    selectedItem: {
        backgroundColor: 'rgb(40, 167, 69)'
    },

    selectedItemText: {
        color: 'white'
    },

    cardInput: {
        width: '100%',
        height: 40,
        marginTop: 5
    },

    cardInputView: {
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        alignSelf: 'center'
    },

    input: {
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: '80%',
        color: 'black',
        textAlign: 'center',
        fontSize: 25
    }
});