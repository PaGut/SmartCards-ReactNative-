import React, { Component } from "react";
import {
    StyleSheet, Image, TextInput, View, Keyboard,
    SafeAreaView, Text, Button, KeyboardAvoidingView,
    StatusBar, TouchableWithoutFeedback, TouchableOpacity
} from "react-native";

// import database
import Firebase from '../Firebase';

export default class SignIn extends Component {

    /* after view is called */
    componentDidMount() {
        // init firebase object        
        Firebase.init();
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <Image style={styles.log} source={require('../../assets/login_logo.jpg')} />
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Enter username/email"
                                    placeholderColor='lightsalmon'
                                    keyboardType='email-address'
                                    returnyKeyType='next'
                                    autoCorrect={false}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    placeholder="Enter password"
                                    placeholderColor='lightsalmon'
                                    returnyKeyType='go'
                                    secureTextEntry={true}
                                    ref={"txtPassword"} />
                                <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                                    this.props.navigation.navigate("App");
                                }}>
                                    <Text style={styles.buttonText}>SIGN IN</Text>
                                </TouchableOpacity>
                                <Button
                                    buttonStyle={{ marginTop: 30 }}
                                    title="Sign Up"
                                    onPress={() => {
                                        this.props.navigation.navigate("SignUp");
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1
    },
    logo: {
        width: 128,
        height: 56
    },
    title: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.9
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 300,
        padding: 20,
        backgroundColor: 'lightgrey'
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        color: 'black',
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: 'yellow',
        paddingVertical: 15,
        marginTop: 10,
        marginBottom: 20,
        fontSize: 14
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold'
    }
});
