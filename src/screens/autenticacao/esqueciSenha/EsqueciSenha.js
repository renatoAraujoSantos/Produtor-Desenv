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
import { RadioButton, Text as TextPaper } from 'react-native-paper';
import { mascaraTelefone, retiraMascaraMaterNumeros } from '../../../util/Masks';
import * as Api from '../../../store/ApiSpring';
import Loader from '../../../components/loading/Loader';
import * as ActionTypes from '../../../constants/ActionTypes';
import SnackBarPaper from '../../../components/snackBar/SnackBarPaper';


export default function EsqueciSenha({ navigation }) {

    const validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const [loading, setLoading] = React.useState(false);
    const [valueRadio, setValueRadio] = React.useState('first');
    const [showInputFone, setShowInputFone] = React.useState(true);

    const [validacaoEmailAoSairDoImput, setValidacaoEmailAoSairDoImput] = React.useState(false);
    const [nameIconImput, setNameIconImput] = React.useState('x-circle');
    const [colorIconImput, setColorIconImput] = React.useState('red');
    const [isValidEmail, setValidEmail] = React.useState(false);
    const [messageEmail, setMessageEmail] = React.useState('');

    const [validacaoAoSairDoImputFone, setValidacaoAoSairDoImputFone] = React.useState(false);
    const [nameIconImputFone, setNameIconImputFone] = React.useState('x-circle');
    const [colorIconImputFone, setColorIconImputFone] = React.useState('red');
    const [isValidFone, setValidFone] = React.useState(false);
    const [valueTelefone, setValueTelefone] = React.useState('');
    const [messageImputFone, setMessageImputFone] = React.useState('');

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
    });

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
        setValidacaoAoSairDoImputFone(true);
        if (val.trim().length >= 15) {
            setNameIconImputFone('check-circle');
            setColorIconImputFone('green');            
        } else {
            setNameIconImputFone('x-circle');
            setColorIconImputFone('red');            
        }
    }

    const recuperacaoDeSenha = async () => {
        try {                       
            const validacaoEmail = validateEmail(data.username);            
            if (!validacaoEmail) {
                setMessageEmail(data.username.trim().length === 0?'Campo obrigatório.':'Preenchimento de e-mail incorreto.');
                setValidEmail(true);
                return;
            }else{
                setMessageEmail('');
                setValidEmail(false);
            }
            
            if (valueTelefone.trim().length < 15 && showInputFone === true) {
                setMessageImputFone(valueTelefone.trim().length === 0? 'Campo obrigatório.':'Mínimo é de 11 caracteres.');
                setValidFone(true);
                return;
            }else{
                setMessageImputFone('');
                setValidFone(false);
            };
            
            setLoading(true);

            //console.log('8888888888888--------------99999999999999', data.username);
            const response2 = await Api.getAllSemAccessToken(`usuarios/usuarioSemAccessTokem?email=${data.username}`, `GET`);            
            const num = response2.numeroStatusResposta;
            if (response2.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {

                const idUsuarioP = response2.respostaRequisicao.data[0].idUsuario;
                const idEmpresaP = response2.respostaRequisicao.data[0].idEmpresa;

                const telx3 = retiraMascaraMaterNumeros(valueTelefone);
                const jsonCodValidacao = {
                    idUsuario: idUsuarioP,
                    idEmpresa: idEmpresaP,
                    origemRequisicao: 'AUTENTICACAO DE SENHA',
                    telefoneDestino: `${telx3}`,
                    enviarParaTelefone: showInputFone === true? 'true' : 'false',
                    enviarParaEmail: showInputFone === true? 'false' : 'true',
                }

                const responseCodValidacao = await Api.postRequestSemAccessToken(`envioCodigoValidacao`, `POST`, jsonCodValidacao);  
                //console.log('000000000000000000000000000000000000000', responseCodValidacao.respostaRequisicao.data);
                if (responseCodValidacao.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) { 
                    if(showInputFone === true){
                        if(responseCodValidacao.respostaRequisicao.data.statusEnvioSms === 'false'){                               
                            await validaMensagem('04', 'envioSms');
                            setLoading(false);  
                            return;          
                        }
                    }else{
                        if(responseCodValidacao.respostaRequisicao.data.statusEnvioEmail === 'false'){                            
                            await validaMensagem('04', 'envioEmail');
                            setLoading(false);  
                            return;           
                        }
                    }                                  
                    navigation.navigate('ValidarCodigoScreen', { 'objetoCodigoValidacao': responseCodValidacao.respostaRequisicao.data, 'telaOrigem': 'EsqueciSenhaScreen' });   
                }
                setLoading(false);
            }else{
                await validaMensagem(num, 'verificaEmailNaBase');
                setLoading(false);
                return;
            };            
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.warn(e);
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
            if(x === 'verificaEmailNaBase'){
                setMessageEmail('E-mail não localizado na base de dados.');
                setValidEmail(true);
                Alert.alert(ActionTypes.MESSAGE_EMAIL_NAO_EXISTE, ActionTypes.MESSAGE_DETALHE_EMAIL_NAO_EXISTE, [
                    { text: 'Ok' }
                ]);    
            }
            if(x === 'envioSms'){
                setMessageImputFone('Não foi possível enviar o código para o nº informado.');
                setValidFone(true);
                Alert.alert(ActionTypes.MESSAGE_CODIGO_NAO_ENVIADO, ActionTypes.MESSAGE_DETALHE_CODIGO_NAO_ENVIADO, [
                    { text: 'Ok' }
                ]);    
            };
            if(x === 'envioEmail'){
                setMessageEmail('Ocorreu um problema ao enviar o código para seu email.');
                setValidFone(true);
                Alert.alert(ActionTypes.MESSAGE_CODIGO_NAO_ENVIADO_EMAIL, ActionTypes.MESSAGE_DETALHE_CODIGO_NAO_ENVIADO_EMAIL, [
                    { text: 'Ok' }
                ]);    
            };
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

    const valueRadioFunction = (val) => {        
        setValueRadio(val);
        if (val === 'first') {
            setShowInputFone(true);
        } else {
            setShowInputFone(false);
        }
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />            
            <View style={styles.header}>
                <Text style={styles.text_header}>Redefinir Senha!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>

                

                    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 1, marginBottom: 10}}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Informe seu e-mail e telefone</Text>
                    </View>


                    <Text style={styles.text_footer}>E-mail</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Seu E-mail"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}                            
                        />
                        {validacaoEmailAoSairDoImput ?
                            <Animatable.View animation="bounceIn"  >
                                <Feather
                                    name={nameIconImput}
                                    color={colorIconImput}
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {!isValidEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{messageEmail}</Text>
                        </Animatable.View>
                    }

                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            Selecione onde receber o código de Validação
                        </Text>
                    </View>

                    <View style={styles.radioButtonSelection}>
                        <RadioButton.Group
                            onValueChange={value => valueRadioFunction(value)}                            
                            value={valueRadio}
                        >
                            <View>
                                <TextPaper>Telefone</TextPaper>
                                <RadioButton value="first" />
                            </View>
                            <View>
                                <TextPaper>E-mail</TextPaper>
                                <RadioButton value="second" />
                            </View>
                        </RadioButton.Group>
                    </View>


                    {showInputFone ? (
                        <View>
                            <Text style={styles.text_footer}>Telefone com DDD</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="phone"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder="(XX)99999-9999"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handleTelefoneChange(val)}
                                    value={valueTelefone}
                                    //onEndEditing={(e) => handleValidFone(e.nativeEvent.text)}
                                    keyboardType="number-pad"
                                />
                                {validacaoAoSairDoImputFone ?
                                    <Animatable.View animation="bounceIn" >
                                        <Feather
                                            name={nameIconImputFone}
                                            color={colorIconImputFone}
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : null}
                            </View>
                            {!isValidFone ? null :
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>{messageImputFone}</Text>
                                </Animatable.View>
                            }
                        </View>
                    ) : null}

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={recuperacaoDeSenha} >
                            <LinearGradient
                                colors={['#56BA42', '#3c812e']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, { color: '#fff' }]}>Continuar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#3c812e',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#3c812e'
                            }]}>Logar</Text>
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
    radioButtonSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 90,
        marginBottom: 15
    },
    color_textPrivate: {
        color: 'grey'
    }
});
