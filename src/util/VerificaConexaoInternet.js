import NetInfo from '@react-native-community/netinfo';

//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ VERIFICA CONEXAO INTERNET ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

    // ═════════════════════════ VERIFICO SE EXISTE CONEXAO COM INTERNET ═════════════════════════
    export async function getVerificaConexaoInternet () {
        var resultadoConnection = '';        
        try { 
            resultadoConnection = NetInfo.fetch().then(state => {
                // console.log("Connection type", state.type);
                // console.log("Is connected?", state.isConnected);
                // console.log("SSID", state.details);  
                return state; 
            });
        } catch (error) {
            console.error("Error na classe VerificaConexaoInternet");
        }

        return resultadoConnection;
                
    }

//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█