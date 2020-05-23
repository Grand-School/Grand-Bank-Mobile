import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ImageBackground, Image, Alert } from 'react-native';
import RestTemplate from '../RestTemplate';
const getUserCard = (user, creditCardsInfo) => creditCardsInfo.filter(info => info.codeName === user.cardType)[0];

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.route.params;
    }

    render() {
        let user = this.params.user;
        let cardInfo = getUserCard(user, this.params.creditCardsInfo);
        return (
            <SafeAreaView>
                <View style={{ padding: 5 }}>
                    <View style={styles.card}>
                        <UserCard user={user} card={cardInfo} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

class UserCard extends React.Component {
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
            .then(settings => {
                that.setState({
                    backgroundImageUrl: settings.frontImage
                });
            })
            .catch(error => Alert.alert('Ошибка загрузки настройки стилей карты', error.message));
    }

    render() {
        if (!this.state.backgroundImageUrl) {
            return <></>;
        }

        const number = getSepparattedCardNumber(this.props.user.creditCard);
        const user = this.props.user.name + ' ' + this.props.user.surname;
        return (
            <ImageBackground style={ccs.creditCard} imageStyle={ccs.backgroundImage}
                source={{uri: RestTemplate.getUrl(this.state.backgroundImageUrl)}}>
                <Text style={ccs.cardTitle}>{this.props.card.name}</Text>
                <Image style={ccs.cardLogo} source={require('../../img/grand.png')} resizeMode='contain' />
                <Text style={ccs.cardNumber}>{number}</Text>
                <View style={ccs.leftColumn}>
                    <Text style={ccs.label}>Владелец</Text>
                    <Text style={ccs.ownerName}>{user}</Text>
                </View>
                <View style={ccs.rightColumn}>
                    <Text style={ccs.label}>Баланс</Text>
                    <Text style={ccs.balance}>{this.props.user.balance}</Text>
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

const styles = StyleSheet.create({
    card: {
        alignItems: 'center', 
        marginTop: 10,
        height: 190
    }
});