// React Navigation
import React from 'react';
import { Platform, StatusBar } from "react-native";
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
// Screens
import SubjectListScreen from './screens/SubjectListScreen';
import SubjectDetailScreen from './screens/SubjectDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
// sign in screen stack
import SignUp from "./login/SignUp";
import SignIn from "./login/SignIn";
import Profile from "./screens/Profile";
// import expo icon library
import { Icon } from 'expo';

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

// name of routs
const HomeStack = createStackNavigator({ SubjectListScreen, SubjectDetailScreen }, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: 'aliceblue',
            marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
        }
    }
});

// navigation stack for sign in/authorization
export const AuthStack = createStackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In",
            headerStyle
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up",
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
            title: 'Profile',
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
        //AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth',
    }
));
