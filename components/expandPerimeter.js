import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';




export default class ExpandPerimeter extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => { this.props.decrease() }}>
                    <Text style={styles.text_touchable}>-</Text>
                </TouchableOpacity>
                <Text
                    style={styles.text_input}
                >
                    {this.props.valuePerimetreNear + ' Metros'}
                </Text>
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() => { this.props.increase() }}>
                    <Text style={styles.text_touchable}>+</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'

    },
    text_input: {
        backgroundColor: '#fff',
        flex: 2,
        fontSize: 35,
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        paddingTop: 5
    },
    touchable: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    text_touchable: {
        textAlign: "center",
        fontSize: 40,
        color: '#fff'
    }
});
