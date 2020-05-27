import React from 'react';
import { View, Text } from 'react-native';

export function LoadingPage() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading...</Text>
        </View>
    );
}