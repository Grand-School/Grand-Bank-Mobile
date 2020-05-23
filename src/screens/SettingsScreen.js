import React from 'react';
import { Text, View, Button, StyleSheet, SafeAreaView, TouchableHighlight } from 'react-native';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';
import Icon from 'react-native-vector-icons/FontAwesome';

export class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
  }

  render() {
    let user = this.params.user;

    return (
      <SafeAreaView>
        <View style={{ padding: 10 }}>
          <Text style={style.userName}>{user.name} {user.surname}</Text>

          <View style={style.actionsList}>
            <View>
              <Text style={style.sectionTitle}>Профиль</Text>
              
              <View style={style.buttonsList}>
                <SettingsButton onPress={this.params.handlers.onLogout} icon='sign-out' text='Выйти' />
                <SettingsButton onPress={this.params.handlers.onLogout} icon='sign-out' text='Выйти' lastItem={true} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

function SettingsButton(props) {
  let viewStyle = !props.lastItem ? { borderBottomColor: 'black', borderBottomWidth: 1 } : {};
  return (
    <TouchableHighlight onPress={props.onPress} style={[bs.btnTouchable]}>
      <View style={[bs.btn, bs.btnLight, style.buttonView, viewStyle]}>
        <View style={style.iconView}>
          <Icon style={style.buttonIcon} name={props.icon} size={24} />
        </View>
        <View style={style.textView}>
          <Text style={style.buttonText}>{props.text}</Text>
        </View>
      </View>
    </TouchableHighlight>
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
    marginTop: 5
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
  }
});