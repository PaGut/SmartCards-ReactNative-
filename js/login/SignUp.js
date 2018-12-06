import React, { Component } from "react";
import {
    StyleSheet, Image, TextInput, View, Keyboard,
    SafeAreaView, Text, KeyboardAvoidingView,
    StatusBar, TouchableWithoutFeedback, TouchableOpacity
} from "react-native";
import Firebase from '../Firebase';

export default class SignIn extends Component {

    state = { email: "", confirmEmail: "", username: "", password: "", confirmPassword: "" };

    /* validate email viea regex */
    _validateEmail = (email) => {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(email)) {
            return true;
        } else {
            alert("Please enter valid EMail address.")
            return false;
        }
    }

    /* check if given values are the same */
    _validateEqualValue = (value1, value2) => {
        if (value1 === value2) {
            return true;
        } else {
            return false;
        }
    }

    _checkInputValues = (email, confirmEmail, username, password, confirmPassword) => {
        debugger;
        // check if all values are fullfilled
        if (email !== "" && confirmEmail !== "" && username !== "" && password !== "" && confirmPassword !== "") {
            // validate email
            if (!this._validateEmail(email)) return false;
            if (!this._validateEmail(confirmEmail)) return false;
            // check if mails are the same
            if (!this._validateEqualValue(email, confirmEmail)) {
                alert("EMails must be identical, please check.");
                return false;
            }
            // check if passwords are the same
            if (!this._validateEqualValue(password, confirmPassword)) {
                alert("Passwords must be identical, please check.");
                return false;
            }
        } else {
            alert("Please fill in all fields");
            return false;
        }
        return true;
    }

    _handleRegister = async () => {

        let { email, confirmEmail, username, password, confirmPassword } = this.state;
        debugger;

        // check input fields
        if (!this._checkInputValues(email, confirmEmail, username, password, confirmPassword)) return false;

        // execute database call
        try {
            // save data to database collection subjects
            docRef = await Firebase.db.collection('user').add({ email, confirmEmail, username, password, confirmPassword });
            // set user object
            let user = {
                id: docRef.id,
                email: email,
                confirmEmail: confirmEmail,
                username: username,
                password: password,
                confirmPassword: confirmPassword
            };

            // TODO: Erfolgsmeldung ausgeben, dass Registrierung erfolgreich ist.
            // TODO: vielleicht noch EMail zur             

            this.props.navigation.navigate("App", {}, {
                type: "Navigate",
                routeName: "SubjectListScreen",
                userData: user
            });
        } catch (error) {
            alert('No internet connection');
        }
    }

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
                                    placeholder="Enter email"
                                    placeholderColor='lightsalmon'
                                    keyboardType='email-address'
                                    returnyKeyType='next'
                                    autoCorrect={false}
                                    ref={"email"}
                                    onSubmitEditing={() => this.refs.confirmEmail.focus()}
                                    onChangeText={(value) => this.setState({ email: value })} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    placeholder="Confirm email"
                                    placeholderColor='lightsalmon'
                                    keyboardType='email-address'
                                    returnyKeyType='next'
                                    autoCorrect={false}
                                    ref={"confirmEmail"}
                                    onSubmitEditing={() => this.refs.username.focus()}
                                    onChangeText={(value) => this.setState({ confirmEmail: value })} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    placeholder="Enter username"
                                    placeholderColor='lightsalmon'
                                    returnyKeyType='next'
                                    autoCorrect={false}
                                    ref={"username"}
                                    onSubmitEditing={() => this.refs.password.focus()}
                                    onChangeText={(value) => this.setState({ username: value })} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    placeholder="Enter password"
                                    placeholderColor='lightsalmon'
                                    returnyKeyType='next'
                                    secureTextEntry={true}
                                    ref={"password"}
                                    onSubmitEditing={() => this.refs.confirmPassword.focus()}
                                    onChangeText={(value) => this.setState({ password: value })} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    placeholder='Confirm password'
                                    placeholderColor='lightsalmon'
                                    returnyKeyType='go'
                                    secureTextEntry={true}
                                    ref={"confirmPassword"}
                                    onChangeText={(value) => this.setState({ confirmPassword: value })} />
                                <TouchableOpacity style={styles.buttonContainer} onPress={() => this._handleRegister()}>
                                    <Text style={styles.buttonText}>SIGN IN</Text>
                                </TouchableOpacity>
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
        color: 'lightsalmon',
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
        height: 320,
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
