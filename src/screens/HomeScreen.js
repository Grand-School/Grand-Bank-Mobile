import React from 'react';
import { Text, View } from 'react-native';

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.params = this.props.route.params;
    }

    render() {
        let user = this.params.user;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Welcome, {user.name} {user.surname}!</Text>
            </View>
        );
    }
}