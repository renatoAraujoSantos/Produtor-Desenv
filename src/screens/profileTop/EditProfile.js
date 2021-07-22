import * as ImagePicker from 'expo-image-picker';
import React, { useRef } from "react";
import {
    View, Text, TouchableOpacity, Dimensions, TextInput,
    Platform, StyleSheet, ScrollView, Alert, Image
} from "react-native";
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import MDIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Slider } from 'react-native-elements';
import Loader from '../../components/loading/Loader';
import { useTheme } from '@react-navigation/native';
import * as Api from '../../store/ApiSpring';
import { UploadImage, CarregaImagemPerfilUsuario } from '../../util/SalvarImagem';
import * as UrlImagensSistema from '../../constants/UrlImagensSistema';
import { mascaraTelefone, mascaraCep, retiraMascaraMaterNumeros } from '../../util/Masks';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import RNPickerSelect from 'react-native-picker-select';
import { MESES } from '../../model/data';
import { ValidarUsuario } from '../../util/ValidarAutenticacaoUser';
import * as ActionTypes from '../../constants/ActionTypes';

MDIcon.loadFont();

export default function EditProfile({ route, navigation }) {

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


    //const theme = useTheme();
    const { colors } = useTheme();
    const refRBSheet = useRef();

    const [isAutenticado, setIsAutenticado] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [selection, setSelection] = React.useState('');
    const [nomeUsuarioAutenticado, setNomeUsuarioAutenticado] = React.useState('');
    const [urlImagemPerfil, setUrlImagemPerfil] = React.useState(UrlImagensSistema.URL_IMAGEM_NAO_EXISTE);
    const [acaoTabela, setAcaoTabela] = React.useState('');
    const [idUrlAnexoArquivo, setIdUrlAnexoArquivo] = React.useState('0');

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

    const [valueEmail, setValueEmail] = React.useState('');

    const [valueRadio, setValueRadio] = React.useState('primeira');
    const [showInputCep, setShowInputCep] = React.useState(true);
    const [showInputCepLocalizacaoAtual, setShowInputCepLocalizacaoAtual] = React.useState(false);

    const [cep, setCep] = React.useState(null);
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

    const [valueImputEmail, setValueImputEmail] = React.useState('');

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

    const [idUsuarioP, setIdUsuarioP] = React.useState('');

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
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
        });
        return unsubscribe;
    }, [navigation]);

    const buscaAnexosUsuario = async () => {
        const imagemPerfil = await CarregaImagemPerfilUsuario();
        setUrlImagemPerfil(imagemPerfil.urlImagemPerfil);
        setAcaoTabela(imagemPerfil.acaoTabela);
        setIdUrlAnexoArquivo(imagemPerfil.idUrlAnexoArquivo);

        const { dadosUsuarioRoute } = route.params;

        setIdUsuarioP(dadosUsuarioRoute.idUsuario);
        setValueImputNome(dadosUsuarioRoute.nomeUsuario);
        setValueImputEmail(dadosUsuarioRoute.email);
        setValueTelefone(mascaraTelefone(dadosUsuarioRoute.celular));
        setValueCEP(mascaraCep(dadosUsuarioRoute.cep));
        //setCep(dadosUsuarioRoute.cep);
        //setIdUfSelecionado(dadosUsuarioRoute.idUf);
        setIdCidadeSelecionado(dadosUsuarioRoute.idCidade);
        setiIoEndereco(dadosUsuarioRoute.endereco);
        setInfoBairro(dadosUsuarioRoute.bairro);
        setValueImputComplemento(dadosUsuarioRoute.complemento);

        if (dadosUsuarioRoute.idUf != null && dadosUsuarioRoute.idUf != '') {
            await ufChange(`${dadosUsuarioRoute.idUf}`);
        }
    }

    const showPicker = async (mediaTypes, allowsEditing = false) => {
        //await requestPermissionAsync(Permissions.CAMERA_ROLL);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);
            setUrlImagemPerfil(result.uri);
        }
        refRBSheet.current.close();        
    };
    const showCamera = async (mediaTypes, allowsEditing = false) => {
        //await requestPermissionAsync(Permissions.CAMERA);
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);
            setUrlImagemPerfil(result.uri);
        }
        refRBSheet.current.close();        
    };

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
        setValueImputEmail(val);
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

    const editarUsuario = async () => {

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
            const validacaoEmail = validateEmail(valueImputEmail);
            if (!validacaoEmail) {
                setMessageEmail(valueImputEmail.trim().length === 0 ? 'Campo obrigatório' : 'E-mail incorreto');
                setValidEmail(true);
                validaCamposFor = true;
            } else {
                setMessageEmail('');
                setValidEmail(false);
            };
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
                return;
            }

            if (selection != '' || selection != undefined) {
                await atualizarImagemUsuario();
            }

            setLoading(true);

            const telx3 = retiraMascaraMaterNumeros(valueTelefone);
            const cepP = retiraMascaraMaterNumeros(valueCEP);

            const jsonUser = {
                idEmpresa: 1,
                nomeUsuario: valueImputNome,
                //senha: password,
                email: valueImputEmail,
                //ativo: 'true',
                endereco: ifoEndereco,
                bairro: infoBairro,
                //idPerfil: 1,
                idUf: idUfSelecionado,
                //alteracaoSenhaObrigatoria: 'false',
                idCidade: idCidadeSelecionado,
                celular: `${telx3}`,
                cep: `${cepP}`,
                complemento: valueImputComplemento,
                //latitude: latitude,
                //longitude: longitude,
                //distanciaMaxima: valueSleder,
            };

            const response = await Api.postRequest(`usuarios/${idUsuarioP}`, `PUT`, jsonUser);

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                //await new Promise(resolve => {resolve(  setDadosUsuario(response.respostaRequisicao.data)  )});                                
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
            console.log('Erro na classe EditProfile metodo editarUsuario', error);
        }
    };

    const atualizarImagemUsuario = async () => {

        try {
            setLoading(true);
            const sucessoUploadImagem = await UploadImage(selection);
            if (sucessoUploadImagem.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
                const idUsuario = await new Promise(resolve => { resolve(AsyncStorage.getItem('idUsuario')) });
                const idEmpresa = await new Promise(resolve => { resolve(AsyncStorage.getItem('idEmpresa')) });
                const nomeUser = await AsyncStorage.getItem('nomeUsuarioLogado');

                const resultadoImagenInserida = await new Promise(resolve => { resolve(sucessoUploadImagem.respostaRequisicao.data) });

                var arr = resultadoImagenInserida.fileDownloadUri.split('downloadFile');
                const urlImagemSemIp = `/downloadFile${arr[1]}`;
                const nomeArquivo = `Imagem-Perfil-Usuario-${resultadoImagenInserida.fileName}`;

                //console.log("RESPOSTA IMAGEM INSERIDA...", resultadoImagenInserida);
                const jsonInsertUrl = {
                    idEmpresa: idEmpresa,
                    idUsuario: idUsuario,
                    url: urlImagemSemIp,
                    dtCriacao: dataAtual,
                    size: resultadoImagenInserida.size,
                    nome: nomeArquivo,
                    statusExclusao: false,
                    dtExclusao: null,
                    //idProduto: idProduto,
                    idTipoAnexo: 2, // 2 É TIPO PERFIL
                }

                let res = null;
                if (acaoTabela === 'UPDATE') {
                    res = await Api.postRequest(`urlAnexoArquivo/alterarUrlPerfil/${idUrlAnexoArquivo}`, `PUT`, jsonInsertUrl);
                } else {
                    res = await Api.postRequest(`urlAnexoArquivo`, `POST`, jsonInsertUrl);
                }
                if (res.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                    await CarregaImagemPerfilUsuario();
                } else {
                    setLoading(false);
                }
                setLoading(false);
            } else {
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.log('Erro na classe EditProfile metodo atualizarImagemUsuario', error);
        }
    }

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };


    const ufChange = async (val) => {
        setIdUfSelecionado(val);
        console.log('ufParamddddddddddddddddasdafd----------------------------', val);
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

    const handleCepChange = async (val) => {
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
            //console.log('66666666666666666666666666666666666666', enderecoPorCep.respostaRequisicao.data);
            //const enderecoPorCep = await new Promise(resolve => { resolve(BuscaEnderecoPorCep.getBuscaEnderecoPorCep(xxxxx)) });
            carregaCamposEnderco(enderecoPorCep);
            setNameIconImputCEP('check-circle');
            setColorIconImputCEP('green');
            setLoading(false);
        } else {
            setNameIconImputCEP('x-circle');
            setColorIconImputCEP('red');
        }
    }

    const carregaCamposEnderco = async (enderecoPorCep) => {
        if (enderecoPorCep.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            const ed = enderecoPorCep.respostaRequisicao.data;
            console.log('66666666666666666666666666666666666666', ed);
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
            console.log('7777777777777777777777777', ufFilter);
            const u = ufFilter[0].value;
            const response8 = await Api.getAllSemAccessToken(`cidades?idUf=${u}`, `GET`);

            console.log('88888888888888888888', response8.respostaRequisicao.data);
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


    if (!isAutenticado) {
        return (
            <Loader loading={loading} />
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>
            <Loader loading={loading} />
            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                <ScrollView>

                    <View style={{ alignSelf: "center", backgroundColor: 'transparent' }}>
                        <View style={styles.profileImage}>
                            <Image
                                source={{ uri: urlImagemPerfil }}
                                style={styles.image} resizeMode="cover"
                            ></Image>
                        </View>
                        {/* <View style={styles.dm}>
                                <MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
                            </View> */}
                        {/* <View style={styles.active}></View> */}
                        <View style={styles.add}>
                            <TouchableOpacity onPress={() => refRBSheet.current.open()} >
                                <Feather name="camera" size={30} color="#DFD8C8" style={{ marginTop: 0, marginLeft: 2 }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{ flex: 1, backgroundColor: 'transparent' }} >
                        <View style={styles.infoContainer}>
                            <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{nomeUsuarioAutenticado}</Text>
                            <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>Produtor</Text>
                        </View>
                    </View> */}

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
                            value={valueImputEmail}
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
                        <Text style={{ color: '#05375a', fontSize: 18, fontWeight: 'bold' }}>Endereço</Text>
                    </View>


                    {/* <View style={styles.textPrivate}></View>
                    <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Informe seu CEP</Text>
                        <Text style={styles.color_textPrivate}>{" "}ou</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Selecione UF / Cidade</Text>
                    </View> */}

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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Endereço</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="store" size={20} color="#05375a" />
                        <TextInput
                            placeholder=""
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>Bairro</Text>
                    <View style={styles.action}>
                        <Entypo name="address" size={20} color="#05375a" />

                        <TextInput
                            placeholder=""
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

                    <Text style={[styles.text_footer, { marginTop: 20 }]}>complemento</Text>
                    <View style={styles.action}>
                        <MaterialIcons name="my-location" size={20} color="#05375a" />
                        <TextInput
                            placeholder=""
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

                    {/* <View style={{ borderWidth: 0.3, borderColor: '#000000', borderRadius: 1, marginTop: 20, marginBottom: 20 }}></View>
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
                    </View> */}

                    {/* <View style={{ borderWidth: 0.3, borderColor: '#000000', borderRadius: 1, marginTop: 20, marginBottom: 20 }}></View> */}


                </ScrollView>
            </Animatable.View>

            <View style={{ height: 70, backgroundColor: 'transparent' }} >
                <View style={styles.bottomView} >
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 0, marginTop: 8, }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Voltar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={editarUsuario}>
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Salvar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <RBSheet ref={refRBSheet} height={270} >
                <View style={{ flex: 1, padding: 25 }}>
                    <Text style={styles.listTitle}>Imagem de Perfil</Text>
                    <TouchableOpacity style={styles.listButton} onPress={() => showCamera(ImagePicker.MediaTypeOptions.All, true)} >
                        <MDIcon name='photo-camera' style={styles.listIcon} />
                        <Text style={styles.listLabel}>{'Tirar foto'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listButton} onPress={() => showPicker(ImagePicker.MediaTypeOptions.All, true)} >
                        <MDIcon name='photo' style={styles.listIcon} />
                        <Text style={styles.listLabel}>{'Escolhe imagem da galeria'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listButton} onPress={() => refRBSheet.current.close()} >
                        <MDIcon name='cancel' style={styles.listIcon} />
                        <Text style={styles.listLabel}>{'Cancelar'}</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>


            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    listTitle: {
        fontSize: 25,
        marginBottom: 20,
        color: "#666",
        fontWeight: "bold"
    },
    listButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    listIcon: {
        fontSize: 26,
        color: "#666",
        width: 60
    },
    listLabel: {
        fontSize: 16
    },
    text: {
        fontFamily: "Roboto_400Regular",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16,
    },
    bottomView: {
        width: '100%',
        height: 70,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        paddingVertical: 3
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        fontWeight: 'bold'
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
        fontSize: 18,
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
        color: 'grey',
        fontSize: 17,
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
