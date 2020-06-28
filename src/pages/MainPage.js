import React from 'react';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from './../screens/HomeScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SettingsScreen } from './../screens/SettingsScreen';
import { CameraScreen } from '../screens/CameraScreen';
import DataStorage from './../DataStorage';
import { withBadge } from 'react-native-elements';
import { GrandMAuth, setInstance as setGrandMAuthInstance } from '../elements/GrandMAuth'

const navigatioSettings = [
  { name: 'Главная', component: HomeScreen, icon: 'ios-home' },
  { name: 'Уведомления', component: NotificationsScreen, icon: 'ios-notifications', notifications: 'notificationsCount' },
  { name: 'Камера', component: CameraScreen, icon: 'ios-camera' },
  { name: 'Настройки', component: SettingsScreen, icon: 'ios-settings' }
];

export class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.Tab = createBottomTabNavigator();
    this.screenOptions = this.screenOptions.bind(this);
    this.state = {
      notifications: {}
    };

    DataStorage.setData({
      authorization: this.props.authorization,
      user: this.props.user,
      creditCardsInfo: this.props.creditCardsInfo,
      handlers: this.props.handlers,
      cardStyles: {},
      updateHistoryList: () => null,
      notificationsCount: 0
    });

    this.props.handlers.loadNotificationsCount();
  }

  componentWillUnmount() {
    for (let notification in this.state.notifications) {
      let data = this.state.notifications[notification];
      DataStorage.removeOnDataChange(notification, data.handler);
    }
  }

  screenOptions({ route, navigation }) {
    return {
      tabBarIcon: ({ size, color }) => {
        const settings = navigatioSettings.filter(item => item.name === route.name)[0];

        let IconElement = Icon;
        if (settings.notifications) {
          let notifications = this.state.notifications;
          if (!(settings.notifications in this.state.notifications)) {
            const that = this;
            const handler = count => {
              let newState = {
                notifications: { ...that.state.notifications }
              };
              newState.notifications[settings.notifications].count = count;
              that.setState(newState);
            };

            let newState = {
              notifications: { ...this.state.notifications }
            };
            newState.notifications[settings.notifications] = {
              count: DataStorage.getByKey(settings.notifications),
              handler
            };

            DataStorage.onDataChange(settings.notifications, handler);

            this.setState(newState);
            notifications = newState.notifications;
          }

          let count = notifications[settings.notifications].count;
          if (count > 0) {
            IconElement = withBadge(count)(Icon);
          }
        }

        return <IconElement name={settings.icon} size={size} color={color} />
      }
    };
  }

  render() {
    const Tab = this.Tab;
    return (
      <NavigationContainer>
        <Header />
        <Tab.Navigator screenOptions={this.screenOptions}>
          {navigatioSettings.map(item => (
            <Tab.Screen name={item.name} component={item.component} key={item.name} />
          ))}
        </Tab.Navigator>

        <GrandMAuth ref={instance => setGrandMAuthInstance(instance)} />
      </NavigationContainer>
    );
  }
}

function Header() {
  return (
    <SafeAreaView>
      <Text style={style.headerText}>Grand Bank Mobile</Text>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    height: '5%',
  },

  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 15
  }
});