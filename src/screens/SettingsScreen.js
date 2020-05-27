import React from 'react';
import { Text, View, Button, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import DataStorage from '../DataStorage';
import { userRoleAsString } from '../Utils';

export class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.updateUserProfile = this.updateUserProfile.bind(this);
  }

  updateUserProfile() {
    DataStorage.getByKey('handlers').updateUserProfile()
      .then(() => Alert.alert('Успех!', 'Вы успешно обновили профиль!'));
  }

  render() {
    let user = DataStorage.getByKey('user');
    const handlers = DataStorage.getByKey('handlers');

    return (
      <SafeAreaView>
        <View style={{ padding: 10 }}>
          <UserInfo user={user} />

          <View style={style.actionsList}>
            <ActionsList title='Профиль'>
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

  return (
    <View>
      <TouchableOpacity onPress={props.onPress} style={btnTouchable}>
        <View style={[btnStyle, bs.btnLight, style.buttonView, radiusStyle]}> 
          <LinearGradient colors={props.colors} style={style.iconView}>
            <Icon style={style.buttonIcon} name={props.icon} size={24} />
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

const UserInfo = props => {
  return (
    <View>
      <Text style={style.userName}>{props.user.name} {props.user.surname}</Text>
      <Text>Логин: <Text style={style.bold}>{props.user.username}</Text></Text>
      <Text>Класс: <Text style={style.bold}>{props.user.class}</Text></Text>
      <Text>Зарплата: <Text style={style.bold}>{props.user.salary} грандиков</Text></Text>
      <Text>Роль: <Text style={style.bold}>{userRoleAsString(props.user.role)}</Text></Text>
    </View>
  );
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