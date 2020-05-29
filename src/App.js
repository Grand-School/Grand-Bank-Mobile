import React from 'react';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { LoadingPage } from './pages/LoadingPage';
import { Alert, AlertButton } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RestTemplate from './RestTemplate';
import DataStorage from './DataStorage';

const AUTHENTICATION_ITEM_NAME = 'authentication';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
    this.tryLogin();

    this.handlers = {
      onLogout: this.logout.bind(this),
      instanceLogout: this.loggedOut.bind(this),
      updateUserProfile: this.updateUserProfile.bind(this)
    };

    this.onLogin = this.onLogin.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);

    RestTemplate.setLogoutHandler(() => this.loggedOut());
    RestTemplate.setRefreshHandler(data => this.onLogin(data));
  }

  logout() {
    Alert.alert('Выход', 'Вы уверены, что хотте выйти?', [
      {
        text: 'Выйти',
        onPress: () => this.loggedOut()
      },
      {
        text: 'Отменить',
        style: 'cancel'
      }
    ])
  }

  loggedOut() {
    AsyncStorage.removeItem(AUTHENTICATION_ITEM_NAME);
    this.setState({ authorization: null });
  }

  onLogin(authorization) {
    AsyncStorage.mergeItem(AUTHENTICATION_ITEM_NAME, JSON.stringify(authorization))
      .catch(error => Alert.alert('Ошибка сохранения авторизации', error.message));
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

    let loadUserPromise = this.updateUserProfile();
    
    let loadCreditCardsPromise = RestTemplate.get('/rest/api/creditcard')
      .then(({ data: creditCardsInfo }) => that.setState({ creditCardsInfo }))
      .catch(error => Alert.alert('Ошибка загрузки настроек карт', error.message));

    Promise.all([ loadUserPromise, loadCreditCardsPromise ])
      .then(() => that.setState({ loading: false }));
  }

  updateUserProfile() {
    const that = this;
    return RestTemplate.get('/rest/users/profile')
      .then(({ data: user }) => {
        DataStorage.put('user', user);
        that.setState({ user })
      })
      .catch(error => Alert.alert('Ошибка загрузки профиля', error.message));
  }

  render() {
    if (this.state.loading) {
      return <LoadingPage />
    }

    return this.state.authorization && this.state.user
        ? <MainPage authorization={this.state.authorization} user={this.state.user} 
                    creditCardsInfo={this.state.creditCardsInfo} handlers={this.handlers} /> 
        : <LoginPage onData={this.onLogin} />;
  }
}
