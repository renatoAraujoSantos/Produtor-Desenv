import React from 'react';
import { View, Text, Button, TouchableOpacity, Dimensions, TextInput,
    Platform, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Api from '../../../store/ApiSpring';
import Loader from '../../../components/loading/Loader';
import * as ActionTypes from '../../../constants/ActionTypes';
import SnackBarPaper from '../../../components/snackBar/SnackBarPaper';
import{ AuthContext } from '../../../components/context';

export default function ValidarCodigo({ route, navigation }) {

    const { signOut } = React.useContext(AuthContext);

    const [loading, setLoading] = React.useState(false);
    const [mensagem, setMensagem] = React.useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = React.useState('');
    const [visible, setVisible] = React.useState(false);
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [checkTextInputChange, setCheckTextInputChange] = React.useState(false);
    const [valueCodigo, setValueCodigo] = React.useState('');
    const [messageImputCodigo, setMessageImputCodigo] = React.useState('');
    const [isValidCodigo, setIsValidCodigo] = React.useState(false);

    const [idCodigoValidacaoP, setIdCodigoValidacaoP] = React.useState(null);
    const [messageDestinoCodigo, setMessageDestinoCodigo] = React.useState('');
    const [telaOrigem, setTelaOrigem] = React.useState('');
    

    React.useEffect(() => {
        async function fetchData() {
            try {
                const unsubscribe = navigation.addListener('focus', async () => {
                    setMessageDestinoCodigo('');
                    const { objetoCodigoValidacao } = route.params;
                    const { telaOrigem } = route.params;                                            

                    setTelaOrigem(telaOrigem);

                    if(objetoCodigoValidacao.emailDestino != null){
                        setMessageDestinoCodigo(`O código enviado para o e-mail: ${objetoCodigoValidacao.emailDestino}`);                        
                    }

                    if(objetoCodigoValidacao.telefoneDestino != null){
                        setMessageDestinoCodigo(`O código enviado via SMS para o nº: ${objetoCodigoValidacao.telefoneDestino}`);
                        //setMessageDestinoCodigo(`O código enviado via SMS para o nº: ${'(55)55555-5555'}`);
                    }                    
                    setIdCodigoValidacaoP(objetoCodigoValidacao.idCodigoValidacao);
                });
                setLoading(false);
            } catch (e) {
                setLoading(false);
                console.warn(e);
            }
        }
        fetchData();
    }, [navigation]);

    const textInputChange = (val) => {
        setValueCodigo(val);
    }

    const validarCodigo = async () => {
        const { objetoCodigoValidacao } = route.params;

        if (valueCodigo.trim().length < 4) {
            setMessageImputCodigo(valueCodigo.trim().length === 0 ? 'Campo obrigatório.' : 'Mínimo é de 4 caracteres.');
            setIsValidCodigo(true);
            return;
        } else {
            setMessageImputCodigo('');
            setIsValidCodigo(false);
        }

        setLoading(true);
        const jsonCodValidacao = {
            idCodigoValidacao: objetoCodigoValidacao.idCodigoValidacao,
            codigo: valueCodigo,
        }
        const response = await Api.putRequestSemAccessToken(`envioCodigoValidacao/validarCodigoEnviado`, `PUT`, jsonCodValidacao);
        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            setLoading(false);
            if(telaOrigem === 'EsqueciSenhaScreen'){
                navigation.navigate('RedefinirSenha', { 'objetoCodigoValidacaoRedefinirSenha': response.respostaRequisicao.data });
            }


            
            if(telaOrigem === 'CadastroUsuario'){
                alertMenssagem();                
            }            
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
            setMessageImputCodigo('Código informado está incorreto');
            setIsValidCodigo(true);

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
    }

    const alertMenssagem = () => {
        Alert.alert(
            'Código validado com sucesso!',
            'Informe suas credenciais na tela de login',
            [
                { text: "OK", onPress: () => navigation.navigate('Login') }
            ],
            { cancelable: false }
        );
    };

    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };

    return (
        <View style={styles.container}>
            <Loader loading={loading} />            
            <View style={styles.header}>
                <Text style={styles.text_header}>Validação de Código</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={styles.text_footer}>Código</Text>
                    <View style={styles.action}>
                        <FontAwesome name="key" color="#05375a" size={20} />
                        <TextInput
                            placeholder="Seu código"
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {checkTextInputChange ?
                            <Animatable.View animation="bounceIn"  >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    {!isValidCodigo ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{messageImputCodigo}</Text>
                        </Animatable.View>
                    }

                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            Insira seu código de validação
                        </Text>
                    </View>
                    <View style={styles.textPrivateSelection}>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{messageDestinoCodigo}</Text>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            //onPress={() => {}}
                            onPress={validarCodigo}
                        >
                            <LinearGradient
                                colors={['#56BA42', '#3c812e']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Continuar</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack() }
                            //onPress={() => navigation.navigate('Login')}
                            style={[styles.signIn, {
                                borderColor: '#3c812e',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#3c812e'
                            }]}>Voltar</Text>
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
        height: 50,
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
    color_textPrivate: {
        color: 'grey',
        fontSize: 18,
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },

});
