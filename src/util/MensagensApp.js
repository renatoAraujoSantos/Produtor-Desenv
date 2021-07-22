import React, { useContext } from 'react';
import * as ActionTypes from '../constants/ActionTypes';

export default function MensagemApp(numeroMensagem) {
    
    switch (numeroMensagem) {

        // ═════════════════ ESSE CASO SE APLICA SEM CONEXAO COM A INTERNET ═════════════
        case ActionTypes.SEM_CONEXAO_COM_INTERNET: { 
            return {
                mensagem: ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET,
                mensagemDetalhe: ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET,            
            };
        };
        // ═════════════════ ESSE CASO SE APLICA TIMEOUT NA RESPOSTA DO BACK ═════════════
        case ActionTypes.TIME_OUT_BACK_END: { 
            return {
                mensagem: ActionTypes.MESSAGE_TIME_OUT_BACK_END,
                mensagemDetalhe: ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END,            
            };
        };
        // ═════════════════ ESSE CASO SE APLICA PARA INFORMAÇÕES INCORRETAS PARA O BACK ═════════════
        case ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS: { 
            return {
                mensagem: ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS,
                mensagemDetalhe: ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS,            
            };
        };







        case ActionTypes.SUCESSO_NA_REQUISICAO: { 
            return {
                mensagem: 'Código de validação enviado',
                mensagemDetalhe: 'Insira o código de validação na tela de confirmação',            
            };
        };
        case ActionTypes.SUCESSO_NA_AUTENTICACAO_CODIGO: { 
            return {
                mensagem: 'Validação concluida com sucesso.',
                mensagemDetalhe: 'Clique para acessar tela de alteração de senha',            
            };
        };
        case ActionTypes.SUCESSO_ALTERACAO_SENHA_USUARIO: { 
            return {
                mensagem: 'Senha alterada.',
                mensagemDetalhe: 'Sua senha foi alterada com sucesso!',            
            };
        };
        case ActionTypes.ERRO_ALTERACAO_SENHA_USUARIO: { 
            return {
                mensagem: 'Erro na alteração',
                mensagemDetalhe: 'Erro inesperado durando o processo de alteração de senha',            
            };
        };


        
        // ═════════════════ ERRO DO CLIENTE, TIPO USUÁRIO OU SENHA ERRADO ═════════════
        case ActionTypes.EMAIL_NAO_LOCALIZADO_NA_BASE: { 
            return {
                mensagem: 'Não localizamos esse e-mail na nossa base de dados.',
                mensagemDetalhe: 'Entre em contato com sua base e confirme as informações cadastradas. Você informou o seguinte e-mail: ',
            };
        };
        // ═════════════════ ERRO DO CLIENTE, TIPO USUÁRIO OU SENHA ERRADO ═════════════
        case ActionTypes.CODIGO_NAO_CONFERE_COM_CODIGO_EMAIL: { 
            return {
                mensagem: 'Código inválido.',
                mensagemDetalhe: 'O código não confere com o código que enviamos por e-mail, você informou o seguinte e-mail: ',
            };
        };
        case ActionTypes.TELA_AUTENTICACAO_ERRO_NA_TENTATIVA_DE_EFETUAR_LOGIN: { 
            return {
                mensagem: 'Login ou senha inválido.',
                mensagemDetalhe: 'Verifique as informações de autenticação!',
            };
        };
        case ActionTypes.TELA_AUTENTICACAO_SUCESSO_AO_EFETUAR_LOGIN: { 
            return {
                mensagem: 'Login efetuado com sucesso',
                mensagemDetalhe: 'AUTENTICADO',
            };
        };

        case ActionTypes.ERRO_VALIDACAO_EMAIL_NOVO_USURIO: { 
            return {
                mensagem: 'Não localizamos esse e-mail na nossa base de dados',
                mensagemDetalhe: 'Entre em contato com sua base e confirme as informações cadastradas. Você informou o seguinte e-mail:',
            };
        };
        
        default:            
            return {
                mensagem: ActionTypes.MESSAGE_ERRO_NAO_ESPERADO,
                mensagemDetalhe: ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO,            
            };
    }
}

