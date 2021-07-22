import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, Avatar } from 'react-native-paper';
import { View } from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Badge } from 'react-native-elements';
import PesquisarProduto from '../screens/pesquisa/PesquisarProduto';
import DetalhePesquisarProduto from '../screens/pesquisa/DetalhePesquisarProduto';
//import CarrinhoCompras from '../screens/pesquisa/CarrinhoCompras';
import CarrinhoProdutos from '../screens/pesquisa/CarrinhoProdutos';

const ProfileStack = createStackNavigator();

const RootPesquisaProduto = ({ navigation }) => {
    const { colors } = useTheme();
    const [autenticado, setAutenticado] = React.useState(false);

    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            const tokenUser = await AsyncStorage.getItem('access_token');
            if (tokenUser != null) {
                setAutenticado(true);
            } else {
                setAutenticado(false);
            }
        }
        loadResourcesAndDataAsync();
    });


    return (
        <ProfileStack.Navigator
            screenOptions={{
                safeAreaInsets:{ top: 0, bottom: 0 },
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    //elevation: 0, // Android
                },
                headerTintColor: colors.text,
            }}>
            <ProfileStack.Screen
                name="PesquisarProduto"
                component={PesquisarProduto}
                options={{
                    title: 'Pesquisar Produtos',
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                backgroundColor={colors.background}
                                color={colors.text}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        !autenticado ? null :
                            <View style={{ marginRight: 10 }}>
                                <AntDesign
                                    name="shoppingcart"
                                    size={30}
                                    color={colors.text}
                                    backgroundColor={colors.background}
                                    onPress={() => navigation.navigate('CarrinhoProdutos', { 'produtoSelecionado': 'null' }) }
                                />
                                {/* <Badge status="error" value="11"
                                    containerStyle={{ position: 'absolute', top: -1, left: -7 }}
                                /> */}
                            </View>
                    ),

                }}
            />            
            <ProfileStack.Screen
                name="DetalhePesquisarProduto"
                options={{
                    title: 'Detalhamento do Produto',
                }}
                component={DetalhePesquisarProduto}
            />
            {/* <ProfileStack.Screen
                name="CarrinhoCompras"
                options={{
                    title: '',
                    headerTransparent: true,
                }}
                component={CarrinhoCompras}
            /> */}

            <ProfileStack.Screen
                name="CarrinhoProdutos"
                options={{
                    title: '',
                    headerTransparent: true,
                }}
                component={CarrinhoProdutos}
            />

        </ProfileStack.Navigator>
    );
};


export default RootPesquisaProduto;