import { Alert } from 'react-native';
import { API_URL } from './Config';
import * as Api from '../../store/ApiSpring';
import * as ActionTypes from '../../constants/ActionTypes';

export async function fetchPublishableKey( paymentMethod ) {
  try {

    let publishableKey = '';
    const response = await Api.getAll(`api/buscarPublishableKey`, `GET`);
    console.log('444444444444444444444', response.respostaRequisicao.data);

    if (response.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
      publishableKey = 'pk_test_51HucYHC6COgGmeocg92oYAHMMTEQZ5J9oCrNEuPEOH3frsfqX2EmLtFY7xCx5w4RzvlG1UJETOb37zvL0zoVcux900MA7Ed5Iq';

      return publishableKey;
  
    }
    // const response = await fetch(
    //   `${API_URL}/stripe-key?paymentMethod=${paymentMethod}`
    // );
    // const { publishableKey } = await response.json();    
    // return publishableKey;

  } catch (e) {
    console.warn('Não foi possível buscar a chave publicável. Seu servidor está funcionando?', e);  //   Unable to fetch publishable key. Is your server running
    Alert.alert(
      'Error',
      'Não foi possível buscar a chave publicável. Seu servidor está funcionando?'
    );
    return null;
  }
}
