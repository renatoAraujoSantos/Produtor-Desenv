import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, Platform, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { mascaraTelefone, mascaraCep, retiraMascaraMaterNumeros, mascaraCpf } from '../../util/Masks';
import { RadioButton, Text as TextPaper } from 'react-native-paper';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import Loader from '../../components/loading/Loader';
import * as BuscaEnderecoPorCep from '../../util/BuscaEnderecoPorCep';
import * as ActionTypes from '../../constants/ActionTypes';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import * as Api from '../../store/ApiSpring';
import Feather from 'react-native-vector-icons/Feather';
import { MESES } from '../../model/data';
import { TIPOS_CONTA_BANCO } from '../../model/data';

import { Slider } from 'react-native-elements';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const items = [
    //name key is must.It is to show the text in front
    { id: 1, name: 'angellist' },
    { id: 2, name: 'codepen' },
    { id: 3, name: 'envelope' },
    { id: 4, name: 'etsy' },
    { id: 5, name: 'facebook' },
    { id: 6, name: 'foursquare' },
    { id: 7, name: 'github-alt' },
    { id: 8, name: 'github' },
    { id: 9, name: 'gitlab' },
    { id: 10, name: 'instagram' },
];


export default function DadosBancariosUsuario({ route, navigation }) {

    const placeholder = {
        label: 'UFs...',
        value: null,
        color: '#9EA0A4',
    };

    const cidadeInicial = [
        {
            label: 'indefinido',
            value: '0'
        },
    ];

    const placeholderCidades = {
        label: 'Selecione a Cidade',
        value: null,
        color: '#9EA0A4',
    };
    
    const [isValidCep, setValidCep] = React.useState(false);
    const [valueCEP, setValueCEP] = React.useState('');
    const [valueRadio, setValueRadio] = React.useState('primeira');
    const [showInputCep, setShowInputCep] = React.useState(true);
    const [cep, setCep] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [messageImpuCep, setMessageImpuCep] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');    
    const [infoBairro, setInfoBairro] = React.useState('');
    const [ifoEndereco, setiIoEndereco] = React.useState('');
    const [idUfP, setIdUfP] = React.useState('');
    const [idCidadeP, setIdCidadeP] = React.useState('');
    const [idUfSelecionado, setIdUfSelecionado] = React.useState(null);
    const [idTipoContaSelecionado, setIdTipoContaSelecionado] = React.useState(null);
    const [idCidadeSelecionado, setIdCidadeSelecionado] = React.useState(null);
    const [isBairroValue, setIsBairroValue] = React.useState(false);
    const [isEnderecoValue, setIsEnderecoValue] = React.useState(false);
    const [isComplementoValue, setIsComplementoValue] = React.useState(false);
    const [valueImputComplemento, setValueImputComplemento] = React.useState('');
    const [isUfValue, setIsUfValue] = React.useState(false);
    const [isCidadeValue, setIsCidadeValue] = React.useState(false);
    const [listaBancos, setListaBancos] = React.useState([]);
    const [isAutenticado, setIsAutenticado] = React.useState(false);

    React.useEffect(() => {
        async function loadScreen() {
            try {
                setLoading(true);
                const autenticado = await ValidarUsuario();
                if (!autenticado) {
                    navigation.navigate('Login');
                    setLoading(false);
                    return;
                } else {                    
                    await buscaListaDeBancos();
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

    const buscaListaDeBancos = async () => {
        try {
            const response = await Api.getAll(`usuarios/buscarListaBancos`, `GET`);        
            //console.log('111111111111111111111111111111111111111111',response.respostaRequisicao.data);
            
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                
                await new Promise(resolve => { resolve(setListaBancos(response.respostaRequisicao.data)) });
            } else if (response.numeroStatusResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
                setLoading(false);
                mensagemSnackBar();
            } else if (response.numeroStatusResposta === ActionTypes.TIME_OUT_BACK_END) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
                setLoading(false);
                mensagemSnackBar();
            } else if (response.numeroStatusResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
                setLoading(false);
                return;
            } else {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
                setLoading(false);
                mensagemSnackBar();
            }

        } catch (error) {
            setLoading(false);
            console.log('Erro na classe DadosBancariosUsuario  metodo buscaListaDeBancos', error);
        }
    };

    const cadastrarDadosBancarios = async () => {

        try {
            var validaCamposFor = false;

            if (valueCEP.trim().length < 10 && showInputCep === true) {
                setMessageImpuCep(valueCEP.trim().length === 0 ? 'Campo obrigatório' : 'Mínimo de 6 caracteres');
                setValidCep(true);
                validaCamposFor = true;
            } else {
                setMessageImpuCep('');
                setValidCep(false);
            };

            if (infoBairro.length < 3) {
                setIsBairroValue(true);
                validaCamposFor = true;
            } else {
                setIsBairroValue(false);
            };

            if (ifoEndereco.length < 3) {
                setIsEnderecoValue(true);
                validaCamposFor = true;
            } else {
                setIsEnderecoValue(false);
            };

            if (idCidadeSelecionado === null) {
                setIsCidadeValue(true);
                validaCamposFor = true;
            } else {
                setIsCidadeValue(false);
            };

            if (idUfSelecionado === null) {
                setIsUfValue(true);
                validaCamposFor = true;
            } else {
                setIsUfValue(false);
            };

            if (validaCamposFor) {
                Alert.alert('Verifique os Campos obrigatórios!', '', [
                    { text: 'Ok' }
                ]);
                return;
            }

            const idUsuarioP = await AsyncStorage.getItem('idUsuario');
            const cepP = retiraMascaraMaterNumeros(valueRadio === 'primeira' ? valueCEP : cep);

            const jsonUser = {
                idEmpresa: 1,
                idUsuario: idUsuarioP,
                endereco: ifoEndereco,
                bairro: infoBairro,
                idUf: idUfP,
                idCidade: idCidadeP,
                cep: `${cepP}`,
                complemento: valueImputComplemento,
            }

            setLoading(true);

            const response = await Api.postRequestSemAccessToken(`usuarios/inserirEnderecoUsuarioSemAccessToken`, `POST`, jsonUser);
            console.log('sssssssssssssssssssssssssss', response.respostaRequisicao.data);
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {

            } else if (response.numeroStatusResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
                setIdUfSelecionado(null);
                setLoading(false);
                mensagemSnackBar();
            } else if (response.numeroStatusResposta === ActionTypes.TIME_OUT_BACK_END) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
                setIdUfSelecionado(null);
                setLoading(false);
                mensagemSnackBar();
            } else if (response.numeroStatusResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
                setLoading(false);
                Alert.alert('Parametros incorretos!', 'Erro cadastrado, Logo será resolvido.', [
                    { text: 'Ok' }
                ]);
                return;
            } else {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
                setLoading(false);
                mensagemSnackBar();
            }

            setLoading(false);

        } catch (error) {
            console.log('Erro na classe DadosBancariosUsuario metodo cadastrarDadosBancarios ', error);
            setLoading(false);
        }
    }

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    
    const tipoContaChange = async (val) => {
        setIdTipoContaSelecionado(val);
    }

    //╔══════════════════════════════════════════════════════════════════════════════════╗
    //                          SELECAO DO RADIO BUTTON
    //   BUSCANDO LOCALIZACAO ATUAL OU DIGITANDO CEP, PREENCHENDO OS CAMPOS DE ENDERECO
    //╚══════════════════════════════════════════════════════════════════════════════════╝



    const textInputBairroChange = (val) => {
        setInfoBairro(val);
    }

    const textInputEnderecoChange = (val) => {
        setiIoEndereco(val);
    }

    const textInputComplementoChange = (val) => {
        setValueImputComplemento(val);
    }

    if (!isAutenticado) {
        return (
            <Loader loading={loading} />
        );
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />
            <View style={styles.header}>
                <Text style={styles.text_header}>Endereço</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                <ScrollView>

                    <View style={styles.textPrivate}></View>
                    <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Informe seu CEP</Text>
                        <Text style={styles.color_textPrivate}>{" "}ou</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Selecione UF / Cidade</Text>
                    </View>

                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>Nome</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="store" size={20} color="#05375a" />
                        <TextInput
                            placeholder="Digite seu nome"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={ifoEndereco}
                            onChangeText={(val) => textInputEnderecoChange(val)}
                        />
                    </View>
                    {!isEnderecoValue ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>CPF</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="store" size={20} color="#05375a" />
                        <TextInput
                            placeholder="Digite seu nome"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={ifoEndereco}
                            onChangeText={(val) => textInputEnderecoChange(val)}
                        />
                    </View>
                    {!isEnderecoValue ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                    <View style={styles.actionUfCidade}>
                        <View>
                            <Text style={{ fontSize: 15, marginTop: 20, color: '#000000', fontWeight: 'bold' }}>Tipo de conta a ser creditado</Text>
                            <RNPickerSelect
                                placeholder={placeholder}
                                items={TIPOS_CONTA_BANCO}
                                onValueChange={value => { tipoContaChange(value) }}
                                style={{
                                    ...pickerSelectStyles,
                                    iconContainer: {
                                        top: 10,
                                        right: 12,
                                    },
                                }}
                                value={idTipoContaSelecionado}
                                useNativeAndroidPickerStyle={false}
                                textInputProps={{ underlineColorAndroid: 'transparent' }}
                                Icon={() => {
                                    return <Ionicons name="md-arrow-down" size={24} color="#000000" />;
                                }}
                            />
                            {!isUfValue ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Obrigatório.</Text>
                                </Animatable.View>
                            }
                        </View>
                    </View>



                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>Banco</Text>
                    <SearchableDropdown
                    onTextChange={(text) => console.log(text)}
                    // No ouvinte de mudança de texto na entrada pesquisável
                    onItemSelect={(item) => alert(JSON.stringify(item))}
                    // onItemSelect chamado após a seleção no menu suspenso
                    containerStyle={{ padding: 5 }}
                    // estilo de recipiente de sugestão
                    textInputStyle={{
                        //inserted text style
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        backgroundColor: '#FAF7F6',
                    }}
                    itemStyle={{
                        // estilo de texto inserido
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
                        maxHeight: '60%',
                    }}
                    items={items}
                    //mapeamento da matriz de itens
                    defaultIndex={2}
                    //default selected item index
                    placeholder="placeholder"
                    // marcador de posição para a entrada de pesquisa
                    resetValue={false}
                    //reset textInput Value with true and false state
                    underlineColorAndroid="transparent"
                    //To remove the underline from the android input
                />

                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>Bairro</Text>
                    <View style={styles.action}>
                        <Entypo name="address" size={20} color="#05375a" />

                        <TextInput
                            placeholder="Digite seu nome"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={infoBairro}
                            onChangeText={(val) => textInputBairroChange(val)}
                        />
                    </View>
                    {!isBairroValue ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 3 caracteres.</Text>
                        </Animatable.View>
                    }

                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>complemento</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="my-location" size={20} color="#05375a" />
                        <TextInput
                            placeholder="Digite seu nome"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={valueImputComplemento}
                            onChangeText={(val) => textInputComplementoChange(val)}
                        />
                    </View>
                    {!isComplementoValue ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 2 caracteres.</Text>
                        </Animatable.View>
                    }

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={cadastrarDadosBancarios} >
                            <LinearGradient
                                colors={['#56BA42', '#3c812e']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, { color: '#fff' }]}>Salvar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#3c812e',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, { color: '#3c812e' }]}>Voltar</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </Animatable.View>
            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c812e'
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingBottom: 1
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionUfCidade: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        justifyContent: 'space-between',
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 19,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0
    },
    textPrivateSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 1
    },
    color_textPrivate: {
        color: 'grey'
    },
    radioButtonSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 50,
        marginBottom: 1
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 80,
    },
    inputAndroid: {
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 80,
    },
});

