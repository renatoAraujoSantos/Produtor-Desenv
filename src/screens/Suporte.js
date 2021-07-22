import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Platform, StyleSheet, Alert,
    ScrollView, Dimensions, Modal, Image, Pressable
} from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import * as Api from '../store/ApiSpring';
import Loader from '../components/loading/Loader';
import * as ActionTypes from '../constants/ActionTypes';
import SnackBarPaper from '../components/snackBar/SnackBarPaper';
import ButtonVerdeLargo from '../components/buttonsApp/ButtonVerdeLargo';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';

export default function Suporte({ route, navigation }) {

    const [modalVisible, setModalVisible] = useState(false);
    const { colors } = useTheme();
    const [loading, setLoading] = React.useState(false);
    const [imputNome, setImputNome] = React.useState('');
    const [isValidNome, setIsValidNome] = React.useState(false);
    const [imputEmail, setImputEmail] = React.useState('');
    const [isValidEmail, setIsValidEmail] = React.useState(false);
    const [mensagemSuporte, setMensagemSuporte] = useState('');
    const [isValidMensagem, setIsValidMensagem] = React.useState(false);
    const [idUsuarioLogado, setIdUsuarioLogado] = useState('');
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');

    useEffect(() => {
        async function loaderPage() {

            const nomelUser = await AsyncStorage.getItem('nomeUsuarioLogado');
            const emailUser = await AsyncStorage.getItem('emailUsuarioLogadoParaUtenticacao');
            const idUsuario = await AsyncStorage.getItem('idUsuario');

            if (nomelUser != null) {
                setImputNome(nomelUser);
            }
            if (emailUser != null) {
                setImputEmail(emailUser);
            }
            if (idUsuario != null) {
                setIdUsuarioLogado(idUsuario);
            }
        }
        loaderPage()
    }, []);

    const textInputNome = (val) => {
        setImputNome(val);
    }

    const textInputEmail = (val) => {
        setImputEmail(val);
    }

    const textInputMensagem = (val) => {
        setMensagemSuporte(val);
    }

    const enviarMensagemSuporte = async () => {

        if (mensagemSuporte.length < 19) {
            setIsValidMensagem(true);
            return;
        } else {
            setIsValidMensagem(false);
        }

        try {
            setLoading(true);
            const jsonInsert = {
                idUsuario: idUsuarioLogado,
                mensagemUsuario: mensagemSuporte,
                idStatusAtendimento: 9
            }

            const response = await Api.postRequest(`suporteAtendimento`, `POST`, jsonInsert);

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                console.log('VERIFICAR SE DEU CERTO A SETSTATE COM OS DADOS DO PRODUTO  ', response.respostaRequisicao.data);
                setModalVisible(true);
            } else {
                tratamentoDeErro(response.numeroStatusResposta);
            }
            setLoading(false);
        } catch (error) {
            console.log('Erro na classe Suporte metodo enviarMensagemSuporte ', error);
            setLoading(false);
        }
    }

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    const tratamentoDeErro = async (numeroStatusResposta) => {
        setLoading(false);
        if (numeroStatusResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
            mensagemSnackBar();
        } else if (numeroStatusResposta === ActionTypes.TIME_OUT_BACK_END) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
            mensagemSnackBar();
        } else if (numeroStatusResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
            return;
        } else {
            await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
            await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
            mensagemSnackBar();
        }
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />

            {/* <View style={styles.centeredView}> */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Mensagem Enviada com Sucesso</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.textStyle}>{'      Ok      '}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            {/* </View> */}


            <ScrollView>
                <View style={{ height: 150, justifyContent:'flex-start' }} >
                    <View style={{ alignItems: 'center', justifyContent:'flex-start'}} >
                        <Image
                            style={{ width: 300, height: 150, resizeMode: 'contain', }}
                            source={{ uri: UrlImagensSistema.URL_LOGO_DESCRICAO }}
                        />
                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 10 }} >
                    <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>Nome</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#666666"
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputNome(val)}
                            value={imputNome}
                            editable={false}
                        />
                    </View>
                    {!isValidNome ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo 4 caracteres</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { color: colors.text, marginBottom: 10 }]}>E-mail</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#666666"
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputEmail(val)}
                            value={imputEmail}
                            editable={false}
                        />
                    </View>
                    {!isValidEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo 4 caracteres</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { color: colors.text, marginTop: 10 }]}>Mensagem</Text>
                    <View style={styles.action}>
                        <TextInput
                            style={styles.TextInputStyleClass}
                            underlineColorAndroid="transparent"
                            placeholder={"Digite sua mensagem"}
                            placeholderTextColor={"#9E9E9E"}
                            numberOfLines={10}
                            multiline={true}
                            value={mensagemSuporte}
                            onChangeText={(val) => textInputMensagem(val)}
                        />
                    </View>
                    {!isValidMensagem ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 20 caracteres.</Text>
                        </Animatable.View>
                    }
                </View>
                </ScrollView>
                <View style={{ height: 100, justifyContent: 'flex-end', }} >
                    <View style={{ marginVertical: 20 }} >
                        <ButtonVerdeLargo titulo={'Enviar'} onPress={enviarMensagemSuporte} />
                    </View>
                </View>
            
            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 2
        //backgroundColor: "red",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        //backgroundColor: "#2196F3",
        backgroundColor: "#3c812e",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: 'Roboto_400Regular',
        fontSize: 15,
        color: 'gray',
        fontWeight: 'bold',
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
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    TextInputStyleClass: {
        width: Dimensions.get('window').width - 40,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        height: 100,
        textAlignVertical: 'top',
        padding: 5,
    },
});

