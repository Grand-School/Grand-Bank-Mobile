import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import DataStorage from '../DataStorage';
import { userRoleAsString } from '../Utils';
import { ChangeUsernamePage } from './settingsScreenPages/ChangeUsernamePage';
import { ChangePasswordPage } from './settingsScreenPages/ChangePasswordPage';
import { ChangePinCode } from './settingsScreenPages/ChangePinCodeScript';
import ChangeCardBackgroundPage from './settingsScreenPages/ChangeCardBackgroundPage';
import { showMessage } from 'react-native-flash-message';

export function SettingsScreen() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name='Настройки' component={MainPage} />
      <Stack.Screen name='Изменить логин' component={ChangeUsernamePage} />
      <Stack.Screen name='Изменить фон карты' component={ChangeCardBackgroundPage} />
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
      .then(() => showMessage({
        message: 'Успех!',
        description: 'Вы успешно обновили профиль',
        type: 'success'
      }));
  }

  render() {
    const handlers = DataStorage.getByKey('handlers');

    return (
      <SafeAreaView>
        <View style={{ padding: 10 }}>
          <UserInfo />

          <View>
            <ActionsList title='Профиль'>
              <SettingsButton onPress={() => this.props.navigation.navigate('Изменить логин')} icon='user' iconElement={AntDesignIcon} 
                  text='Изменить логин' colors={['#aff6cf', '#9f98e8']} firstItem={true} />
              <SettingsButton onPress={() => this.props.navigation.navigate('Изменить фон карты')} icon='image' iconElement={FontAwesome} 
                  text='Изменить фон карты' colors={['#aff6cf', '#9f98e8']} />
              <SettingsButton onPress={() => this.props.navigation.navigate('Изменить пароль')} icon='key' iconElement={AntDesignIcon} 
                  text='Изменить пароль' colors={['#b1ade2', '#7ddff8']} />
              <SettingsButton onPress={() => this.changePinCode.start()} icon='numeric' iconElement={MaterialCommunityIcons} 
                  text='Изменить пин-код' colors={['#f0ecfc', '#c797eb']} lastItem={true} />
            </ActionsList>

            <ActionsList title='Аккаунт'>
              <SettingsButton onPress={this.updateUserProfile} icon='refresh' 
                  text='Обновить профиль' colors={['#bbf0f3', '#f6d285']} firstItem={true} />
              <SettingsButton onPress={() => handlers.onLogout(true)} icon='sign-out' 
                  text='Выйти' colors={['#ee9617', '#fe5858']} lastItem={true} />
            </ActionsList>
          </View>
        </View>
        <ChangePinCode ref={ref => this.changePinCode = ref} />
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
            <IconElement style={style.buttonIcon} name={props.icon} size={30} />
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
    <View style={{ marginTop: 15 }}>
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
    width: 35,
    height: 35,
    textAlign: 'center'
  },

  iconView: {
    borderRadius: 5,
    padding: 5,
    marginRight: 5,
    width: 40,
    height: 40,
    maxWidth: 40,
    maxHeight: 40,
    alignItems: 'center'
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