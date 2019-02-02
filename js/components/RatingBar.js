import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
// import text to speech
import { Speech } from 'expo';
// import icons
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default class RatingBar extends Component {
    state = {
        //To set the default star Selected
        filledStars: 0,
        //To set the max number of Stars
        maxRating: 5,
    };

    constructor() {
        super();

        //Filled star
        this.star = '../../assets/star_filled.png';

        //Empty star
        this.starEmpty = '../../assets/star_empty.png';
    }

    _updateRating = (key) => {
        this.setState({ filledStars: key });
    }

    _finishRating = () => {

        this.props.onFinishRating(this.state.filledStars);
        // reset the Stars after rating was done
        this.setState({ filledStars: 0 });
    }

    _startTextToSpeech = () => {
        debugger;
        let { cardValue } = this.props;
        // create parameters for speach to test
        var oMap = {
            language: 'de-DE',
        }
        // execute text to speech
        Speech.speak(cardValue, oMap);
    }

    render() {
        let ratingBar = [];

        const { filledStars, maxRating } = this.state;
        const label = ["Terrible", "Bad", "OK", "Good", "Perfect"];

        if (this.props.visible === false) {
            return (<View />);
        }

        //Array to hold the filled or empty Stars
        for (var i = 1; i <= maxRating; i++) {
            ratingBar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={this._updateRating.bind(this, i)}>
                    <Image
                        style={styles.starImage}
                        source={i <= filledStars
                            ? require('../../assets/star_filled.png')
                            : require('../../assets/star_empty.png')}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <View style={styles.container}>
                <MaterialCommunityIcons.Button name="voice" color="lightsalmon" size="50" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={() => this._startTextToSpeech()}>
                </MaterialCommunityIcons.Button>
                <View style={styles.ratingContainer}>
                    <View style={styles.rating}>{ratingBar}</View>
                    <Text style={styles.textStyle}>
                        {label[filledStars - 1]}
                    </Text>
                </View>
                <Icon.Button name="navigate-next" color="lightsalmon" size="50" iconStyle={{ marginRight: 0 }} backgroundColor="transparent" onPress={this._finishRating}>
                </Icon.Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    horizontalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    rating: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    ratingContainer: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    button: {
        backgroundColor: "lightsalmon",
        alignItems: 'stretch',
        paddingVertical: 15,
        borderRadius: 40,
        marginBottom: 10
    },
    starImage: {
        marginTop: 20,
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 15,
        color: 'gold',
        marginTop: 15,
    },
    textStyleButton: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
})