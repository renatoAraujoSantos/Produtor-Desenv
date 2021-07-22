import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { data } from '../model/data';
import Card from '../components/Card';
import { SearchBar } from 'react-native-elements';


const CardListScreen = ({ navigation }) => {

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    useEffect(() => {
        setFilteredDataSource(data);
        setMasterDataSource(data);
    }, []);

    const renderItem = ({ item }) => {
        return (
            <Card
                itemData={item}
                onPress={() => navigation.navigate('CardItemDetails', { itemData: item })}
            />
        );
    };

    const searchFilterFunction = (text) => {
        // Verifique se o texto pesquisado não está em branco
        if (text) {
            // O texto inserido não está em branco
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    return (
        <View style={styles.container}>
            <SearchBar
                round
                searchIcon={{ size: 24 }}
                onChangeText={(text) => searchFilterFunction(text)}
                onClear={(text) => searchFilterFunction('')}
                placeholder="Pesquisa"
                value={search}
                inputStyle={{ backgroundColor: 'white' }}
                containerStyle={{ backgroundColor: '#BDBDBD', borderWidth: 1, borderRadius: 5 }}
                inputContainerStyle={{ backgroundColor: 'white' }}
            />
            <FlatList
                data={filteredDataSource}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

export default CardListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center'
    },
});
