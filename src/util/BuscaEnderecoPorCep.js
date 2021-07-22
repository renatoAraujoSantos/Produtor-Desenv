import * as ActionTypes from '../constants/ActionTypes';
import cep from 'cep-promise';


//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ BUSCA OS DADOS DO ENDERECO PELO CEP ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
    
    export async function getBuscaEnderecoPorCep (cepParam) {
        const s = JSON.stringify(cepParam)        
        var res = null;
        await cep(s)
            .then(response =>{
                res = {
                    respostaRequisicao: response,
                    numeroStatusResposta: ActionTypes.SUCESSO_NA_REQUISICAO,
                }                        
            }).catch((err) => {
                res = {
                    respostaRequisicao: err,
                    numeroStatusResposta: ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS,
                }                        
            });
        return res;                    
    }

//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█