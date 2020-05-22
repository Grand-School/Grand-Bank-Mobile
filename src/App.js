import React from 'react';
import { LoginPage } from './LoginPage';
import { MainPage } from './MainPage';
import { LoadingScreen } from './LoadingScreen';
import { Alert } from 'react-native';
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
    AsyncStorage.removeItem(AUTHENTICATION_ITEM_NAME);
    this.setState({ authorization: null });
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
    this.setState({ authorization });
    RestTemplate.setAuthorization(authorization);
    RestTemplate.get('/rest/users/profile')
      .then(user => that.setState({ user, loading: false }))
  }

  render() {
    if (this.state.loading) {
      return <LoadingScreen />
    }

    return this.state.authorization && this.state.user
        ? <MainPage authorization={this.state.authorization} user={this.state.user} handlers={this.handlers} /> 
        : <LoginPage onData={this.onLogin} />;
  }
}
