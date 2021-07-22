import React from 'react';
import { FlatList, Text, View, TouchableHighlight, Image } from 'react-native';
import styles from './styles';
import { getRecipes, getCategoryName } from '../../../../model/MockDataAPI';

export default function RecipesListScreen({ route, navigation }) {

    const onPressRecipe = item => {
        navigation.navigate('RecipeScreen', { item });
    };

    const renderRecipes = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => onPressRecipe(item)}>
            <View style={styles.container}>
                <Image style={styles.photo} source={{ uri: item.photo_url }} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
            </View>
        </TouchableHighlight>
    );

    const category = route.params.category;
    const item = category;
    const recipesArray = getRecipes(item.id);
    return (
        <View>
            <FlatList
                vertical
                showsVerticalScrollIndicator={false}
                numColumns={2}
                data={recipesArray}
                renderItem={renderRecipes}
                keyExtractor={item => `${item.recipeId}`}
            />
        </View>
    );

}
