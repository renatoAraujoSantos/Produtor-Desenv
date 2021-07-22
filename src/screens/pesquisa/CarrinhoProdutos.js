import React, { useState, useEffect } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, 
    Image, ActivityIndicator, TextInput, Alert, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
//import Property from "../../components/Property";
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';

const { width, height } = Dimensions.get('window');

const cartItems2 = [
    /* Sample data from walmart */
    { itemId: "501436323", name: "Tomate", thumbnailImage: require("../../../assets/images/tomate.jpg"), color: "Caixa com 50", qty: 1, salePrice: "25", checked: 1, url:'http://35.247.228.82:8080/produtor/downloadFile/anexo2020-08-19-4859.png' },
    { itemId: "35031861", name: "Alface", thumbnailImage: require("../../../assets/images/alface.jpg"), qty: 1, color: "Caixa com 10", salePrice: "15", checked: 0, url:'http://35.247.228.82:8080/produtor/downloadFile/anexo2020-08-19-4859.png' },
    { itemId: "801099131", name: "Laranja", thumbnailImage: require("../../../assets/images/laranja.jpg"), qty: 1, color: "Caixa com 100", salePrice: "27.99", checked: 1, url:'http://35.247.228.82:8080/produtor/downloadFile/anexo2020-08-19-4859.png' },
    { itemId: "42608079", name: "Banana", thumbnailImage: require("../../../assets/images/banana.jpg"), color: "Duzia", qty: 1, salePrice: "7.99", checked: 0, url:'http://35.247.228.82:8080/produtor/downloadFile/anexo2020-08-19-4859.png' },
    { itemId: "247714372", name: "Melancia", thumbnailImage: require("../../../assets/images/melancia.jpg"), qty: 1, color: "Unicade", salePrice: "35", checked: 1, url:'http://35.247.228.82:8080/produtor/downloadFile/anexo2020-08-19-4859.png' }
]

const actions = [
    {
      color: "#3c812e",
      text: "Adicionar Novo Produto",
      icon: require("../../../assets/images/icone-carrinho.png"),
      name: "add_produto",
      position: 3,
      textColor: "#FFFFFF",      
      textBackground: "#3c812e",  
    },
    {
        color: "#3c812e",
        text: "Limpar Carrinho",
        icon: require("../../../assets/images/lixeiraFundoBranco2.png"),
        name: "limpar_carrinho",
        position: 4,
        textColor: "#f0f0f0",      
        textBackground: "#3c812e",              
    },  
    {
      color: "#3c812e",
      text: "Cancelar",
      icon: require("../../../assets/images/icone-cancel.png"),
      name: "bt_cancel",
      position: 4,
      textColor: "#f0f0f0",      
      textBackground: "#3c812e",        
      //textStyle:{color: '#f0f0f0', fontSize: 15, }    
    }
  ];

