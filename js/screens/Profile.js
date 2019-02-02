import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Button, Text } from "react-native-elements";


export default class Profile extends Component {

    render() {

        return (
            <View style={{ paddingVertical: 20 }}>
                <Card title="Patrick Gutting">
                    <View
                        style={{
                            backgroundColor: "#bcbec1",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            alignSelf: "center",
                            marginBottom: 20
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 28 }}>PG</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
                        <Text style={styles.buttonText}>SIGN OUT</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'lightsalmon',
        height: 40,
        paddingTop: 10
    }
});