import React from 'react';
import { LoginPage } from './LoginPage';
import { MainPage } from './MainPage';
import { LoadingScreen } from './LoadingScreen';
import { Alert, AlertButton } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RestTemplate from './RestTemplate';

const AUTHENTICATION_ITEM_NAME = 'authentication';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
    this.tryLogin();

    this.handlers = {
      onLogout: this.logout.bind(this)
    };

    this.onLogin = this.onLogin.bind(this);
  }

  logout() {
    Alert.alert('Выход', 'Вы уверены, что хотте выйти?', [
      {
        text: 'Выйти',
        onPress: () => {
          AsyncStorage.removeItem(AUTHENTICATION_ITEM_NAME);
          this.setState({ authorization: null });
        }
      },
      {
        text: 'Отменить',
        style: 'cancel'
      }
    ])
  }

  onLogin(authorization) {
    AsyncStorage.setItem(AUTHENTICATION_ITEM_NAME, JSON.stringify(authorization))
      .catch(error => Alert.alert('Ошибка сохранения авторизации'));
    this.login(authorization);
  }

  async tryLogin() {
    const authorization = await AsyncStorage.getItem(AUTHENTICATION_ITEM_NAME)
      .catch(error => Alert.alert('Ошибка получения авторизации'));
    if (authorization) {
      this.login(JSON.parse(authorization));
    } else {
      this.setState({ loading: false });
    }
  }

  login(authorization) {
    const that = this;
    this.setState({ authorization, loading: true });
    RestTemplate.setAuthorization(authorization);

    let loadUserPromise = RestTemplate.get('/rest/users/profile')
      .then(user => that.setState({ user }));
    
    let loadCreditCardsPromise = RestTemplate.get('/rest/api/creditcard')
      .then(creditCardsInfo => that.setState({ creditCardsInfo }));

    Promise.all([ loadUserPromise, loadCreditCardsPromise ])
      .then(() => that.setState({ loading: false }));
  }

  render() {
    if (this.state.loading) {
      return <LoadingScreen />
    }

    return this.state.authorization && this.state.user
        ? <MainPage authorization={this.state.authorization} user={this.state.user} 
                    creditCardsInfo={this.state.creditCardsInfo} handlers={this.handlers} /> 
        : <LoginPage onData={this.onLogin} />;
  }
}
