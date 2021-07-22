import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, Text, View, TouchableOpacity, Image, Dimensions, TouchableHighlight, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import Loader from '../../components/loading/Loader';
import { mascaraValorMoeda, retiraMascaraMaterNumeros } from '../../util/Masks';
import * as Api from '../../store/ApiSpring';
import * as ActionTypes from '../../constants/ActionTypes';
import ButtonConfirmarCompra from '../../components/buttonConfirmarCompra/ButtonConfirmarCompra';

const cartItems2 = [
    {  itemId: "247714372",  qty: 20, color: "Unicade", salePrice: "35", checked: 1, url:'' }
]

const { width: viewportWidth } = Dimensions.get('window');

export default function DetalhePesquisarProduto({ navigation, route }) {
    
    const [cartItems, setCartItems] = useState(cartItems2);
    const [loading, setLoading] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [slider1Ref, setSlider1Ref] = useState({});
    const [listaUrlImagens, setListaUrlImagens] = useState([]);
    const [arrayPhotos, setArrayPhotos] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                // setLoading(true);
                // const autenticado = await ValidarUsuario();
                // if (!autenticado) {
                //     navigation.navigate('Login');
                //     setLoading(false);
                //     return;
                // } else {
                //     await pesquisaUrls();
                //     setLoading(false);
                // }

                await pesquisaUrls();

            } catch (error) {
                console.log('Error no useEffect da classe DetalhePesquisarProduto ', error);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const pesquisaUrls = async () => {
        try {
            setLoading(true);
            setListaUrlImagens([]);
            const itemData = await route.params.itemData; 
            //console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++', itemData);
            //╔════════════════════════════════════════════════════════════════════════════════════════════════╗
            //   ADICIONANDO ALGUNS CAMPOS NESSE ARRAY POR VOU PRECISAR NA TELA DO CARRINHO
            //╚════════════════════════════════════════════════════════════════════════════════════════════════╝                        
            var listXp = [];
            listXp.push(itemData);
            var ss = listXp.map(x => {
                x.url = `${ActionTypes.LINK_API_SPRING}${x.url}`;
                x['qty'] = 1;
                x['checked'] = 1;                
                return x;
            })            
            setCartItems(ss);

            // const newItems = [...cartItems]; // clone the array 
            // newItems[0]['url'] = itemData.url;            
            // setCartItems(newItems);            

            const idTipoAnexo = 3;  // 3 E DO TIPO ANEXO, OU SEJA, IMAGENS DO PRODUTO
            const response = await Api.getAllSemAccessToken(`urlAnexoArquivo/listaUrlSemAccessToken?idProduto=${itemData.idProduto}&idTipoAnexo=${idTipoAnexo}`, `GET`);                            
            
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setListaUrlImagens(response.respostaRequisicao.data);
                
                
                var count = 1;
                var listImagens = [];
                var listImagens2 = {key: count, url: itemData.url};                                
                listImagens = response.respostaRequisicao.data.map(function (item) {
                    //console.log('111111111111111111-------------1111111111111111111111', `${ActionTypes.LINK_API_SPRING}${item.url}`);
                    count = count+1;
                    return {
                        key: count,
                        url: `${ActionTypes.LINK_API_SPRING}${item.url}`
                    };
                });
                listImagens.push(listImagens2);   
                                
                listImagens.sort(function(a, b) {
                    return a.key - b.key;
                 });
                 
                setArrayPhotos(listImagens);

            }            
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('Error classe DetalhePesquisarProduto metodo pesquisaProdutos ', error);
        }
    }

    const renderImage = ({ item }) => (
        <TouchableHighlight>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: item.url }} />
            </View>
        </TouchableHighlight>
    );

    const slider = (item) => {
        setSlider1Ref(item)
    };

    const quantityHandler = (action, index) => {
        const newItems = [...cartItems]; // clone the array 
        let currentQty = newItems[index]['qty'];
        if (action == 'more') {
            newItems[index]['qty'] = currentQty + 1;            
        } else if (action == 'less') {
            newItems[index]['qty'] = currentQty > 1 ? currentQty - 1 : 1;            
        }
        setCartItems(newItems);        
    }

    const itemData = route.params.itemData;
    const itemPro = cartItems[0];

    return (
        <ScrollView style={styles.container}>
            <Loader loading={loading} />
            <View style={styles.carouselContainer}>
                <View style={styles.carousel}>
                    <Carousel
                        ref={c => { slider(c) }}
                        data={arrayPhotos}                        
                        renderItem={renderImage}
                        sliderWidth={viewportWidth}
                        itemWidth={viewportWidth}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        firstItem={0}
                        loop={false}
                        autoplay={false}
                        autoplayDelay={500}
                        autoplayInterval={3000}
                        onSnapToItem={index => setActiveSlide(index)}
                    />
                    <Pagination
                        dotsLength={arrayPhotos.length}
                        activeDotIndex={activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor="rgba(255, 255, 255, 0.92)"
                        dotStyle={styles.paginationDot}
                        inactiveDotColor="white"
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={slider1Ref}
                        appableDots={!!slider1Ref}
                    />
                </View>
            </View>
            <View style={styles.infoRecipeContainer}>
                <Text style={styles.infoRecipeName}>{itemData.nomeProduto}</Text>                                
                <View style={styles.infoContainer}>
                    <TouchableHighlight
                        //onPress={() => navigation.navigate('RecipesListScreen', { category, title })}
                        onPress={() => { } }
                    >
                        {/* <Text style={styles.category}>{getCategoryName(item.categoryId).toUpperCase()}</Text> */}
                        <Text style={styles.category}>Categoria {itemData.descricaoCategoria}</Text>
                    </TouchableHighlight>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', marginTop: 10 }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> Valor Unitário: </Text>
                        <Text style={styles.infoRecipeDetail}>{  mascaraValorMoeda(`${itemData.valorUnitarioMedida}`)  }</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> QTD Disponível: </Text>
                        <Text style={styles.infoRecipeDetail}>{itemData.quantidadeDisponivelMedida}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> QTD Mínima Para Venda: </Text>
                        <Text style={styles.infoRecipeDetail}>{itemData.quantidadePedidoMinimoMedida}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> Validade: </Text>
                        <Text style={styles.infoRecipeDetail}>{moment(itemData.dataValidade).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> Medida: </Text>
                        <Text style={styles.infoRecipeDetail}>{itemData.descricaoMedida}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> Organico: </Text>
                        <Text style={styles.infoRecipeDetail}>{itemData.organico === true ? 'Sim' : 'Não'}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }} >
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoRecipe}> Selo Organico: </Text>
                        <Text style={styles.infoRecipeDetail}>{itemData.seloOrganico === true ? 'Sim' : 'Não'}</Text>
                    </View>
                </View>
            
                <View style={{ marginTop: 40, }} />
                <View style={styles.infoContainer}>                    
                    <Text style={styles.infoRecipe}> Descrição </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start', }}>                    
                    <Text style={{ fontSize: 16, marginTop: 10, margin: 15}}>{itemData.descricaoProduto}</Text>
                </View>

                {/* BOTOES DE ADICIONAR OU REMOVER */}
                <View style={{ flex: 1, width: '100%', marginTop: 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.infoRecipe}> Quantidade: </Text>
                </View>
                <View style={{ flex: 1, width: '100%', marginTop: 5, marginBottom: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity                         
                        style={{ borderWidth: 1, borderColor: '#525252' }}
                        onPress={() => quantityHandler('less', 0)}                         
                    >
                        <MaterialIcons name="remove" size={34} color="#525252" />
                    </TouchableOpacity>
                    <Text style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#525252', paddingHorizontal: 7, paddingTop: 3, color: '#1f1f1f', fontSize: 24 }}>{itemPro.qty}</Text>
                    <TouchableOpacity                         
                        style={{ borderWidth: 1, borderColor: '#525252' }}
                        onPress={() => quantityHandler('more', 0)}                         
                    >
                        <MaterialIcons name="add" size={34} color="#525252" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoContainer}>
                    <ButtonConfirmarCompra
                        onPress={() => { navigation.navigate('CarrinhoProdutos', { 'produtoSelecionado': cartItems })  }}
                    />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    carouselContainer: {
        minHeight: 250
    },
    carousel: {},
    image: {
        //...StyleSheet.absoluteFillObject,
        width: '100%',
        height: 250
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        width: viewportWidth,
        height: 250
    },
    paginationContainer: {
        flex: 1,
        position: 'absolute',
        alignSelf: 'center',
        paddingVertical: 8,
        marginTop: 200
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 0
    },
    infoRecipeContainer: {
        flex: 1,
        margin: 25,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    infoPhoto: {
        height: 20,
        width: 20,
        marginRight: 0
    },
    infoRecipe: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    infoRecipeDetail: {
        fontSize: 14,
        //fontWeight: 'bold',
        marginLeft: 5,
    },
    category: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 10,
        color: '#2cd18a'
    },
    infoRecipeName: {
        fontSize: 28,
        margin: 10,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center'
    }

});




