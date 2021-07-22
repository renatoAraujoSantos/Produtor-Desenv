import axios from 'axios';
import * as ActionTypes from '../constants/ActionTypes';
import decode from 'jwt-decode';
import { retornaRefreshTokenAplicacao } from './RefreshToken';
import { getVerificaConexaoInternet } from './VerificaConexaoInternet';
import * as Api from '../store/ApiSpring';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';

const timeOutBackEnd = 1000 * 10;   // tempo de espera do back ex: 1000 * 10 referente a 10 segundos  --- pesquisar por canceltoken

const getTesteConnection = async () => {
    const testConnection = await new Promise(resolve => { resolve(getVerificaConexaoInternet()) });
    return testConnection;
};

//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
//    CLASS RESPONSAVÉL POR:
//         VALIDADE DO ACCESS_TOKEN
//         ATUALIZAR ACCESS_TOKEN CASO O TOKEN ESTEJA EXPIRADO UTILIZANDO REFRESH_TOKEN
//         VALIDAR O ExponentPushToken, OU SEJA, MANTER O APARELHO DO USUARIO SINCRONIZADO
//               PARA QUE RECEBA AS NOTIFICAÇÕES NO APARELHO ATUAL
//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█



//╔═══════════════════════════════════════════════════════════════════════════╗
//   VALIDACAO DA AUTENTICACAO DO USUARIO
//╚═══════════════════════════════════════════════════════════════════════════╝
export async function ValidarUsuario() {        
    var resultado = false;
    try {    
        const tokenUser = await AsyncStorage.getItem('access_token');        
        if (tokenUser !== null) {                
            const res = await verificaValidadeAccessToken();
            resultado = res;
            const verificado = await pesquisaExpoNotificationPorUsuario();            
            if(!verificado){
                resultado = false;
            }                                        
        }
    } catch (error) {
        console.error("Erro na classe util/ValidarUsuario  ", error.message);
    }
    return resultado;
}

const verificaValidadeAccessToken = async () => {
    var validation = true;
    let accessTokenV = null;
    let refreshTokenV = null;
    try {
        //╔═════════════════════════════════════════════════╗
        //   VERIFICAR SE O ACCESS_TOKEN ESTÁ EXPIRADO
        //╚═════════════════════════════════════════════════╝
        const accessToken = await new Promise(resolve => { resolve(AsyncStorage.getItem('access_token')) });
        const tokenDecoder = decode(accessToken);
        if (Date.now() >= tokenDecoder.exp * 1000) {
            console.log('----> ----> ACCESS_TOKEN EXPIRADOOOOOOOOO ----> ----> **********************************');
            
            const refresToken = await new Promise(resolve => { resolve(AsyncStorage.getItem('refresh_token')) });
            const refreshTokenDecoder = decode(refresToken);
            //╔═════════════════════════════════════════════════╗
            //   VERIFICAR SE O REFRESH_TOKEN ESTÁ EXPIRADO
            //╚═════════════════════════════════════════════════╝            
            if (Date.now() >= refreshTokenDecoder.exp * 1000) {                
                const emailUsuarioLogado = await new Promise(resolve => { resolve(AsyncStorage.getItem('emailUsuarioLogadoParaUtenticacao')) });
                const senhaUsuarioLogado = await new Promise(resolve => { resolve(AsyncStorage.getItem('senhaUsuarioLogadoParaUtenticacao')) });
                const data = `username=${emailUsuarioLogado}&password=${senhaUsuarioLogado}&grant_type=password`;                        
                const response = await new Promise(resolve => { resolve(Api.postAutenticacaoApp(data, `POST`)) });
                if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
                    accessTokenV = await new Promise(resolve => { resolve(response.respostaRequisicao.data.access_token) });
                    refreshTokenV = await retornaRefreshTokenAplicacao(response.respostaRequisicao.headers);
                }
            }else{
                //╔═══════════════════════════════════════════════════════════════╗
                //   REFRESH_TOKEN NÃO ESTA EXPIRADO, VOU RENOVAR O ACCESS_TOKEN
                //╚═══════════════════════════════════════════════════════════════╝            
                const response = await postRefApp();                
                accessTokenV = await new Promise(resolve => { resolve(   response.respostaRequisicao.data.access_token   )});
                refreshTokenV = await retornaRefreshTokenAplicacao(response.respostaRequisicao.headers);
            }
            
            await new Promise(resolve => { resolve(AsyncStorage.setItem('access_token', `${accessTokenV}`)) });
            await new Promise(resolve => { resolve(AsyncStorage.setItem('refresh_token', `${refreshTokenV}`)) });
        }
    } catch (error) {
        validation = false;
        console.log('Erro ao renovar access_token na classe ApiSpring/verificaValidadeAccessToken ', error.message);
    }
    return validation;
};


