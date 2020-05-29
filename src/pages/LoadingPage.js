import React from 'react';
import { View, Text } from 'react-native';
var Spinner = require('react-native-spinkit');

export function LoadingPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner type='Wave' size={100} />
        </View>
    );
}