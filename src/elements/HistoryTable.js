import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { parseToDayMonth } from '../Utils';
var Spinner = require('react-native-spinkit');

export class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            page: 0,
            data: []
        };
        
        this.refreshData = this.refreshData.bind(this);
        this.loadCountAndFirstPage = this.loadCountAndFirstPage.bind(this);
        this.loadData = this.loadData.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        
        this.loadCountAndFirstPage();
    }

    loadCountAndFirstPage() {
        const that = this;
        this.props.getCount()
            .then(({ data: count }) => that.setState({ count, page: 0 }, () => that.loadData(0)));
    }

    loadData(page) {
        if (page !== 0 && !this.hasMoreData()) {
            return;
        }

        const that = this;
        this.setState({ page });
        this.props.getPage(page, this.props.count)
            .then(({ data: newData }) => that.setState({ data: [...this.state.data, ...newData], refreshing: false }));
    }

    refreshData() {
        this.setState({ data: [], page: 0 }, () => this.loadCountAndFirstPage());
    }

    scrollHandler(event) {
        let e = event.nativeEvent;
        if (e.contentOffset.y + e.layoutMeasurement.height >= e.contentSize.height) {
            this.loadData(++this.state.page);
        }
    }

    hasMoreData() {
        return this.props.count * this.state.page < this.state.count;
    }

    render() {
        let dates = [], years = [];
        return (
            <ScrollView style={styles.scrollView} onScroll={this.scrollHandler} scrollEventThrottle={5}
                    refreshControl={<RefreshControl onRefresh={this.refreshData} refreshing={this.state.refreshing} />}>
                {this.props.title && <Text style={styles.title}>{this.props.title}</Text>}

                <View style={{ marginBottom: 15 }}>
                    {this.state.data.map(item => {
                        let date = this.props.getDate(item);
                        let dateMonth = parseToDayMonth(date);

                        let shouldPrintDate = !dates.includes(dateMonth) && this.props.showDate;
                        if (shouldPrintDate) {
                            dates.push(dateMonth);
                        }

                        let year = date.getFullYear();
                        let shouldPrintYear = !years.includes(year) && year !== new Date().getFullYear();
                        if (!years.includes(year)) {
                            years.push(year);
                        }

                        return (
                            <>
                                {shouldPrintDate && <Text style={styles.date}>{dateMonth} {shouldPrintYear && year}</Text>}
                                {this.props.parseToObject(item)}
                            </>
                        )
                    })}

                    {this.hasMoreData() && (
                        <View style={{ alignItems: 'center' }}>
                            <Spinner type='ThreeBounce' />
                        </View>
                    )}
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        padding: 15,
        height: '100%'
    }, 

    title: {
        fontSize: 20,
        fontWeight: '800',
        color: 'black'
    },

    date: {
        fontSize: 18,
        fontWeight: '800',
        color: 'black',
        marginBottom: 5,
        marginTop: 10
    }
});