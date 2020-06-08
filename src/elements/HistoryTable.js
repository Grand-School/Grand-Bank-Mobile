import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { parseToDayMonth } from '../Utils';
import Spinner from 'react-native-spinkit';
const CURRENT_YEAR = new Date().getFullYear();

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
        this.setState({ data: [], page: 0, refreshing: true }, () => this.loadCountAndFirstPage());
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

    spliItems() {
        const that = this;
        const years = {};
        return this.state.data.reduce((acc, item) => {
            let date = that.props.getDate(item);
            let dateMonth = parseToDayMonth(date);
            let year = date.getFullYear();
            let dateMonthYear = dateMonth + ' ' + year;

            if (year in years) {
                let yearDateMonth = years[year];
                if (yearDateMonth === dateMonthYear) {
                    dateMonth = dateMonthYear;
                }
            } else if (CURRENT_YEAR !== year) {
                years[year] = dateMonthYear;
                dateMonth = dateMonthYear;
            }

            let filtered = acc.filter(item => item.date === dateMonth);
            if (filtered.length === 0) {
                acc.push({ date: dateMonth, data: [item] });
            } else {
                filtered[0].data.push(item);
            }
            
            return acc;
        }, []);
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} onScroll={this.scrollHandler} scrollEventThrottle={5}
                    refreshControl={<RefreshControl onRefresh={this.refreshData} refreshing={this.state.refreshing} tintColor='black' colors={['black']} />}>
                {this.props.title && <Text style={styles.title}>{this.props.title}</Text>}

                <View style={{ marginBottom: 15 }}>
                    {this.state.data.length === 0 && !this.state.refreshing && this.props.empty}

                    {this.spliItems().map(item => (
                        <DatedItemsList key={item.date} date={item.date}>
                            {item.data.map(item => (<View key={item.id}>{this.props.parseToObject(item)}</View>))}
                        </DatedItemsList>
                    ))}

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

const DatedItemsList = props => (
    <View>
        <Text style={styles.date}>{props.date}</Text>
        {props.children}
    </View>
);

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