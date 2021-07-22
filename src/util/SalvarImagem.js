import * as ImageManipulator from "expo-image-manipulator";
import moment from 'moment';
import FormData from 'form-data';
import * as Api from '../store/ApiSpring';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ActionTypes from '../constants/ActionTypes';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';

//╔═══════════════════════════════════════════════════════════════════════════╗
//   SALVANDO IMAGEM
//╚═══════════════════════════════════════════════════════════════════════════╝
export async function UploadImage(param) {        
    var resultado = false;
    console.log('111112288888888888888888888888888888888888888888888888888888888888', param);
    try {            
        const nomeUser = await AsyncStorage.getItem('nomeUsuarioLogado');                
        const image = await new Promise(resolve => {resolve(   param   )});
        let nomeImagem = '';
        if(image.idTipoAnexo === 1){
            nomeImagem = 'Imagem-Sistema';
        }else if(image.idTipoAnexo === 2){
            nomeImagem = 'Perfil-Usuario';
        }else if(image.idTipoAnexo === 3){
            nomeImagem = 'Galeria-Produto';
        }else if(image.idTipoAnexo === 4){
            nomeImagem = 'Capa-Produto';
        }else{
            nomeImagem = 'Nao-Classificada';
        }
        //═══════ ESSE CARA E PRA REDUZIR O TAMANHO DA IMAGEM ══════════════        
        const manipResult = await ImageManipulator.manipulateAsync(
            image.fileDownloadUri || image.uri,                
            [{ resize: { width: 600 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.PNG }
        );                                
        var dataAtual = moment().format("YYYY-MM-DD");
        const stringImagem = JSON.stringify(manipResult);            
        var numero_aleatorio = Math.random();
        numero_aleatorio = Math.floor(numero_aleatorio * 100000);
        var yyyrrr = JSON.parse(stringImagem);
        var jsonData44 = {
            "file": [yyyrrr]
        };            
        var data4455 = jsonData44.file.map(function (item) {
            return {
                name: `${nomeImagem}-${dataAtual}-${numero_aleatorio}.png`,
                uri: item.uri,
                type: 'image/PNG',
                nome: nomeUser,
                descricao: 'Imagem Perfil Usuario',
            };
        });        
        const formData = new FormData();
        formData.append('file', data4455[0]);
        const responseUploadImagem = await Api.uploadImagem(`uploadFile`, `POST`, formData);
        //console.log('11111222223333444444444455555555555666666666666666', responseUploadImagem.respostaRequisicao.data);
        const responseImagemSalva = await new Promise(resolve => {resolve(   responseUploadImagem   )});
        return responseImagemSalva;
    } catch (error) {
        console.log('Erro na classe util/SalvarImagem/UploadImagem ', error);
        return null;
    }
}

export async function CarregaImagemPerfilUsuario() {
    try {        
        var urlImagemPerfilP = '';
        var idUrlAnexoArquivoP = 0; 
        var acaoTabelaP  = '';
        const idUsuarioP = await AsyncStorage.getItem('idUsuario');
        const idTipoAnexo = 2; // 2 É IMAGEM DE PERFIL 
        const response = await Api.getAll(`urlAnexoArquivo?idUsuario=${idUsuarioP}&idTipoAnexo=${idTipoAnexo}`, `GET`);        
        if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            if (response.respostaRequisicao.data.length > 0) {  
                
                urlImagemPerfilP = `${ActionTypes.LINK_API_SPRING}${response.respostaRequisicao.data[0].url}`;
                acaoTabelaP = 'UPDATE';
                idUrlAnexoArquivoP = response.respostaRequisicao.data[0].idUrlAnexoArquivo;
                                    
            } else {
                urlImagemPerfilP = UrlImagensSistema.URL_IMAGEM_NAO_EXISTE;
                acaoTabelaP = 'INSERT';
            }
        }else{
            urlImagemPerfilP = UrlImagensSistema.URL_IMAGEM_NAO_EXISTE;
            //acaoTabelaP = 'INSERT';
        }
    } catch (error) {
        console.log('Erro na classe SalvarImagem/CarregaImagemPerfilUsuario ', error);
        urlImagemPerfilP = UrlImagensSistema.URL_IMAGEM_NAO_EXISTE;
    }
    await AsyncStorage.setItem('imagemPerfilUserLogado', urlImagemPerfilP);
    //const sssss = await AsyncStorage.getItem('imagemPerfilUserLogado');
    //console.log('22222222222222222222222222222222222-------------------------------------------------------------------------------- ', sssss);
    const jsonResult = {
        urlImagemPerfil: urlImagemPerfilP,
        idUrlAnexoArquivo: idUrlAnexoArquivoP,  // ESSE CARA É USADO NA TELA EditProfile
        acaoTabela: acaoTabelaP,  // ESSE CARA É USADO NA TELA EditProfile
    }    
    return jsonResult;
}


export async function AlterandoValorArray() {    
    var result = '';

    const usersList = [
        {name: 'João', credit: 500},
        {name: 'Maria', credit: 800}
    ];

    const newUsersList = usersList.map((user, index, array) => {
        user.credit += 100;
        user.name = 'Novo Nome';
        return user;
    });

    result = newUsersList;
    
    return result;
  }