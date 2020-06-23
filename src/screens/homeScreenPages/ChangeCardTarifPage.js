import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import DataStorage from '../../DataStorage';
import { UserCard } from '../../elements/UserCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import RestTemplate from '../../RestTemplate';
import { updateProfileAndGoBack, findCard, printMessage } from '../../Utils';
import { PinCodeModal } from '../../elements/PinCodeModal';

export class ChangeCardTarifPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: DataStorage.getByKey('user'),
            askPinCode: false
        }

        this.buyCard = this.buyCard.bind(this);
        this.updateUser = this.updateUser.bind(this);
        
        this.pinCodeCallback = () => null;
        DataStorage.onDataChange('user', this.updateUser);
    }

    buyCard(cardType, image) {
        let newCard = findCard(cardType);
        let oldCard = findCard(this.state.user.cardType);
        if (newCard.price <= oldCard.price) {
            Alert.alert('Вы уверены?', 'Вы уверены, что хотите купить карту, со стоимостью меньшей предыдущей?', [
                { text: 'Нет', style: 'cancel' },
                { text: 'Да', onPress: () => this.proccessBuy(cardType, image) }
            ]);
        } else {
            this.proccessBuy(cardType, image);
        }
    }

    proccessBuy(cardType, image) {
        const that = this;
        this.pinCodeCallback = pinCode => {
            RestTemplate.post(`/rest/profile/card/${cardType}?pinCode=${pinCode}&image=${image}`)
                .then(({ requestInfo, data }) => {
                    that.setState({ askPinCode: false });
                    printMessage(requestInfo, data, 'Вы успешно изменили тариф карты!');
                    if (requestInfo.isOk) {
                        updateProfileAndGoBack(that.props.navigation);
                    }
                    that.pinCodeModal.clear();
                });
        };
        this.setState({ askPinCode: true });
    }

    updateUser(user) {
        this.setState({ user });
    }

    componentWillUnmount() {
        DataStorage.removeOnDataChange('user', this.updateUser);
    }

    render() {
        let user = this.state.user;
        let creditCards = DataStorage.getByKey('creditCardsInfo')
                .filter(card => card.ableToBuy);

        return (
            <ScrollView style={{ padding: 15 }}>
                <View style={{ alignItems: 'center', paddingBottom: 15 }}>
                    {creditCards.map(card => <CardInfo key={card.codeName} card={card} 
                            buyAble={card.codeName !== user.cardType} onBuy={(image) => this.buyCard(card.codeName, image)} />)}
                </View>

                <PinCodeModal isVisible={this.state.askPinCode} onPinCode={this.pinCodeCallback} onCloseAsk={() => this.setState({ askPinCode: false })} ref={ref => this.pinCodeModal = ref} />
            </ScrollView>
        );
    }    
}

const CardInfo = props => {
    const [images, setImages] = useState(null);
    const [page, setPage] = useState(0);
    useEffect(() => {
        if (images !== null) {
            return;
        }
        fetch(RestTemplate.getUrl(props.card.style))
            .then(response => response.json())
            .then(style => setImages(style.images));
    });

    return (
        <View style={[style.creditCardInfo, { marginBottom: 15 }]}>
            <View style={style.creditCardView}>
                <UserCard cardTarif={props.card.codeName} image={page} />
            </View>

            {images !== null && images.length > 1 && (
                <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => { if (page !== 0) setPage(page - 1) }}>
                        <Icon name='caret-left' size={50} color='#3498DB' />
                    </TouchableOpacity>

                    <Text style={{ fontWeight: '600', fontSize: 40, marginLeft: 15, marginRight: 15 }}>{page + 1}</Text>

                    <TouchableOpacity onPress={() => { if (page + 1 < images.length) setPage(page + 1) }}>
                        <Icon name='caret-right' size={50} color='#3498DB' />
                    </TouchableOpacity>
                </View>
            )}

            <Text style={style.cardTitle}>{props.card.name}</Text>
            <View style={style.cardInfo}>
                <ListItem>Налог на премию: <Text style={style.bold}>{props.card.tax.awards}%</Text></ListItem>
                <ListItem>Налог на штраф: <Text style={style.bold}>{props.card.tax.fines}%</Text></ListItem>
                <ListItem>Налог на покупку: <Text style={style.bold}>{props.card.tax.purchase}%</Text></ListItem>
                <ListItem>Налог на зарплату: <Text style={style.bold}>{props.card.tax.salary}%</Text></ListItem>
                <ListItem>Налог на активацию купона: <Text style={style.bold}>{props.card.tax.coupon}%</Text></ListItem>
                {props.card.servicePay && <ListItem>Оплата за обслуживание: <Text style={style.bold}>{props.card.servicePay} грандиков</Text></ListItem>}
                {props.card.minimumCosts && <ListItem>Минимальные расходы в месяц: <Text style={style.bold}>{props.card.minimumCosts} грандиков</Text></ListItem>}
            </View>
            {props.card.additional && props.card.additional.length !== 0 && (
                <View>
                    <Text>Дополнительные возможности:</Text>
                    <View style={[style.cardInfo, { paddingTop: 5 }]}>
                        {props.card.additional.map((info, index) => (
                            <ListItem key={index}>{info}</ListItem>
                        ))}
                    </View>
                </View>
            )}
            <Button title='Купить' disabled={!props.buyAble} onPress={() => props.onBuy(page)} />
        </View>
    );
}

const ListItem = props => {
    return (
        <View style={style.listItem}>
            <Icon name='circle' size={7} style={style.listItemIcon} />
            <Text style={style.listItemText}>{props.children}</Text>
        </View>
    );
};

const style = StyleSheet.create({
    creditCardInfo: {
        borderColor: 'rgba(0, 0, 0, 0.125)',
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        marginBottom: 15,
        width: 350
    },

    cardInfo: {
        padding: 15
    },

    creditCardView: {
        height: 200,
        alignItems: 'center'
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black'
    },

    listItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    listItemText: {
        marginLeft: 5
    },

    listItemIcon: {
        marginTop: 5
    },

    bold: {
        fontWeight: '600'
    }
});