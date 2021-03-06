// React Navigation
import React from 'react';
import { Platform, StatusBar } from "react-native";
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
// App Screen stack
import SubjectScreen from './screens/SubjectScreen';
import CardDeckScreen from './screens/CardDeckScreen';
import CardScreen from './screens/CardScreen';
import CardDetailScreen from './screens/CardDetailScreen';
import LearnResultScreen from './screens/LearnResultScreen';
// Sign In Screen stack
import SignUp from "./login/SignUp";
import SignIn from "./login/SignIn";
import Profile from "./screens/Profile";
// import expo icon library
import { Icon } from 'expo';

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

// Name der Routen
const HomeStack = createStackNavigator({ SubjectScreen, CardDeckScreen, CardScreen, CardDetailScreen, LearnResultScreen, SignIn }, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: 'aliceblue',
            marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }
    }
});

HomeStack.navigationOptions = ({ navigation }) => {

    let tabBarVisible = true;
    // check if navigation to sign in screen is true, for this screen hide footer bar
    if (navigation.state.routes[1] !== undefined) {
        if (navigation.state.routes[1].routeName === "SignIn") {
            tabBarVisible = false;
        }
    }

    return {
        tabBarVisible,
    };
};

// navigation stack for sign in/authorization
export const AuthStack = createStackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Login",
            headerStyle
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Registrieren",
            headerStyle
        }
    }
});

// navigation stack for app screens
export const AppStack = createBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            title: 'Home',
            tabBarIcon: ({ tintColor }) => (<Icon.Feather name="home" size={24} color={tintColor} />)
        }
    },
    Settings: {
        screen: Profile,
        navigationOptions: {
            title: 'Profil',
            tabBarIcon: ({ tintColor }) => (<Icon.Feather name="settings" size={24} color={tintColor} />)
        }
    }
}, {
        tabBarOptions: {
            activeTintColor: 'darkorange',
            style: {
                backgroundColor: 'aliceblue',
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
            }
        }
    });

// set active navigations stack
export default createAppContainer(createSwitchNavigator(
    {
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth',
    }
));
