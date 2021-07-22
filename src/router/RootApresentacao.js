import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, Avatar } from 'react-native-paper';
import { View } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeApresentacaoApp from '../screens/apresentacaoApp/HomeApresentacaoApp';
import CardListScreen from '../screens/CardListScreen';
import CardItemDetails from '../screens/CardItemDetails';
import Categorias from '../screens/apresentacaoApp/Categorias';
import ProdutoDestaque from '../screens/apresentacaoApp/destaques/ProdutoDestaque';
//import Overlays from '../screens/apresentacaoApp/Overlays';
import SejaUmProdutor from '../screens/apresentacaoApp/sejaUmProdutor/SejaUmProdutor';


const HomeStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeStackScreen = ({ navigation }) => {

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
        <HomeStack.Navigator initialRouteName="HomeApresentacaoApp"
            screenOptions={{
                safeAreaInsets: { top: 0, bottom: 0 },
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    elevation: 0, // Android
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <HomeStack.Screen
                name="HomeApresentacaoApp"
                component={HomeApresentacaoApp}
                options={{
                    title: 'Direto do Produtor',
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                color={colors.text}
                                backgroundColor={colors.background}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                    headerRight: () => (
                        !autenticado ? null :
                            <View style={{ marginRight: 10 }}>
                                <MaterialIcons
                                    name="notifications"
                                    size={30}
                                    color={colors.text}
                                    backgroundColor={colors.background}
                                    onPress={() => navigation.navigate('FornecedorTabScreen')}
                                />
                                <Badge status="error" value="11"
                                    containerStyle={{ position: 'absolute', top: -1, left: -7 }}
                                />
                            </View>
                    ),
                }}
            />
            <HomeStack.Screen
                name="CardListScreen"
                component={CardListScreen}
                options={({ route }) => ({
                    title: route.params.title,
                    headerBackTitleVisible: false
                })}
            />
            <HomeStack.Screen
                name="CardItemDetails"
                component={CardItemDetails}
                options={({ route }) => ({
                    title: route.params.title,
                    headerBackTitleVisible: false,
                    headerTitle: false,
                    headerTransparent: true,
                    headerTintColor: '#fff'
                })}
            />
            <HomeStack.Screen
                name="Categorias"
                component={Categorias}
                options={({ route }) => ({
                    title: 'Categorias',
                    headerBackTitleVisible: false,
                    headerTitle: false,
                    headerTransparent: true,
                    headerTintColor: '#fff'
                })}
            />

            <HomeStack.Screen
                name="ProdutoDestaque"
                component={ProdutoDestaque}
                options={{
                    title: 'Produtos em destaque',
                }}
            />
            {/* <HomeStack.Screen
                name="Overlays"
                component={Overlays}
                options={{
                    title: 'Raio do local',
                }}
            /> */}
            <HomeStack.Screen
                name="SejaUmProdutor"
                component={SejaUmProdutor}
                
                options={{
                    title: 'Iniciar Anúncio',
                    //headerTransparent: true,
                }}
            />
        </HomeStack.Navigator>
    );
};

export default HomeStackScreen;