import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserCard } from './parts/UserCard';
import { ButtonsGroup, Button } from './parts/ButtonsGroup';
import { ChangeCardNumberPage } from './parts/ChangeCardNumberPage'; 
import { ChangeCardTarif } from './parts/ChangeCardTarif';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.Stack = createStackNavigator();
    }

    render() {
        const Stack = this.Stack;
        return (
            <Stack.Navigator>
                <Stack.Screen name='Главная' component={MainPage} />
                <Stack.Screen name='Смена номера карты' component={ChangeCardNumberPage} />
                <Stack.Screen name='Смена тарифа карты' component={ChangeCardTarif} />
            </Stack.Navigator>
        );
    }
}

function MainPage({ navigation }) {
    return (
        <SafeAreaView>
            <View style={styles.card}>
                <UserCard />
            </View>
            <View style={styles.buttonsGroup}>
                <ButtonsGroup>
                    <Button title='Перевод' icon='exchange' colors={['#20bf55', '#01baef']} onPress={() => Alert.alert('translate')} />
                    <Button title='Смена тарифа карты' icon='credit-card' colors={['#fce043','#fb7ba2']} onPress={() => navigation.navigate('Смена тарифа карты')} />
                    <Button title='Смена номера карты' icon='numeric' colors={['#9fa4c4', '#9e768f']} onPress={() => navigation.navigate('Смена номера карты')} iconElement={MaterialCommunityIcons} />
                    <Button title='Активировать купон' icon='ticket' colors={['#fce043','#fb7ba2']} onPress={() => Alert.alert('translate')} />
                </ButtonsGroup>
            </View>
        </SafeAreaView>
    );
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