import React from 'react';
import { Text, View, Button } from 'react-native';

export class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.route.params;
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
        <Button title='Выйти' onPress={() => this.params.handlers.onLogout()} />
      </View>
    );
  }
}