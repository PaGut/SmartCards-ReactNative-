import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

export default class LearnResultScreen extends Component {

    // define card header at runtime
    static navigationOptions = ({ navigation }) => {
    }

    render() {
        const data = this._getResult();
        const xAxisData = ["Terrible", "Bad", "OK", "Good", "Perfect"];

        // data.push(this.props.navigation.getParam('ratings');
        return (
            <View style={styles.container}>
                {/* <Text>{this.props.navigation.getParam('score')}</Text> */}
                <BarChart
                    style={styles.barChart}
                    data={data}
                    svg={{ fill: 'lightsalmon' }}
                    contentInset={{ top: 30, bottom: 30 }}
                />

                <XAxis
                    style={{ marginTop: 10 }}
                    data={xAxisData}
                    scale={scale.scaleBand}
                    formatLabel={(_, index) => xAxisData[index]}
                    labelStyle={{ color: 'black' }}
                />
            </View>
        )
    }
    _getResult = () => {
        let ratings = this.props.navigation.getParam('ratings');
        let ratingResult = [0, 0, 0, 0, 0];//count every category from the raiting

        ratings.forEach(element => {
            ratingResult[element - 1] = ratingResult[element - 1] + 1;
        });
        return ratingResult;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    barChart: {
        height: 200,
    }
});