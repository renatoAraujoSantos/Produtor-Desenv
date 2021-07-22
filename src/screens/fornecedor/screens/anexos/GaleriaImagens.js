import * as ImagePicker from 'expo-image-picker';
import React, { useState, useRef } from "react";
import {
    View, Text, TouchableOpacity, Dimensions, TextInput,
    Platform, StyleSheet, ScrollView, Alert, Image, Modal
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ValidarUsuario } from '../../../../util/ValidarAutenticacaoUser';
import * as ActionTypes from '../../../../constants/ActionTypes';
import Loader from '../../../../components/loading/Loader';
import { useTheme } from '@react-navigation/native';
import * as Api from '../../../../store/ApiSpring';
import moment from 'moment';
import { UploadImage, CarregaImagemPerfilUsuario } from '../../../../util/SalvarImagem';
import RBSheet from "react-native-raw-bottom-sheet";
import MDIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from 'react-native-animatable';
import { mascaraTelefone, mascaraCep, retiraMascaraMaterNumeros } from '../../../../util/Masks';
import SnackBarPaper from '../../../../components/snackBar/SnackBarPaper';
import { Entypo, MaterialIcons, Feather } from '@expo/vector-icons';
import ProductItens from '../../../../components/ProductItens';
//import SnackBarMensagemSistema from '../../../../components/snackBar/SnackBarMensagemSistema';

MDIcon.loadFont();

