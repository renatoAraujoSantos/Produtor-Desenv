import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView, Image, TouchableOpacity, ImageBackground, Alert, TouchableHighlight, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Product from '../../../../components/ProductItens';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { imagemCameraSelecionada, limparImagemSelecionada, excluiItemArrayImagensUpload } from '../../../../store/actions/ActionImagemSelecionada';
import moment from 'moment';
import FormData from 'form-data';
import axios from 'axios';
import * as Api from '../../../../store/ApiSpring';
import Loader from '../../../../components/loading/Loader';
import * as ActionTypes from '../../../../constants/ActionTypes';
import SnackBarPaper from '../../../../components/snackBar/SnackBarPaper';
import RBSheet from "react-native-raw-bottom-sheet";
import FAIcon from "react-native-vector-icons/FontAwesome";
import MDIcon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
//import * as Permissions from 'expo-permissions';
import * as Animatable from 'react-native-animatable';


FAIcon.loadFont();
MDIcon.loadFont();

const SCREEN_WIDTH_LARGURA = Dimensions.get('window').width;
const SCREEN_WIDTH_ALTURA = Dimensions.get('window').height + 80;

const SCREEN_WIDTH_LARGURA_RODAPE = Dimensions.get('window').width;

// async function requestPermissionAsync(permission) {
//     // Image Picker doesn't need permissions in the web
//     if (Platform.OS === 'web') {
//       return true;
//     }
//     const { status } = await Permissions.askAsync(permission);
//     return status === 'granted';
//   }
  
  
class ListaEAdicionaAnexos extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            contratoPA: null,
            produtoParametro: null,
            file: [],
            files: [],
            loading: false,
            renderSnack: 0,
            mensagem: '',
            mensagemDetalhe: '',
            visible: false,
            modalVisible: false,
            isValidNomeImagem: false,
            isValidDescricao: false,
            valueImpuNomeImagem: '',
            valueImpuDescricao: '',
            selection: ImagePicker,
            intemNovo: false,
            urlImagemModal: '',
            imagemParaEdicaoOuExclusao: {},
            exluirImagemNaoSalvaNaListaUpload: false,
            imagensUploadSalvar: [],
            imagensArrayUpload: [],
            arrayImagensContratos: [],
            numContratoState: '',
            idProdutoState: '',
            percentual: 0,
            currentPage: 0,
            isVisible: false,
            activeIndex: 0,
            carouselItems: [
                {
                    title: "Item 1",
                    text: "Text 1",
                    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                },
                {
                    title: "Item 2",
                    text: "Text 2",
                    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                },
                {
                    title: "Item 3",
                    text: "Text 3",
                    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                },
                {
                    title: "Item 4",
                    text: "Text 4",
                    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                },
                {
                    title: "Item 5",
                    text: "Text 5",
                    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
                },
            ]

        };
    }

    async componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', async () => {
            this.setState({ loading: true });
            
            //this.setState({ contratoPA: this.props.route.params.contratoPA });
            this.setState({ produtoParametro: this.props.route.params.produtoParametro });            
            //this.setState({ numContratoState: this.props.route.params.contratoPA.numContrato });
            this.setState({ idProdutoState: this.props.route.params.produtoParametro.idProduto });
            
            const dataAtual = moment().format("DD/MM/YYYY HH:mm:ss");
            
            //navigation.setOptions({ headerTitle: 'Updated!', headerTransparent: true });
            if (this.props.imagemSelecionada.imagemSelecionada === undefined) {                
            } else {
                var count = 0;
                const listBases1 = await new Promise(resolve => { resolve(this.props.imagemSelecionada.imagemSelecionada) });                
                await new Promise(resolve => {
                    resolve(
                        this.setState({
                            imagensArrayUpload:
                                listBases1.map(x => {
                                    count = count + 1;
                                    x['id'] = count;
                                    x['image'] = x.uri;
                                    x['title'] = x.nome;
                                    //x['description'] = contratoParametro;
                                    x['description'] = 'campo disponível';
                                    x['price'] = `${dataAtual}`;
                                    x['typeIcon'] = 'check';
                                    return x;
                                }),
                        })
                    )
                });
            }

            await new Promise(resolve => { resolve(this.carregaAnexosSalvos()) });

            this.setState({ loading: false });
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }


    showPicker = async (mediaTypes, allowsEditing = false) => {
        this.Standard.close();
        //await requestPermissionAsync(Permissions.CAMERA_ROLL);
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes,
          allowsEditing,
        });
        if (result.cancelled) {
          this.setState({ selection: undefined });
        } else {
          this.setState({ selection: result });
        }
        const image = await new Promise(resolve => {resolve(   this.state.selection   )});                
        this.props.navigation.navigate('ImagemNovaModal', { 'urlImagem': image.uri });                
    };
    
    carregaAnexosSalvos = async () => {
        this.setState({ loading: true });
        const idUsuarioP = await new Promise(resolve => { resolve(AsyncStorage.getItem('idUsuario')) });
        const c22 = await this.props.route.params.produtoParametro;
        const dataAtual = moment().format("DD/MM/YYYY HH:mm:ss");
        const idProduto = c22.idProduto;
        const idTipoAnexo = 3;  // 3 E DO TIPO ANEXO, OU SEJA, IMAGENS DO PRODUTO
        const responseUrlContratos = await Api.getAll(`urlAnexoArquivo?idUsuario=${idUsuarioP}&idProduto=${idProduto}&idTipoAnexo=${idTipoAnexo}`, `GET`);
        //const responseUrlContratos = await Api.getAll(`urlAnexoArquivo?idUsuario=2&idProduto=5`, `GET`);
        //console.log('---------response.respostaRequisicao.data---------', responseUrlContratos);
        if (responseUrlContratos.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            if (responseUrlContratos.respostaRequisicao.data.length > 0) {

                var count2 = 0;
                const anexosSavos = await new Promise(resolve => { resolve(responseUrlContratos.respostaRequisicao.data) });
                await new Promise(resolve => {
                    resolve(
                        this.setState({
                            arrayImagensContratos:
                                anexosSavos.map(x => {
                                    count2 = count2 + 1;
                                    x['id'] = count2;
                                    x['image'] = `${ActionTypes.LINK_API_SPRING}${x.url}`;
                                    x['title'] = x.nome;
                                    x['description'] = c22.idProduto;
                                    x['price'] = `${dataAtual}`;
                                    x['typeIcon'] = 'lock';
                                    return x;
                                }),
                        })
                    )
                });
            }
        }
        this.setState({ loading: false });
    }


    //█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ FUNCOES DO MODAL ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

    _renderNextButton() {
        const nextIndex = this.state.currentPage + 1;
        return (
            <View style={{ marginRight: 10 }}>
                <TouchableOpacity onPress={() => { this.setState({ currentPage: nextIndex });
                        this.carousel.snapToItem(nextIndex);
                    }}
                >
                    <Text style={{ color: "grey", fontWeight: "bold", fontSize: 14 }}> {" "}próximo{" "} </Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderFinishButton() {
        return (
            <View style={{ marginRight: 10 }} >
                <TouchableOpacity onPress={() => {this.setState({ isVisible: false })}} >
                    <Text style={{ color: "grey", fontWeight: "bold", fontSize: 14 }}> {" "}Finalizar{" "} </Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderSkipButton() {
        return (
            <View style={{ marginLeft: 15, marginTop: 30 }} >
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#565656',
                        borderWidth: 0.5,
                        borderColor: '#fff',
                        height: 50,
                        width: 145,
                        borderRadius: 5,
                        margin: 1,
                    }}
                    activeOpacity={0.5}
                    onPress={() => { this.setState({ isVisible: false }) }}
                >
                    <View style={{ width: '95%', justifyContent: 'center', alignItems: 'flex-end', }}>
                        {/* <Image source={IMAGE_SETA_BRANCA} style={{ margin: 1, height: 22, width: 25, resizeMode: 'stretch', }} /> */}
                    </View>
                    <View style={{ width: '89%', justifyContent: 'center', alignItems: 'flex-start', }}>
                        <Text style={styles.TextStyle}>Voltar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    _renderSkipButton2() {
        return (
            <View style={{ marginLeft: 10 }} >
                <TouchableOpacity onPress={() => { this.setState({ isVisible: false }) }} >
                    <Text style={{ color: "grey", fontWeight: "bold", fontSize: 14 }}> {" "}Sair{" "} </Text>
                </TouchableOpacity>
            </View>
        );
    }

    isLastStep() {
        //return this.state.carouselItems.length - 1 === this.state.currentPage;
        return this.state.arrayImagensContratos.length - 1 === this.state.currentPage;
    }

    changeIndex = (index) => {
        this.setState({ currentPage: index });
    }

    _renderItem({ item, index }) {
        return (

            <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'transparent', borderRadius: 5, height: 300, padding: 2, marginLeft: 1, marginRight: 1, marginBottom: 10 }}>
                <ImageBackground source={{ uri: item.image }} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', }} >
                    <View style={{ backgroundColor: 'transparent', marginBottom: 1, marginTop: 1, borderWidth: 2, borderRadius: 6, borderColor: '#C0C0C0', }}>
                    </View>
                </ImageBackground>

                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 50, marginTop: 5, borderWidth: 2, borderRadius: 6, borderColor: 'gray', width: SCREEN_WIDTH_LARGURA_RODAPE - 150, }}>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: "flex-start", backgroundColor: 'transparent', marginBottom: 2, marginTop: 2, }}>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 12, color: 'gray', marginLeft: 5, fontWeight: 'bold', }}>
                            {'Contrato:'}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 11, color: 'gray', marginLeft: 5 }}>
                            {item.seqContrato}
                        </Text>
                    </View>
                    <View style={{ flex: 0.5, justifyContent: "center", alignItems: "flex-start", backgroundColor: 'transparent', marginBottom: 2, marginTop: 2, }}>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 12, color: 'gray', marginLeft: 5, fontWeight: 'bold', }}>
                            {'Data:'}
                        </Text>
                        <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 11, color: 'gray', marginLeft: 5, }}>
                            {item.price}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }


    //█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█



    alertMenssagem2 = () => {
        const mensagemPrincipal = this.state.mensagem;
        const mensagemDetalhes = this.state.mensagemDetalhe;
        Alert.alert(
            mensagemPrincipal,
            `${mensagemDetalhes}`,
            [
                { text: "Ok", onPress: () => console.log("Ok") }
            ],
            { cancelable: false }
        );
    };

    anexarEvidencia = () => {                        
        this.props.navigation.navigate('CameraPage');
        this.Standard.close();
    }

    upload = async (files) => {
        const config = {
            onUploadProgress: function (progressEvent) {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                console.log('Perncetual upload',percentCompleted)
            }
        }        
        let data = new FormData()
        data.append('file', files[0])
        axios.post('http://35.247.228.82:8080/produtor/uploadFileSemAccessToken', data, config)
            // .then(res => this.setState({...percentual, res})    )
            //.then(res =>  this.setState({ percentual : res }) )
            .then(res =>  console.log('thennnnnnnnnnnnnnnnnnnnnnnnnn',res))
            .catch(err => console.log('erooooooooo',err))
    }

    // upload22 = async (files) => {
    //     let data = new FormData()
    //     data.append('file', files[0])
    //     axios.request( {
    //         method: "post",
    //         url: 'http://35.247.228.82:8080/produtor/uploadFileSemAccessToken',
    //         data: data,
    //         responseType:'json',
    //         onUploadProgress: (p) => {
    //             this.setState({
    //                 percentual: Math.round((p.loaded * 100) / p.total)
    //             })
    //         }    
    //     });
    // }    

    _handleTextChange = event => {
    this.setState({zip: event.nativeEvent.text});
    }


    atualizaPercentual = (res = 1) => {
        console.log('Perncetual upload dentro da funcao', res);
        //this.setState({ percentual : res })                
    }

    //█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ SALVA IMAGENS E CRIA URLS ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█      
    salvarImagens = async () => {
        try {
            this.setState({ loading: true });
            const res2 =      await new Promise(resolve => {resolve(   AsyncStorage.getItem('access_token')   )});
            const idUsuario = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idUsuario')   )});
            const idEmpresa = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idEmpresa')   )});
            const idProduto = await new Promise(resolve => {resolve(   this.state.idProdutoState   )});
            const produtoParametro = await new Promise(resolve => {resolve(   this.props.route.params   )});
            
            const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");

            if (res2 === null) {
                console.log("access_token null");
                this.setState({ loading: false });
                return;
            }
            
            await new Promise(resolve => { resolve(this.setState({ file: this.props.imagemSelecionada.imagemSelecionada })) });

            //════════════════════════════════════ UPLOAD 1 ARQUIVO ══════════════════════════════════════
            if (this.state.file.length === 1) {
                
                const nomeI = this.state.imagensArrayUpload[0].nome;
                const formData = new FormData();
                formData.append('file', this.state.file[0]);
                const response = await Api.uploadImagem(`uploadFile`, `POST`, formData);

                //console.log("ESTOU EM UM ARQUIVO .....................................", response.numeroStatusResposta);

                if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                    
                    const resultadoImagenInserida = await new Promise(resolve => { resolve(response.respostaRequisicao.data) });
                    
                    var arr = resultadoImagenInserida.fileDownloadUri.split('downloadFile');
                    const urlImagemSemIp = `/downloadFile${arr[1]}`                  

                    console.log("RESPOSTA IMAGEM INSERIDA...", resultadoImagenInserida);
                    const jsonInsertUrl = {
                        idEmpresa: idEmpresa,
                        idUsuario: idUsuario,                        
                        //url: resultadoImagenInserida.fileDownloadUri,
                        url: urlImagemSemIp,
                        dtCriacao: dataAtual,
                        size: resultadoImagenInserida.size,
                        //nome: resultadoImagenInserida.fileName,
                        nome: nomeI,
                        statusExclusao: false,                        
                        dtExclusao: null,
                        idProduto: idProduto,
                        idTipoAnexo: 3, // TIPO 3 É ANEXO
                    }

                    const res222 = await Api.postRequest(`urlAnexoArquivo`, `POST`, jsonInsertUrl);
                    if (res222.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                        await new Promise(resolve => { resolve(this.props.limparImagemSelecionada()) });                                                
                        await new Promise(resolve => { resolve(this.setState({ imagensArrayUpload: this.props.imagemSelecionada.imagemSelecionada })) });                                                
                    } else {
                        this.setState({ loading: false });
                        await new Promise(resolve => { resolve(this.mensagem002(res222.numeroStatusResposta)) });
                    }
                    this.setState({ loading: false });
                } else {
                    this.setState({ loading: false });
                    await new Promise(resolve => { resolve(this.mensagem002(response.numeroStatusResposta)) });
                }
            }

            //════════════════════════════════════ UPLOAD VARIAS IMAGENS ══════════════════════════════════════    
            if (this.state.file.length > 1) {
                this.setState({ files: this.props.imagemSelecionada.imagemSelecionada });

                // var ssz777 = this.props.imagemSelecionada.imagemSelecionada.map(function (item) {
                //     console.log('66666666666666666666666666666666666666666666666', item);
                // });
                //console.log("ESTOU EM UM VARIOS .....................................", this.state.files);

                // await this.getFedaDaGaita(this.state.file);
                // console.log("666666666666666666666666666666666666666666666666666666");
                // this.setState({ loading: false });
                // return;
                var formData2 = new FormData();
                this.state.files.map(function (item) {
                    formData2.append('files', item);
                });

                let listxx = this.props.imagemSelecionada.imagemSelecionada;
                let kz7 = [];
                //console.log('6666666666666666666666666666666666666666666666666666666666666666666', listxx);
                //await this.props.uploadVariasImagensRequest(formData2);
                const responVariasImagens = await Api.uploadImagem(`uploadMultipleFiles`, `POST`, formData2);                
                //console.log('77777777777777777777777777777777777777777777777777777777777777777777', responVariasImagens.respostaRequisicao.data);
                if (responVariasImagens.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                    var resultadoVariasImagensInseridas = await new Promise(resolve => { resolve(responVariasImagens.respostaRequisicao.data) });
                    var sszzr = resultadoVariasImagensInseridas.map(function (item) {
                        kz7 = listxx.filter(value => value.name === item.fileName);
                        
                        var arr = item.fileDownloadUri.split('downloadFile');
                        const urlImagemSemIp = `/downloadFile${arr[1]}`                  
                        
                        return {
                            idEmpresa: idEmpresa,
                            idUsuario: idUsuario,                            
                            url: urlImagemSemIp,
                            //url: item.fileDownloadUri,
                            dtCriacao: dataAtual,
                            size: item.size,
                            //nome: item.fileName,
                            nome: kz7.length > 0? kz7[0].nome : '',
                            statusExclusao: false,                        
                            dtExclusao: null,
                            idProduto: idProduto,     
                            idTipoAnexo: 3, // TIPO 3 É ANEXO               
                        };
                    });
                    await this.getData(sszzr);                    
                    await new Promise(resolve => { resolve(this.props.limparImagemSelecionada()) });
                    await new Promise(resolve => { resolve(this.setState({ imagensArrayUpload: this.props.imagemSelecionada.imagemSelecionada })) });
                    this.setState({ loading: false });
                } else {
                    this.setState({ loading: false });
                    await new Promise(resolve => { resolve(this.mensagem002(responVariasImagens.numeroStatusResposta)) });
                }
            }
            await new Promise(resolve => { resolve(this.carregaAnexosSalvos()) });            

        } catch (error) {
            this.setState({ loading: false });
            console.log('Erro metodo salvarImagens class AddAnexo');
        }

    }
    //█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█  

    getData = async (sszzr) => {
        return await Promise.all(sszzr.map(item => Api.postRequest(`urlAnexoArquivo`, `POST`, item)))                                                   
    }

    // getFedaDaGaita = async (sszzr) => {
    //     return await Promise.all(sszzr.map(item => {

    //         const config = {
    //             onUploadProgress: function (progressEvent) {
    //                 var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //                 console.log(percentCompleted)
    //             }
    //         }
    //         let data = new FormData()
    //         data.append('file', item)

    //         axios.post('http://35.247.228.82:8080/produtor/uploadFileSemAccessToken', data, config)
    //             .then(res => console.log(res))
    //             .catch(err => console.log(err))
    //     }
    //     ));
    // }


    mensagem002 = async (numeroResposta) => {

        await new Promise(resolve => { resolve(this.setState({ mensagem: '' })) });
        await new Promise(resolve => { resolve(this.setState({ mensagemDetalhe: '' })) });

        if (numeroResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
            await new Promise(resolve => { resolve(this.setState({ mensagem: 'Informações incorretas' })) });
            await new Promise(resolve => { resolve(this.setState({ mensagemDetalhe: 'Verifique os dados enviados e tente mais tarde!' })) });
            this.setState({ loading: false });
            this.alertMenssagem2();
        } else if (numeroResposta === ActionTypes.TIME_OUT_BACK_END) {
            await new Promise(resolve => { resolve(this.setState({ mensagem: 'Sem comunicação com servidor' })) });
            await new Promise(resolve => { resolve(this.setState({ mensagemDetalhe: 'Favor tentar mais tarde' })) });
            this.setState({ loading: false });
            this.mensagemSnackBar();
        } else if (numeroResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
            await new Promise(resolve => { resolve(this.setState({ mensagem: 'Sem Conexão com a Internet' })) });
            await new Promise(resolve => { resolve(this.setState({ mensagemDetalhe: 'Favor Verificar sua Conexão' })) });
            this.setState({ loading: false });
            this.mensagemSnackBar();
        } else {
            await new Promise(resolve => { resolve(this.setState({ mensagem: 'Erro não esperdo' })) });
            await new Promise(resolve => { resolve(this.setState({ mensagemDetalhe: 'Favor entrar em contato com seu gestor!' })) });
            this.setState({ loading: false });
            this.mensagemSnackBar();
        }
        this.setState({ loading: false });        
    }

    editarImagem = async (val) => {        
        await new Promise(resolve => {resolve(   this.setState({imagemParaEdicaoOuExclusao: val})   )});
        await new Promise(resolve => {resolve(   this.setState({intemNovo: false})   )});  
        this.Standard.open();
    }
    sheetAdicionarImagem = async () => { 
        await new Promise(resolve => {resolve(   this.setState({intemNovo: true})   )});        
        this.Standard.open();        
    }
    mensagemSnackBar = () => {
        this.setState({ visible: true });
        const xxdr = this.state.renderSnack;
        this.setState({ renderSnack: xxdr + 1 });
    };

    confirmaExcluirImagemNaoSalva = async (product) => {              
        Alert.alert('Deseja excluir a imagem?',
            '',
            [                
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Ok", onPress: () => { this.excluirImagemNaoSalva(product) } }
            ],
            { cancelable: false }
        );  
    };
    excluirImagemNaoSalva = async (product) => {        
        let list = await new Promise(resolve => {resolve(   this.state.imagensArrayUpload   )});        
        list = list.filter(item => item.id !== product.id);
        this.setState({imagensArrayUpload: list});
        await new Promise(resolve => {resolve(   this.props.excluiItemArrayImagensUpload(product.id)   )});        
    }    
    confirmaExcluirImagemSalvaNoBanco = async () => {  
        this.Standard.close();             
        Alert.alert('Deseja excluir a imagem?',
            '',
            [                
                {
                    text: "Cancelar",
                    onPress: () => { this.limpaStateImagemParaEdicaoOuExclusao() },
                    style: "cancel"
                },
                { text: "Ok", onPress: () => { this.excluirImagemSalvaNoBanco() } }
            ],
            { cancelable: false }
        );  
    };
    limpaStateImagemParaEdicaoOuExclusao = () => {
        this.setState({imagemParaEdicaoOuExclusao: {}});
    }
    excluirImagemSalvaNoBanco = async () => { 
        this.Standard.close(); 
        const idUrlAnexoArquivo = await new Promise(resolve => {resolve(   this.state.imagemParaEdicaoOuExclusao.idUrlAnexoArquivo   )});      
        //console.log('11111111111111111111111111111111111111111111111111111111111', idUrlAnexoArquivo);  
        const idUsuarioP = await new Promise(resolve => {resolve(   AsyncStorage.getItem('idUsuario')   )}); 
        const json = {
            idUsuario: idUsuarioP
        }
        const urlAnexoArquivoExcluido = await Api.postRequest(`urlAnexoArquivo/${idUrlAnexoArquivo}`, `PUT`, json);        
        await new Promise(resolve => { resolve(this.carregaAnexosSalvos()) });
    }    
    editarDadosImagem = async () => { 
        this.Standard.close(); 
        const AnexoArquivo = await new Promise(resolve => {resolve(   this.state.imagemParaEdicaoOuExclusao   )});        
        await new Promise(resolve => {resolve(   this.setState({urlImagemModal: AnexoArquivo.url})   )});
        await new Promise(resolve => {resolve(   this.setState({valueImpuNomeImagem: AnexoArquivo.nome})   )});
        await new Promise(resolve => {resolve(   this.setState({valueImpuDescricao: AnexoArquivo.descricao})   )});
        this.setState({modalVisible: true});
    } 
    salvarAlteracoesImagem = async () => { 
        this.setState({ loading: true });                
        const nomeImage = await new Promise(resolve => {resolve(   this.state.valueImpuNomeImagem   )});          
        const descricaoImagem = await new Promise(resolve => {resolve(   this.state.valueImpuDescricao   )});  
        const idUrlAnexoArquivo = await new Promise(resolve => {resolve(   this.state.imagemParaEdicaoOuExclusao.idUrlAnexoArquivo   )});  
        const json = {
            nome: nomeImage,
            descricao: descricaoImagem
        }
        const response = await Api.postRequest(`urlAnexoArquivo/alterarNomeAndDescricao/${idUrlAnexoArquivo}`, `PUT`, json);          
        await new Promise(resolve => { resolve(this.carregaAnexosSalvos()) });
        this.setState({ loading: false });
        this.setState({modalVisible: false});
    } 
    cancelarAlteracoesImagem = async () => { 
        this.setState({modalVisible: false});
    } 
    textInputNomeImagem = async (val) => { 
        this.setState({valueImpuNomeImagem: val});
    } 
    textInputDescricao = async (val) => { 
        this.setState({valueImpuDescricao: val});
    } 
    
    renderListAnexosUpload() {
        if (this.state.imagensArrayUpload.length === 0) {
            return (
                <View style={{ backgroundColor: 'transparent', marginBottom: 1, marginTop: 1, borderWidth: 0, borderRadius: 0, borderColor: 'transparent', width: SCREEN_WIDTH_LARGURA_RODAPE - 20, }}>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, padding: 1, marginHorizontal: 5, backgroundColor: 'transparent', marginBottom: 1, marginTop: 19, borderWidth: 5, borderRadius: 20, borderColor: '#3C812E', }}>
                    <View style={{ padding: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5}}>
                        {this.state.imagensArrayUpload.map(product => {
                            return (
                                <View key={product.id} >
                                    <TouchableOpacity onPress={() => { this.confirmaExcluirImagemNaoSalva(product) }} >
                                        <Product key={product.id} product={product} />
                                    </TouchableOpacity>
                                </View>
                            )                                                           
                        })}
                    </View>
                    <View style={{  justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                        <TouchableOpacity  onPress={this.salvarImagens}> 
                            <View style={{backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20,  padding: 10, paddingHorizontal: 1, width: 250,}} >                        
                                <Text style={{fontSize: 20, color: '#fff', marginLeft: 8, }}>Salvar Novas Imagens</Text>                                                            
                            </View> 
                        </TouchableOpacity>                   
                    </View>
                </View>
            );
        }
    }

    renderListAnexosSalvos() {
        if (this.state.arrayImagensContratos.length === 0) {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 1, marginTop: 19, borderWidth: 2, borderRadius: 6, borderColor: '#C0C0C0',  }}>
                </View>
            )
        } else {
            return (
                <View style={{ backgroundColor: 'transparent', marginBottom: 1, marginTop: 19, borderWidth: 0, borderRadius: 0, borderColor: '#C0C0C0',  }}>
                    <View style={{ padding: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', }}>
                        {this.state.arrayImagensContratos.map(product => {
                            return (
                                <View key={product.id} >
                                    <TouchableOpacity onPress={() => { this.editarImagem(product) }} >
                                        <Product key={product.id} product={product} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
            );
        }
    }



    render() {
        const {urlImagemModal, intemNovo, imagemParaEdicaoOuExclusao, valueImpuNomeImagem, isValidNomeImagem, isValidDescricao, valueImpuDescricao, exluirImagemNaoSalvaNaListaUpload, percentual, numContratoState, visible, renderSnack, mensagem, imagensArrayUpload, carouselItems, currentPage, arrayImagensContratos, contratoPA } = this.state;
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    {/* onRequestClose={() => { Alert.alert('Modal has been closed.') }}> */}
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>
                        <View style={{height: 50, backgroundColor: 'transparent'}} >
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ color: '#000000', fontSize: 21, fontWeight: 'bold', marginBottom: 1 }}>Informações da Imagem</Text>
                            </View>
                        </View>
                        <View style={{flex:1, backgroundColor: 'transparent', padding: 10}} >
                            <Image
                                style={{width: '100%',height:'100%',backgroundColor:"transparent", borderRadius: 10}}
                                source={{ uri: urlImagemModal }}                                
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{height: 250, marginHorizontal: 10, backgroundColor: 'transparent', marginTop: 19}} >
                            <Text style={[styles.text_footer, { color: '#000000', marginBottom: 10 }]}>Nome</Text>
                            <View style={styles.action}>                                
                                <TextInput
                                    placeholder=""
                                    placeholderTextColor="#666666"
                                    style={[styles.textInput, { color: '#000000' }]}
                                    autoCapitalize="none"
                                    onChangeText={(val) => this.textInputNomeImagem(val)}
                                    value={valueImpuNomeImagem}                        
                                />
                            </View>
                            {!isValidNomeImagem ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Mínimo 4 caracteres</Text>
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
                                    value={valueImpuDescricao}
                                    onChangeText={(val) => this.textInputDescricao(val)}
                                />
                            </View>
                            {!isValidDescricao ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Mínimo de 20 caracteres.</Text>
                                </Animatable.View>
                            }

                        </View>
                        <View style={{height: 70, backgroundColor: 'transparent'}} >
                            <View style={{flexDirection: 'row',  justifyContent: 'center', alignItems: 'center', marginBottom: 7 }}>
                                <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                    <TouchableOpacity  onPress={this.cancelarAlteracoesImagem}> 
                                        <View style={{backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20,  padding: 10, paddingHorizontal: 1, width: 150,}} >                        
                                            <Text style={{fontSize: 16, color: '#fff', marginLeft: 0, }}>Cancelar</Text>                                                            
                                        </View> 
                                    </TouchableOpacity>                   
                                </View>
                                <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                    <TouchableOpacity  onPress={this.salvarAlteracoesImagem}> 
                                        <View style={{backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20,  padding: 10, paddingHorizontal: 1, width: 150,}} >                        
                                            <Text style={{fontSize: 16, color: '#fff', marginLeft: 0, }}>Salvar</Text>                                                            
                                        </View> 
                                    </TouchableOpacity>                   
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 8,  }}>
                    <ScrollView>

                        {this.renderListAnexosUpload()}
                        {this.renderListAnexosSalvos()}
                        
                    </ScrollView>
                </View>
                <TouchableOpacity onPress={() => { this.sheetAdicionarImagem() }} style={styles.viewTask} >
                    <Image source={require('../../../../../assets/images/plus.png')} style={{ height: 23, width: 23 }} />
                </TouchableOpacity>

                <RBSheet ref={ref => { this.Standard = ref }} height={270} >
                    {intemNovo ? 
                        <View style={styles.listContainer}>
                            <Text style={styles.listTitle}>Incluir nova Foto</Text>
                            <TouchableOpacity  style={styles.listButton} onPress={this.anexarEvidencia} >
                                <MDIcon name='photo-camera' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Tirar foto'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.listButton} onPress={() => this.showPicker(ImagePicker.MediaTypeOptions.Images)} >
                                <MDIcon name='photo' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Escolhe imagem da galeria'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.listButton} onPress={() => this.Standard.close()} >
                                <MDIcon name='cancel' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Cancelar'}</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.listContainer}>
                            <Text style={styles.listTitle}>Editar ou excluir imagem</Text>
                            <TouchableOpacity  style={styles.listButton} onPress={() => this.Standard.close()} >
                                <MDIcon name='important-devices' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Usar como foto de capa'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.listButton} onPress={this.editarDadosImagem} >
                                <MDIcon name='mode-edit' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Editar imagem'}</Text>
                            </TouchableOpacity>                        
                            <TouchableOpacity  style={styles.listButton} onPress={this.confirmaExcluirImagemSalvaNoBanco} >
                                <MDIcon name='delete' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Excluir imagem'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.listButton} onPress={() => this.Standard.close()} >
                                <MDIcon name='cancel' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Cancelar'}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity  style={styles.listButton} onPress={() => this.Standard.close()} >
                                <MDIcon name='check-box' style={styles.listIcon} />
                                <Text style={styles.listLabel}>{'Editar dados da image'}</Text>
                            </TouchableOpacity>                         */}
                        </View>
                    }
                </RBSheet>



                {/* </ImageBackground> */}
                <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    TextStyle: {
        color: '#fff',
        marginBottom: 1,
        marginRight: 2,
        fontSize: 14,
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        paddingBottom: 10,
        flex: 0
    },
    card: {
        flex: 1,
        marginVertical: 1,
        marginHorizontal: 1,
        borderRadius: 5,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center"
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
        borderRadius: 8 ,
        backgroundColor : "#FFFFFF",
    },
    TextInputStyleClass: {
        width: Dimensions.get('window').width-20,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 10 ,
        backgroundColor : "#FFFFFF",
        height: 100,
        textAlignVertical: 'top',
        padding: 5,
    },
});

function mapStateToProps(state) {
    return {
        imagemSelecionada: state.imagemSelecionada,
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        limparImagemSelecionada: limparImagemSelecionada,
        imagemCameraSelecionada: imagemCameraSelecionada,
        excluiItemArrayImagensUpload: excluiItemArrayImagensUpload,
    }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ListaEAdicionaAnexos);
