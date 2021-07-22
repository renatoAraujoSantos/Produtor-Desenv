import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator, HeaderHeightContext } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { FontAwesome5, AntDesign, Entypo, MaterialCommunityIcons, Octicons } from '@expo/vector-icons'; 
import HomeFonecedor from './screens/Home/HomeScreen';
import CategoriesScreen from './screens/Categories/CategoriesScreen';
import PedidosScreen from './screens/Pedidos/PedidosScreen';
import RecipeScreen from './screens/Recipe/RecipeScreen';
import RecipesListScreen from './screens/RecipesList/RecipesListScreen';
import ProdutoScreen from './screens/Produto/ProdutoScreen';
import IngredientScreen from './screens/Ingredient/IngredientScreen';
import IngredientsDetailsScreen from './screens/IngredientsDetails/IngredientsDetailsScreen';
//import ListaEAdicionaAnexos from './screens/anexos/ListaEAdicionaAnexos';
import GaleriaImagens from './screens/anexos/GaleriaImagens';
import { useTheme } from '@react-navigation/native';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import { View, ActivityIndicator } from 'react-native';

const HomeStack = createStackNavigator();
const DetailsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

export default function FornecedorTabScreen({navigation}) {
    const theme = useTheme();    


    // const [isLoading, setIsLoading] = React.useState(false);
    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', async () => {
    //         try {
    //             setIsLoading(false);
    //             const autenticado = await ValidarUsuario();   
    //             console.log('77777777777777777777777777777777777777777777777');             
    //             if(!autenticado){
    //                 navigation.navigate('Login');                    
    //                 return;
    //             }else{
    //                 setIsLoading(true);
    //                 console.log('LOGADOOOOOOOOOOOOO --------------- ******************');
    //             }
    //         } catch (error) {
    //             console.log('Erro no useEffect da classe FornecedorTabScreen ', error);     
    //         }                        
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    // if (!isLoading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     );
    // }

    return (
        <Tab.Navigator
            initialRouteName="HomeFonecedor"
            activeColor={theme.colors.text}
            inactiveColor={theme.colors.textSecund}
            barStyle={{ backgroundColor: theme.colors.background }}  
            //labeled={true}            
        >
            <Tab.Screen
                name="HomeFonecedor"
                component={HomeDetailsStackScreen}
                options={{
                    tabBarLabel: 'Produtos',                    
                    tabBarColor: theme.colors.background,                                        
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="sprout" size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="PedidosDetailScreen"
                component={PedidosDetailsStackScreen}
                options={{
                    tabBarLabel: 'Pedidos',                    
                    tabBarColor: theme.colors.background,
                    tabBarBadge: '11',
                    tabBarIcon: ({ color }) => (
                        <Octicons name="checklist" size={26} color={color} />
                    ),
                }}
            />

            {/* <Tab.Screen
                name="CategoriesScreen"
                component={CategoriesScreen}
                options={{
                    tabBarLabel: 'Calendário',
                    tabBarColor: theme.colors.background,
                    tabBarIcon: ({ color }) => (
                        <Entypo name="calendar" color={color} size={26}  />
                    ),
                }}
            /> */}


        </Tab.Navigator>
    );
}


function HomeDetailsStackScreen({ navigation }) {
    const theme = useTheme();
    return (
        <DetailsStack.Navigator screenOptions={{
            safeAreaInsets:{ top: 0, bottom: 0 },
            headerStyle: {
                backgroundColor: theme.colors.background,                
                elevation: 0, // Android                                                
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {fontWeight: 'bold'}            
        }}>
            <DetailsStack.Screen name="HomeFonecedor" component={HomeFonecedor} options={{
                title: 'Meus Anúncios',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
            <DetailsStack.Screen name="ProdutoScreen" component={ProdutoScreen} options={{
                title: 'Produto',
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />

            {/* <DetailsStack.Screen name="ListaEAdicionaAnexos" component={ListaEAdicionaAnexos} options={{
                title: 'Anexar Imagens',
            }} /> */}

            <DetailsStack.Screen name="GaleriaImagens" component={GaleriaImagens} options={{
                title: 'Imagens do Produto',
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />

        </DetailsStack.Navigator>
    );
}



function PedidosDetailsStackScreen({ navigation }) {
    const theme = useTheme();
    return (
        <DetailsStack.Navigator screenOptions={{
            safeAreaInsets:{ top: 0, bottom: 0 },
            headerStyle: {
                backgroundColor: theme.colors.background,                
                elevation: 0, // Android                                                
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {fontWeight: 'bold'}            
        }}>
            <DetailsStack.Screen name="PedidosScreen" component={PedidosScreen} options={{
                title: 'Pedidos',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
            <DetailsStack.Screen name="RecipesListScreen" component={RecipesListScreen} options={{
                title: 'Pedidos',                
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />
            <DetailsStack.Screen name="RecipeScreen" component={RecipeScreen} options={{
                title: 'Detalhes do Pedido',
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />
            <DetailsStack.Screen name="IngredientScreen" component={IngredientScreen} options={{
                title: 'Ingrediente',                
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />
            <DetailsStack.Screen name="IngredientsDetailsScreen" component={IngredientsDetailsScreen} options={{
                title: 'Ingrediente Detalhes',                
                // headerLeft: () => (
                //     <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                // )
            }} />



        </DetailsStack.Navigator>
    );
}



function HomeStackScreen({ navigation }) {
    const theme = useTheme();
    return (
        <HomeStack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }}>
            <HomeStack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{
                title: 'Categorias',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" color={theme.colors.text} size={25} backgroundColor={theme.colors.background} onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />


        </HomeStack.Navigator>
    );
}
