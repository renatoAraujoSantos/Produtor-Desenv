import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Button, StyleSheet, Image, ScrollView, TextInput, Dimensions, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import * as Animatable from 'react-native-animatable';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import * as Api from '../../store/ApiSpring';
import Loader from '../../components/loading/Loader';
import * as ActionTypes from '../../constants/ActionTypes';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import * as UrlImagensSistema from '../../constants/UrlImagensSistema';
import moment from 'moment';

export default function PlantDetail({ route, navigation }) {

    const [valueImpuDescricao, setValueDescricao] = useState('');
    const [validacaoImput, setValidacaoImput] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = useState('');
    const [loading, setLoading] = useState(false);
    const [renderSnack, setRenderSnack] = useState(0);
    const [visible, setVisible] = useState(false);
    const [nomeUsuarioLogadoP, setNomeUsuarioLogadoP] = useState('');
    const [codUsuarioLogadoP, setCodUsuarioLogadoP] = useState('');
    const [motivo, setMotivo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [isAutenticado, setIsAutenticado] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                setLoading(true);


                // const autenticado = await ValidarUsuario();
                // if (autenticado != ActionTypes.SUCESSO_NA_REQUISICAO) {
                //     navigation.navigate('Login');
                //     setLoading(false);
                //     return;
                // } else {
                //     setLoading(false);
                //     setIsAutenticado(true);
                // }

                setLoading(false);
                setIsAutenticado(true);


            } catch (error) {
                setLoading(false);
                console.log('Error na classe ContestacaoDetalhe metodo useEffect ', error);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const textInputDescricao = (val) => {
        setValueDescricao(val);
    }

    const salvarContestacao = async () => {

        if (valueImpuDescricao.trim().length <= 1) {
            setValidacaoImput(true);
            return;
        } else {
            setValidacaoImput(false);
        }

        // const sqlBonificacaoEquipePP = await route.params.sqlBonificacaoEquipeP;
        // const listaBonificacaoMensagensP = await route.params.listaBonificacaoMensagensP;

        const codUsuarioP = await AsyncStorage.getItem('codUsuarioAsyncStorage');
        const jsonContestacao = {
            // seqBonificacaoContestacao

            seqBonificacaoMovimento: route.params.sqlBonificacaoEquipeP[0].seqBonificacaoMovimento,
            descricao: valueImpuDescricao,
            codUsuarioAlteracao: codUsuarioP,
            dhCadastro: route.params.sqlBonificacaoEquipeP[0].dtEntrada
        }
        setLoading(true);
        const response = await Api.postRequest(`sqlBonificacaoEquipe/enviarMensagemBonificacao`, `POST`, jsonContestacao);

        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            setLoading(false);
            await new Promise(resolve => { resolve(setMensagem('Mensagem enviada com sucesso!')) });
            await new Promise(resolve => { resolve(setMensagemDetalhe('')) });
            alertMenssagemSucesso();
        } else {
            tratamentoDeMensagensDeErro();
        }
    }

    const tratamentoDeMensagensDeErro = async (numeroStatusResposta) => {

        if (numeroStatusResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
            await new Promise(resolve => { resolve(setMensagem('Informações incorretas')) });
            await new Promise(resolve => { resolve(setMensagemDetalhe('Verifique os dados informados e tente novamente')) });
            setLoading(false);
            alertMenssagem();
        } else if (numeroStatusResposta === ActionTypes.TIME_OUT_BACK_END) {
            await new Promise(resolve => { resolve(setMensagem('Sem comunicação com servidor')) });
            await new Promise(resolve => { resolve(setMensagemDetalhe('Favor tentar mais tarde')) });
            setLoading(false);
            mensagemSnackBar();
        } else if (numeroStatusResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
            await new Promise(resolve => { resolve(setMensagem('Sem Conexão com a Internet')) });
            await new Promise(resolve => { resolve(setMensagemDetalhe('Favor Verificar sua Conexão')) });
            setLoading(false);
            mensagemSnackBar();
        } else {
            await new Promise(resolve => { resolve(setMensagem('Erro não esperdo')) });
            await new Promise(resolve => { resolve(setMensagemDetalhe('Favor entrar em contato com seu gestor!')) });
            setLoading(false);
            mensagemSnackBar();
        }
    }

    const mensagemSnackBar = () => {
        setVisible(true);
        const xxdr = renderSnack;
        setRenderSnack(xxdr + 1)
    };

    const alertMenssagemSucesso = () => {
        setLoading(false);
        const mensagemPrincipal = 'Mensagem enviada com sucesso!';
        const mensagemDetalhes = '';
        Alert.alert(
            mensagemPrincipal,
            mensagemDetalhes,
            [
                { text: "OK", onPress: () => navigation.navigate('ProdutividadeTecnico') }
            ],
            { cancelable: false }
        );
    };

    const alertMenssagem = () => {
        setLoading(false);
        const mensagemPrincipal = mensagem;
        const mensagemDetalhes = mensagemDetalhe;
        Alert.alert(
            mensagemPrincipal,
            mensagemDetalhes,
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: false }
        );
    };


    function renderHeader() {
        return (
            <View style={{ position: 'absolute', top: 80, left: 14, right: 14, backgroundColor: 'transparent' }} >
                <View style={{ backgroundColor: 'transparent' }}>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>

            <Loader loading={loading} />
            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
            <View style={{ height: "20%" }}>
                <Image
                    source={require('../../../assets/images/banner_bg.jpg')}
                    resizeMode="cover"
                    style={{ width: '100%', height: '100%' }}
                />
            </View>

            {renderHeader()}
            <View style={{ flex: 1, marginTop: -40, backgroundColor: '#e6e6e6', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingVertical: 24, paddingHorizontal: 24, }} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: '#00004d', fontSize: 15, fontWeight: 'bold' }}>Motivo da contestação:</Text>
                    <Text style={{ color: '#00004d', fontSize: 15, }}>  motivo</Text>
                </View>

            </View>
            <ScrollView>

                <View style={{ marginTop: 20, borderRadius: 12, backgroundColor: '#e9f3fc', marginHorizontal: 20, ...styles.shadow }} >
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                            <Text style={{ color: '#00004d', fontSize: 15, fontWeight: 'bold' }}>Detalhes: </Text>
                            <Text style={{ color: '#00004d', fontSize: 15, }}>  detalhess</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={{ height: 70, }} >
                <View style={{ width: '100%', height: 70, alignItems: 'center', justifyContent: 'flex-end', }} >
                    <View style={{ flexDirection: 'row', marginBottom: 0, marginTop: 8, }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <View style={{ backgroundColor: '#0e396c', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 145, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Voltar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => salvarContestacao()} >
                                <View style={{ backgroundColor: '#0e396c', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 145, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Enviar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            </Animatable.View>
            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        //justifyContent: 'center',      
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },    
    viewBorder: {
        flex: 1,
        backgroundColor: '#faf9f9',
        borderRadius: 15,
        shadowRadius: 12,
        borderWidth: 2,
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginBottom: 0,
        marginTop: 1,
    },
    action: {
        flexDirection: 'row',
        marginTop: 25,
        paddingBottom: 5,
        alignContent: 'center',
        alignItems: 'center'
    },
    TextInputStyleClass: {
        fontFamily: 'SourceSansPro_400Regular',
        fontSize: 18,
        width: Dimensions.get('window').width - 40,
        borderWidth: 1,
        borderColor: '#0d75ae',
        borderRadius: 0,
        backgroundColor: "#FFFFFF",
        height: 150,
        textAlignVertical: 'top',
        padding: 10,
        width: '96%',
        marginLeft: '2%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,

    },
    textTituloColunas: {
        fontFamily: 'SourceSansPro_600SemiBold',
        fontSize: 17,
        color: '#888888',
        marginLeft: 5,
    },
    textColunas: {
        fontFamily: 'SourceSansPro_400Regular',
        fontSize: 17,
        color: '#888888',
        marginLeft: 5,
        marginTop: 5
    },
    tituloMensagens: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 20,
        marginBottom: 10
    },
    textData: {
        fontFamily: 'SourceSansPro_400Regular',
        fontSize: 12,
        color: 'gray',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    messages_BalaoMensagem: {
        flex: 1,
        height: 'auto',
        backgroundColor: '#f3f7ff',
        borderColor: '#8aadfe',
        borderRadius: 10,
        shadowRadius: 0,
        borderWidth: 1
    },
    messages_BalaoMensagem_label: {
        fontFamily: 'SourceSansPro_600SemiBold',
        fontSize: 16,
        color: '#888888',
        marginLeft: 5,
        marginBottom: 2,
    },
    messages_BalaoMensagem_label_thisUser: {
        fontFamily: 'SourceSansPro_400Regular',
        width: '100%',
        textAlign: 'right',
        marginBottom: 3,
        paddingRight: 10
    },
})