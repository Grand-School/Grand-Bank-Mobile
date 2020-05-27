import React from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserCard } from '../elements/UserCard';
import { ButtonsGroup, Button } from '../elements/ButtonsGroup';
import { ChangeCardNumberPage } from './homeScreenPages/ChangeCardNumberPage'; 
import { ChangeCardTarifPage } from './homeScreenPages/ChangeCardTarifPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Modal from 'react-native-modal';

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
                <Stack.Screen name='Смена тарифа карты' component={ChangeCardTarifPage} />
            </Stack.Navigator>
        );
    }
}

const bootstrapStyleSheet = new BootstrapStyleSheet({}, {});
const s = bootstrapStyleSheet.create();

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    openModal() {
        this.setState({ modalVisible: true });
    }

    openScreen(screen) {
        this.props.navigation.navigate(screen);
        this.closeModal();
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.card}>
                    <UserCard />
                </View>
                <TouchableOpacity onPress={this.openModal} style={[s.btnTouchAble, { width: 320, alignSelf: 'center' }]}>
                    <View style={[s.btn, s.btnInfo, {borderRadius: 15}]}>
                        <Text style={[s.btnText, s.btnTextInfo]}>Действия</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <Modal isVisible={this.state.modalVisible} onSwipeComplete={this.closeModal} swipeDirection={['down']} style={{ justifyContent: 'flex-end', margin: 0 }}>
                        <ButtonsGroup>
                            <Button title='Перевод' icon='exchange' colors={['#20bf55', '#01baef']} onPress={() => Alert.alert('translate')} />
                            <Button title='Смена тарифа карты' icon='credit-card' colors={['#fce043','#fb7ba2']} onPress={() => this.openScreen('Смена тарифа карты')} />
                            <Button title='Смена номера карты' icon='numeric' colors={['#9fa4c4', '#9e768f']} onPress={() => this.openScreen('Смена номера карты')} iconElement={MaterialCommunityIcons} />
                            <Button title='Активировать купон' icon='ticket' colors={['#fce043','#fb7ba2']} onPress={() => Alert.alert('translate')} />
                        </ButtonsGroup>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
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