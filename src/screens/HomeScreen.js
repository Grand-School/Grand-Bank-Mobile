import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { UserCard } from './parts/UserCard';
import { ButtonsGroup, Button } from './parts/ButtonsGroup';
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
                <View style={styles.card}>
                    <UserCard user={user} card={cardInfo} />
                </View>
                <View style={styles.buttonsGroup}>
                    <ButtonsGroup>
                        <Button title='Перевод' icon='exchange' onPress={() => Alert.alert('translate')} />
                        <Button title='Смена номера карты' icon='credit-card' onPress={() => Alert.alert('translate')} />
                        <Button title='Активировать купон' icon='ticket' onPress={() => Alert.alert('translate')} />
                    </ButtonsGroup>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center', 
        marginTop: 10,
        height: 190,
        padding: 5
    },

    buttonsGroup: {
        marginTop: 15
    }
});