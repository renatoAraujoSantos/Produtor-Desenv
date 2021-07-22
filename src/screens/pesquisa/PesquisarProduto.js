import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardPesquisa from '../../components/CardPesquisa';
import { SearchBar } from 'react-native-elements';
import * as Api from '../../store/ApiSpring';
//import Loader from '../../components/loading/Loader';
import * as ActionTypes from '../../constants/ActionTypes';
//import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import { LinearGradient } from 'expo-linear-gradient';
import { organizaArrayMarcadoProdutosSelecionados } from '../../util/TrabalhandoComArray';

const PesquisarProduto = ({ navigation }) => {

    const [search, setSearch] = useState('');
    const [listaProdutos, setListaProdutos] = useState([]);
    const [cloneListaProdutos, setCloneListaProdutos] = useState([]);
    const [pageT, setPageT] = useState(1);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [size, setSize] = useState(5);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                // const autenticado = await ValidarUsuario();
                // if (!autenticado) {
                //     navigation.navigate('Login');
                //     return;
                // } else {
                //     await pesquisaProdutos();
                // }

                //await AsyncStorage.removeItem('produtosCarrinho');
                await pesquisaProdutos();

            } catch (error) {
                console.log('Error no useEffect da classe HomeScreen ', error);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const pesquisaProdutos = async () => {
        try {
            setLoading(true);
            setListaProdutos([]);
            setPageT(0);
            
            //const idUsuario = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idUsuario')   )});            
            //const response = await Api.getAll(`produto/sqlProdutosComPaginacao?size=${size}&page=0&telaPesquisaRetiraridUsuario=${idUsuario}&nomeProduto=${search}`, `GET`);   
            //const response = await Api.getAll(`produto/sqlProdutosComPaginacao?size=${size}&page=0&nomeProduto=${search}`, `GET`);            
            const response = await Api.getAllSemAccessToken(`produto/sqlProdutosComPaginacaoSemAccessToken?size=${size}&page=0&nomeProduto=${search}&ocultarProduto=false`, `GET`);
            
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                                
                const produtosCarrinhoString = await AsyncStorage.getItem('produtosCarrinho');

                if(produtosCarrinhoString !== null){
                    const produtosCarrinho = JSON.parse(produtosCarrinhoString);                    
                    const resultado = await organizaArrayMarcadoProdutosSelecionados(response.respostaRequisicao.data.content, produtosCarrinho);
                    setListaProdutos(resultado);
                }else{
                    setListaProdutos(response.respostaRequisicao.data.content);
                }
                setTotal(response.respostaRequisicao.data.totalPages);
            }
            setPageT(1);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('Error classe PesquisarProduto metodo pesquisaProdutos ', error);
        }
    }

    const loading2 = async () => {
        try {
            setLoading(true);
            const pageNumber = pageT;
            if (total === pageNumber) {
                setLoading(false);
                return;
            }
            const response = await Api.getAllSemAccessToken(`produto/sqlProdutosComPaginacaoSemAccessToken?size=${size}&page=${pageT}&nomeProduto=${search}`, `GET`);            

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setPageT(pageT + 1);
                var novaLista = response.respostaRequisicao.data.content;
                var arrayConcatenandoListaProdutosComNovaPesquisaPaginada = [];                

                listaProdutos.map(function(x) {
                    arrayConcatenandoListaProdutosComNovaPesquisaPaginada.push(x);
                });
                novaLista.map(function(o) {
                    arrayConcatenandoListaProdutosComNovaPesquisaPaginada.push(o);
                });

                const produtosCarrinhoString = await AsyncStorage.getItem('produtosCarrinho');  
                const produtosCarrinho = JSON.parse(produtosCarrinhoString);
                if(produtosCarrinho !== null){
                    const resultado = await organizaArrayMarcadoProdutosSelecionados(arrayConcatenandoListaProdutosComNovaPesquisaPaginada, produtosCarrinho);
                    setListaProdutos(resultado);                        
                }else{
                    setListaProdutos([...listaProdutos, ...novaLista]);
                }                                                
            }            
            setLoading(false);            
        } catch (error) {
            setLoading(false);
            console.log('Error classe PesquisarProduto metodo loading2', error);
        }
    }

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

    const renderItem = ({ item }) => {
        return (
            <CardPesquisa key={item.idProduto}
                itemData={item}
                onPress={() => navigation.navigate('DetalhePesquisarProduto', { itemData: item })}                                
            />
        );
    };

    const searchFilterFunction = (text) => {
        setSearch(text);
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
            <View style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 20 }}>
                <TouchableOpacity style={styles.signIn} onPress={() => { pesquisaProdutos() }} >
                    <LinearGradient
                        colors={['#56BA42', '#3c812e']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign, { color: '#fff' }]}>PESQUISAR</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <FlatList
                data={listaProdutos}
                keyExtractor={item => `${item.idProduto}`}
                renderItem={renderItem}
                onEndReached={() => loading2()}
                onEndReachedThreshold={0.1}
                ListFooterComponent={activityIndicator}
            />
        </View>
    );
};

export default PesquisarProduto;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center'
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
