import * as ImagePicker from 'expo-image-picker';
//import * as Permissions from 'expo-permissions';
import React, { useRef } from "react";
import { Platform, StyleSheet, Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ValidarUsuario, LogoutUsuario } from '../../util/ValidarAutenticacaoUser';
import Loader from '../../components/loading/Loader';
import { useTheme } from '@react-navigation/native';
import * as Api from '../../store/ApiSpring';
import { CarregaImagemPerfilUsuario } from '../../util/SalvarImagem';
//import ActionTypes from '../../constants/ActionTypes';
import * as ActionTypes from '../../constants/ActionTypes';
import RBSheet from "react-native-raw-bottom-sheet";
import MDIcon from "react-native-vector-icons/MaterialIcons";
import * as UrlImagensSistema from '../../constants/UrlImagensSistema';
import ButtonVerdeLargo from '../../components/buttonsApp/ButtonVerdeLargo';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import * as Animatable from 'react-native-animatable';

MDIcon.loadFont();

// async function requestPermissionAsync(permission) {
//     if (Platform.OS === 'web') {
//       return true;
//     }
//     const { status } = await Permissions.askAsync(permission);
//     return status === 'granted';
//   }

export default function ProfileTop({ route, navigation }) {
    //const theme = useTheme();
    const { colors } = useTheme();
    const refRBSheet = useRef();
    const [isAutenticado, setIsAutenticado] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [textExpoToken, setTextExpoToken] = React.useState('');
    const [selection, setSelection] = React.useState('');
    const [nomeUsuarioAutenticado, setNomeUsuarioAutenticado] = React.useState('');
    const [urlImagemPerfil, setUrlImagemPerfil] = React.useState(UrlImagensSistema.URL_IMAGEM_NAO_EXISTE);
    const [dadosUsuario, setDadosUsuario] = React.useState({});
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [mensagem, setMensagem] = React.useState('');

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
                    const imagemUser = await AsyncStorage.getItem('imagemPerfilUserLogado');

                    setUrlImagemPerfil(imagemUser);
                    setNomeUsuarioAutenticado(nomeUser);
                    await buscaDadosUsuario();
                    setLoading(false);
                    setIsAutenticado(true);
                }
            } catch (error) {
                setLoading(false);
                console.log('Error na classe ProfileTop metodo useEffect ', error);
            }
        });
        return unsubscribe;
    }, [navigation]);




    const buscaDadosUsuario = async () => {

        try {
            const idUsuarioP = await AsyncStorage.getItem('idUsuario');
            //const response = await Api.getAll(`usuarios/${idUsuarioP}`, `GET`);
            const response = await Api.getAll(`usuarios/buscarUsuarioComEnderecosDadosBancarios/${idUsuarioP}`, `GET`);

            

            console.log('111111111111111111111111111111111111111111',response.respostaRequisicao.data);

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                await new Promise(resolve => { resolve(setDadosUsuario(response.respostaRequisicao.data)) });
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
            console.log('Erro na classe ProfileTop  metodo buscaDadosUsuario', error);
        }
    };

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };







    const remoteToken = async () => {
        const autenticado = await LogoutUsuario();
        navigation.navigate('HomeApresentacaoApp');
    }

    const mostraExpoToken = async () => {
        const tokenExpoNotification2 = await AsyncStorage.getItem('tokenExpoNotification');
        setTextExpoToken(`${tokenExpoNotification2}`);
    }
    const enviarNotificacao = async () => {
        const idEmpresaP = await AsyncStorage.getItem('idEmpresa');
        const idUsuarioP = await AsyncStorage.getItem('idUsuario');
        const tokenExpoNotification = await AsyncStorage.getItem('tokenExpoNotification');

        const jsonNotificacao = {
            tokenExpoDestino: tokenExpoNotification,
            idUsuario: idUsuarioP,
            idEmpresa: idEmpresaP,
            //dhEnvio: `${dataAtual}`, // ESSE CARA PEGO NO BACK
            nome: 'Nome teste',
            descricao: 'descricao teste'
        }
        const response = await Api.postRequest(`expoNotification`, `POST`, jsonNotificacao);
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

    const testFuncao = async () => {

        console.log('444444444444444444444444444444444444444', dadosUsuario);
    }


    if (!isAutenticado) {
        return (
            <Loader loading={loading} />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ flexDirection: 'row', marginHorizontal:10, backgroundColor:'transparent',  justifyContent:'center', alignItems:'flex-start', }}>
                        <View style={{ flex: 0.4, alignSelf: "center", alignItems:'center', }}>
                            <View style={styles.profileImage}>
                                <Image
                                    source={{ uri: urlImagemPerfil }}
                                    style={styles.image} resizeMode="cover"
                                ></Image>
                            </View>
                        </View>

                        <View style={{ flex: 0.6, flexDirection: 'row', justifyContent:'flex-start', alignItems:'center'  }}>
                            <View style={{ alignItems:'flex-start'}}>
                                <Text style={[styles.text, { fontWeight: "200", fontSize: 16, fontWeight: 'bold' }]}>{'Perfil: '}</Text>
                            </View>
                            <View style={{ alignItems:'flex-start'}}>
                                <Text style={[styles.text, { fontWeight: "200", fontSize: 16 }]}>{'  Produtor'}</Text>
                            </View>
                        </View>
                    </View>





                    <View style={{ marginTop: 24, borderRadius: 12, marginHorizontal: 8, backgroundColor: "#fff", ...styles.shadow }} >
                        <Text style={[styles.text_footer, { marginTop: 20 }]}>Nome Completo</Text>
                        <View style={styles.textPrivate}>
                            <Text style={{ fontSize: 18, color: 'grey' }}>
                                {dadosUsuario.nomeUsuario}
                            </Text>
                        </View>

                        <Text style={[styles.text_footer, { marginTop: 20 }]}>E-mail</Text>
                        <View style={styles.textPrivate}>
                            <Text style={{ fontSize: 18, color: 'grey' }}>
                                {dadosUsuario.email}
                            </Text>
                        </View>

                        <Text style={[styles.text_footer, { marginTop: 20 }]}>Celular</Text>
                        <View style={styles.textPrivate}>
                            <Text style={{ fontSize: 18, color: 'grey' }}>
                                {dadosUsuario.celular}
                            </Text>
                        </View>
                        {/* <View style={{ marginHorizontal: 10, backgroundColor: 'transparent', marginBottom: 5, marginTop: 20, borderWidth: 0.8, borderRadius: 6, borderColor: '#C0C0C0' }} /> */}

                    </View>

                    <View style={{ marginTop: 24, borderRadius: 12, marginHorizontal: 8, backgroundColor: "#fff", ...styles.shadow }} >
                        <Text style={{ textAlign:'center',  color: '#05375a', fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Endereços</Text>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
                            <TouchableOpacity onPress={() => navigation.navigate('EnderecoUsuario') } >
                                <View style={{ backgroundColor: 'transparent', alignItems: 'center', borderRadius: 20, margin: 10, padding: 3, paddingHorizontal: 15, width: 185, borderWidth: 3, borderColor: '#3c812e' }} >
                                    <Text style={{ fontSize: 14, color: '#05375a', }}>Adicionar Endereço</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ marginTop: 24, borderRadius: 12, marginHorizontal: 8, backgroundColor: "#fff", ...styles.shadow }} >
                        <Text style={{ textAlign:'center',  color: '#05375a', fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>Dados Bancários</Text>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', }}>
                            <TouchableOpacity onPress={() => navigation.navigate('DadosBancariosUsuario') } >
                                <View style={{ backgroundColor: 'transparent', alignItems: 'center', borderRadius: 20, margin: 10, padding: 3, paddingHorizontal: 15, width: 185, borderWidth: 3, borderColor: '#3c812e' }} >
                                    <Text style={{ fontSize: 14, color: '#05375a', }}>Dados Bancarios</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>



                        <Text style={[styles.text_footer, { marginTop: 20 }]}>CEP</Text>
                        <View style={styles.textPrivate}>
                            <Text style={{ fontSize: 18, color: 'grey' }}>
                                {dadosUsuario.endereco}
                            </Text>
                        </View>

                        <Text style={[styles.text_footer, { marginTop: 20 }]}>Endereço</Text>
                        <View style={styles.textPrivate}>
                            <Text style={{ fontSize: 18, color: 'grey' }}>
                                {dadosUsuario.endereco}
                            </Text>
                        </View>

                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: '#05375a', fontSize: 15, marginTop: 40 }}>V.S 04</Text>
                        </View>
                    






                    {/* <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 24 }]}>483</Text>
                        <Text style={[styles.text, styles.subText]}>Visitas</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                        <Text style={[styles.text, { fontSize: 24 }]}>450</Text>
                        <Text style={[styles.text, styles.subText]}>Solicitações</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 24 }]}>302</Text>
                        <Text style={[styles.text, styles.subText]}>Vendas</Text>
                    </View>
                </View> */}




                    {/* <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.mediaImageContainer}>
                            <Image source={{ uri: UrlImagensSistema.URL_MEDIAL1 }} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={{ uri: UrlImagensSistema.URL_MEDIAL2 }} style={styles.image} resizeMode="cover"></Image>
                        </View>
                        <View style={styles.mediaImageContainer}>
                            <Image source={{ uri: UrlImagensSistema.URL_MEDIAL3 }} style={styles.image} resizeMode="cover"></Image>
                        </View>
                    </ScrollView>
                </View> */}






                    {/* <View style={{ height: 100, justifyContent: 'flex-end', backgroundColor: 'transparent' }} >
                    <View style={{ marginVertical: 20 }} >
                        <ButtonVerdeLargo titulo={'Auterar Senha'} onPress={() => navigation.navigate('AlterarSenhaUserAutenticado')} />
                    </View>
                </View>


                <View style={{ height: 100, justifyContent: 'flex-end', backgroundColor: 'transparent' }} >
                    <View style={{ marginVertical: 20 }} >
                        <ButtonVerdeLargo titulo={'testeee'} onPress={testFuncao} />
                    </View>
                </View> */}






                </ScrollView>
            </Animatable.View>


            <View style={{ height: 70, backgroundColor: 'transparent' }} >
                <View style={{ width: '100%', height: 70, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'flex-end', }} >
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginBottom: 0, marginTop: 8, }}>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Voltar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', }}>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('EditProfile', {'dadosUsuarioRoute': dadosUsuario} )} > */}
                            <TouchableOpacity onPress={() => navigation.navigate('PlantDetail')} >
                                <View style={{ backgroundColor: '#3c812e', alignItems: 'center', borderRadius: 20, margin: 10, padding: 10, paddingHorizontal: 15, width: 165, }} >
                                    <Text style={{ fontSize: 15, color: '#fff', marginLeft: 8, }}>Editar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>


            {/* <View style={styles.button}>                    
                    <TouchableOpacity  style={styles.signIn} onPress={remoteToken} >
                        <LinearGradient  colors={['#56BA42', '#3c812e']}  style={styles.signIn} >
                            <Text style={[styles.textSign, { color:'#fff' }]}>Sair do App</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> */}
            {/* <View style={{alignItems: 'center', marginTop: 10, marginHorizontal: 20}}>                    
                    <TouchableOpacity  style={styles.signIn} onPress={enviarNotificacao} >                        
                        <LinearGradient  colors={['#56BA42', '#3c812e']}  style={styles.signIn} >
                            <Text style={[styles.textSign, { color:'#fff' }]}>Enviar Notificação</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View> */}

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
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
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 10,
        //marginTop: 2
    },
    color_textPrivate: {
        color: 'grey'
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        //backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        //paddingHorizontal: 20,
        paddingVertical: 3
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        fontWeight: 'bold'
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

    button: {
        alignItems: 'center',
        marginTop: 50,
        marginHorizontal: 20
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
    text: {
        fontFamily: "Roboto_400Regular",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 80,
        overflow: "hidden",
        backgroundColor: 'red',        
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
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});
