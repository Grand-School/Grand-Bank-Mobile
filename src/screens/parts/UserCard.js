import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ImageBackground, Image, Alert } from 'react-native';
import RestTemplate from '../../RestTemplate';

export class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { backgroundImageUrl: null };
        this.loadSettings();
    }

    loadSettings() {
        const that = this;
        const styleUrl = RestTemplate.getUrl(this.props.card.style);
        fetch(styleUrl)
            .then(response => response.json())
            .then(cardSettings => that.setState({ cardSettings }))
            .catch(error => Alert.alert('Ошибка загрузки настройки стилей карты', error.message));
    }

    styles(name) {
        const settings = this.state.cardSettings;
        if (settings.styles !== undefined && settings.styles.native !== undefined) {
            let stylesJSON = settings.styles.native[name];
            console.log(stylesJSON);
            return stylesJSON === undefined ? {} : stylesJSON;
        }
        return {};
    }

    render() {
        if (!this.state.cardSettings) {
            return <></>;
        }

        const number = getSepparattedCardNumber(this.props.user.creditCard);
        const user = this.props.user.name + ' ' + this.props.user.surname;
        return (
            <ImageBackground style={[ccs.creditCard, this.styles('credit_card')]} imageStyle={ccs.backgroundImage}
                source={{uri: RestTemplate.getUrl(this.state.cardSettings.frontImage)}}>
                <Text style={[ccs.cardTitle, this.styles('card_type')]}>{this.props.card.name}</Text>
                <Image style={[ccs.cardLogo, this.styles('card_logo')]} source={require('../../../img/grand.png')} resizeMode='contain' />
                <Text style={[ccs.cardNumber, this.styles('card_number')]}>{number}</Text>
                <View style={[ccs.leftColumn, this.styles('card_space-75')]}>
                    <Text style={[ccs.label, this.styles('card_label'), this.styles('card_user')]}>Владелец</Text>
                    <Text style={[ccs.ownerName, this.styles('card_info'), this.styles('card_user')]}>{user}</Text>
                </View>
                <View style={[ccs.rightColumn, this.styles('card_space-25')]}>
                    <Text style={[ccs.label, this.styles('card_label'), this.styles('card_label_balance')]}>Баланс</Text>
                    <Text style={[ccs.balance, this.styles('card_info'), this.styles('card_balance')]}>{this.props.user.balance}</Text>
                </View>
            </ImageBackground>
        );
    }
}

function getSepparattedCardNumber(number) {
    let result = '';
    for (let i = 0; i < number.length; i++) {
        result += i % 4 === 0 ? ' ' + number[i] : number[i];
    }
    return result.trim();
}

const ccs = StyleSheet.create({
    creditCard: {
        width: 320,
        height: 190,
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 1000,
        borderRadius: 15
    },

    backgroundImage: {
        borderRadius: 15
    },

    cardTitle: {
        borderRadius: 5,
        height: 40,
        fontSize: 25,
        color: 'white',
        padding: 10
    },

    cardLogo: {
        position: 'absolute',
        right: 18,
        width: 90,
        height: 50
    },

    cardNumber: {
        letterSpacing: 2,
        color: '#fff',
        textAlign: 'center',
        fontSize: 25,
        width: '100%',
        marginBottom: 25,
        marginTop: 35
    },

    leftColumn: {
        width: '75%',
        position: 'absolute',
        bottom: 15,
        left: 15
    },

    rightColumn: {
        width: '25%',
        position: 'absolute',
        bottom: 15,
        right: 0
    },

    label: {
        fontSize: 10,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1
    },

    ownerName: {
        marginBottom: 0,
        marginTop: 5,
        fontSize: 16,
        lineHeight: 18,
        color: '#fff',
        letterSpacing: 1,
        textTransform: 'uppercase'
    },

    balance: {
        marginBottom: 0,
        marginTop: 5,
        fontSize: 16,
        lineHeight: 18,
        color: '#fff',
        letterSpacing: 1,
        textTransform: 'uppercase'
    }
});