export default function GaleriaImagens({ route, navigation }) {

    //const theme = useTheme();
    const { colors } = useTheme();
    const refRBSheet = useRef();
    const idTipoAnexoPP = 3;  // TIPO 3 E ANEXO DO PRODUTO

    const [isAutenticado, setIsAutenticado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState('');
    const [acaoTabela, setAcaoTabela] = useState('');
    const [idUrlAnexoArquivo, setIdUrlAnexoArquivo] = useState('0');
    const [valueTelefone, setValueTelefone] = useState('');
    const [valueCEP, setValueCEP] = useState('');

    const [visible, setVisible] = useState(false);
    const [renderSnack, setRenderSnack] = useState(0);
    const [mensagem, setMensagem] = useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = useState('');
    const [imagensArrayUpload, setImagensArrayUpload] = useState([]);
    const [arrayImagensContratos, setArrayImagensContratos] = useState([]);
    const [count2, setCount2] = useState(0);
    const [numRespostaSnackBar, setNumRespostaSnackBar] = useState('');
    const [intemNovo, setIntemNovo] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imagemParaEdicaoOuExclusao, setImagemParaEdicaoOuExclusao] = useState({});
    const [valueImpuNomeImagem, setValueImpuNomeImagem] = useState('');  
    const [valueImpuDescricao, setValueImpuDescricao] = useState('');
    const [urlImagemModal, setUrlImagemModal] = useState('');
    const [isValidNomeImagem, setIsValidNomeImagem] = useState(false);
    const [isValidDescricao, setIsValidDescricao] = useState(false);
    const [teste, setTeste] = useState([]);
    const [acaoBotaoSalvarModal, setAcaoBotaoSalvarModal] = useState('');
    const [imagemSelecionada, setImagemSelecionada] = useState({});
    
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                setLoading(true);
                await carregaAnexosSalvos();
                setIsAutenticado(true);
                setLoading(false);

            } catch (error) {
                setLoading(false);
                console.log('Error na classe GaleriaImagens metodo useEffect ', error);
            }
        });
        return unsubscribe;
    }, [navigation]);


    const carregaAnexosSalvos = async () => {        
        const idUsuarioP = await AsyncStorage.getItem('idUsuario');
        const c22 = await route.params.produtoParametro;
        const idProduto = c22.idProduto;
        const dataAtual = moment().format("DD/MM/YYYY HH:mm:ss");
        //const response = await Api.getAll(`urlAnexoArquivo?idUsuario=2&idProduto=4&idTipoAnexo=3`, `GET`);
        //console.log(`----------------- sssssssssssssssssss  urlAnexoArquivo?idUsuario=${idUsuarioP}&idProduto=${idProduto}&idTipoAnexo=${idTipoAnexoPP}`);
        const response = await Api.getAll(`urlAnexoArquivo?idUsuario=${idUsuarioP}&idProduto=${idProduto}&idTipoAnexo=${idTipoAnexoPP}`, `GET`);
        var count = 0;
        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            if (response.respostaRequisicao.data.length > 0) {
                // ACERTANDO A URL POR QUE NAO GRAVO IP NA TABELA DO BANCO, E ADICIONANDO UM CAMPO NO ARRAY
                var podioPorPais = response.respostaRequisicao.data.map(function (item, indice) {
                    item.url = `${ActionTypes.LINK_API_SPRING}${item.url}`;
                    count = count + 1;
                    item['id'] = count;
                    item['typeIcon'] = 'lock';
                    return item;
                });
                setArrayImagensContratos(podioPorPais);
            }
        }
    }

    const showPicker = async (mediaTypes, allowsEditing = false) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);
            await inserirDadosImagem(result.uri);
            setImagemSelecionada(result);
            //concatenandoImagensParaUpload(result);
        }
        refRBSheet.current.close();
    };
    const showCamera = async (mediaTypes, allowsEditing = false) => {
        refRBSheet.current.close();
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes,
            allowsEditing,
        });
        if (result.cancelled) {
            setSelection(undefined);
        } else {
            setSelection(result);
            await inserirDadosImagem(result.uri);
            setImagemSelecionada(result);            
            //concatenandoImagensParaUpload(result);            
        }
        
    };

    const concatenandoImagensParaUpload = () => {
        var js = { "file": [imagemSelecionada] };

        let numero_aleatorio = Math.random();
        numero_aleatorio = Math.floor(numero_aleatorio * 10000);
        const dataAtual = moment().format("YYYY-MM-DD");

        var newArrayI = js.file.map(function (item, indice) {
            item['id'] = count2 + 1;
            item['url'] = item.uri;
            item.type = 'image/PNG';
            item['nome'] = valueImpuNomeImagem;
            item['descricao'] = valueImpuDescricao;
            item['idTipoAnexo'] = idTipoAnexoPP;
            return item;
        });
        setCount2(count2 + 1);

        if (imagensArrayUpload.length === 0) {
            setImagensArrayUpload(newArrayI);
        } else {
            setImagensArrayUpload([...imagensArrayUpload, ...newArrayI]);  // CONCATENANDO ARRAYS
        }
    }

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    const salvarImagens = async () => {
        try {
            console.log(' salvar imagem  ');
            const dataAtual = moment().format("YYYY-MM-DD HH:mm:ss");
            const idUsuario = await new Promise(resolve => {resolve( AsyncStorage.getItem('idUsuario') )});
            const idEmpresa = await new Promise(resolve => {resolve( AsyncStorage.getItem('idEmpresa') )});
            const nomeUser = await AsyncStorage.getItem('nomeUsuarioLogado');
            const produtoParametro = await route.params.produtoParametro;
            const idProdutoP = produtoParametro.idProduto; 

            if (imagensArrayUpload.length >= 1) {                
                    imagensArrayUpload.forEach(async (number, index, array) => {                    
                    const img = await UploadImage(number);
                    //console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk',img);
                    if (img.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                        const resurUrl = await new Promise(resolve => { resolve(img.respostaRequisicao.data); });
                        console.log('--------------33333333333333333333333333333333333333333333333------------------------', resurUrl);                        
                        const nomeArquivo = `Imagem-Galeria-do-Produto-${resurUrl.fileName}`;
                        let arrU = resurUrl.fileDownloadUri.split('downloadFile');
                        const urlImagemSemIpX = `/downloadFile${arrU[1]}`;
                        const jsonInsertUrl = {
                            idEmpresa: idEmpresa,
                            idUsuario: idUsuario,
                            url: urlImagemSemIpX,
                            dtCriacao: dataAtual,
                            size: resurUrl.size,
                            nome: valueImpuNomeImagem,                            
                            statusExclusao: false,
                            dtExclusao: null,
                            idProduto: idProdutoP,
                            descricao: valueImpuDescricao,
                            idTipoAnexo: idTipoAnexoPP, // TIPO 3 É ANEXO
                        };
                        const res = await Api.postRequest(`urlAnexoArquivo`, `POST`, jsonInsertUrl);
                        await carregaAnexosSalvos();
                    } else {
                        mensagemSnackBar();
                    }
                });
            }
            setImagensArrayUpload([]);
            //await carregaAnexosSalvos();                                    
        } catch (error) {
            console.log('Erro na classe CapturarImagem metodo salvarImagens', error);
        }
    }

    const getData = async (sszzr) => {
        return await Promise.all(sszzr.map(item => Api.postRequest(`urlAnexoArquivo`, `POST`, item)))
    }
    
    const confirmaExcluirImagemNaoSalva = async (product) => {
        console.log(' valor produto  ', product);
        Alert.alert('Deseja excluir a imagem?',
            '',
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Ok", onPress: () => { excluirImagemNaoSalva(product) } }
            ],
            { cancelable: false }
        );
    }

    const confirmaExcluirImagemSalvaNoBanco = async () => {
        refRBSheet.current.close();
        Alert.alert('Deseja excluir a imagem?',
            '',
            [
                {
                    text: "Cancelar",
                    onPress: () => { limpaStateImagemParaEdicaoOuExclusao() },
                    style: "cancel"
                },
                { text: "Ok", onPress: () => { excluirImagemSalvaNoBanco() } }
            ],
            { cancelable: false }
        );
    };
    const limpaStateImagemParaEdicaoOuExclusao = () => {
        setImagemParaEdicaoOuExclusao({});
    }

    const excluirImagemSalvaNoBanco = async () => {
        refRBSheet.current.close();
        const idUrlAnexoArquivo = await new Promise(resolve => { resolve(imagemParaEdicaoOuExclusao.idUrlAnexoArquivo) });
        const idUsuarioP = await AsyncStorage.getItem('idUsuario');
        const json = {
            idUsuario: idUsuarioP
        }
        const urlAnexoArquivoExcluido = await Api.postRequest(`urlAnexoArquivo/${idUrlAnexoArquivo}`, `PUT`, json);
        await new Promise(resolve => { resolve(carregaAnexosSalvos()) });
    }

    const excluirImagemNaoSalva = async (product) => {
        let list = imagensArrayUpload.filter(item => item.id !== product.id);
        setImagensArrayUpload(list);
    }
    const inserirDadosImagem = async (url) => {        
        refRBSheet.current.close();
        setAcaoBotaoSalvarModal('imagemNova');
        setUrlImagemModal(url);
        setValueImpuNomeImagem(''); 
        setValueImpuDescricao(''); 
        setModalVisible(true);
    }
    const editarDadosImagem = async () => {
        refRBSheet.current.close();
        setAcaoBotaoSalvarModal('imagemAlteracao');
        setUrlImagemModal(imagemParaEdicaoOuExclusao.url);
        setValueImpuNomeImagem(imagemParaEdicaoOuExclusao.nome); 
        setValueImpuDescricao(imagemParaEdicaoOuExclusao.descricao); 
        setModalVisible(true);
    }
    const salvarAlteracoesImagem = async () => { 
        if(valueImpuNomeImagem.trim().length < 5 ){
            setIsValidNomeImagem(true);
            return;
        }else{
            setIsValidNomeImagem(false);
        }

        if(acaoBotaoSalvarModal === 'imagemNova'){
            concatenandoImagensParaUpload();
        }else{
            setLoading(true);
            const json = {
                nome: valueImpuNomeImagem,
                descricao: valueImpuDescricao
            }
            const response = await Api.postRequest(`urlAnexoArquivo/alterarNomeAndDescricao/${imagemParaEdicaoOuExclusao.idUrlAnexoArquivo}`, `PUT`, json);          
            await new Promise(resolve => {resolve( carregaAnexosSalvos() )});
            setLoading(false);    
        }
        setModalVisible(false);        
    } 

    const cancelarAlteracoesImagem = async () => { 
        setModalVisible(false);        
    } 
    const textInputNomeImagem = async (val) => { 
        setValueImpuNomeImagem(val);          
    } 
    const textInputDescricao = async (val) => { 
        setValueImpuDescricao(val);        
    } 
    const editarImagem = async (val) => {        
        setImagemParaEdicaoOuExclusao(val);
        setIntemNovo(false);
        refRBSheet.current.open(); 
    }
    const sheetAdicionarImagem = async () => {         
        setIntemNovo(true);
        refRBSheet.current.open();               
    }
    const sheetAdicionarImagemBotaoTeste = async () => {     // DEIXA ESSE CARA AQUI, USO PARA TESTE  
        //console.log('111111111111111111111111111111111');
    }

    const renderListAnexosUpload = () => {
        if (imagensArrayUpload.length === 0) {
            return (
                <View style={{ backgroundColor: 'transparent', marginBottom: 1, marginTop: 1, borderWidth: 0, borderRadius: 0, borderColor: 'transparent', }}>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, padding: 1, marginHorizontal: 1, backgroundColor: 'transparent', marginBottom: 1, marginTop: 10, borderWidth: 5, borderRadius: 20, borderColor: '#3C812E', }}>
                    <View style={{ padding: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5 }}>
                        {imagensArrayUpload.map(product => {
                            return (
                                <View key={product.id} >
                                    <TouchableOpacity onPress={() => { confirmaExcluirImagemNaoSalva(product) }} >
                                        <ProductItens key={product.id} product={product} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                        <TouchableOpacity onPress={salvarImagens}>
                            <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, padding: 10, paddingHorizontal: 1, width: 250, }} >
                                <Text style={{ fontSize: 20, color: '#fff', marginLeft: 8, }}>Salvar Novas Imagens</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    const renderListAnexosSalvos = () => {
        if (arrayImagensContratos.length === 0) {
            return (
                <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 1, marginTop: 19, borderWidth: 2, borderRadius: 6, borderColor: '#C0C0C0', }}>
                </View>
            )
        } else {
            return (
                <View style={{ backgroundColor: 'transparent', marginBottom: 1, marginTop: 19, borderWidth: 0, borderRadius: 0, borderColor: '#C0C0C0', }}>
                    <View style={{ padding: 4, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', }}>
                        {arrayImagensContratos.map(product => {
                            return (
                                <View key={product.idUrlAnexoArquivo} >
                                    <TouchableOpacity onPress={() => { editarImagem(product) }} >
                                        <ProductItens key={product.idUrlAnexoArquivo} product={product} />
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
            );
        }
    }


    if (!isAutenticado) {
        return (
            <Loader loading={loading} />
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Loader loading={loading} />
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible)  }}
                >
                {/* onRequestClose={() => { Alert.alert('Modal has been closed.') }}> */}
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', }}>
                    <View style={{ height: 50, backgroundColor: 'transparent' }} >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ color: '#000000', fontSize: 21, fontWeight: 'bold', marginBottom: 1 }}>Informações da Imagem</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'transparent', padding: 10 }} >
                        <Image
                            style={{ width: '100%', height: '100%', backgroundColor: "transparent", borderRadius: 10 }}
                            source={{ uri: urlImagemModal }}
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
                                onChangeText={(val) => textInputNomeImagem(val)}
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
                                onChangeText={(val) => textInputDescricao(val)}
                            />
                        </View>
                        {!isValidDescricao ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Mínimo de 20 caracteres.</Text>
                            </Animatable.View>
                        }
                    </View>
                    <View style={{ height: 70, backgroundColor: 'transparent' }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 7 }}>
                            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                <TouchableOpacity onPress={cancelarAlteracoesImagem}>
                                    <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, padding: 10, paddingHorizontal: 1, width: 150, }} >
                                        <Text style={{ fontSize: 16, color: '#fff', marginLeft: 0, }}>Cancelar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', padding: 10, }}>
                                <TouchableOpacity onPress={salvarAlteracoesImagem}>
                                    <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, padding: 10, paddingHorizontal: 1, width: 150, }} >
                                        <Text style={{ fontSize: 16, color: '#fff', marginLeft: 0, }}>Salvar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>        

            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 1, }}>
                <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                    <ScrollView>
                        {renderListAnexosUpload()}
                        {renderListAnexosSalvos()}
                    </ScrollView>
                </Animatable.View>
            </View>

            <TouchableOpacity onPress={() => sheetAdicionarImagem()} style={styles.viewTask} >
                <Image source={require('../../../../../assets/images/plus.png')} style={{ height: 23, width: 23 }} />
            </TouchableOpacity>

            
            {/*    DEIXA ESSE CARA AQUI USO PRA TESTE
             <TouchableOpacity onPress={() => sheetAdicionarImagemBotaoTeste()} style={styles.viewTaskBotaoTeste} >
                <Image source={require('../../../../../assets/images/plus.png')} style={{ height: 23, width: 23 }} />
            </TouchableOpacity> */}


            <RBSheet ref={refRBSheet} height={270} >
                {intemNovo ?
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
                    :
                    <View style={styles.listContainer}>
                        <Text style={styles.listTitle}>Editar ou excluir imagem</Text>
                        <TouchableOpacity style={styles.listButton} onPress={() => refRBSheet.current.close()} >
                            <MDIcon name='important-devices' style={styles.listIcon} />
                            <Text style={styles.listLabel}>{'Usar como foto de capa'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listButton} onPress={editarDadosImagem} >
                            <MDIcon name='mode-edit' style={styles.listIcon} />
                            <Text style={styles.listLabel}>{'Editar imagem'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listButton} onPress={confirmaExcluirImagemSalvaNoBanco} >
                            <MDIcon name='delete' style={styles.listIcon} />
                            <Text style={styles.listLabel}>{'Excluir imagem'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listButton} onPress={() => refRBSheet.current.close()} >
                            <MDIcon name='cancel' style={styles.listIcon} />
                            <Text style={styles.listLabel}>{'Cancelar'}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </RBSheet>
            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
            {/* <SnackBarMensagemSistema key={renderSnack} tintColor="blue" openSnack={visible} numeroResposta={numRespostaSnackBar} /> */}

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
    // DEIXA ESSE ESTILO AQUI, POSSO USAR COM O BOTAO DE TESTE
    viewTaskBotaoTeste: {
        position: 'absolute',
        bottom: 140,
        right: 17,
        height: 50,
        width: 50,
        backgroundColor: '#0000cc',
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

    text: {
        fontFamily: "Roboto_400Regular",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
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

    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    listContainer: {
        flex: 1,
        padding: 25
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
        height: 40,
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },


});

