import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function (props) {
    const { cardList, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Image style={styles.image} source={require("../../assets/folder-flat.png")} />
                <View style={styles.infoColumn}>
                    <View style={styles.infoRow}>
                        <Text style={styles.text}>{cardList.name}</Text>
                        <Text style={styles.text}>{cardList.examDate}</Text>
                    </View>
                    <Text style={styles.text}>{cardList.desc}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10
    },
    text: {
        marginLeft: 40,
        marginTop: 20
    },
    infoColumn: {
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    text: {
        fontSize: 20
    },
    textSmall: {
        fontSize: 16,
        fontWeight: '100'
    }
})