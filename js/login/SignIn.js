import React, { Component } from "react";
import {
    Alert, StyleSheet, TextInput, View, Keyboard,
    SafeAreaView, Text, Button, KeyboardAvoidingView,
    StatusBar, TouchableWithoutFeedback, TouchableOpacity
} from "react-native";
import ResponsiveImage from '../components/ResponsiveImage';
// import database
import Firebase from '../Firebase';

export default class SignIn extends Component {

    // set header toolbar title
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Login",
            headerLeft: null,
            tabBarVisible: false
        }
    }

    state = { username: "Patrick", password: "diablo" };

    _handleLogin = async () => {

        let { username, password } = this.state;

        // check if username and password are filled        
        if (username && password) {
            // check if user exists
            try {
                let userData = {};
                // get user from database
                query = await Firebase.db.collection('user').where("username", "==", username).get();

                // set selected entry to local object 
                query.forEach(user => {
                    userData = {
                        id: user.id,
                        username: user.data().username,
                        password: user.data().password,
                        email: user.data().email
                    };
                });

                // check if password is correct
                if (password === userData.password) {
                    // navigate to app homescreen
                    this.props.navigation.navigate("SubjectScreen", {
                        userData: userData
                    });
                }
            } catch (error) {
                // open alert popup
                Alert.alert('Benutzer existiert nicht',
                    'Bitte überprüfen Sie Ihre Anmeldedaten',
                    [{ text: 'OK' }]);
            }
        } else {
            // open alert popup
            Alert.alert('Benutzername oder Passwort fehlt',
                'Bitte prüfen Sie ob Benutzername und Passwort befüllt sind',
                [{ text: 'OK' }]);
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
                                <ResponsiveImage source={require('../../assets/StartLogo.png')} width={230} height={130} />
                                {/* <Image style={styles.logo} source={require('../../assets/StartLogo.png')} /> */}
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput style={styles.input}
                                    value="Patrick"
                                    placeholder="Benutzername/Email eingeben"
                                    placeholderColor='lightsalmon'
                                    keyboardType='email-address'
                                    returnyKeyType='next'
                                    autoCorrect={false}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()}
                                    onChangeText={(value) => this.setState({ username: value })} />
                                <TextInput style={[styles.input, { marginTop: 10 }]}
                                    value="diablo"
                                    placeholder="Passwort eingeben"
                                    placeholderColor='lightsalmon'
                                    returnyKeyType='go'
                                    secureTextEntry={true}
                                    ref={"txtPassword"}
                                    onChangeText={(value) => this.setState({ password: value })} />
                                <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                                    this._handleLogin()
                                }}>
                                    <Text style={styles.buttonText}>Anmelden</Text>
                                </TouchableOpacity>
                                <Button
                                    buttonStyle={{ marginTop: 30 }}
                                    title="Registrieren"
                                    onPress={() => {
                                        this.props.navigation.navigate("SignUp")
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
        justifyContent: 'flex-start',
        flex: 1,
    },
    logo: {
        resizeMode: 'center',
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
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'lightsalmon',
    },
    buttonContainer: {
        backgroundColor: 'lightsalmon',
        paddingVertical: 15,
        marginTop: 10,
        marginBottom: 20,
        fontSize: 14
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    }
});
