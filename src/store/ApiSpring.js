import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ActionTypes from '../constants/ActionTypes';
import { getVerificaConexaoInternet } from '../util/VerificaConexaoInternet';

const timeOutBackEnd = 1000 * 25;   // tempo de espera do back ex: 1000 * 10 referente a 10 segundos  --- pesquisar por canceltoken

const getAccessToken = async () => {
    const xx0021 = await new Promise(resolve => { resolve(AsyncStorage.getItem('access_token')) });
    return xx0021;
};

const getTesteConnection = async () => {
    const testConnection = await new Promise(resolve => { resolve(getVerificaConexaoInternet()) });
    return testConnection;
};


//════════════════════════ AUTENTICACAO ═══════════════════════════════
    export async function postAutenticacaoApp(endpoint, method) {
        const teste001Conection = await getTesteConnection();
        var res1 = null;
        try {
            if (teste001Conection.isConnected === true) {
                await axios({
                    method: method,
                    url: `${ActionTypes.LINK_API_SPRING}/oauth/token`,
                    //url: 'http://localhost:8080/oauth/token',
                    timeout: timeOutBackEnd,
                    headers: {
                        Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA==',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: endpoint
                }).then(response => {
                    res1 = {
                        respostaRequisicao: response,
                        numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                    }
                }).catch((err) => {
                    if (err.response) {
                        res1 = {
                            respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                            numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                        }
                    } else {
                        res1 = {
                            respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                            numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                        }
                    }
                });
            } else {
                res1 = {
                    respostaRequisicao: {},
                    numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
                }
            }
        }
        catch (error) {
            console.log('Erro na configuracao axios postAutenticacaoApp ', error);
        }
        return res1;
    }


    //════════════════════════ SELECT ═══════════════════════════════
    export async function getAll(endpoint, method) {        
        try {                                              
            const teste001Conection = await getTesteConnection();
            const token33 = await getAccessToken();
            var res10 = null;
        
            if (teste001Conection.isConnected === true) {
                await axios({
                    method: method,
                    url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                    timeout: timeOutBackEnd,
                    headers: { Authorization: `Bearer ${token33}` },
                    data: null
                }).then(response => {
                    res10 = {
                        respostaRequisicao: response,
                        numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                    }
                }).catch((err) => {
                    if (err.response) {
                        res10 = {
                            respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                            numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                        }
                    } else {
                        res10 = {
                            respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                            numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                        }
                    }
                });
            } else {
                res10 = {
                    respostaRequisicao: {},
                    numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
                }
            }
        }
        catch (error) {
            console.log('Erro no getAll na classe API ', error);            
        }
        return res10;
    }

    //════════════════════════ INSERT ═══════════════════════════════
    export async function postRequest(endpoint, method, list) {
        const teste001Conection = await getTesteConnection();
        const token22 = await getAccessToken();
        var res6 = null;
        try {
            if (teste001Conection.isConnected === true) {
                await axios({
                    method: method,
                    url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                    timeout: timeOutBackEnd,
                    headers: { Authorization: `Bearer ${token22}` },
                    data: list
                }).then(response => {
                    res6 = {
                        respostaRequisicao: response,
                        numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                    }
                }).catch((err) => {
                    if (err.response) {
                        res6 = {
                            respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                            numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                        }
                    } else {
                        res6 = {
                            respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                            numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                        }
                    }
                });
            } else {
                res6 = {
                    respostaRequisicao: {},
                    numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
                }
            }
        }
        catch (error) {
            console.log('Erro no postRequest na classe API ', error);
        }
        return res6;
    }

    //════════════════════════ UPDATE ═══════════════════════════════
    export async function putRequest(endpoint, method, list) {
        const teste001Conection = await getTesteConnection();
        const token22 = await getAccessToken();
        var res7 = null;
        try {
            if (teste001Conection.isConnected === true) {
                await axios({
                    method: method,
                    url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                    timeout: timeOutBackEnd,
                    headers: { Authorization: `Bearer ${token22}` },
                    data: list
                }).then(response => {
                    res7 = {
                        respostaRequisicao: response,
                        numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                    }
                }).catch((err) => {
                    if (err.response) {
                        res7 = {
                            respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                            numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                        }
                    } else {
                        res7 = {
                            respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                            numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                        }
                    }
                });
            } else {
                res7 = {
                    respostaRequisicao: {},
                    numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
                }
            }
        }
        catch (error) {
            console.log('Erro no putRequest na classe API ', error);
        }
        return res7;
    }

    //════════════════════════ UPLOAD DE IMAGENS ═══════════════════════════════
    export async function uploadImagem2(endpoint, method, formData) {
        const token22 = await getAccessToken();
        var res2 = null;
        try {
            await axios({
                method: method,
                url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                timeout: timeOutBackEnd,
                headers: {
                    Authorization: `Bearer ${token22}`,
                    'Content-Type': 'multipart/form-data',
                },
                data: formData
            }).then(response => {
                res2 = response;
            }).catch((err) => {
                res2 = err.response;
            });
        }
        catch (error) {
            console.log('Erro no uploadImagem na classe API ', error);
        }
        return res2;
    }


    //════════════════════════ UPLOAD DE IMAGENS ═══════════════════════════════
    export async function uploadImagem(endpoint, method, formData) {
        const teste001Conection = await getTesteConnection();
        const token22 = await getAccessToken();
        var res5 = null;
        try {
            if (teste001Conection.isConnected === true) {
                await axios({
                    method: method,
                    url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                    timeout: timeOutBackEnd,
                    headers: {
                        Authorization: `Bearer ${token22}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    data: formData
                }).then(response => {
                    res5 = {
                        respostaRequisicao: response,
                        numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                    }
                }).catch((err) => {
                    if (err.response) {
                        res5 = {
                            respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                            numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                        }
                    } else {
                        res5 = {
                            respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                            numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                        }
                    }
                });
            } else {
                res2 = {
                    respostaRequisicao: {},
                    numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
                }
            }
        }
        catch (error) {
            console.log('Erro no uploadImagem na classe API ', error);
        }
        return res5;
    }



//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█


//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ FUNCOES QUE NÃO PRECISAM DE AUTENTICÃO  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

//═════════════════════════════ INSERT SEM AUTENTICAÇÃO ════════════════════════════
export async function postRequestSemAccessToken(endpoint, method, list) {
    const teste001Conection = await getTesteConnection();
    var res2 = null;
    try {
        if (teste001Conection.isConnected === true) {
            await axios({
                method: method,
                url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                timeout: timeOutBackEnd,
                data: list
            }).then(response => {
                res2 = {
                    respostaRequisicao: response,
                    numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                }
            }).catch((err) => {
                if (err.response) {
                    res2 = {
                        respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                        numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                    }
                } else {
                    res2 = {
                        respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                        numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                    }
                }
            });
        } else {
            res2 = {
                respostaRequisicao: {},
                numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
            }
        }
    }
    catch (error) {
        console.log('Erro no postRequestSemAccessToken na classe API ', error);
    }
    return res2;
}

//════════════════════════ UPDATE SEM AUTENTICAÇÃO═══════════════════════════════
export async function putRequestSemAccessToken(endpoint, method, list) {    
    const teste001Conection = await getTesteConnection();
    var res3 = null;
    try {
        if (teste001Conection.isConnected === true) {
            await axios({
                method: method,
                url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                timeout: timeOutBackEnd,
                data: list
            }).then(response => {
                res3 = {
                    respostaRequisicao: response,
                    numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                }
            }).catch((err) => {
                if (err.response) {
                    res3 = {
                        respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                        numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                    }
                } else {
                    res3 = {
                        respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                        numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                    }
                }
            });
        } else {
            res3 = {
                respostaRequisicao: {},
                numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
            }
        }
    }
    catch (error) {
        console.log('Erro no putRequest na classe API ', error);
    }
    return res3;
}


//════════════════════════ SELECT SEM AUTENTICAÇÃO ═══════════════════════════════
export async function getAllSemAccessToken(endpoint, method) {
    const teste001Conection = await getTesteConnection();
    var res4 = null;
    try {
        if (teste001Conection.isConnected === true) {
            await axios({
                method: method,
                url: `${ActionTypes.LINK_API_SPRING}/${endpoint}`,
                timeout: timeOutBackEnd,
                data: null
            }).then(response => {
                res4 = {
                    respostaRequisicao: response,
                    numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                }
            }).catch((err) => {
                if (err.response) {
                    res4 = {
                        respostaRequisicao: err.response,  // AQUI SE APLICA EM CASO DE ERRO NA REQUISICAO
                        numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                    }
                } else {
                    res4 = {
                        respostaRequisicao: err,  // AQUI SE APLICA SE DER TIMEOUT NA RESPOSTA DO BACK
                        numeroStatusResposta: ActionTypes.TIME_OUT_BACK_END,
                    }
                }
            });
        } else {
            res4 = {
                respostaRequisicao: {},
                numeroStatusResposta: ActionTypes.SEM_CONEXAO_COM_INTERNET,
            }
        }
    }
    catch (error) {
        console.log('Erro no getAll na classe API ', error);
    }
    return res4;
}


//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█


