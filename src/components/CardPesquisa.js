import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import StarRating from './StarRating';
import { Avatar } from "react-native-elements";
import * as ActionTypes from '../constants/ActionTypes';


const CardPesquisa = ({itemData, onPress}) => {

  var corSelecionado = '#fff';
  var corFundo =  '#fff';
  var desabilitar = false;
  var imagemItemSelecionado = false;

  if(itemData.selecionado !== null && itemData.selecionado === true ){    
    corSelecionado = '#f0f0f0';
    corFundo = '#ee0e0';
    desabilitar = true;
    imagemItemSelecionado = true;
  }

  return (
    <TouchableOpacity disabled={desabilitar} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.cardImgWrapper}>
          <Image
            //source={itemData.url}
            
            source={{ uri: `${ActionTypes.LINK_API_SPRING}${itemData.url}` }}
            //source={{ uri: itemData.url }}
            resizeMode="cover"
            style={styles.cardImg}
          />

        </View>
        <View style={[styles.cardInfo, {backgroundColor: corSelecionado}]}>
          <Text style={styles.cardTitle}>{itemData.nomeProduto}</Text>
          <StarRating ratings={itemData.ratings} reviews={5} />
          <Text numberOfLines={2} style={styles.cardDetails}>Valor Unitário  {itemData.valorUnitarioMedida}</Text>
          <Text numberOfLines={2} style={styles.cardDetails}>Pedido Mínimo  {itemData.quantidadePedidoMinimoMedida}  {itemData.descricaoMedida}</Text>
          <Text numberOfLines={2} style={styles.cardDetails}>Quantidade Disponível  {itemData.quantidadeDisponivelMedida}</Text>

          {imagemItemSelecionado?
          <Avatar
              size="small"
              overlayContainerStyle={{backgroundColor: 'transparent'}}
              rounded
              //source={require('../../assets/images/banana.jpg')}
              //source={{ uri:  'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'  }}
              icon={{name: 'check', color: '#64e50c', type: 'font-awesome', size: 43}}
              //onPress={() => console.log("Works!")}
              activeOpacity={0.7}
              containerStyle={{position: 'absolute', right:15,  top: 15,  color: '#2d8425', zIndex: 1,  }}            
          />            
          : null}

        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardPesquisa;

const styles = StyleSheet.create({
  card: {
    height: 100,
    marginVertical: 10,
    flexDirection: 'row',
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    //backgroundColor: '#ee0e0',
  },
  cardImgWrapper: {
    flex: 1,
  },
  cardImg: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  cardInfo: {
    flex: 2,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,    
    //backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardDetails: {
    fontSize: 12,
    color: '#444',
  },
});