const postRefApp = async () =>{
//export async function postRefApp() {
    const refresToken = await new Promise(resolve => { resolve(AsyncStorage.getItem('refresh_token')) });
    //console.log(' 33333333333333333333333333333    ', refresToken);
    const data2r = `grant_type=refresh_token&refresh_token=${refresToken}`;
    const teste001Conection = await getTesteConnection();
    //console.log(' 444444444444444444444444444444444    ', teste001Conection);
    var res9 = null;
    try {
        if (teste001Conection.isConnected === true) {
            await axios({
                method: 'POST',
                url: `${ActionTypes.LINK_API_SPRING}/oauth/token`,
                timeout: timeOutBackEnd,
                headers: {
                    Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA==',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data2r
            }).then(response => {
                res9 = {
                    respostaRequisicao: response,
                    numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                }
            }).catch((err) => {
                if (err.response) {
                    res9 = {
                        respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                        numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                    }
                } else {
                    res9 = {
                        respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                        numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                    }
                }
            });
        } else {
            res9 = {
                respostaRequisicao: {},
                numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
            }
        }
    }
    catch (error) {
        console.log('Erro na configuracao axios no metotodo postRefApp ', error);
    }
    return res9;
}


//╔═══════════════════════════════════════════════════════════════════════════╗
//   COMPARANDO O ExponentPushToken DO APARELHO COM O GRAVADO NO BANCO
//   ESSA MUDANÇA PODE ACONTECER QUANDO O USUARIO FAZ LOGIN EM OUTRO APARELHO,
//   OU ALUMA ATUALIZAÇÃO DO APLICATIVO
//╚═══════════════════════════════════════════════════════════════════════════╝
const pesquisaExpoNotificationPorUsuario = async () => {
    let resultado = false;
    try {        
        const idUsuario = await AsyncStorage.getItem('idUsuario');
        const idEmpresa = await AsyncStorage.getItem('idEmpresa');

        const response = await new Promise(resolve => {resolve(   Api.getAll(`expoNotification?idEmpresa=${idEmpresa}&idUsuario=${idUsuario}`, `GET`)   )});
        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            const expoToken = response.respostaRequisicao.data.tokenExpoDestino;
            const tokenExpoNotification2 = await AsyncStorage.getItem('tokenExpoNotification');              
            console.log(' ---------> VERIFICANDO EXPO SE ESTA NO MESMO APARELHO <-----------');
            console.log(' ---------> EXPO TOKEN NA BASE DE DADOS ', expoToken);
            console.log(' --------------> EXPO TOKEN DO APARELHO ', tokenExpoNotification2);

            if(expoToken !== tokenExpoNotification2){
                resultado = false;
                console.log(' ---------> EXPO NOTIFICATON ESTA DIFERENTE <-----------');
            }else{
                console.log(' ---------> EXPO NOTIFICATON CONFERE-- APARELHO ESTA IGUAL DA BASE <-----------');
                resultado = true;
            }        
        }        
    } catch (error) {
        console.log('Erro no metodo pesquisaExpoNotificationPorUsuario da classe ValidarAutenticacaoUser', error);
    }
    return resultado;    
}


//╔═══════════════════════════════════════════════════════════════════════════╗
//   LIMPANDO AS SESSÕES DO USUÁRIO, É CHAMADO QUANDO O USUÁRIO FAZ LOGOUT
//╚═══════════════════════════════════════════════════════════════════════════╝
export async function LogoutUsuario() {    
    //console.log('************************************************************');
    var resultado = true;
    try {            
        //await AsyncStorage.removeItem('avisoInicial');    // ESSE CARA FICA COMENTADO POR QUE E A APRESENTACAO INICIAL, OU SEJA, SO VAI SER APRESENTADO NA HORA DA INSTALACAO
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('emailUsuarioLogadoParaUtenticacao');
        await AsyncStorage.removeItem('senhaUsuarioLogadoParaUtenticacao');
        await AsyncStorage.removeItem('idUsuario');
        await AsyncStorage.removeItem('idEmpresa');
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.removeItem('nomeUsuarioLogado');        
        await AsyncStorage.removeItem('produtosCarrinho');
        await AsyncStorage.setItem('imagemPerfilUserLogado', UrlImagensSistema.URL_IMAGEM_NAO_EXISTE);
        //await AsyncStorage.removeItem('imagemPerfilUserLogado');    
    } catch (error) {
        console.error("Erro na classe util/ValidarUsuario metodo LogoutUsuario ", error.message);
    }
    return resultado;
}