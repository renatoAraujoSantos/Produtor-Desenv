import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, Text, View, TouchableHighlight, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import Loader from '../../../../components/loading/Loader';
import * as Api from '../../../../store/ApiSpring';
import * as ActionTypes from '../../../../constants/ActionTypes';
import SnackBarPaper from '../../../../components/snackBar/SnackBarPaper';
import { AuthContext } from '../../../../components/context';
import { ValidarUsuario } from '../../../../util/ValidarAutenticacaoUser';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ navigation }) {
    const { signOut } = React.useContext(AuthContext);

    const [listaProdutos, setListaProdutos] = useState([]);
    const [pageT, setPageT] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(5);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const autenticado = await ValidarUsuario();
                if (!autenticado) {
                    navigation.navigate('Login');
                    return;
                } else {
                    setListaProdutos([]);
                    setPageT(0);
                    const idUsuario = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idUsuario')   )});

                    const response = await Api.getAll(`produto/sqlProdutosComPaginacao?size=${size}&page=0&idUsuario=${idUsuario}`, `GET`);
                    if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                        setListaProdutos(response.respostaRequisicao.data.content);
                        setTotal(response.respostaRequisicao.data.totalPages);
                        console.log('--------------------------'  ,response.respostaRequisicao.data.content);
                    }
                    setPageT(1);
                }

            } catch (error) {
                console.log('Error no useEffect da classe HomeScreen ', error);
            }
        });        
        return unsubscribe;
    }, [navigation]);

    const loading2 = async () => {
        try {
            setLoading(true);
            const pageNumber = pageT;
            if (total === pageNumber) {
                setLoading(false);
                return;
            }
            const idUsuario = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idUsuario')   )});
            const response = await Api.getAll(`produto/sqlProdutosComPaginacao?size=${size}&page=${pageT}&idUsuario=${idUsuario}`, `GET`);

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setPageT(pageT + 1);
                var novaLista = response.respostaRequisicao.data.content;
                setListaProdutos([...listaProdutos, ...novaLista]);
                //console.log('--------------------------'  ,listaProdutos);
            }
            if (response.numeroStatusResposta === ActionTypes.REFRESH_TOKEN_EXPIRADO) {
                signOut();
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('Error ', error);
        }
    }

    const onPressRecipe = item => {        
        navigation.navigate('ProdutoScreen', { 'produto': item });
    };

    const renderRecipes = ({ item }) => (
        <TouchableHighlight underlayColor='rgba(73,182,77,1,0.9)' onPress={() => onPressRecipe(item)}>
            <View style={styles.container}>
                <Image style={styles.photo} source={{ uri: `${ActionTypes.LINK_API_SPRING}${item.url}` }} />
                <Text style={styles.title}>{item.descricaoProduto}</Text>
                <Text style={styles.category}>{item.descricaoCategoria}</Text>
            </View>
        </TouchableHighlight>
    );

    const activityIndicator = () => {
        if (loading) {
            return (
                <View>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
            );
        } else {
            return (
                <View />
            )
        }
    }

    async function refreshList() {
        setRefreshing(true);
        await loading2();
        setRefreshing(false);
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>            

            <View style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 20 }}>
                    <TouchableOpacity style={styles2.signIn} onPress={() => { navigation.navigate('ProdutoScreen')  } } >
                        <LinearGradient
                            colors={['#56BA42', '#3c812e']}
                            style={styles2.signIn}
                        >
                            <Text style={[styles2.textSign, { color: '#fff' }]}>CADASTRAR NOVO PRODUTO</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            <View style={{ flex: 1 }}>
                <FlatList
                    vertical
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    data={listaProdutos}
                    renderItem={renderRecipes}
                    keyExtractor={item => `${item.idProduto}`}
                    onEndReached={() => loading2()}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={activityIndicator}
                    //ListEmptyComponent                     // da uma olhada nesse cara ele reinderiza caso a lista esteja vazia
                    //initialScrollIndex={1}
                    //initialNumToRender={2}
                    //onRefresh={refreshList}
                    //refreshing={refreshing}

                />
            </View>
        </View>
    );
}

const styles2 = StyleSheet.create({
    viewTask: {
        position: 'absolute',
        bottom: 40,
        right: 17,
        height: 50,
        width: 50,
        backgroundColor: '#004C00',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2E66E7',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 30,
        shadowOpacity: 0.5,
        elevation: 5,
        zIndex: 999,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },



});