export default function CarrinhoProdutos({ navigation, route }) {
    
    const [cartItems, setCartItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [cartItemsIsLoading, setCartItemsIsLoading] = useState(false);
    const [updatedCartP, setUpdatedCartP] = useState([]);

    const [larguraModal, setLarguraModal] = useState('14%');
    const [alturaModal, setAlturaModal] = useState('10%');
    const [valorTotalPagamento, setValorTotalPagamento] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const autenticado = await ValidarUsuario();
                if (!autenticado) {
                    navigation.navigate('Login');
                    return;
                } else {
                    await carregaPedidos();
                }

                

            } catch (error) {
                console.log('Error no useEffect da classe CarrinhoProdutos ', error);
            }
        });
        return unsubscribe;
    }, [navigation]);


    const atualizaListaDeProdutosNoAsyncStorage = async (arrayAtualizado) =>{
        await AsyncStorage.setItem('produtosCarrinho', JSON.stringify(arrayAtualizado));
        // const p = await AsyncStorage.getItem('produtosCarrinho');
        // const d = JSON.parse(p);  
        // console.log('11111111111111111111111111111111111111111------------------ ', d);
    }

    const carregaPedidos = async () => {       
      //╔════════════════════════════════════════════════════════════════════════════════════════════════╗
      //   VOU CONCATENANDO OS PRODUTOS A MEDIDA QUE VAI SENDO SELECIONADO
      //   A PROPOSITO O "AsyncStorage" VAI SER NULL NA PRIMEIRA SELECÃO, NESSE CASO PEGO O DA ROTA
      //╚════════════════════════════════════════════════════════════════════════════════════════════════╝                        
      try {          
        var newItems2 = [];

        const produtosCarrinhoString = await AsyncStorage.getItem('produtosCarrinho');   
        const produtosCarrinho = JSON.parse(produtosCarrinhoString);                
        if(produtosCarrinho !== null){
            newItems2 = [...produtosCarrinho]; // clone the array 
        }

        const produtoSelecionado = await new Promise(resolve => {resolve(   route.params.produtoSelecionado   )});        
        if(produtoSelecionado !== 'null' && produtoSelecionado !== null){
            newItems2.push(produtoSelecionado[0]);            
        }
        
        setCartItems(newItems2);
        atualizaListaDeProdutosNoAsyncStorage(newItems2);        

      } catch (error) {
            console.log('Erro na classe CarrinhoProdutos metodo carregaPedidos ', error);
      }
    }

    const selectHandler = (index, value) => {
        const newItems = [...cartItems]; // clone the array 
        newItems[index]['checked'] = value == 1 ? 0 : 1; // set the new value 
        setCartItems(newItems);
        atualizaListaDeProdutosNoAsyncStorage(newItems);
    }

    const selectHandlerAll = (value) => {
        const newItems = [...cartItems]; // clone the array 
        newItems.map((item, index) => {
            newItems[index]['checked'] = value == true ? 0 : 1; // set the new value 
        });
        setCartItems(newItems);
        setSelectAll(value == true ? false : true);
        atualizaListaDeProdutosNoAsyncStorage(newItems);
    }

    const deleteHandler = (index) => {
        Alert.alert(
            'Tem certeza de que deseja excluir este item do seu carrinho?',
            '',
            [
                { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Excluir', onPress: () => {
                        let updatedCart = cartItems; /* Clone it first */
                        updatedCart.splice(index, 1); /* Remove item from the cloned cart state */
                        setUpdatedCartP(updatedCart);
                        atualizaListaDeProdutosNoAsyncStorage(updatedCart);
                    }
                },
            ],
            { cancelable: false }
        );
    }

    const limpaCarrinho = (index) => {
        Alert.alert(
            'Tem certeza de que deseja excluir todos os produtos do seu carrinho?',
            '',
            [
                { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Excluir', onPress: () => {
                        setCartItems([]);
                        AsyncStorage.removeItem('produtosCarrinho');            
                    }
                },
            ],
            { cancelable: false }
        );
    }

    const quantityHandler = (action, index) => {
        const newItems = [...cartItems]; // clone the array 
        let currentQty = newItems[index]['qty'];
        if (action == 'more') {
            newItems[index]['qty'] = currentQty + 1;
        } else if (action == 'less') {
            newItems[index]['qty'] = currentQty > 1 ? currentQty - 1 : 1;
        }
        setCartItems(newItems);     
        atualizaListaDeProdutosNoAsyncStorage(newItems);   
    }

    const subtotalPrice = () => {
        if (cartItems) {                        
            return cartItems.reduce((sum, item) => sum + (item.checked == 1 ? item.qty * item.valorUnitarioMedida : 0), 0);
        }
        return 0;
    }
    
    const buttonAdd = (val) => {  
        setLarguraModal('14%');            
        setAlturaModal('10%')    
        if (val === 'add_produto') {        
            navigation.navigate('PesquisarProduto');                        
        }else if(val === 'bt_cancel'){
            console.log('botão cancelar ', val);
        }else if(val === 'limpar_carrinho'){     
            limpaCarrinho();
        }        
    }

    const botaoPrincipal = (val) => {                
        if (val === true) {        
            setLarguraModal('100%');
            setAlturaModal('100%')
        }else {
            setLarguraModal('14%');            
            setAlturaModal('10%')
        }        
    }

    const chamarTelaDePagamento = () => {        
        const total = subtotalPrice();
        // console.log('3333333333333', total);
        navigation.navigate('HomeScreen', {'cartItensParam': cartItems, 'totalPagamentoPram': total });
    }


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
        <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>

            <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.centerElement, { width: 50, height: 50 }]}>
                    <Ionicons name="ios-cart" size={25} color="#000" />
                </View>
                <View style={[styles.centerElement, { height: 50 }]}>
                    <Text style={{ fontSize: 18, color: '#000' }}>Carrinho de Compras</Text>
                </View>
            </View>

            {cartItemsIsLoading ? (
                <View style={[styles.centerElement, { height: 300 }]}>
                    <ActivityIndicator size="large" color="#ef5739" />
                </View>
            ) : (
                    <ScrollView>
                        {cartItems && cartItems.map((item, i) => (
                            <View key={i} style={{ flexDirection: 'row', backgroundColor: '#fff', marginBottom: 2, height: 120 }}>
                                <View style={[styles.centerElement, { width: 60 }]}>
                                    <TouchableOpacity style={[styles.centerElement, { width: 32, height: 32 }]} onPress={() => selectHandler(i, item.checked)}>
                                        <Ionicons name={item.checked == 1 ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} size={25} color={item.checked == 1 ? "#0faf9a" : "#aaaaaa"} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/ }} style={{ paddingRight: 10 }}>                                       
                                        <Image source={{ uri: item.url }} style={[styles.centerElement, { height: 60, width: 60, backgroundColor: '#eeeeee' }]} />
                                    </TouchableOpacity>
                                    <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                                        <Text numberOfLines={1} style={{ fontSize: 15 }}>{item.nomeProduto}</Text>
                                        <Text numberOfLines={1} style={{ color: '#8f8f8f' }}>{item.descricaoMedida ? 'Valor Unitário: ' + item.valorUnitarioMedida + ',00'  : ''}</Text>
                                        <Text numberOfLines={1} style={{ color: '#333333', marginBottom: 10 }}>R$ {item.qty * item.valorUnitarioMedida},00</Text>                                                                                                    

                                        {/* BOTOES DE ADICIONAR OU REMOVER */}
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity onPress={() => quantityHandler('less', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
                                                <MaterialIcons name="remove" size={34} color="#cccccc" />
                                            </TouchableOpacity>
                                            <Text style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#cccccc', paddingHorizontal: 7, paddingTop: 3, color: '#bbbbbb', fontSize: 25 }}>{item.qty}</Text>
                                            <TouchableOpacity onPress={() => quantityHandler('more', i)} style={{ borderWidth: 1, borderColor: '#cccccc' }}>
                                                <MaterialIcons name="add" size={34} color="#cccccc" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                </View>
                                <View style={[styles.centerElement, { width: 60 }]}>
                                    <TouchableOpacity style={[styles.centerElement, { width: 32, height: 32 }]} onPress={() => deleteHandler(i)}>
                                        <Ionicons name="md-trash" size={25} color="#ee4d2d" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        
                    </ScrollView>
                )}

            {!cartItemsIsLoading &&
                <View style={{ backgroundColor: '#fff', borderTopWidth: 2, borderColor: '#f6f6f6', paddingVertical: 5 }}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.centerElement, { width: 60 }]}>
                            <TouchableOpacity style={[styles.centerElement, { width: 32, height: 32 }]} onPress={() => selectHandlerAll(selectAll)}>
                                <Ionicons name={selectAll == true ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"} size={25} color={selectAll == true ? "#0faf9a" : "#aaaaaa"} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', flexGrow: 1, flexShrink: 1, justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#1f1f1f', fontSize: 20 }}>Selecionar Todos</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', paddingRight: 20, alignItems: 'center', marginHorizontal: 20, marginTop: 20,}}>
                        <MaterialIcons name="monetization-on" size={28} color="black" />
                        <Text style={{ color: '#1f1f1f', fontSize: 20 }}>   Total: </Text>
                        <Text style={{ color: '#1f1f1f', fontSize: 20, fontWeight: 'bold' }}>R${subtotalPrice().toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20, marginHorizontal: 80,}}>
                        <TouchableOpacity style={styles.signIn}                             
                            onPress={() => chamarTelaDePagamento() }  
                        >
                            <LinearGradient colors={['#56BA42', '#3c812e']} style={styles.signIn} >
                                <Text style={[styles.textButton, { color: '#fff' }]}>Finalizar</Text>
                            </LinearGradient>
                        </TouchableOpacity>                        
                    </View>                          
                </View>
            }
        </View>
                
        <View style={[styles.viewTask, { width: larguraModal, height: alturaModal }]} >          
                <FloatingAction
                    //showBackground={false}
                    color="#3c812e"
                    actions={actions}
                    distanceToEdge={0}
                    position="right"
                    onPressItem={name => { buttonAdd(name)  }}
                    onPressMain={name => { botaoPrincipal(name)  }}                    
                />                        
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c812e'
    },
    viewTask: {
        //flex: 1,
        position: 'absolute',
        bottom: 80,
        right: 1,
        //height: 100,
        //width: 200,
        backgroundColor: 'transparent',
        //backgroundColor: '#FFFFFF',
        borderRadius: 30,  
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
    centerElement: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        marginTop: 20,        
        marginHorizontal: 20,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,        
    },
    textButton: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',        
        fontWeight: 'bold',        
    },

});