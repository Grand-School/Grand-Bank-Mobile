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
                        <Button title='Перевод' icon='exchange' colors={['#20bf55', '#01baef']} onPress={() => Alert.alert('translate')} />
                        <Button title='Смена номера карты' icon='credit-card' colors={['#9fa4c4', '#9e768f']} onPress={() => Alert.alert('translate')} />
                        <Button title='Активировать купон' icon='ticket' colors={['#fce043','#fb7ba2']} onPress={() => Alert.alert('translate')} />
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