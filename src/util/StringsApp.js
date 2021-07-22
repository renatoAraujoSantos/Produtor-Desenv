import AsyncStorage from '@react-native-async-storage/async-storage';
import decode from 'jwt-decode';

//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ INFORMACOES ACCESS_TOKEN ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

    // ════════════════════════════ NOME USUARIO NA TELA ════════════════════════════════
    // ═══════════════════════ CORTO O NOME NO PRIMEITO ESPACO ══════════════════════════
    // ═════ POREM SE O NOME FOR MUITO EXENSO CORTO AO CHEGER EM 15 CARACTERES ══════════
    export async function getNomeUsuarioLogado () {
        const quantidadeCaracteresNomeUsuario = 15;
        var verificaEspacoNome = '';        
        var nomeLoop = '';
        var resultadoNomeUsuario = '';
        try {        
            const res2 = await new Promise(resolve => {resolve(   AsyncStorage.getItem('access_token')   )}); 
            
            if (res2 != null){
                const tokenDecoder = decode(res2);                
                const nomeUserX2 = tokenDecoder.nomeUsuario;
                
                for (let i=0; i <= nomeUserX2.length; i++) {

                    verificaEspacoNome = nomeUserX2.substring(i, i+1);
        
                    if(i < quantidadeCaracteresNomeUsuario){
                        if(verificaEspacoNome === ' '){
                            nomeLoop = nomeUserX2.substring(0, i) ;
                            break;
                        }                                          
                    }else {
                        nomeLoop = nomeUserX2.substring(0, i) + '...';                        
                        break;
                    }                
                }
        
                // ════════════ CONVERTENDO O NOME PARA MINUSCULO POR QUE VEM DO BANCO TUDO MAIUSCULO ══════════
                const primeiraLetra = nomeLoop.substring(0, 1);
                const aposPrimeiraLetra = nomeLoop.substring(1, nomeLoop.length);

                resultadoNomeUsuario = primeiraLetra + aposPrimeiraLetra.toLowerCase();
//                console.log('-----',resultadoNomeUsuario);
            }
        } catch (error) {
            console.error("Error na classe stringsApp metodo getNomeUsuarioLogado");
        }

        return resultadoNomeUsuario;
                
    }


    export async function formataNomeUsuario (nome) {
        const quantidadeCaracteresNomeUsuario = 15;
        var verificaEspacoNome = '';        
        var nomeLoop = '';
        var resultadoNomeUsuario = '';
        try {        
                            
                const nomeUserX2 = nome;
                
                for (let i=0; i <= nomeUserX2.length; i++) {

                    verificaEspacoNome = nomeUserX2.substring(i, i+1);
        
                    if(i < quantidadeCaracteresNomeUsuario){
                        if(verificaEspacoNome === ' '){
                            nomeLoop = nomeUserX2.substring(0, i) + '!';
                            break;
                        }                                          
                    }else {
                        nomeLoop = nomeUserX2.substring(0, i) + '...';                        
                        break;
                    }                
                }
        
                // ════════════ CONVERTENDO O NOME PARA MINUSCULO POR QUE VEM DO BANCO TUDO MAIUSCULO ══════════
                const primeiraLetra = nomeLoop.substring(0, 1);
                const aposPrimeiraLetra = nomeLoop.substring(1, nomeLoop.length);

                resultadoNomeUsuario = primeiraLetra + aposPrimeiraLetra.toLowerCase();
//                console.log('-----',resultadoNomeUsuario);                     
            
        } catch (error) {
            console.error("Error na classe stringsApp metodo getNomeUsuarioLogado");
        }

        return resultadoNomeUsuario;
                
    }


//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█