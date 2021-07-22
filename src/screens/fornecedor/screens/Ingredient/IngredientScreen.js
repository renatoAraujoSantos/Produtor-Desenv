import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import styles from './styles';
import {
  getIngredientUrl,
  getRecipesByIngredient,
  getCategoryName
} from '../../../../model/MockDataAPI';

export default class IngredientScreen extends React.Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.getParam('name')
  //   };
  // };

  constructor(props) {
    super(props);
  }

  onPressRecipe = item => {
    this.props.navigation.navigate('RecipeScreen', { item });
  };

  renderRecipes = ({ item }) => (
    <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressRecipe(item)}>
      <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => this.onPressRecipe(item)}>
        <View style={styles.container}>
          <Image style={styles.photo} source={{ uri: item.photo_url }} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
        </View>
      </TouchableHighlight>
    </TouchableHighlight>
  );

  render() {
    const { navigation } = this.props;
    const ingredient = this.props.route.params.ingredient;
    const ingredientId = ingredient;
    const ingredientUrl = getIngredientUrl(ingredientId);
    const name = this.props.route.params.name;
    const ingredientName = name;
    return (
      <ScrollView style={styles.mainContainer}>
        <View style={{ borderBottomWidth: 0.4, marginBottom: 10, borderBottomColor: 'grey' }}>
          <Image style={styles.photoIngredient} source={{ uri: '' + ingredientUrl }} />
        </View>
        <Text style={styles.ingredientInfo}>Recipes with {ingredientName}:</Text>
        <View>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={getRecipesByIngredient(ingredientId)}
            renderItem={this.renderRecipes}
            keyExtractor={item => `${item.recipeId}`}
          />
        </View>
      </ScrollView>
    );
  }
}
