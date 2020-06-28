import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import grandMauth from '../elements/GrandMAuth';

export class CameraScreen extends React.Component {
    grandMAuth(token) {
        grandMauth(token);
    }

    render() {
        return (
            <View>
                <ButtonInput title='Grand MAuth' onSave={token => this.grandMAuth(token)} />
            </View>
        )
    }
}

function ButtonInput(props) {
    let [value, setValue] = useState('');
    return (
        <View>
            <Text>{props.text}</Text>
            <TextInput onChangeText={text => setValue(text)} style={{ borderBottomWidth: 1, color: 'black', textAlign: 'center' }} />
            <Button title='Save' onPress={() => props.onSave(value)} />
        </View>
    )
}