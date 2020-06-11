import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserCard } from '../elements/UserCard';
import { ButtonsGroup, Button } from '../elements/ButtonsGroup';
import { ChangeCardNumberPage } from './homeScreenPages/ChangeCardNumberPage'; 
import { ChangeCardTarifPage } from './homeScreenPages/ChangeCardTarifPage';
import { TranslatePage } from './homeScreenPages/TranslatePage';
import { UserOperationsHistory } from '../elements/UserOperationsHistory';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import subscribeToSocket from '../SocketHandlers';

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.Stack = createStackNavigator();
        subscribeToSocket();
    }

    render() {
        const Stack = this.Stack;
        return (
            <Stack.Navigator>
                <Stack.Screen name='Главная' component={MainPage} />
                <Stack.Screen name='Перевод' component={TranslatePage} />
                <Stack.Screen name='Смена номера карты' component={ChangeCardNumberPage} />
                <Stack.Screen name='Смена тарифа карты' component={ChangeCardTarifPage} />
            </Stack.Navigator>
        );
    }
}

const bootstrapStyleSheet = new BootstrapStyleSheet({}, {});
const s = bootstrapStyleSheet.create();

function MainPage(props) {
    const openScreen = screen => props.navigation.navigate(screen);
    return (
        <UserOperationsHistory>
            <View style={styles.card}>
                <UserCard />
            </View>
            <ButtonsGroup style={{ marginTop: 5 }}>
                <Button title='Перевод' icon='exchange' colors={['#20bf55', '#01baef']} onPress={() => openScreen('Перевод')} />
                <Button title='Тариф' icon='credit-card' colors={['#fce043', '#fb7ba2']} onPress={() => openScreen('Смена тарифа карты')} />
                <Button title='Номер карты' icon='numeric' colors={['#9fa4c4', '#9e768f']} onPress={() => openScreen('Смена номера карты')} iconElement={MaterialCommunityIcons} />
                <Button title='Купон' icon='ticket' colors={['#cdedfd', '#ffec82', '#ffcfd2']} onPress={() => Alert.alert('translate')} />
            </ButtonsGroup>
        </UserOperationsHistory>
    );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center', 
        marginTop: 10,
        marginBottom: 10,
        height: 190,
        padding: 5
    }
});