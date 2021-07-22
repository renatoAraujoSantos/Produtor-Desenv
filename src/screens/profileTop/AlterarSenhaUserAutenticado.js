import React from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,    
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Api from '../../store/ApiSpring';
import Loader from '../../components/loading/Loader';
import * as ActionTypes from '../../constants/ActionTypes';
import SnackBarPaper from '../../components/snackBar/SnackBarPaper';
import ButtonVerdeLargo from '../../components/buttonsApp/ButtonVerdeLargo';
import ButtonBrandoLargo from '../../components/buttonsApp/ButtonBrandoLargo';

export default function AlterarSenhaUserAutenticado({ route, navigation }) {

    const [loading, setLoading] = React.useState(false);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);


    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isValidPassword2: true,
    });

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
            });
        }
    }

    const handleConfirmPasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                confirm_password: val,
                isValidPassword2: true
            });
        } else {
            setData({
                ...data,
                confirm_password: val,
                isValidPassword2: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }


    const cadastrarSenha = async () => {
        try {
            const { objetoCodigoValidacaoRedefinirSenha } = route.params;
            const idUsuarioP = objetoCodigoValidacaoRedefinirSenha.idUsuario;
            const idCodigoValidacaoP = objetoCodigoValidacaoRedefinirSenha.idCodigoValidacao;

            if (data.password.trim().length < 6 || data.confirm_password.trim().length < 6) {
                Alert.alert('Caracteres Insuficientes.', 'Mínimo de 6 caracteres nos campos de senha!', [
                    { text: 'Ok' }
                ]);
                return;
            }
            if (data.password != data.confirm_password) {
                Alert.alert('Senhas incorretas', 'Os campos estão com informações direferentes!', [
                    { text: 'Ok' }
                ]);
                return;
            };

            setLoading(true);

            const jsonCodValidacao = {
                idUsuario: idUsuarioP,
                novaSenha: data.password,
                idCodigoValidacao: idCodigoValidacaoP,
            };
            //console.log('9999999999999999999999999999999',jsonCodValidacao);

            const response = await Api.putRequestSemAccessToken(`usuarios/alteracaoDeSenhaSemAccessTokem`, `PUT`, jsonCodValidacao);

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                setLoading(false);
                navigation.navigate('Login');
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
                Alert.alert('Código incorreto', 'O código informado está diferente do código enviado!', [
                    { text: 'Ok' }
                ]);
                return;
            } else {
                await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
                await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
                setLoading(false);
                mensagemSnackBar();
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        setLoading(false);
    };

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    return (
        <View style={styles.container}>
            <Loader loading={loading} />
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <View style={{ height: 3, backgroundColor: 'transparent' }} >
                    <View style={{ alignItems: 'center', }} >
                        <Text style={[styles.text_footer, { marginTop: 5 }]}>{''}</Text>
                    </View>
                </View>


                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 10 }} >

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Senha</Text>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#05375a" size={20} />
                        <TextInput
                            placeholder=""
                            placeholderTextColor="#666666"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity onPress={updateSecureTextEntry}>
                            {data.secureTextEntry ?
                                <Feather name="eye-off" color="grey" size={20} />
                                :
                                <Feather name="eye" color="grey" size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Confirme sua Senha</Text>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color="#05375a" size={20} />
                        <TextInput
                            placeholder=""
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity onPress={updateConfirmSecureTextEntry} >
                            {data.confirm_secureTextEntry ?
                                <Feather name="eye-off" color="grey" size={20} />
                                :
                                <Feather name="eye" color="grey" size={20} />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword2 ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Mínimo de 6 caracteres.</Text>
                        </Animatable.View>
                    }

                </View>

                <View style={{ height: 170, justifyContent: 'flex-end', backgroundColor: 'transparent' }} >
                    <View style={{ marginVertical: 20 }} >
                        <ButtonVerdeLargo titulo={'Salvar'} onPress={cadastrarSenha} />
                    </View>

                    <View style={{ marginVertical: 20 }} >
                        <ButtonBrandoLargo titulo={'Voltar'} onPress={() => navigation.goBack()} />
                    </View>

                </View>

            </Animatable.View>
            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        //marginHorizontal: 20
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
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
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
    color_textPrivate: {
        color: 'grey'
    }
});
