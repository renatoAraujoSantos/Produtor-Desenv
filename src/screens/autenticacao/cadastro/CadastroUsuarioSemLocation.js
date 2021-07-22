//import React from 'react';
import * as React from 'react';
import {
    View, Text, Button, TouchableOpacity, Dimensions, TextInput,
    Platform, StyleSheet, ScrollView, Alert, Animated
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { mascaraTelefone, mascaraCep, retiraMascaraMaterNumeros } from '../../../util/Masks';
import { RadioButton, Text as TextPaper } from 'react-native-paper';
//import * as Location from 'expo-location';
//import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/loading/Loader';
import * as BuscaEnderecoPorCep from '../../../util/BuscaEnderecoPorCep';
import * as ActionTypes from '../../../constants/ActionTypes';
import SnackBarPaper from '../../../components/snackBar/SnackBarPaper';
import * as Api from '../../../store/ApiSpring';
import RNPickerSelect from 'react-native-picker-select';
import Feather from 'react-native-vector-icons/Feather';
import { MESES } from '../../../model/data';
import { Slider } from 'react-native-elements';
import { Entypo, MaterialIcons } from '@expo/vector-icons';


export default function CadastroUsuarioSemLocation({ route, navigation }) {

    const validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const placeholder = {
        label: 'UFs...',
        value: null,
        color: '#9EA0A4',
    };

    const cidadeInicial = [
        {
            label: 'indefinido',
            value: '0'
            //key: '1',
        },
    ];

    const placeholderCidades = {
        label: 'Selecione a Cidade',
        value: null,
        color: '#9EA0A4',
    };

    const [validacaoEmailAoSairDoImput, setValidacaoEmailAoSairDoImput] = React.useState(false);
    const [nameIconImput, setNameIconImput] = React.useState('x-circle');
    const [colorIconImput, setColorIconImput] = React.useState('red');
    const [isValidEmail, setValidEmail] = React.useState(false);

    const [nameIconImputFone, setNameIconImputFone] = React.useState('x-circle');
    const [colorIconImputFone, setColorIconImputFone] = React.useState('red');
    const [isValidFone, setValidFone] = React.useState(false);
    const [valueTelefone, setValueTelefone] = React.useState('');

    const [validacaoAoSairDoImputCEP, setValidacaoAoSairDoImputCEP] = React.useState(false);
    const [nameIconImputCEP, setNameIconImputCEP] = React.useState('x-circle');
    const [colorIconImputCEP, setColorIconImputCEP] = React.useState('red');
    const [isValidCep, setValidCep] = React.useState(false);
    const [valueCEP, setValueCEP] = React.useState('');

    const [valueRadio, setValueRadio] = React.useState('primeira');
    const [showInputCep, setShowInputCep] = React.useState(true);
    const [showInputCepLocalizacaoAtual, setShowInputCepLocalizacaoAtual] = React.useState(false);

    const [cep, setCep] = React.useState(null);

    const [loading, setLoading] = React.useState(false);
    const [messageEmail, setMessageEmail] = React.useState('');
    const [messageImputFone, setMessageImputFone] = React.useState('');
    const [messageImpuCep, setMessageImpuCep] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');
    

    const [messageNome, setMessageNome] = React.useState('');
    const [valueImputNome, setValueImputNome] = React.useState('');
    const [isNomeValue, setIsNomeValue] = React.useState(false);

    const [infoCidade, setInfoCidade] = React.useState('');
    const [infoBairro, setInfoBairro] = React.useState('');
    const [infoUf, setInfoUf] = React.useState('');
    const [ifoEndereco, setiIoEndereco] = React.useState('');

    const [idUfP, setIdUfP] = React.useState('');
    const [idCidadeP, setIdCidadeP] = React.useState('');

    const [idUfSelecionado, setIdUfSelecionado] = React.useState(null);

    const [idCidadeSelecionado, setIdCidadeSelecionado] = React.useState(null);
    const [listaCidadeCombo, setListaCidadeCombo] = React.useState(cidadeInicial);
    const [disableCidadeCombo, setDisableCidadeCombo] = React.useState(true);

    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [confirmSecureTextEntry, setConfirmSecureTextEntry] = React.useState(true);
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const [isValidPassword2, setIsValidPassword2] = React.useState(true);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [latitude, setLatitude] = React.useState('');
    const [longitude, setLongitude] = React.useState('');
    const [valueSleder, setValueSleder] = React.useState(50);

    const [isBairroValue, setIsBairroValue] = React.useState(false);
    const [isEnderecoValue, setIsEnderecoValue] = React.useState(false);
    const [isComplementoValue, setIsComplementoValue] = React.useState(false);
    const [valueImputComplemento, setValueImputComplemento] = React.useState('');

    const [isUfValue, setIsUfValue] = React.useState(false);
    const [isCidadeValue, setIsCidadeValue] = React.useState(false);

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
    });

    useFocusEffect(
        React.useCallback(() => {
          //alert('A tela estava focada');
          setPassword('');
          setConfirmPassword('');
          return () => {
            //alert('A tela estava desfocada');
          };
        }, [])
      );
    

    const textInputNomeChange = (val) => {

        setValueImputNome(val);
        if (isNomeValue) {
            setNameIconImput('check-circle');
            setColorIconImput('green');
        } else {
            setNameIconImput('x-circle');
            setColorIconImput('red')
        }
    }

    const textInputChange = (val) => {
        if (validacaoEmailAoSairDoImput) {
            const validacaoEmail = validateEmail(val);
            if (validacaoEmail) {
                setNameIconImput('check-circle');
                setColorIconImput('green');
            } else {
                setNameIconImput('x-circle');
                setColorIconImput('red');
            }
        }

        if (val.length !== 0) {
            setData({
                ...data,
                username: val
            });
        } else {
            setData({
                ...data,
                username: val
            });
        }
    }

    const handleValidUser = (val) => {
        const validacaoEmail = validateEmail(data.username);
        if (validacaoEmail) {
            setValidacaoEmailAoSairDoImput(true);
            setNameIconImput('check-circle');
            setColorIconImput('green');
        } else {
            setValidacaoEmailAoSairDoImput(true);
            setNameIconImput('x-circle');
            setColorIconImput('red');
        }
    }

    const handleTelefoneChange = (val) => {
        const foneMascarado = mascaraTelefone(val);
        setValueTelefone(foneMascarado);
        if (validacaoEmailAoSairDoImput) {
            if (val.trim().length >= 15) {
                setNameIconImputFone('check-circle');
                setColorIconImputFone('green');
            } else {
                setNameIconImputFone('x-circle');
                setColorIconImputFone('red');
            }
        }
    }
    const handleValidFone = (val) => {
        if (val.trim().length >= 15) {
            setNameIconImputFone('check-circle');
            setColorIconImputFone('green');
        } else {
            setNameIconImputFone('x-circle');
            setColorIconImputFone('red');
        }
    }

    const handleValidCep = (val) => {
        setValidacaoAoSairDoImputCEP(true);
        if (val.trim().length >= 10) {
            setNameIconImputCEP('check-circle');
            setColorIconImputCEP('green');
        } else {
            setNameIconImputCEP('x-circle');
            setColorIconImputCEP('red');
        }
    }

    const cadastroUsuario = async () => {        
        
        try {
            var validaCamposFor = false;
            if (valueImputNome.trim().length < 3) {
                setMessageNome(valueImputNome.trim().length === 0 ? 'Campo obrigatório' : 'Mínimo 2 caracteres');
                setIsNomeValue(true);
                validaCamposFor = true;
            } else {
                setMessageNome('');
                setIsNomeValue(false);
            }

            const validacaoEmail = validateEmail(data.username);
            if (!validacaoEmail) {
                setMessageEmail(data.username.trim().length === 0 ? 'Campo obrigatório' : 'E-mail incorreto');
                setValidEmail(true);
                validaCamposFor = true;
            } else {
                setMessageEmail('');
                setValidEmail(false);
            }
            if (valueTelefone.trim().length < 15) {
                setMessageImputFone(valueTelefone.trim().length === 0 ? 'Campo obrigatório' : 'Mínimo de 11 caracteres');
                setValidFone(true);
                validaCamposFor = true;
            } else {
                setMessageImputFone('');
                setValidFone(false);
            };
            if (valueCEP.trim().length < 10 && showInputCep === true) {
                setMessageImpuCep(valueCEP.trim().length === 0 ? 'Campo obrigatório' : 'Mínimo de 6 caracteres');
                setValidCep(true);
                validaCamposFor = true;
            } else {
                setMessageImpuCep('');
                setValidCep(false);
            };

            if (confirmPassword.length < 5) {
                setIsValidPassword2(false);
                validaCamposFor = true;
            } else {
                setIsValidPassword2(true);
            };

            if (password.length < 5) {
                setIsValidPassword(false);
                validaCamposFor = true;
            } else {
                setIsValidPassword(true);
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

            if (confirmPassword != password) {
                validaCamposFor = true;
                Alert.alert('Os campos de senhas estão com valores diferentes', '', [
                    { text: 'Ok' }
                ]);
                return;
            }

            setLoading(true);            
            const response = await Api.getAllSemAccessToken(`usuarios/pesquisarUsuarioSemAccessToken?email=${data.username}`, `GET`);            
            const num = response.numeroStatusResposta;
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {

                if (response.respostaRequisicao.data.length === 0) {
                    const telx3 = retiraMascaraMaterNumeros(valueTelefone);
                    const cepP = retiraMascaraMaterNumeros(valueRadio === 'primeira' ? valueCEP : cep);

                    const jsonUser = {
                        idEmpresa: 1,
                        nomeUsuario: valueImputNome,
                        senha: password,
                        email: data.username,
                        ativo: 'true',
                        endereco: ifoEndereco,
                        bairro: infoBairro,
                        idPerfil: 1,
                        idUf: idUfP,
                        alteracaoSenhaObrigatoria: 'false',
                        idCidade: idCidadeP,
                        celular: `${telx3}`,
                        cep: `${cepP}`,
                        complemento: valueImputComplemento,
                        latitude: latitude,
                        longitude: longitude,
                        distanciaMaxima: valueSleder,
                    }
                        const jsonCodValidacao = {
                            //idUsuario: usuarioNovo.idUsuario,
                            idEmpresa: 1,
                            origemRequisicao: 'NOVO USUARIO',
                            telefoneDestino: `${telx3}`,
                            enviarParaTelefone: 'true',
                            enviarParaEmail: 'false',
                        }
                        const responseCodValidacao = await Api.postRequestSemAccessToken(`envioCodigoValidacao/geracaoDeCodigoAntesCadastroUsuarioSemAccessToken`, `POST`, jsonCodValidacao);
                        //console.log('111111111---------------------------------', responseCodValidacao.respostaRequisicao.data); 
                    
                        setLoading(false);
                        
                    if (responseCodValidacao.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {                        
                        navigation.navigate('CadastroValidarCodigo', { 'codigoValidacao': responseCodValidacao.respostaRequisicao.data, 'dadosUsuarioCadastro': jsonUser });
                    }
                } else {
                    setMessageEmail('E-mail já existe na base de dados');
                    setValidEmail(true);
                    Alert.alert('E-mail já cadastrado', 'Já existe na base de dados, se precisar pode redifinir sua senha na tela de login', [
                        { text: 'Ok' }
                    ]);
                    setLoading(false);
                    return;
                };

            } else {
                await validaMensagem(num, 'verificaEmailNaBase');
                setLoading(false);
                return;
            };

            setLoading(false);

        } catch (error) {
            console.log('Erro na classe CadastroUsuarioSemLocation metodo cadastroUsuario ',error);
            setLoading(false);
        }
    }

    const validaMensagem = async (numero, x) => {
        if (numero === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
            setLoading(false);
            mensagemSnackBar();
        } else if (numero === ActionTypes.TIME_OUT_BACK_END) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
            setLoading(false);
            mensagemSnackBar();
        } else if (numero === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
            setLoading(false);
            if (x === 'envioSms') {
                setMessageImputFone('Não foi possível enviar o código para o nº informado');
                setValidFone(true);
                Alert.alert(ActionTypes.MESSAGE_CODIGO_NAO_ENVIADO, ActionTypes.MESSAGE_DETALHE_CODIGO_NAO_ENVIADO, [
                    { text: 'Ok' }
                ]);
            }else if (x === 'envioEmail') {
                setMessageEmail('Ocorreu um problema ao enviar o código para seu email');
                setValidFone(true);
                Alert.alert(ActionTypes.MESSAGE_CODIGO_NAO_ENVIADO_EMAIL, ActionTypes.MESSAGE_DETALHE_CODIGO_NAO_ENVIADO_EMAIL, [
                    { text: 'Ok' }
                ]);
            }else{
                Alert.alert('Ops!', 'Ocorreu um erro de sistma', [
                    { text: 'Ok' }
                ]);
            }
            return;
        } else {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
            setLoading(false);
            mensagemSnackBar();
        }
        setLoading(false);
    };

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    const ufChange = async (val) => {
        setIdUfSelecionado(val);
        //console.log('ufParamddddddddddddddddasdafd----------------------------', val);
        if (val === null || val === '0') {
            setListaCidadeCombo(cidadeInicial);
            setDisableCidadeCombo(true);
            setIdCidadeSelecionado(null);
            return;
        }
        setLoading(true);
        const response = await Api.getAllSemAccessToken(`cidades?idUf=${val}`, `GET`);
        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            var listaCidadeResp = response.respostaRequisicao.data.map(function (item) {
                return {
                    label: item.nome,
                    value: item.idCidade
                };
            });
            setDisableCidadeCombo(false);
            setListaCidadeCombo(listaCidadeResp);
            setLoading(false);
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
    }

    const cidadeChange = (val) => {
        setIdCidadeSelecionado(val);
    }
    //╔══════════════════════════════════════════════════════════════════════════════════╗
    //                          SELECAO DO RADIO BUTTON
    //   BUSCANDO LOCALIZACAO ATUAL OU DIGITANDO CEP, PREENCHENDO OS CAMPOS DE ENDERECO
    //╚══════════════════════════════════════════════════════════════════════════════════╝
    // const valueRadioFunction = async (val) => {
    //     try {
    //         setValueRadio(val);

    //         if (val === 'primeira') {
    //             setShowInputCep(true);
    //             setShowInputCepLocalizacaoAtual(false);
    //             handleCepChange(valueCEP);
    //         } else {
    //             setShowInputCep(false);
    //             setLoading(true);
    //             if (Platform.OS === 'android' && !Constants.isDevice) {
    //                 setErrorMsg('Ops, isso não funcionará no Sketch em um emulador de Android. Experimente no seu dispositivo!')
    //             } else {
                                                            
    //                 let { status } = await Location.requestPermissionsAsync();
    //                 if (status !== 'granted') {
    //                     setErrorMsg('A permissão para acessar o local foi negada');
    //                 }

    //                 let location2 = await Location.getCurrentPositionAsync({});
    //                 setLocation(location2);

    //                 //console.log('------------------location2----', location2);
    //                 setLatitude(location2.coords.latitude);
    //                 setLongitude(location2.coords.longitude);

    //                 const place = await Location.reverseGeocodeAsync({
    //                     latitude: location2.coords.latitude,
    //                     longitude: location2.coords.longitude
    //                 });
    //                 setCep(place[0].postalCode);
    //                 //setValueCEP(place[0].postalCode);
    //                 console.log('------------------longitude----', place);

    //                 //╔══════════════════════════════════════════════════════════════════════════════════╗
    //                 //   NAO CONSEGUIU RECUPERA O CEP, AI PARAMOS O PROCESSO
    //                 //╚══════════════════════════════════════════════════════════════════════════════════╝
    //                 if (place[0].postalCode === null) {
    //                     Alert.alert('Possição Atual', 'Erro na consulta por GPS, selecione a opção Endereço');
    //                     setLoading(false);
    //                     setInfoBairro('');
    //                     setiIoEndereco('');
    //                     setValueImputComplemento('');
    //                     setIdUfSelecionado(null);
    //                     setIdCidadeSelecionado(null);
    //                     return;
    //                 }
    //                 const xxxxx = retiraMascaraMaterNumeros(place[0].postalCode);
    //                 const enderecoPorCep = await new Promise(resolve => { resolve(BuscaEnderecoPorCep.getBuscaEnderecoPorCep(xxxxx)) });
    //                 carregaCamposEnderco(enderecoPorCep);
    //             }
    //             setLoading(false);
    //             setShowInputCepLocalizacaoAtual(true);
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //     }
    // }

    const handleCepChange = async (val) => {
        try {            
            setInfoCidade('');
            setInfoBairro('');
            setInfoUf('');
            setiIoEndereco('');
            setIdUfSelecionado(null);
            setIdCidadeSelecionado(null);
            const cepMascarado = mascaraCep(val);
            setValueCEP(cepMascarado);
            if (val.trim().length >= 10) {
                
                setLoading(true);
                const xxxxx = retiraMascaraMaterNumeros(cepMascarado);
                const enderecoPorCep = await Api.getAllSemAccessToken(`buscaEnderecoPorCep/${xxxxx}`, `GET`);
                //console.log('66666666666666666666666666666666666666', enderecoPorCep.numeroStatusResposta);
                if (enderecoPorCep.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                    //const enderecoPorCep = await new Promise(resolve => { resolve(BuscaEnderecoPorCep.getBuscaEnderecoPorCep(xxxxx)) });
                    carregaCamposEnderco(enderecoPorCep);
                    setNameIconImputCEP('check-circle');
                    setColorIconImputCEP('green');
                    setLoading(false);
                }else if (enderecoPorCep.numeroStatusResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
                    await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
                    await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
                    setIdUfSelecionado(null);
                    setLoading(false);
                    mensagemSnackBar();
                } else if (enderecoPorCep.numeroStatusResposta === ActionTypes.TIME_OUT_BACK_END) {
                    await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
                    await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
                    setIdUfSelecionado(null);
                    setLoading(false);
                    mensagemSnackBar();
                } else if (enderecoPorCep.numeroStatusResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
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

            } else {
                setNameIconImputCEP('x-circle');
                setColorIconImputCEP('red');
            }
        } catch (error) {
            setLoading(false);
            console.log('Erro na classe CadastroUsuarioSemLocation metodo handleCepChange', error);
        }

    }

    const carregaCamposEnderco = async (enderecoPorCep) => {
        const ed = enderecoPorCep.respostaRequisicao.data;
        //console.log('66666666666666666666666666666666666666', ed);
        if (ed.erro != true) {

            setInfoCidade(ed.localidade);
            setInfoBairro(ed.bairro);
            setInfoUf(ed.uf);
            setiIoEndereco(ed.logradouro);
            // setInfoCidade(enderecoPorCep.respostaRequisicao.city);
            // setInfoBairro(enderecoPorCep.respostaRequisicao.neighborhood);
            // setInfoUf(enderecoPorCep.respostaRequisicao.state);
            // setiIoEndereco(enderecoPorCep.respostaRequisicao.street);
            setValidCep(false);
            setMessageImpuCep('');

            let ufFilter = null;
            //ufFilter = MESES.filter(item => item.label === enderecoPorCep.respostaRequisicao.state);
            ufFilter = MESES.filter(item => item.label === ed.uf);            
            const u = ufFilter[0].value;
            const response8 = await Api.getAllSemAccessToken(`cidades?idUf=${u}`, `GET`);
            
            const c = response8.respostaRequisicao.data[0].idCidade;
            setIdUfP(u);
            setIdCidadeP(c);
            setIdUfSelecionado(u);
            setIdCidadeSelecionado(c);
        } else {
            setInfoCidade('');
            setInfoBairro('');
            setInfoUf('');
            setiIoEndereco('');
            setValidCep(true);
            setMessageImpuCep('CEP inválido');
            setIdUfP('');
            setIdCidadeP('');
            setIdUfSelecionado(null);
            setIdCidadeSelecionado(null);
        }
    }

    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    }

    const updateConfirmSecureTextEntry = () => {
        setConfirmSecureTextEntry(!confirmSecureTextEntry);
    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setConfirmPassword(val.trim());
        } else {
            setConfirmPassword(val.trim());
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setPassword(val.trim());
        } else {
            setPassword(val.trim());
        }
    }

    const changeSlider = (val) => {
        setValueSleder(val);
    }

    const textInputBairroChange = (val) => {
        setInfoBairro(val);
    }

    const textInputEnderecoChange = (val) => {
        setiIoEndereco(val);
        //setInfoCidade(val);

    }

    const textInputComplementoChange = (val) => {
        setValueImputComplemento(val);
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />            
            <View style={styles.header}>
                <Text style={styles.text_header}>Cadastrar agora!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                <ScrollView>

                    <Text style={styles.text_footer}>Nome</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Digite seu nome"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={valueImputNome}
                            onChangeText={(val) => textInputNomeChange(val)}
                        />
                    </View>
                    {!isNomeValue ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{messageNome}</Text>
                        </Animatable.View>
                    }

                    <View style={styles.textPrivate}></View>
                    <Text style={styles.text_footer}>E-mail</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Digite seu e-mail"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                    </View>
                    {!isValidEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{messageEmail}</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Telefone</Text>
                    <View style={styles.action}>
                        <FontAwesome name="phone" color="#05375a" size={20} />
                        <TextInput
                            placeholder="(XX)99999-9999"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleTelefoneChange(val)}
                            value={valueTelefone}
                            onEndEditing={(e) => handleValidFone(e.nativeEvent.text)}
                            keyboardType="number-pad"
                        />
                    </View>
                    {!isValidFone ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{messageImputFone}</Text>
                        </Animatable.View>
                    }

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
                        <Text style={{ color: '#05375a', fontSize: 18 }}>Endereço</Text>
                    </View>
                    
                    {/* <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Informe seu Endereço</Text>
                        <Text style={styles.color_textPrivate}>{" "}ou</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Localização atual</Text>
                    </View> */}

                    {/* <View style={styles.radioButtonSelection}>
                        <RadioButton.Group
                            onValueChange={value => valueRadioFunction(value)}
                            value={valueRadio}
                        >
                            <View>
                                <TextPaper >Endereço</TextPaper>
                                <RadioButton value="primeira" />
                            </View>
                            <View>
                                <TextPaper>Localização atual</TextPaper>
                                <RadioButton value="segunda" />
                            </View>
                        </RadioButton.Group>
                    </View> */}


                    <View style={styles.textPrivate}></View>
                    <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Informe seu CEP</Text>
                        <Text style={styles.color_textPrivate}>{" "}ou</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Selecione UF / Cidade</Text>
                    </View>

                    {showInputCep ? (
                        <View>
                            <Text style={[styles.text_footer, { marginTop: 3 }]}>CEP</Text>
                            <View style={styles.action}>
                                <FontAwesome name="map-marker" color="#05375a" size={20} />
                                <TextInput
                                    placeholder="99.999-999"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleCepChange(val)}
                                    value={valueCEP}
                                    keyboardType="number-pad"
                                />
                            </View>
                            {!isValidCep ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>{messageImpuCep}</Text>
                                </Animatable.View>
                            }
                        </View>
                    ) : null}

                    {showInputCepLocalizacaoAtual ? (
                        <View>
                            <Text style={[styles.text_footer, { marginTop: 3 }]}>CEP Localização atual</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="map-marker"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="99.999-999"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    value={cep}
                                    editable={false}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.actionUfCidade}>
                        <View>
                            <Text style={{ fontSize: 15, marginTop: 20, color: '#000000', fontWeight: 'bold' }}>UF</Text>
                            <RNPickerSelect
                                placeholder={placeholder}
                                items={MESES}
                                onValueChange={value => { ufChange(value) }}
                                style={{
                                    ...pickerSelectStyles,
                                    iconContainer: {
                                        top: 10,
                                        right: 12,
                                    },
                                }}
                                value={idUfSelecionado}
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

                        {!disableCidadeCombo ? (
                            <View>
                                <Text style={{ fontSize: 15, marginTop: 20, color: '#000000', fontWeight: 'bold' }}>Cidade</Text>
                                <RNPickerSelect
                                    placeholder={placeholderCidades}
                                    items={listaCidadeCombo}
                                    onValueChange={value => { cidadeChange(value) }}
                                    style={{
                                        ...pickerSelectStylesCidade,
                                        iconContainer: {
                                            top: 10,
                                            right: 12,
                                        },
                                    }}
                                    value={idCidadeSelecionado}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{ underlineColorAndroid: 'transparent', }}
                                    disabled={disableCidadeCombo}
                                    Icon={() => {
                                        return <Ionicons name="md-arrow-down" size={24} color="#000000" />;
                                    }}
                                />
                                {!isCidadeValue ? null :

                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.errorMsg}>Campo Obrigatório.</Text>
                                    </Animatable.View>
                                }
                            </View>
                        ) :
                            <View>
                                <Text style={{ fontSize: 15, marginTop: 20, color: '#E2E2E2', fontWeight: 'bold' }}>Cidade</Text>
                                <RNPickerSelect
                                    placeholder={placeholderCidades}
                                    items={cidadeInicial}
                                    onValueChange={value => { cidadeChange(value) }}
                                    style={{
                                        ...pickerSelectStylesCidadeDesabilitado,
                                        iconContainer: {
                                            top: 10,
                                            right: 12,
                                        },
                                    }}
                                    value={idCidadeSelecionado}
                                    useNativeAndroidPickerStyle={false}
                                    textInputProps={{ underlineColorAndroid: 'transparent', }}
                                    disabled={disableCidadeCombo}
                                    Icon={() => {
                                        return <Ionicons name="md-arrow-down" size={24} color="#E2E2E2" />;
                                    }}
                                />
                                {!isCidadeValue ? null :
                                    <Animatable.View animation="fadeInLeft" duration={500}>
                                        <Text style={styles.errorMsg}>Campo Obrigatório.</Text>
                                    </Animatable.View>
                                }
                            </View>
                        }
                    </View>

                    <Text style={{ color: '#05375a', fontSize: 18, marginTop: 20 }}>Endereço</Text>
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

                    <View style={{ borderWidth: 0.3, borderColor: '#000000', borderRadius: 1, marginTop: 20, marginBottom: 20 }}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.text_footer, { marginTop: 1 }]}>Distância máxima p/ entrega</Text>
                        <Text style={styles.text_footer}>{valueSleder} Km</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center', marginHorizontal: 20 }}>
                        <Slider
                            minimumValue={50}
                            maximumValue={500}
                            minimumTrackTintColor="#3C812E"
                            maximumTractTintColor="#3C812E"
                            step={1}
                            value={valueSleder}
                            onValueChange={(value) => changeSlider(value)}
                            thumbTintColor="#3C812E"
                        />
                    </View>

                    <View style={{ borderWidth: 0.3, borderColor: '#000000', borderRadius: 1, marginTop: 20, marginBottom: 20 }}></View>
                    <Text style={[styles.text_footer, { marginTop: 3 }]}>Senha</Text>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Sua Senha"
                            placeholderTextColor="#666666"
                            secureTextEntry={secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                            value={password}
                        />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {secureTextEntry ?
                                <Feather name="eye-off" color="grey" size={20} />
                                :
                                <Feather name="eye" color="grey" size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    {isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Confirme sua Senha</Text>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Confirme sua Senha"
                            secureTextEntry={confirmSecureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                            value={confirmPassword}
                        />
                        <TouchableOpacity onPress={updateConfirmSecureTextEntry} >
                            {confirmSecureTextEntry ?
                                <Feather name="eye-off" color="grey" size={20} />
                                :
                                <Feather name="eye" color="grey" size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    {isValidPassword2 ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                    <View style={styles.textPrivate}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Será enviado um SMS com código de validação</Text>
                    </View>
                    <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}para o telefone informado!</Text>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={cadastroUsuario} >
                            <LinearGradient
                                colors={['#56BA42', '#3c812e']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, { color: '#fff' }]}>Continuar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}                            
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
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
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
        marginTop: 20
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

const pickerSelectStylesCidade = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 4,
        color: 'black',  // cor dos itens do combo
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 200,
    },
    inputAndroid: {
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 8,
        color: 'black',  // cor dos itens do combo
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 200,
    },
});

const pickerSelectStylesCidadeDesabilitado = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#E2E2E2',
        borderRadius: 4,
        color: 'black',  // cor dos itens do combo
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 200,
    },
    inputAndroid: {
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 2,
        borderColor: '#E2E2E2',
        borderRadius: 8,
        color: 'black',  // cor dos itens do combo
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 200,
    },
});
