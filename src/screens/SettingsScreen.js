import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import DataStorage from '../DataStorage';
import { userRoleAsString } from '../Utils';
import { ChangeUsernamePage } from './settingsScreenPages/ChangeUsernamePage';
import { ChangePasswordPage } from './settingsScreenPages/ChangePasswordPage';

export function SettingsScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name='Главная' component={MainPage} />
      <Stack.Screen name='Изменить логин' component={ChangeUsernamePage} />
      <Stack.Screen name='Изменить пароль' component={ChangePasswordPage} />
    </Stack.Navigator>
  );
}

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.updateUserProfile = this.updateUserProfile.bind(this);
  }

  updateUserProfile() {
    DataStorage.getByKey('handlers').updateUserProfile()
      .then(() => Alert.alert('Успех!', 'Вы успешно обновили профиль!'));
  }

  render() {
    const handlers = DataStorage.getByKey('handlers');

    return (
      <SafeAreaView>
        <View style={{ padding: 10 }}>
          <UserInfo />

          <View style={style.actionsList}>
            <ActionsList title='Профиль'>
              <SettingsButton onPress={() => this.props.navigation.navigate('Изменить логин')} icon='key' iconElement={FontAwesome5Icon} 
                  text='Изменить логин' colors={['#bbf0f3', '#f6d285']} firstItem={true} />
              <SettingsButton onPress={() => this.props.navigation.navigate('Изменить пароль')} icon='key' iconElement={FontAwesome5Icon} 
                  text='Изменить пароль' colors={['#bbf0f3', '#f6d285']} lastItem={true} />
            </ActionsList>

            <ActionsList title='Аккаунт'>
              <SettingsButton onPress={this.updateUserProfile} icon='refresh' 
                  text='Обновить профиль' colors={['#bbf0f3', '#f6d285']} firstItem={true} />
              <SettingsButton onPress={handlers.onLogout} icon='sign-out' 
                  text='Выйти' colors={['#ee9617', '#fe5858']} lastItem={true} />
            </ActionsList>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

function SettingsButton(props) {
  let btnStyle = { ...bs.btn };
  delete btnStyle.borderRadius;
  delete btnStyle.borderStyle;
  delete btnStyle.borderColor;
  delete btnStyle.borderWidth;

  let btnTouchable = { ...bs.btnTouchable };
  delete btnTouchable.borderRadius;

  let radiusStyle = {};
  if (props.lastItem) {
    radiusStyle.borderBottomLeftRadius = 5;
    radiusStyle.borderBottomRightRadius = 5;
  } else if (props.firstItem) {
    radiusStyle.borderTopLeftRadius = 5;
    radiusStyle.borderTopRightRadius = 5;
  }

  let IconElement = props.iconElement || Icon;

  return (
    <View>
      <TouchableOpacity onPress={props.onPress} style={btnTouchable}>
        <View style={[btnStyle, bs.btnLight, style.buttonView, radiusStyle]}> 
          <LinearGradient colors={props.colors} style={style.iconView}>
            <IconElement style={style.buttonIcon} name={props.icon} size={24} />
          </LinearGradient>
          <View style={style.textView}>
            <Text style={style.buttonText}>{props.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {!props.lastItem && (
        <View style={bs.btnLight}>
          <View style={style.bottomButtonLine} />
        </View>
      )}
    </View>
  );
}

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: DataStorage.getByKey('user')
    };

    this.updateUser = this.updateUser.bind(this);
    DataStorage.onDataChange('user', this.updateUser);
  }

  componentWillUnmount() {
    DataStorage.removeOnDataChange('user', this.updateUser);
  }

  updateUser(user) {
    this.setState({ user })
  }

  render() {
    return (
      <View>
        <Text style={style.userName}>{this.state.user.name} {this.state.user.surname}</Text>
        <Text>Логин: <Text style={style.bold}>{this.state.user.username}</Text></Text>
        <Text>Класс: <Text style={style.bold}>{this.state.user.class}</Text></Text>
        <Text>Зарплата: <Text style={style.bold}>{this.state.user.salary} грандиков</Text></Text>
        <Text>Роль: <Text style={style.bold}>{userRoleAsString(this.state.user.role)}</Text></Text>
      </View>
    );
  }
}

const ActionsList = props => {
  return (
    <View>
      <Text style={style.sectionTitle}>{props.title}</Text>
      
      <View style={style.buttonsList}>
        {props.children}
      </View>
    </View>
  )
}

const bootstrapStyleSheet = new BootstrapStyleSheet({}, {});
const bs = bootstrapStyleSheet.create();

const style = StyleSheet.create({
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: 'black'
  },

  actionsList: {
    marginTop: 40
  },

  buttonsList: {
    marginTop: 5,
    borderRadius: 15
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black'
  },

  buttonView:  {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },

  buttonText: {
    fontSize: 21,
    fontWeight: '500',
    textAlign: 'left'
  },

  buttonIcon: {
    marginRight: 10,
    minWidth: 30
  },

  iconView: {
    borderRadius: 5,
    padding: 5,
    maxWidth: 30,
    marginRight: 5
  },

  textView: {
    justifyContent: 'center'
  },

  bottomButtonLine: {
    borderBottomColor: '#6c757d',
    borderBottomWidth: 1,
    width: '93%',
    alignSelf: 'center'
  },

  bold: {
    fontWeight: '600'
  },

  userInfo: {
    fontSize: 18
  }
});