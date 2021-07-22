//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ RETORNA REFRESH-TOKEN ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

    // ═════════════════════════ O REFRESH-TOKEN VEM COM OUTRAS INFORMACOES, AQUI EU LIMPO ═════════════════════════
    export async function retornaRefreshTokenAplicacao (param) {
        var resultado = '';
        var verificaEspacoNome = '';
        try { 
            var xxx = JSON.stringify(param);
            xxx = xxx.replace('set-cookie','setCookie');
            xxx = xxx.replace('refreshToken=','');
            const xxx2b = JSON.parse(xxx);
            const refreshTokenComInformacoesDesnecessarias = xxx2b.setCookie[0];
            //console.log(' ----> ----> ----> ----> ----> ----> ----> ----> ---->', xxx2b.setCookie[0]);

            for (let i=0; i <= refreshTokenComInformacoesDesnecessarias.length; i++) {
                verificaEspacoNome = refreshTokenComInformacoesDesnecessarias.substring(i, i+1);            
                if(verificaEspacoNome === ' '){
                    resultado = refreshTokenComInformacoesDesnecessarias.substring(0, i-1) ;
                    break;
                }                                                                       
            }
            //console.log(' resultado ---->', resultado);
        } catch (error) {
            console.error("Erro na classe util/RefreshToken  ", error.message);
        }
        return resultado;                
    }

//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█