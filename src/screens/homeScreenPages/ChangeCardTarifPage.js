import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import DataStorage from '../../DataStorage';
import { UserCard } from '../../elements/UserCard';
import Icon from 'react-native-vector-icons/FontAwesome';
import RestTemplate from '../../RestTemplate';
import { parseErrorResponse, updateProfileAndGoBack, findCard } from '../../Utils';

export class ChangeCardTarifPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: DataStorage.getByKey('user')
        }

        this.buyCard = this.buyCard.bind(this);
        this.updateUser = this.updateUser.bind(this);
        DataStorage.onDataChange('user', this.updateUser);
    }

    buyCard(cardType) {
        let newCard = findCard(cardType);
        let oldCard = findCard(this.state.user.cardType);
        if (newCard.price <= oldCard.price) {
            Alert.alert('Вы уверены?', 'Вы уверены, что хотите купить карту, со стоимостью меньшей предыдущей?', [
                { text: 'Нет', style: 'cancel' },
                { text: 'Да', onPress: () => this.proccessBuy(cardType) }
            ]);
        } else {
            this.proccessBuy(cardType);
        }
    }

    proccessBuy(cardType) {
        const that = this;
        Alert.prompt('Введите пин-код', 'Для смены тарифа, введите пин-код', pinCode => {
            RestTemplate.post(`/rest/profile/card/${cardType}?pinCode=${pinCode}`)
                .then(({ requestInfo }) => {
                    Alert.alert(requestInfo.isOk ? 'Успех!' : 'Ошибка!', requestInfo.isOk ? null : parseErrorResponse(requestInfo));
                    if (requestInfo.isOk) {
                        updateProfileAndGoBack(that.props.navigation);
                    }
                });
        });
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
                            buyAble={card.codeName !== user.cardType} onBuy={() => this.buyCard(card.codeName)} />)}
                </View>
            </ScrollView>
        );
    }    
}

const CardInfo = props => {
    return (
        <View style={[style.creditCardInfo, { marginBottom: 15 }]}>
            <View style={style.creditCardView}>
                <UserCard cardTarif={props.card.codeName} />
            </View>
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
            <Button title='Купить' disabled={!props.buyAble} onPress={props.onBuy} />
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