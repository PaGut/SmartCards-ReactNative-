import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

export default class LearnResultScreen extends Component {
    state = { averageRating: 0, ratings: [] };

    // define card header at runtime
    // static navigationOptions = ({ navigation }) => {
    // }
    // Called before the view is loaded
    componentWillMount() {

        //determine Ratingdata and write it into state
        this._determineResult();
    }

    render() {
        const ratings = this.state.ratings;
        const xAxisData = ["Terrible", "Bad", "OK", "Good", "Perfect"];

        return (
            <View style={styles.container}>
                <Text>{this.state.averageRating}</Text>
                <BarChart
                    style={styles.barChart}
                    data={ratings}
                    svg={{ fill: 'lightsalmon' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    xScale={scale.scaleBand}
                />

                <XAxis
                    style={{ marginTop: 10 }}
                    data={xAxisData}
                    scale={scale.scaleBand}
                    formatLabel={(_, index) => xAxisData[index]}
                    contentInset={{ top: 10, bottom: 10 }}
                    labelStyle={{ color: 'black' }}
                />
            </View>
        )
    }
    _determineResult = () => {
        let ratings = this.props.navigation.getParam('ratings');
        let ratingResult = [0, 0, 0, 0, 0];//count every category from the raiting
        let averageRating = this.state.averageRating;

        ratings.forEach(element => {
            ratingResult[element - 1] = ratingResult[element - 1] + 1;
            averageRating = averageRating + element;
        });
        averageRating = averageRating / ratings.length;

        this.setState({ averageRating: averageRating, ratings: ratingResult });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    barChart: {
        flex: 1,
    }
});