import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export class CardInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberInputs: ['', '', '']
        };
        this.inputs = [];
        this.changeText = this.changeText.bind(this);

        this.styles = StyleSheet.create({
            input: {
                marginRight: 15,
                height: 40,
                borderColor: 'gray',
                borderBottomWidth: 1,
                width: 80,
        
                letterSpacing: 2,
                color: props.textColor ? props.textColor : '#fff',
                textAlign: 'center',
                fontSize: 25,
            }
        });
    }

    changeText(text, inputIndex) {
        if (text !== '' && (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(+text[text.length - 1])
                || text.length > 4)) {
            return;
        }

        let numberInputs = this.state.numberInputs;
        numberInputs[inputIndex] = text;

        this.setState({ numberInputs });

        if (text.length === 4 && inputIndex !== 2) {
            this.inputs[inputIndex + 1].focus();
        } else if (text.length === 0 && inputIndex !== 0) {
            this.inputs[inputIndex - 1].focus();
        }

        this.props.onType(numberInputs.join(''));
    }

    render() {
        const styles = this.styles;
        return (
            <View style={{  flexWrap: 'wrap',  flexDirection: 'row' }}>
                <TextInput onChangeText={e => this.changeText(e, 0)} ref={input => this.inputs[0] = input}
                    value={this.state.numberInputs[0]} style={styles.input} keyboardType='number-pad' />
                                
                <TextInput onChangeText={e => this.changeText(e, 1)} ref={input => this.inputs[1] = input}
                        value={this.state.numberInputs[1]} style={[styles.input]} keyboardType='number-pad' />

                <TextInput onChangeText={e => this.changeText(e, 2)} ref={input => this.inputs[2] = input}
                        value={this.state.numberInputs[2]} style={[styles.input]} keyboardType='number-pad' />
            </View>
        );
    }
}