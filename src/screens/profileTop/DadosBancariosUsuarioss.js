import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import SearchableDropdown from 'react-native-searchable-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/loading/Loader';
import * as ActionTypes from '../../constants/ActionTypes';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import * as Api from '../../store/ApiSpring';
import RNPickerSelect from 'react-native-picker-select';

import * as UrlImagensSistema from '../../constants/UrlImagensSistema';
import ButtonVerdeLargo from '../../components/buttonsApp/ButtonVerdeLargo';

import ss from '../../../assets/images/nike-metcon-3.png'



export default function DadosBancariosUsuario ({ navigation }) {

    const [showAddToBagModal, setShowAddToBagModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");

    const [renderSnack, setRenderSnack] = useState(0);
    const [visible, setVisible] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        async function loadScreen() {
            try {
                setLoading(true);
                const autenticado = await ValidarUsuario();
                if (!autenticado) {
                    navigation.navigate('Login');
                    setLoading(false);
                    return;
                } else {


                    const nomeUser = await AsyncStorage.getItem('nomeUsuarioLogado');
                    setNomeUsuarioAutenticado(nomeUser);
                    await buscaAnexosUsuario();
                    setIsAutenticado(true);
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.log('Error na classe EditProfile metodo useEffect ', error);
            }

        }
        loadScreen()
    },[]);

    const funcaoTeste = () => {
        setShowAddToBagModal(true);
        //navigation.goBack();
        // setVisible(true);
        // setRenderSnack(renderSnack + 1);        
    }

    return (
        <View style={styles.container}>






                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAddToBagModal}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <BlurView
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                        blurType="light"
                        blurAmount={20}
                        reducedTransparencyFallbackColor="white"
                    >
                        {/* Button to close modal */}
                        <TouchableOpacity
                            style={styles.absolute}
                            onPress={() => {
                                setSelectedItem(null)
                                setSelectedSize("")
                                setShowAddToBagModal(false)
                            }}
                        >
                        </TouchableOpacity>

                        {/* Modal content */}
                        <View style={{ justifyContent: 'center', width: "85%", backgroundColor: 'red' }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -24 * 2 }}>
                                <Image
                                    source={require('../../../assets/images/nike-metcon-3.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: "90%",
                                        height: 170,
                                        transform: [
                                            { rotate: '-15deg' }
                                        ]
                                    }}
                                />
                            </View>
                            <Text style={{ marginTop: 10, marginHorizontal: 10, color: '#FFFFFF', }}>{'kichut'}</Text>
                            <Text style={{ marginTop: 8 / 2, marginHorizontal: 24, color: '#FFFFFF',  }}>{'firestone'}</Text>
                            <Text style={{ marginTop: 12, marginHorizontal: 24, color: '#FFFFFF' }}>{'00000'}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 12, marginHorizontal: 24 }}>
                                <View>
                                    <Text style={{ color: '#FFFFFF',  }}>Select size</Text>
                                </View>
                                {/* <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginLeft: 12 }}>
                                    {renderShoeSizes()}
                                </View> */}
                            </View>

                            <TouchableOpacity
                                style={{ width: '100%', height: 70, marginTop: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                onPress={() => {
                                    setSelectedItem(null)
                                    setSelectedSize("")
                                    setShowAddToBagModal(false)
                                }}
                            >
                                <Text style={{ color: '#FFFFFF',  }}>Add to Bag</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </Modal>







            <ScrollView>
                <View style={{ height: 100, }} >



                <SearchableDropdown
                    onTextChange={(text) => console.log(text)}
                    //On text change listner on the searchable input
                    onItemSelect={(item) => alert(JSON.stringify(item))}
                    //onItemSelect called after the selection from the dropdown
                    containerStyle={{ padding: 5 }}
                    //suggestion container style
                    textInputStyle={{
                        //inserted text style
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                    }}
                    itemStyle={{
                        //single dropdown item style
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#FAF9F8',
                        borderColor: '#bbb',
                        borderWidth: 1,
                    }}
                    itemTextStyle={{
                        // estilo de texto de um único item suspenso
                        color: '#222',
                    }}
                    itemsContainerStyle={{
                        // estilo do contêiner de itens, você pode passar a altura máxima 
                        // para restringir a altura da lista suspensa de itens
                        maxHeight: '50%',
                    }}
                    items={serverData}
                    //mapping of item array
                    defaultIndex={2}
                    //default selected item index
                    placeholder="placeholder"
                    // marcador de posição para a entrada de pesquisa
                    resetValue={false}
                    // redefinir o valor textInput com estado verdadeiro e falso
                    underlineColorAndroid="transparent"
                // Para remover o sublinhado da entrada do Android
                />




                    <Text>{''}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', }} >
                    <View style={{ alignItems: 'center', }} >
                        <Image
                            style={{ width: 250, height: 250, resizeMode: 'contain', }}
                            source={{ uri: UrlImagensSistema.URL_MANUTENCAO }}
                        />
                    </View>
                </View>
                <View style={{ height: 220, justifyContent: 'flex-end' }} >
                    <View style={{ marginVertical: 10 }} >
                        <Text style={styles.text}>Página em Manutenção</Text>
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 20 }} >
                        <ButtonVerdeLargo titulo={'Voltar'} onPress={() => funcaoTeste()} />
                    </View>
                </View>
            </ScrollView>
            
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    text: {
        color: "#000061",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }

});
