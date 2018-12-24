import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';

export default class RatingBar extends Component {

    render() {
        if (this.props.visible) {
            return (
                <AirbnbRating
                    count={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Perfect"]}
                    defaultRating={0}
                    size={50}
                    onFinishRating={this.props.onFinishRating}
                    showRating={true}
                />
            );
        }
        else {
            return (<View />);
        }
    }

}

const styles = StyleSheet.create({


})