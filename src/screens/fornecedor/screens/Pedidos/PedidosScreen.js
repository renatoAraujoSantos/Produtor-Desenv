import React from 'react';
import { FlatList, Text, View, Image, TouchableHighlight } from 'react-native';
  import styles from './styles';
  import { categories } from '../../../../model/dataArrays';
  import { getNumberOfRecipes } from '../../../../model/MockDataAPI';




export default function ProdutoScreen({ navigation }) {

    const onPressCategory = item => {
        const title = item.name;
        const category = item;
        navigation.navigate('RecipesListScreen', { category, title });
      };
    
      const renderCategory = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => onPressCategory(item)}>
          <View style={styles.categoriesItemContainer}>
            <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
            <Text style={styles.categoriesName}>{item.name}</Text>
            <Text style={styles.categoriesInfo}>{getNumberOfRecipes(item.id)} Pedido(s)</Text>
          </View>
        </TouchableHighlight>
      );
    

    return (
        <View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={item => `${item.id}`}
          />
        </View>
      );
  

}