import React from 'react';
import {
    View, Text, TouchableOpacity, TextInput, Platform,
    StyleSheet, StatusBar, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Api from '../../../store/ApiSpring';
import Loader from '../../../components/loading/Loader';
import * as ActionTypes from '../../../constants/ActionTypes';
import SnackBarPaper from '../../../components/snackBar/SnackBarPaper';
import { getNomeUsuarioLogado } from '../../../util/StringsApp';
import { useTheme } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
//import { AuthContext } from '../../../components/context';
import { retornaRefreshTokenAplicacao } from '../../../util/RefreshToken';
import { CarregaImagemPerfilUsuario } from '../../../util/SalvarImagem';

export default function SignInScreen({ navigation }) {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isValidEmail: false
    });

    const [validacaoEmailAoSairDoImput, setValidacaoEmailAoSairDoImput] = React.useState(false);
    const [nameIconImput, setNameIconImput] = React.useState('x-circle');
    const [colorIconImput, setColorIconImput] = React.useState('red');
    const [isValidEmail, setValidEmail] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [checked, setChecked] = React.useState(false);
    const [valueImpuEmail, setValueImpuEmail] = React.useState('');
    const [isValidPassword, setIsValidPassword] = React.useState(true);
    const { colors } = useTheme();
    //const { signIn } = React.useContext(AuthContext);

    const validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                const emailPersistence = await AsyncStorage.getItem('emailUsuariTelaLogin');
                const senhaPersistence = await AsyncStorage.getItem('senhalUsuariTelaLogin');
                const checkBoxPersistence = await AsyncStorage.getItem('CheckBoxTelaLogin');

                if (senhaPersistence != null) {
                    setData({ ...data, password: senhaPersistence });
                }
                if (emailPersistence != null) {
                    setValueImpuEmail(emailPersistence);
                }
                if (checkBoxPersistence != null) {
                    if (checkBoxPersistence === 'true') {
                        setChecked(true);
                    } else {
                        setChecked(false);
                    }
                } else {
                    setChecked(false);
                }

            } catch (e) {
                console.warn(e);
            }
        }
        loadResourcesAndDataAsync();
    }, []);

    const textInputChange = (val) => {
        if (validacaoEmailAoSairDoImput) {
            const validacaoEmail = validateEmail(val);
            if (validacaoEmail) {
                setNameIconImput('check-circle');
                setColorIconImput('green');
                setValidEmail(false);
            } else {
                setNameIconImput('x-circle');
                setColorIconImput('red');
                setValidEmail(true);
            }
        }
        if (val.trim().length >= 0) {
            setValueImpuEmail(val.trim())
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setIsValidPassword(true);
            setData({
                ...data,
                password: val.trim()
            });
        } else {
            setIsValidPassword(false);
            setData({
                ...data,
                password: val.trim()
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        const validacaoEmail = validateEmail(valueImpuEmail);
        if (validacaoEmail) {
            setValidacaoEmailAoSairDoImput(true);
            setNameIconImput('check-circle');
            setColorIconImput('green');
            setValidEmail(false);
        } else {
            setValidacaoEmailAoSairDoImput(true);
            setNameIconImput('x-circle');
            setColorIconImput('red');
            setValidEmail(true);
        }
    }

    //╔══════════════════════ AUTENTICACAO ═══════════════════════════════╗
    const loginHandle = async (userName, password) => {
        
        const emailOk = await new Promise(resolve => { resolve(validateEmail(userName)) });
        if (emailOk === false) {
            setValidacaoEmailAoSairDoImput(true);
            setNameIconImput('x-circle');
            setColorIconImput('red');
            setValidEmail(true);
            return;
        }
        if (password.trim().length < 6) {
            setIsValidPassword(false);
            return;
        }

        if (checked === true) {
            await AsyncStorage.setItem('emailUsuariTelaLogin', userName);
            await AsyncStorage.setItem('senhalUsuariTelaLogin', password);
            await AsyncStorage.setItem('CheckBoxTelaLogin', 'true');
        } else {
            await AsyncStorage.removeItem('emailUsuariTelaLogin');
            await AsyncStorage.removeItem('senhalUsuariTelaLogin');
            await AsyncStorage.removeItem('CheckBoxTelaLogin');
        }

        try {
            setLoading(true);
            const data = `username=${userName}&password=${password}&grant_type=password`;
            const response = await new Promise(resolve => { resolve(Api.postAutenticacaoApp(data, `POST`)) });

            if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                const idUsuarioP = await new Promise(resolve => { resolve(response.respostaRequisicao.data.idUsuario) });
                const idEmpresaP = await new Promise(resolve => { resolve(response.respostaRequisicao.data.idEmpresa) });
                const token = await new Promise(resolve => { resolve(response.respostaRequisicao.data.access_token) });
                const RefreshTokenRes = await retornaRefreshTokenAplicacao(response.respostaRequisicao.headers);

                await new Promise(resolve => { resolve(AsyncStorage.setItem('emailUsuarioLogadoParaUtenticacao', `${userName}`)) });
                await new Promise(resolve => { resolve(AsyncStorage.setItem('senhaUsuarioLogadoParaUtenticacao', `${password}`)) });
                await new Promise(resolve => { resolve(AsyncStorage.setItem('idUsuario', `${idUsuarioP}`)) });
                await new Promise(resolve => { resolve(AsyncStorage.setItem('idEmpresa', `${idEmpresaP}`)) });
                await new Promise(resolve => { resolve(AsyncStorage.setItem('access_token', `${token}`)) });
                await new Promise(resolve => { resolve(AsyncStorage.setItem('refresh_token', `${RefreshTokenRes}`)) });
                const nomeUsuarioLogado = await getNomeUsuarioLogado();  // esse cara tem que ficar aqui nessa linha
                await new Promise(resolve => { resolve(AsyncStorage.setItem('nomeUsuarioLogado', `${nomeUsuarioLogado}`)) });

                //╔═══════════════════════════════════════════════════════════════════════════╗
                //   CADASTRANDO OU ATUALIZANDO UM EXPO NOTIFICATION PARA O USUARIO
                //╚═══════════════════════════════════════════════════════════════════════════╝
                const tokenExpoNotification = await AsyncStorage.getItem('tokenExpoNotification');                
                const jsonNotificacao = {
                    tokenExpoDestino: tokenExpoNotification,
                    idUsuario: idUsuarioP,
                    idEmpresa: idEmpresaP,
                    nome: 'Nome teste',
                    descricao: 'descricao teste'
                }
                
                const idTbExpoNotificacao = await new Promise(resolve => { resolve(response.respostaRequisicao.data.idExpoNotificacao) });
                console.log('UPDATE EXPO NOTIFICATION**********************************************************', idTbExpoNotificacao);

                if (idTbExpoNotificacao === null || idTbExpoNotificacao === undefined) {
                    console.log('INSERT EXPO NOTIFICATION');
                    responseExpo = await Api.postRequest(`expoNotification/criarExpoNotification`, `POST`, jsonNotificacao);
                } else {
                    if (idTbExpoNotificacao !== tokenExpoNotification) {
                        console.log('UPDATE EXPO NOTIFICATION');
                        responseExpo = await Api.putRequest(`expoNotification/${idTbExpoNotificacao}`, `PUT`, jsonNotificacao);
                        console.log('------------------------------------------------------------------------------------');
                    } else {
                        console.log('TELA DE LOGIN OS EXPO TOKENS SÃO IGUAIS, NÃO PRECISA DE UPDATE 888888888888888888888888888888888888888');
                    }
                }
                await CarregaImagemPerfilUsuario();
                
                setLoading(false);
                navigation.navigate('RootApresentacao');
                //signIn();
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
                Alert.alert('Usuário Inválido!', 'Nome de usuário ou senha está incorreta.', [
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
    }

    const mensagemSnackBar = () => {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    const gravaCredeciais = async () => {
        setChecked(!checked);
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />
            <StatusBar backgroundColor='#3c812e' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Bem Vindo!</Text>
            </View>
            <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: colors.background }]} >
                <ScrollView>
                    <Text style={[styles.text_footer, { color: colors.text }]}>E-mail</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user" color={colors.text} size={20} />
                        <TextInput
                            placeholder="Seu e-mail"
                            placeholderTextColor="#666666"
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                            value={valueImpuEmail}
                            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                        />
                        {validacaoEmailAoSairDoImput ?
                            <Animatable.View animation="bounceIn" >
                                <Feather
                                    name={nameIconImput}
                                    //name="check-circle"
                                    //color="green"
                                    color={colorIconImput}
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {!isValidEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>E-mail inválido.</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, { color: colors.text, marginTop: 35 }]}>Senha</Text>
                    <View style={styles.action}>
                        <FontAwesome name="lock" color={colors.text} size={20} />
                        <TextInput
                            placeholder="Sua Senha"
                            placeholderTextColor="#666666"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={[styles.textInput, { color: colors.text }]}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                            value={data.password}
                        />
                        <TouchableOpacity onPress={updateSecureTextEntry} >
                            {data.secureTextEntry ?
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
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('EsqueciSenhaScreen')} >
                                <Text style={{ color: '#3c812e', marginTop: 15 }}>Esqueceu a Senha?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <CheckBox
                                title='Salvar senha'
                                checked={checked}
                                containerStyle={{ backgroundColor: 'transparent' }}
                                checkedColor='#3c812e'
                                onPress={() => gravaCredeciais()}
                            />
                        </View>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={() => { loginHandle(valueImpuEmail, data.password) }} >
                            <LinearGradient colors={['#56BA42', '#3c812e']} style={styles.signIn} >
                                <Text style={[styles.textSign, { color: '#fff' }]}>Logar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ConfirmaPoliticaPrivacidade')}
                            style={[styles.signIn, { borderColor: '#3c812e', borderWidth: 1, marginTop: 15 }]}
                        >
                            <Text style={[styles.textSign, { color: '#3c812e' }]}>Inscrever-se</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={[styles.signIn, { marginTop: 15 }]} onPress={() => navigation.navigate('RootApresentacao')} >
                            <LinearGradient colors={['#56BA42', '#3c812e']} style={styles.signIn} >
                                <Text style={[styles.textSign, { color: '#fff' }]}>Cancelar</Text>
                            </LinearGradient>
                        </TouchableOpacity> */}

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
        backgroundColor: '#3c812e',
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    footer: {
        flex: 3,
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
        marginTop: 40
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
    }
});


