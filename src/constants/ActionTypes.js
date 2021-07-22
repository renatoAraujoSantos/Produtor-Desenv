
export const LINK_API_SPRING = 'http://192.168.15.22:8083';
//export const LINK_API_SPRING = 'http://34.95.243.252:8080/produtor';



// principais
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// se está logado ou nao
export const IS_LOGGED = 'IS_LOGGED';

// se há erros no momento do login
export const LOGIN_HAS_ERROR = 'LOGIN_HAS_ERROR';

// se está sendo executada uma call
export const LOGIN_IS_LOADING = 'LOGIN_IS_LOADING';

//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ MENSAGENS GENERICAS DO SISTEMA  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
    export const MESSAGE_SEM_CONEXAO_COM_INTERNET = 'Sem Conexão com a Internet'; 
    export const MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET = 'Favor Verificar sua Conexão'; 

    export const MESSAGE_TIME_OUT_BACK_END = 'Sem comunicação com servidor'; 
    export const MESSAGE_DETALHE_TIME_OUT_BACK_END = 'Favor tentar mais tarde'; 

    export const MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS = 'Informações incorretas'; 
    export const MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS = 'Verifique os dados enviados e tente mais tarde'; 

    export const MESSAGE_ERRO_NAO_ESPERADO = 'Erro não esperdo'; 
    export const MESSAGE_DETALHE_ERRO_NAO_ESPERADO = 'Favor entrar em contato com seu gestor'; 

    export const MESSAGE_EMAIL_NAO_EXISTE = 'E-mail não localizado'; 
    export const MESSAGE_DETALHE_EMAIL_NAO_EXISTE = 'O e-mail informado não foi localizado na base de dados'; 

    export const MESSAGE_CODIGO_NAO_ENVIADO = 'Código não enviado'; 
    export const MESSAGE_DETALHE_CODIGO_NAO_ENVIADO = 'Ocorreu um problema ao enviar o código para o nº informado'; 

    export const MESSAGE_CODIGO_NAO_ENVIADO_EMAIL = 'Código não enviado'; 
    export const MESSAGE_DETALHE_CODIGO_NAO_ENVIADO_EMAIL = 'Ocorreu um problema ao enviar o código para seu e-mail'; 

    export const IMAGEM_SELECIONADA = 'IMAGEM_SELECIONADA';  
    export const LIMPAR_IMAGEM_SELECIONADA = 'LIMPAR_IMAGEM_SELECIONADA';  
    export const EXCLUI_ITEM_ARRAY_IMAGEM_UPLOAD = 'EXCLUI_ITEM_ARRAY_IMAGEM_UPLOAD';  


//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█


//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ TRATAMENTO DE MENSAGENS  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
    
    export const SUCESSO_NA_REQUISICAO = '02'; 
    export const PARAMETROS_DE_ENVIO_INCORRETOS = '04';    
    export const SUCESSO_NA_AUTENTICACAO_CODIGO = '05';    
    export const SEM_CONEXAO_COM_INTERNET = '08'; 
    export const EMAIL_NAO_LOCALIZADO_NA_BASE = '09'; 
    export const TIME_OUT_BACK_END = '41';    
    export const REFRESH_TOKEN_EXPIRADO = '16'; 
    export const FALHA_NA_AUTENTICACAO = '42'; 


    //═══════════════════ TELA ConfirmarCodigoEmail ═══════════════════════
    export const SUCESSO_CODIGO_VALIDACAO_ENVIADO = '01'; 
    export const CODIGO_NAO_CONFERE_COM_CODIGO_EMAIL = '03'; 

    //═══════════════════ TELA AlteracaoSenha ═══════════════════════
    export const SUCESSO_ALTERACAO_SENHA_USUARIO = '10'; 
    export const ERRO_ALTERACAO_SENHA_USUARIO = '11'; 

    //═══════════════════ TELA LoginApp ═══════════════════════
    export const TELA_AUTENTICACAO_SUCESSO_AO_EFETUAR_LOGIN = '12'; 
    export const TELA_AUTENTICACAO_ERRO_NA_TENTATIVA_DE_EFETUAR_LOGIN = '13'; 

    //═══════════════════ TELA NOVO CADASTRO ═══════════════════════
    export const SUCESSO_VALIDACAO_EMAIL_NOVO_USURIO = '14'; 
    export const ERRO_VALIDACAO_EMAIL_NOVO_USURIO = '15'; 

//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
