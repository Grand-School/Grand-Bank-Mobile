import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const navigatioSettings = [
  { name: 'Главная', component: HomeScreen, icon: 'ios-home' },
  { name: 'Настройки', component: SettingsScreen, icon: 'ios-settings' }
];

export class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.Tab = createBottomTabNavigator();
    this.screenOptions = this.screenOptions.bind(this);
  }

  screenOptions({ route }) {
    route.params = {
      ...route.params,
      authorization: this.props.authorization,
      user: this.props.user,
      handlers: this.props.handlers
    };

    return {
      tabBarIcon: ({ size, color }) => {
        const iconName = navigatioSettings
            .filter(item => item.name === route.name)[0].icon;
        return <Icon name={iconName} size={size} color={color} />
      }
    };
  }

  render() {
    const Tab = this.Tab;
    return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={this.screenOptions}>
          {navigatioSettings.map(item => (
            <Tab.Screen name={item.name} component={item.component} key={item.name} />)
          )}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}