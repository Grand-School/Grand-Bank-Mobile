import React from 'react';
import { Text, View, Button, StyleSheet, SafeAreaView, TouchableHighlight, Alert } from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import DataStorage from '../DataStorage';

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
          <Text style={style.userName}>{user.name} {user.surname}</Text>

          <View style={style.actionsList}>
            <View>
              <Text style={style.sectionTitle}>Профиль</Text>
              
              <View style={style.buttonsList}>
                <SettingsButton onPress={this.updateUserProfile} icon='refresh' 
                    text='Обновить профиль' colors={['#bbf0f3', '#f6d285']} firstItem={true} />
                <SettingsButton onPress={handlers.onLogout} icon='sign-out' 
                    text='Выйти' colors={['#ee9617', '#fe5858']} lastItem={true} />
              </View>
            </View>
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
      <TouchableHighlight onPress={props.onPress} style={btnTouchable}>
        <View style={[btnStyle, bs.btnLight, style.buttonView, radiusStyle]}> 
          <LinearGradient colors={props.colors} style={style.iconView}>
            <Icon style={style.buttonIcon} name={props.icon} size={24} />
          </LinearGradient>
          <View style={style.textView}>
            <Text style={style.buttonText}>{props.text}</Text>
          </View>
        </View>
      </TouchableHighlight>
      {!props.lastItem && (
        <View style={bs.btnLight}>
          <View style={style.bottomButtonLine} />
        </View>
      )}
    </View>
  );
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
  }
});