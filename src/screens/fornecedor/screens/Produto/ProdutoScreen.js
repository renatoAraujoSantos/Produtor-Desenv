import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet,
    Alert, ScrollView, Dimensions, Modal, Image, Animated, Easing, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import * as Api from '../../../../store/ApiSpring';
import Loader from '../../../../components/loading/Loader';
import * as ActionTypes from '../../../../constants/ActionTypes';
import SnackBarPaper from '../../../../components/snackBar/SnackBarPaper';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons, Feather, FontAwesome5, EvilIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../../../components/context';
import { Avatar } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
//import * as Permissions from 'expo-permissions';
import RBSheet from "react-native-raw-bottom-sheet";
import FAIcon from "react-native-vector-icons/FontAwesome";
import MDIcon from "react-native-vector-icons/MaterialIcons";
import moment from 'moment';
import * as ImageManipulator from "expo-image-manipulator";
import { mascaraValorMoeda, retiraMascaraMaterNumeros } from '../../../../util/Masks';

FAIcon.loadFont();
MDIcon.loadFont();

// async function requestPermissionAsync(permission) {
//     if (Platform.OS === 'web') {
//         return true;
//     }
//     const { status } = await Permissions.askAsync(permission);
//     return status === 'granted';
// }

export default function ProdutoScreen({ route, navigation }) {
    const [opened, setOpened] = React.useState(false)

    const animatedValue = new Animated.Value(0)
    const animatedValueRef = useRef(animatedValue)

    const translateX = animatedValueRef.current.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200],
    })

    const scrollRef = useRef();
    const refRBSheet = useRef();
    const placeholderProduto = {
        label: 'Categorias...',
        value: null,
        color: '#9EA0A4',
    };
    const categoriaProdutoInicial = [
        {
            label: 'value1',
            value: '1'
        },
    ];
    const placeholderMedida = {
        label: 'Medidas...',
        value: null,
        color: '#9EA0A4',
    };
    const CategoriaMedidaInicial = [
        {
            label: 'value1',
            value: '1'
        },
    ];

    const [categoriaProduto, setCategoriaProduto] = React.useState(categoriaProdutoInicial);
    const [produtoSelecionado, setProdutoSelecionado] = React.useState(null);
    const [categoriaMedida, setCategoriaMedida] = React.useState(CategoriaMedidaInicial);
    const [medidaSelecionado, setMedidaSelecionado] = React.useState(null);
    const [isValidCategoria, setIsValidCategoria] = React.useState(false);
    const [isValidMedida, setIsValidMedida] = React.useState(false);

    const [isValidProduto, setValidProduto] = React.useState(false);
    const [isValidImagemCapa, setIsValidImagemCapa] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');

    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);

    const [checkedOrganico, setCheckedOrganico] = React.useState(false);
    const [checkedSeloOrganico, setCheckedSeloOrganico] = React.useState(false);

    const [valueImpuProduto, setValueProduto] = React.useState('');
    const [valueImpuDescricao, setValueDescricao] = React.useState('');
    const [isValidDescricao, setIsValidDescricao] = React.useState(false);

    const [valueImpuValorUnitario, setValueImpuValorUnitario] = React.useState('');
    const [isValidValorUnitario, setIsValidValorUnitario] = React.useState(false);

    const { colors } = useTheme();

    const [dataValidade, setDataValidade] = React.useState(new Date());
    const [isValidData, setIsValidData] = React.useState(false);
    const [messageImpuData, setMessageImpuData] = React.useState('');
    const [imputQtdMinimoPedido, setImputQtdMinimoPedido] = React.useState('');
    const [imputQtdDisponivel, setImputQtdDisponivel] = React.useState('');
    const [isValidQtdDisponivel, setIsValidQtdDisponivel] = React.useState(false);
    const [isValidQtdMinimoPedido, setIsValidQtdMinimoPedido] = React.useState(false);

    const [size, setSize] = React.useState('');
    const [operacaoBanco, setOperacaoBanco] = React.useState('INSERT');

    const [produtoParametro, setProdutoParametro] = React.useState({});
    const [produtoParametroNoCasoDeUpdate, setProdutoParametroNoCasoDeUpdate] = React.useState({});
    const [idProduto, setIdProduto] = React.useState(0);
    const [selection, setSelection] = React.useState(ImagePicker);

    const [valueImpuNomeImagem, setValueImpuNomeImagem] = React.useState('');
    const [valueImpuDescricaoImage, setValueImpuDescricaoImage] = React.useState('');
    const [isValidDescricaoModal, setIsValidDescricaoModal] = React.useState(false);
    const [isValidNomeImagem, setIsValidNomeImagem] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [urlImagemCapa, setUrlImagemCapa] = React.useState('');

    const [switchValue, setSwitchValue] = React.useState(false);
    const [ocultarProdutoP, setOcultarProdutoP] = React.useState(false);

    const { signIn } = React.useContext(AuthContext);
    const [date, setDate] = React.useState(new Date());
    const [mode, setMode] = React.useState('date');
    const [show, setShow] = React.useState(false);
    const [color, setColor] = React.useState();
    const [display, setDisplay] = React.useState('default');

    // USO ESSE CARA PARA JOGAR A TELA NO TOPO
    const onPressTouch = () => {
        scrollRef.current.scrollTo({
            y: 0,
            animated: true,
        });
        hideSearchWithUseState();
    }

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setDataValidade(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            setProdutoParametroNoCasoDeUpdate({});
            setIdProduto(0);
            let userToken;
            userToken = null;
            try {

                try {                    
                    const produto = await new Promise(resolve => { resolve(route.params.produto) });
                    //console.log('--------uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu NA TELA DE PRODUTO---------',produto);
                    const rr = moment(produto.dataValidade).format('YYYY-MM-DD');
                    const valorComMascara = mascaraValorMoeda(`${produto.valorUnitarioMedida}`);

                    setProdutoParametroNoCasoDeUpdate(produto);
                    setOperacaoBanco('UPDATE');
                    setIdProduto(produto.idProduto);
                    setValueProduto(produto.nomeProduto);
                    setProdutoSelecionado(produto.idCategoriaProduto);
                    setMedidaSelecionado(produto.idCategoriaMedida);
                    setCheckedOrganico(produto.organico);
                    setCheckedSeloOrganico(produto.seloOrganico);
                    setDataValidade(new Date(rr));
                    setValueImpuValorUnitario(`${valorComMascara}`);
                    setImputQtdMinimoPedido(`${produto.quantidadePedidoMinimoMedida}`);
                    setImputQtdDisponivel(`${produto.quantidadeDisponivelMedida}`);
                    setValueDescricao(`${produto.descricaoProduto}`);
                    setUrlImagemCapa(`${ActionTypes.LINK_API_SPRING}${produto.url}`);
                    setSize(produto.size);
                    setOcultarProdutoP(!produto.ocultarProduto);
                    hideSearchWithUseState();
                } catch (error) {
                    setOperacaoBanco('INSERT');
                    console.log('--------INSERT NA TELA DE PRODUTO---------');
                }

                const responseCategoriaProduto = await Api.getAll(`categoriaProduto`, `GET`);
                const responseCategoriaMedida = await Api.getAll(`categoriaMedida`, `GET`);

                var listaCategoriaProduto = responseCategoriaProduto.respostaRequisicao.data.map(function (item) {
                    return {
                        label: item.descricaoCategoria,
                        value: item.idCategoriaProduto
                    };
                });
                setCategoriaProduto(listaCategoriaProduto);

                var listaCategoriaMedida = responseCategoriaMedida.respostaRequisicao.data.map(function (item) {
                    return {
                        label: item.descricaoMedida,
                        value: item.idCategoriaMedida
                    };
                });
                setCategoriaMedida(listaCategoriaMedida);

            } catch (e) {
                console.warn(e);
            }
        }
        loadResourcesAndDataAsync();
    }, []);

    const textInputProduto = (val) => {
        setValueProduto(val);
    }

    const textInputDescricao = (val) => {
        setValueDescricao(val);
    }

    const salvarImagem = async () => {
        try {
            const image = await new Promise(resolve => { resolve(selection) });
            //═══════ ESSE CARA E PRA REDUZIR O TAMANHO DA IMAGEM ══════════════
            const manipResult = await ImageManipulator.manipulateAsync(
                image.localUri || image.uri,
                [{ resize: { width: 600 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
            );
            var dataAtual = moment().format("YYYY-MM-DD");
            const stringImagem = JSON.stringify(manipResult);
            var numero_aleatorio = Math.random();
            numero_aleatorio = Math.floor(numero_aleatorio * 10000);
            var yyyrrr = JSON.parse(stringImagem);
            var jsonData44 = {
                "file": [yyyrrr]
            };
            var data4455 = jsonData44.file.map(function (item) {
                return {
                    name: `A${dataAtual}-${numero_aleatorio}.png`,
                    uri: item.uri,
                    type: 'image/PNG',
                    nome: valueImpuNomeImagem,
                    descricao: valueImpuDescricaoImage
                };
            });
            const formData = new FormData();
            formData.append('file', data4455[0]);
            const responseUploadImagem = await Api.uploadImagem(`uploadFile`, `POST`, formData);
            const responseImagemSalva = await new Promise(resolve => { resolve(responseUploadImagem) });
            return responseImagemSalva;
        } catch (error) {
            console.log('Erro na classe ProdutoScreen/salvarImagem ', error);
            return null;
        }
    }

    //╔════════════════════════════════ AUTENTICACAO ═════════════════════════════════════════╗
    const submitProduto = async () => {

        var statusValidacao = true;

        if (urlImagemCapa.length === 0) {
            setIsValidImagemCapa(true);
            statusValidacao = false;
        } else {
            setIsValidImagemCapa(false);
        }

        if (valueImpuProduto.length < 3) {
            setValidProduto(true);
            statusValidacao = false;
        } else {
            setValidProduto(false);
        }

        if (valueImpuValorUnitario === '0' || valueImpuValorUnitario.length === 0) {
            setIsValidValorUnitario(true);
            statusValidacao = false;
        } else {
            setIsValidValorUnitario(false);
        }

        if (produtoSelecionado === null) {
            setIsValidCategoria(true);
            statusValidacao = false;
        } else {
            setIsValidCategoria(false);
        }

        if (medidaSelecionado === null) {
            setIsValidMedida(true);
            statusValidacao = false;
        } else {
            setIsValidMedida(false);
        }

        if (imputQtdMinimoPedido === '0' || imputQtdMinimoPedido.length === 0) {
            setIsValidQtdMinimoPedido(true);
            statusValidacao = false;
        } else {
            setIsValidQtdMinimoPedido(false);
        }

        if (imputQtdDisponivel === '0' || imputQtdDisponivel.length === 0) {
            setIsValidQtdDisponivel(true);
            statusValidacao = false;
        } else {
            setIsValidQtdDisponivel(false);
        }

        if (valueImpuDescricao.length < 19) {
            setIsValidDescricao(true);
            statusValidacao = false;
        } else {
            setIsValidDescricao(false);
        }

        if (statusValidacao === false) {
            return;
        }

        setLoading(true);

        const sucessoUploadImagem = await salvarImagem();

        let dadosResponseImage = null;
        //╔════════════════════════════════════════════════════════════════════════════════════════════════╗
        //   CASO sucessoUploadImagem SEJA NULL É POR QUE ESTAMOS EM UPDATE E A IMAGEM NÃO FOI ALTERADA
        //╚════════════════════════════════════════════════════════════════════════════════════════════════╝
        if (sucessoUploadImagem !== null) {
            if (sucessoUploadImagem.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                dadosResponseImage = sucessoUploadImagem.respostaRequisicao.data;
            }
        }

        try {
            const valorSemMascara = retiraMascaraMaterNumeros(valueImpuValorUnitario);
            const dataValidacao = formatDate22(dataValidade);
            const idUsuarioP = await new Promise(resolve => { resolve(AsyncStorage.getItem('idUsuario')) });
            const jsonCadastroProduto = {
                idUsuario: idUsuarioP,
                nomeProduto: valueImpuProduto,
                descricaoProduto: valueImpuDescricao,
                idCategoriaProduto: produtoSelecionado,
                organico: checkedOrganico,
                seloOrganico: checkedSeloOrganico,
                idCategoriaMedida: medidaSelecionado,
                valorUnitarioMedida: valorSemMascara,
                dataCadastro: '',   // BACK INSERE ESSA DATA 
                produtoStatus: '0',
                dataValidade: dataValidacao,
                quantidadePedidoMinimoMedida: imputQtdMinimoPedido,
                quantidadeDisponivelMedida: imputQtdDisponivel,
                nomeImagePrincipal: valueImpuNomeImagem,
                size: dadosResponseImage === null ? size : dadosResponseImage.size,
                url: dadosResponseImage === null ? urlImagemCapa : dadosResponseImage.fileDownloadUri,
                statusExclusao: false,
                ocultarProduto: false,
            }
            
            let response = null;

            if (operacaoBanco === 'INSERT') {
                response = await Api.postRequest(`produto`, `POST`, jsonCadastroProduto);
            }
            if (operacaoBanco === 'UPDATE') {
                response = await Api.putRequest(`produto/alterar/${produtoParametroNoCasoDeUpdate.idProduto}`, `PUT`, jsonCadastroProduto);
            }
            setIdProduto(response.respostaRequisicao.data.idProduto);
            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                setProdutoParametroNoCasoDeUpdate(response.respostaRequisicao.data);
                setProdutoParametro(response.respostaRequisicao.data);
                console.log('VERIFICAR SE DEU CERTO A SETSTATE COM OS DADOS DO PRODUTO  ', produtoParametro);

                Alert.alert('Produto Salvo com Sucesso', '',
                    [
                        { text: "Ok", onPress: () => { onPressTouch() } }
                    ],
                    { cancelable: false }
                );

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
                Alert.alert('Erro!', 'Ocorreu um erro no cadastro do produdo.', [
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
            setLoading(false);
        }

        function mensagemSnackBar() {
            setVisible(true);
            setRenderSnack(renderSnack + 1);
        };

    }
    //╚════════════════════════════════════════════════════════════════════════════════════════════╝

    const organicoChecked = async () => {
        setCheckedOrganico(!checkedOrganico);
    }
    const seloOrganicoChecked = async () => {
        setCheckedSeloOrganico(!checkedSeloOrganico);
    }
    const produtoChange = async (val) => {
        setProdutoSelecionado(val);
    }
    const MedidaChange = async (val) => {
        setMedidaSelecionado(val);
    }
    const formatDate = (date) => {
        var MyDateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
        return MyDateString;
    };
    const formatDate22 = (date) => {
        var MyDateString2 = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' 00:00:00';
        return MyDateString2;
    };
    const qtdDisponive = (val) => {
        setImputQtdDisponivel(val);
    }
    const qtdMinimoPedido = (val) => {
        setImputQtdMinimoPedido(val);
    }
    const inserirImagens = () => {
        //navigation.navigate('ListaEAdicionaAnexos', { 'produtoParametro': produtoParametroNoCasoDeUpdate });
        navigation.navigate('GaleriaImagens', { 'produtoParametro': produtoParametroNoCasoDeUpdate });
    }
    const changeValorUnitario = (val) => {
        const valorMascarado = mascaraValorMoeda(val);
        setValueImpuValorUnitario(valorMascarado);
    }
    const changeInputDescricao = (val) => {
        setValueImpuDescricaoImage(val);
    }
    const changeInputNomeImagem = (val) => {
        setValueImpuNomeImagem(val);
    }
    const cancelarAlteracoesImagem = () => {
        setModalVisible(false);
    }
    const salvarAlteracoesImagem = async () => {
        if (valueImpuNomeImagem.length < 6) {
            setIsValidNomeImagem(true);
            return;
        }
        const nomeImage = await new Promise(resolve => { resolve(valueImpuNomeImagem) });
        const descricaoImagem = await new Promise(resolve => { resolve(valueImpuDescricaoImage) });
        //console.log('444444444444444444444444444444444444444444444444444444', selection);
        setUrlImagemCapa(selection.uri);
        setModalVisible(false);
    }

    const showCamera = async (mediaTypes, allowsEditing = false) => {
        refRBSheet.current.close();
        //await requestPermissionAsync(Permissions.CAMERA);
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);

        }
        setModalVisible(true);
    };

    const showPicker = async (mediaTypes, allowsEditing = false) => {
        refRBSheet.current.close();
        //await requestPermissionAsync(Permissions.CAMERA_ROLL);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);
        }
        setModalVisible(true);
    };

    const ocultarProdutoChange = (value) => {        
        if(value === false){
            Alert.alert('Deseja Ocultar o Produto?',
                'Enquanto essa opção estiver desativada, seu produto não aparecerá para outros usuários',
                [
                    {
                        text: "Cancelar",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "Ok", onPress: () => { ocultarProdutoRequest(value) } }
                ],
                { cancelable: false }
            );        
        }else{
            ocultarProdutoRequest(value);            
        }
    };
    const ocultarProdutoRequest = async (value) => {        
        const jsonOcultarProduto = {
            ocultarProduto: !value
        }        
        const urlAnexoArquivoExcluido = await Api.putRequest(`produto/alterarCampoOcultar/${produtoParametroNoCasoDeUpdate.idProduto}`, `PUT`, jsonOcultarProduto);
        setOcultarProdutoP(value);
    }




    function hideSearchWithUseState() {
        Animated.timing(animatedValueRef.current, {
            toValue: 1,
            duration: 1000,
            easing: Easing.cubic,
            useNativeDriver: false
        }).start(() => {
            setOpened(false)
        })
    }

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef}>
                <Loader loading={loading} />

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => { cancelarAlteracoesImagem() }}>

                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>
                        <View style={{ height: 50, backgroundColor: 'transparent' }} >
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: '#000000', fontSize: 21, fontWeight: 'bold', marginBottom: 1 }}>Informações da Imagem</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'transparent', padding: 10 }} >
                            <Image
                                style={{ width: '100%', height: '100%', backgroundColor: "transparent", borderRadius: 10 }}
                                source={{ uri: selection.uri }}
                                //source={IMAGE_FUNDO_CAMERA}                                                        
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{ height: 250, marginHorizontal: 10, backgroundColor: 'transparent', marginTop: 19 }} >
                            <Text style={[styles.text_footer, { color: '#000000', marginBottom: 10 }]}>Nome</Text>
                            <View style={styles.action}>
                                <TextInput
                                    placeholder=""
                                    placeholderTextColor="#666666"
                                    style={[styles.textInput, { color: '#000000' }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => changeInputNomeImagem(val)}
                                    value={valueImpuNomeImagem}
                                />
                            </View>
                            {!isValidNomeImagem ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Mínimo 6 caracteres</Text>
                                </Animatable.View>
                            }

                            <Text style={[styles.text_footer, { color: '#000000', marginTop: 10 }]}>Descrição</Text>
                            <View style={styles.action}>
                                <TextInput
                                    style={styles.TextInputStyleClass}
                                    underlineColorAndroid="transparent"
                                    placeholder={"Digite uma descrição para a imagem"}
                                    placeholderTextColor={"#9E9E9E"}
                                    numberOfLines={10}
                                    multiline={true}
                                    value={valueImpuDescricaoImage}
                                    onChangeText={(val) => changeInputDescricao(val)}
                                />
                            </View>
                            {!isValidDescricaoModal ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Mínimo de 20 caracteres.</Text>
                                </Animatable.View>
                            }

                        </View>
                        <View style={{ height: 70, backgroundColor: 'transparent' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 7 }}>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                    <TouchableOpacity onPress={() => cancelarAlteracoesImagem()}>
                                        {/* <TouchableOpacity   onPress={() => window.scrollTo({ top: 0,  behavior: "smooth" })}> */}
                                        <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, padding: 10, paddingHorizontal: 1, width: 150, }} >
                                            <Text style={{ fontSize: 16, color: '#fff', marginLeft: 0, }}>Cancelar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                    <TouchableOpacity onPress={() => salvarAlteracoesImagem()} >
                                        <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, padding: 10, paddingHorizontal: 1, width: 150, }} >
                                            <Text style={{ fontSize: 16, color: '#fff', marginLeft: 0, }}>Selecionar</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={{ flexDirection: 'row', marginTop: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: colors.text, fontSize: 21, fontWeight: 'bold', marginBottom: 1 }}>Imagem de Capa</Text>
                    </View>
                </View>

                <View style={{ height: 250, padding: 0, backgroundColor: 'transparent', borderRadius: 12, borderColor: '#000000', borderWidth: 5, }} >
                    <Avatar
                        size="medium"
                        overlayContainerStyle={{ backgroundColor: '#FFFFFF' }}
                        rounded
                        icon={{ name: 'camera', color: 'black', type: 'font-awesome', size: 30 }}
                        onPress={() => refRBSheet.current.open()}
                        activeOpacity={0.7}
                        containerStyle={{ position: 'absolute', right: 15, top: 15, color: '#2d8425', zIndex: 1, }}
                    />
                    {urlImagemCapa !== '' ?
                        <Image
                            style={{ width: '100%', height: '100%', backgroundColor: "transparent", borderRadius: 8 }}
                            source={{ uri: urlImagemCapa }}
                            resizeMode="cover"
                        />
                        :
                        <Image
                            style={{ width: '100%', height: '100%', backgroundColor: "transparent", borderRadius: 8 }}                            
                            source={require('../../../../../assets/images/cameraFundo.png')}                            
                            resizeMode="cover"
                        />
                    }
                </View>
                {!isValidImagemCapa ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Imagem do produto é obrigatório</Text>
                    </Animatable.View>
                }

                {idProduto === 0 ?
                    <View style={{ height: 30 }} />
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 7 }}>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-start', padding: 10, backgroundColor: 'transparent' }}>
                            <Switch  style={{ marginTop: 0 }} onValueChange={ocultarProdutoChange} value={ocultarProdutoP} />
                        </View>
                        <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'flex-start', padding: 10, backgroundColor: 'transparent'}}>
                            <Text style={[styles.text_footer, { color: colors.text, marginLeft:10 }]}>Produto Visível Para Vendas</Text>
                        </View>
                    </View>
                }

                {idProduto === 0 ?
                    <View style={{ height: 30 }} />
                    :
                    <View style={{  flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'flex-start', marginTop: 2, marginBottom: 20 }}>
                        <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ fontSize: 15, color: '#fff', marginLeft: 1, }}>{''}</Text>
                        </View>

                        <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={inserirImagens} >
                                <View style={{ flexDirection: 'row', backgroundColor: '#3c812e', justifyContent: 'space-around', alignItems: 'center', borderRadius: 20, margin: 1, padding: 10, paddingHorizontal: 1, width: 190, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 1, }}>Novas Imagens</Text>
                                    <Feather name="camera" size={20} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                }
                
                <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Nome do Produto</Text>
                <View style={styles.action}>
                    <TextInput
                        placeholder=""
                        placeholderTextColor="#666666"
                        style={[styles.textInput, { color: colors.text }]}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputProduto(val)}
                        value={valueImpuProduto}
                    />
                </View>
                {!isValidProduto ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Mínimo 4 caracteres</Text>
                    </Animatable.View>
                }

                <View style={styles.actionCombo}>
                    <View>
                        <Text style={{ fontSize: 15, marginTop: 10, color: colors.text, fontWeight: 'bold' }}>Categoria</Text>
                        <RNPickerSelect
                            placeholder={placeholderProduto}
                            items={categoriaProduto}
                            onValueChange={value => { produtoChange(value) }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: { top: 10, right: 12, },
                            }}
                            value={produtoSelecionado}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColorAndroid: 'transparent' }}
                            Icon={() => {
                                return <Ionicons name="md-arrow-down" size={24} color="#9E9E9E" />;
                            }}
                        />
                        {!isValidCategoria ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Selecione uma categoria</Text>
                            </Animatable.View>
                        }
                    </View>

                    <View>
                        <Text style={{ fontSize: 15, marginTop: 10, color: colors.text, fontWeight: 'bold' }}>Medida</Text>
                        <RNPickerSelect
                            placeholder={placeholderMedida}
                            items={categoriaMedida}
                            onValueChange={value => { MedidaChange(value) }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: { top: 10, right: 12, },
                            }}
                            value={medidaSelecionado}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColorAndroid: 'transparent' }}
                            Icon={() => {
                                return <Ionicons name="md-arrow-down" size={24} color="#9E9E9E" />;
                            }}
                        />
                        {!isValidMedida ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Selecione uma Medida</Text>
                            </Animatable.View>
                        }
                    </View>
                </View>

                <View style={styles.actionCombo}>
                    <View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <CheckBox
                                title='Orgânico'
                                checked={checkedOrganico}
                                containerStyle={{ backgroundColor: 'transparent' }}
                                checkedColor='#3c812e'
                                onPress={() => organicoChecked()}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <CheckBox
                                title='Selo Orgânico'
                                checked={checkedSeloOrganico}
                                containerStyle={{ backgroundColor: 'transparent' }}
                                checkedColor='#3c812e'
                                onPress={() => seloOrganicoChecked()}
                            />
                        </View>
                    </View>
                </View>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={date}
                        mode={mode}
                        is24Hour
                        display={display}
                        onChange={onChange}
                        style={styles.iOsPicker}
                        textColor={color || undefined}
                        locale="pt-PT"
                    />
                )}

                <View style={styles.viewQtd}>
                    <View style={{ flex: 0.4, backgroundColor: 'transparent' }}>
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Validade</Text>
                        <TouchableOpacity onPress={showDatepicker}>
                            <View style={styles.action}>
                                {/* <MaterialCommunityIcons name="calendar-range" size={25} color={colors.text}  /> */}
                                <TextInput
                                    editable={false}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    //onChangeText={(val) => handleTelefoneChange(val)}
                                    //value={formatDate(dataValidade, timeValidade)}
                                    value={formatDate(dataValidade)}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </TouchableOpacity>
                        {!isValidData ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>{messageImpuData}</Text>
                            </Animatable.View>
                        }
                    </View>
                    <View style={{ flex: 0.2, backgroundColor: 'transparent' }}>
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}></Text>
                    </View>
                    <View style={{ flex: 0.4, backgroundColor: 'transparent' }}>
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Valor Unitário</Text>
                        <View style={styles.action}>
                            {/* <MaterialCommunityIcons name="calendar-range" size={25} color={colors.text}  /> */}
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#666666"
                                style={[styles.textInput, { color: colors.text }]}
                                autoCapitalize="none"
                                onChangeText={(val) => changeValorUnitario(val)}
                                value={valueImpuValorUnitario}
                                keyboardType="number-pad"
                            />
                        </View>
                        {!isValidValorUnitario ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Campo Obrigatório</Text>
                            </Animatable.View>
                        }
                    </View>
                </View>

                <View style={styles.viewQtd}>
                    <View style={{ flex: 0.4, justifyContent: 'flex-start', }}>
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Qtd Mínimo Pedido</Text>
                        <View style={styles.action}>
                            {/* <FontAwesome name="lock" color={colors.text}  size={20} /> */}
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#666666"
                                style={[styles.textInput, { color: colors.text }]}
                                autoCapitalize="none"
                                onChangeText={(val) => qtdMinimoPedido(val)}
                                value={imputQtdMinimoPedido}
                                keyboardType="number-pad"
                            />
                        </View>
                        {!isValidQtdMinimoPedido ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Campo Obrigatório</Text>
                            </Animatable.View>
                        }
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'flex-start', }}>
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}></Text>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'flex-end', }} >
                        <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Qtd Disponível</Text>
                        <View style={styles.action}>
                            {/* <FontAwesome name="lock" color={colors.text}  size={20} /> */}
                            <TextInput
                                placeholder=""
                                placeholderTextColor="#666666"
                                style={[styles.textInput, { color: colors.text }]}
                                autoCapitalize="none"
                                onChangeText={(val) => qtdDisponive(val)}
                                value={imputQtdDisponivel}
                                keyboardType="number-pad"
                            />
                        </View>
                        {!isValidQtdDisponivel ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Campo Obrigatório</Text>
                            </Animatable.View>
                        }
                    </View>
                </View>

                <Text style={[styles.text_footer, { color: colors.text, marginTop: 10 }]}>Descrição</Text>
                <View style={styles.action}>
                    <TextInput
                        style={styles.TextInputStyleClass}
                        underlineColorAndroid="transparent"
                        placeholder={"Digite uma descrição para o produto"}
                        placeholderTextColor={"#9E9E9E"}
                        numberOfLines={10}
                        multiline={true}
                        value={valueImpuDescricao}
                        onChangeText={(val) => textInputDescricao(val)}
                    />
                </View>
                {!isValidDescricao ? null :
                    <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Mínimo de 20 caracteres.</Text>
                    </Animatable.View>
                }

                <View style={styles.bottomView} >
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 0, marginTop: 8, }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={submitProduto}>
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Salvar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Cancelar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <RBSheet ref={refRBSheet} height={270} >
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Imagem de Capa</Text>
                    <TouchableOpacity style={styles.listButton} onPress={() => showCamera(ImagePicker.MediaTypeOptions.Images)} >
                        <MDIcon name='photo-camera' style={styles.listIcon} />
                        <Text style={styles.listLabel}>{'Tirar foto'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listButton} onPress={() => showPicker(ImagePicker.MediaTypeOptions.Images)} >
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    block: {
        width: 50,
        height: 50,
    },
    listContainer: {
        flex: 1,
        padding: 25
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
    bottomView: {
        width: '100%',
        height: 70,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0
    },
    actionCombo: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        justifyContent: 'space-between',
    },
    viewQtd: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 16,
        fontWeight: 'bold',
    },
    action: {
        flexDirection: 'row',
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        height: 35,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    TextInputStyleClass: {
        width: Dimensions.get('window').width - 20,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        height: 100,
        textAlignVertical: 'top',
        padding: 5,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 170,
        backgroundColor: '#FFFFFF'
    },
    inputAndroid: {
        fontSize: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // para garantir que o texto nunca fique atrás do ícone
        width: 170,
        backgroundColor: '#FFFFFF'
    },
});
