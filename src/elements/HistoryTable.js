import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { parseToDayMonth } from '../Utils';
import Spinner from 'react-native-spinkit';
const CURRENT_YEAR = new Date().getFullYear();

export class HistoryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true
        };
        this.count = 0;
        this.currentPage = 0;

        this.loadData = this.loadData.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.hasMore = this.hasMore.bind(this);
        this.refreshData = this.refreshData.bind(this);

        this.loadData();
    }

    loadData(page = 0) {
        const that = this;
        const oldData = this.state.data;
        this.props.getCount().then(({ data: count }) => {
            that.props.getPage(page, that.props.count)
                .then(({ data }) => {
                    that.count = count;
                    that.currentPage = page;
                    that.setState({
                        data: [...oldData, ...data],
                        refreshing: false
                    });
                });
        });
    }

    refreshData() {
        this.count = 0;
        this.currentPage = 0;
        this.setState({ refreshing: true, data: [] }, () => this.loadData());
    }

    hasMore() {
        return (this.currentPage + 1) * this.props.count < this.count;
    }

    scrollHandler(event) {
        let e = event.nativeEvent;
        if (e.contentOffset.y + e.layoutMeasurement.height >= e.contentSize.height
                && this.hasMore()) {
            this.loadData(this.currentPage + 1);
        }
    }
    
    render() {
        let datesList = [];
        let data = [];

        this.state.data.forEach(item => {
            let time = this.props.getDate(item);

            let date = parseToDayMonth(time);
            if (!datesList.includes(date)) {
                datesList.push(date);
                data.push({ date, data: [item] });
            } else {
                data.filter(item => item.date === date)[0]
                    .data.push(item);
            }
        });

        return (
            <ScrollView style={styles.scrollView} onScroll={this.scrollHandler} scrollEventThrottle={5}
                    refreshControl={<RefreshControl onRefresh={this.refreshData} refreshing={this.state.refreshing} tintColor='black' colors={['black']} />}>
                {this.props.children}

                <View>
                    {this.props.title && <Text style={styles.title}>{this.props.title}</Text>}

                    <View style={{ marginBottom: 15 }}>
                        {this.state.data.length === 0 && !this.state.refreshing && this.props.empty}

                        {data.map(item => (
                            <DatedItemsList key={item.date} date={item.date} showDate={this.props.showDate}>
                                {item.data.map(item => (<View key={item.id}>{this.props.parseToObject(item)}</View>))}
                            </DatedItemsList>
                        ))}

                        {this.hasMore() && (
                            <View style={{ alignItems: 'center' }}>
                                <Spinner type='ThreeBounce' />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const DatedItemsList = props => (
    <View>
        {props.showDate && <Text style={styles.date}>{props.date}</Text>}
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