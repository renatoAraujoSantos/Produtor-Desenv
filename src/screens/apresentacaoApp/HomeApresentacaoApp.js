import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import * as UrlImagensSistema from '../../constants/UrlImagensSistema';

export default function HomeScreen({ route, navigation }) {
    const theme = useTheme();

    React.useEffect(() => {
        async function limparStatusNecessariosApp(){            
            AsyncStorage.removeItem('produtosCarrinho');
        }
        limparStatusNecessariosApp();
    });

    return (
        <ScrollView style={styles.container}>            
            <View style={styles.sliderContainer}>
                <Swiper
                    autoplay
                    horizontal={false}
                    height={200}
                    activeDotColor="#FF6347">
                    <View style={styles.slide}>
                        <Image
                            source={{ uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER1 }}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                            source={{ uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER2 }}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                    </View>
                    <View style={styles.slide}>
                        <Image
                            source={{ uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER3 }}
                            resizeMode="cover"
                            style={styles.sliderImage}
                        />
                    </View>
                </Swiper>
            </View>

            <View style={styles.categoryContainer}>
                {/* <TouchableOpacity
                    style={styles.categoryBtn}
                    onPress={() => navigation.navigate('Inicio') }>
                    <View style={styles.categoryIcon}>
                        <FontAwesome name="search" size={35} color="#FF6347" />
                    </View>
                    <Text style={styles.categoryBtnTxt}>Pesquisar</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { navigation.navigate('ProdutoDestaque') }}>
                    <View style={styles.categoryIcon}>
                        <MaterialCommunityIcons name="sprout" size={35} color="#FF6347" />
                    </View>
                    <Text style={styles.categoryBtnTxt}>Em Destaque</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { navigation.navigate('Categorias') }}>
                    <View style={styles.categoryIcon}>
                        <SimpleLineIcons name="options" size={35} color="#FF6347" />
                    </View>
                    <Text style={styles.categoryBtnTxt}>Categorias</Text>
                </TouchableOpacity>
            </View>


            {/* <View style={[styles.categoryContainer, { marginTop: 10 }]}>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { navigation.navigate('Overlays') }}>
                    <View style={styles.categoryIcon}>
                        <Entypo name="bar-graph" size={35} color="#FF6347" />                        
                    </View>
                    <Text style={styles.categoryBtnTxt}>Informações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { buscaCep() }}>
                    <View style={styles.categoryIcon}>
                        <AntDesign name="hourglass" size={35} color="#FF6347" />                        
                    </View>
                    <Text style={styles.categoryBtnTxt}>Tempo Reduzido</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.categoryBtn} onPress={() => { }}>
                    <View style={styles.categoryIcon}>                        
                        <Foundation name="graph-pie" size={35} color="#FF6347" />
                    </View>
                    <Text style={styles.categoryBtnTxt}>Índices</Text>
                </TouchableOpacity>
            </View> */}


            <View style={styles.cardsWrapper}>
                {/* <TouchableOpacity style={{ alignItems: "center",}} onPress={() => {navigation.navigate('SejaUmProdutor')   }} >
                    <View style={styles.card}>
                        <Image
                            source={require('../../../assets/images/comprar.gif')}                        
                            resizeMode="contain"
                            style={styles.cardImg}
                        />                        
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity style={{ alignItems: "center", paddingVertical: 10}} 
                    //onPress={() => { navigation.navigate('CardListScreen', { title: 'Produtores' })  }} 
                    onPress={() => { navigation.navigate('RootPesquisaProduto')  }} 
                >
                    <View style={styles.cardAnunciar}>
                        <View style={styles.cardImgWrapper}>
                            <Image                
                                source={require('../../../assets/images/pesquisarFundoTrasparente.png')}
                                resizeMode="contain"
                                style={styles.cardImg}
                            />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 23, marginHorizontal: '1%', fontWeight: 'bold'}}>PESQUISAR</Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 16, marginHorizontal: '1%', fontWeight: 'bold'}}>PRODUTOS</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center", paddingVertical: 10}} onPress={() => { navigation.navigate('FornecedorTabScreen')  }} >
                    <View style={styles.cardAnunciar}>
                        <View style={styles.cardImgWrapper}>
                            <Image
                                //source={{ uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER2 }}
                                source={require('../../../assets/images/anunciar.png')}
                                resizeMode="cover"
                                style={styles.cardImg}
                            />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 23, marginHorizontal: '1%', fontWeight: 'bold'}}>ANUNCIAR </Text>
                            <Text style={{fontFamily: 'Roboto_400Regular', fontSize: 16, marginHorizontal: '1%', fontWeight: 'bold'}}>PRODUTOS</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
    },





    wrapper: {},

    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
    },
    sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
    },
    categoryContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
    },
    categoryBtn: {
        flex: 1,
        width: '30%',
        marginHorizontal: 0,
        alignSelf: 'center',
    },
    categoryIcon: {
        borderWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 70,
        height: 70,
        backgroundColor: '#fdeae7' /* '#FF6347' */,
        borderRadius: 50,
    },
    categoryBtnTxt: {
        alignSelf: 'center',
        marginTop: 5,
        color: '#de4f35',
    },
    cardsWrapper: {
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
    },
    card: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    cardAnunciar: {
        backgroundColor: '#A3E4D7',
        height: 100,
        marginVertical: 1,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,    
    },




    cardImgWrapper: {
        //flex: 0.5,
        flex: 1,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    
    cardImg2: {
        height: '80%',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 8,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },

    cardInfo: {
        flex: 2,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 12,
        color: '#444',
    },
});
