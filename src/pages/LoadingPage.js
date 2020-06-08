import React from 'react';
import { View, Text } from 'react-native';
import Spinner from 'react-native-spinkit';

export function LoadingPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Spinner type='Wave' size={100} />
        </View>
    );
}