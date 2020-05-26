import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, ImageBackground, Image, Alert } from 'react-native';
import RestTemplate from '../../RestTemplate';
import DataStorage from '../../DataStorage';
import { getUserCard, findCard } from '../../Utils';
import CustomFontProvider, { useCustomFont } from 'react-native-custom-fonts';

let userCardCounter = 0;

export class UserCard extends React.Component {
    constructor(props) {
        super(props);
        let user = DataStorage.getByKey('user');
        let creditCardInfo = DataStorage.getByKey('creditCardsInfo');
        this.id = ++userCardCounter;

        let card = props.cardTarif ? findCard(props.cardTarif, creditCardInfo) : getUserCard(user, creditCardInfo);
        this.state = {
            cardSettings: null,
            card, user,
            fontLoading: true
        };

        let cardSetting = DataStorage.getByKey('cardStyles')[card.codeName];
        if (cardSetting === undefined) {
            this.loadSettings();
        } else {
            this.state.cardSettings = cardSetting;
        }

        this.onUserUpdate = this.onUserUpdate.bind(this);
        if (!props.cardTarif) {
            DataStorage.onDataChange('user', this.onUserUpdate, this.id);
        }

        this.fontDownloadingEnd = this.fontDownloadingEnd.bind(this);
    }

    componentWillUnmount() {
        DataStorage.removeOnDataChange('user', this.onUserUpdate, this.id);
    }

    onUserUpdate(user) {
        let creditCardInfo = DataStorage.getByKey('creditCardsInfo');
        this.setState({
            cardSettings: null,
            card: getUserCard(user, creditCardInfo),
            user
        });
        this.loadSettings();
    }

    loadSettings() {
        const that = this;
        const styleUrl = RestTemplate.getUrl(this.state.card.style);
        fetch(styleUrl)
            .then(response => response.json())
            .then(cardSettings => {
                DataStorage.getByKey('cardStyles')[that.state.card.codeName] = cardSettings;
                that.setState({ cardSettings })
            })
            .catch(error => Alert.alert('Ошибка загрузки настройки стилей карты', error.message));
    }

    styles(name) {
        const settings = this.state.cardSettings;
        if (settings.styles !== undefined && settings.styles.native !== undefined) {
            let styles = settings.styles.native[name];
            return styles === undefined ? {} : styles;
        }
        return {};
    }

    getFontFaces() {
        const fontsArray = this.state.cardSettings.loadFonts
            .filter(font => font.native !== undefined)
            .map(font => ({
                uri: RestTemplate.getUrl(font.native.uri),
                fontFamily: font.native.fontFamily,
                fontWeight: font.native.fontWeight,
                fontStyle: font.native.fontStyle,
                color: font.native.color
            }));

        const result = {};
        fontsArray.forEach(font => result[font.fontFamily] = font);
        return result;
    }

    getCustomFont(className) {
        if (this.state.fontLoading) {
            return '';
        }

        let settings = this.state.cardSettings.setFonts[className];
        return settings ? settings.fontFamily : '';
    }

    fontDownloadingEnd() {
        if (!this.state.fontLoading) {
            return;
        }

        this.setState({
            fontLoading: false
        });
    }

    render() {
        if (!this.state.cardSettings) {
            return (
                <View style={[ccs.creditCard, { backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: 'white', fontSize: 24, fontWeight: '600' }}>Загрузка...</Text>
                </View>
            );
        }

        const number = getSeparatedCardNumber(this.state.user.creditCard);
        const user = this.state.user.name + ' ' + this.state.user.surname;
        const fontsMap = {
            'card_type': this.getCustomFont('card_type'),
            'card_number': this.getCustomFont('card_number'),
            'card_label_owner': this.getCustomFont('card_label_owner'),
            'card_user': this.getCustomFont('card_user'),
            'card_label_balance': this.getCustomFont('card_label_balance'),
            'card_balance': this.getCustomFont('card_balance')
        };

        return (
            <ImageBackground style={[ccs.creditCard, this.styles('credit_card')]} imageStyle={ccs.backgroundImage}
                    source={{uri: RestTemplate.getUrl(this.state.cardSettings.frontImage)}}>
                <CustomFontProvider fontFaces={this.getFontFaces()} onDownloadDidEnd={this.fontDownloadingEnd}>
                    <CardTextComponent fontName={fontsMap['card_type']} style={[ccs.cardTitle, this.styles('card_type')]}>{this.state.card.name}</CardTextComponent>
                    <Image style={[ccs.cardLogo, this.styles('card_logo')]} source={require('../../../img/grand.png')} resizeMode='contain' />

                    {this.props.children ? (
                        <View style={[ccs.cardNumber, this.styles('card_number')]}>{this.props.children}</View>
                    ) : (
                        <CardTextComponent fontName={fontsMap['card_number']} style={[ccs.cardNumber, this.styles('card_number')]}>{number}</CardTextComponent>
                    )}

                    <View style={[ccs.leftColumn, this.styles('card_space-75')]}>
                        <CardTextComponent fontName={fontsMap['card_label_owner']} style={[ccs.label, this.styles('card_label'), this.styles('card_label_owner')]}>Владелец</CardTextComponent>
                        <CardTextComponent fontName={fontsMap['card_user']} style={[ccs.ownerName, this.styles('card_info'), this.styles('card_user')]}>{user}</CardTextComponent>
                    </View>
                    <View style={[ccs.rightColumn, this.styles('card_space-25')]}>
                        <CardTextComponent fontName={fontsMap['card_label_balance']} style={[ccs.label, this.styles('card_label'), this.styles('card_label_balance')]}>Баланс</CardTextComponent>
                        <CardTextComponent fontName={fontsMap['card_balance']} style={[ccs.balance, this.styles('card_info'), this.styles('card_balance')]}>{this.state.user.balance}</CardTextComponent>
                    </View>
                </CustomFontProvider>
            </ImageBackground>
        );
    }
}

const CardTextComponent = props => {
    const fontStyles = props.fontName === '' ? {} : useCustomFont(props.fontName).style;
    const styles = [fontStyles, ...props.style]
    return <Text style={styles}>{props.children}</Text>;
  };
  

function getSeparatedCardNumber(number) {
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
        padding: 10,

        fontFamily: "Lacquer",
        fontWeight: "400",
        fontStyle: "normal",
        color: "white"
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
