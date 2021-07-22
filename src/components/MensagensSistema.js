import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ActionTypes from '../constants/ActionTypes';
import SnackBarPaper from './snackBar/SnackBarPaper';
import StarRating from './StarRating';

export default function MensagensSistema({ numeroResposta }) {
//, itemData, onPress
    const [renderSnack, setRenderSnack] = useState(0);
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [mensagemDetalhe, setMensagemDetalhe] = useState('');

    if (numeroResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
        await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET)) });
        await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_SEM_CONEXAO_COM_INTERNET)) });
        mensagemSnackBar();
    } else if (numeroResposta === ActionTypes.TIME_OUT_BACK_END) {
        await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_TIME_OUT_BACK_END)) });
        await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_TIME_OUT_BACK_END)) });
        mensagemSnackBar();
    } else if (numeroResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
        await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
        await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_PARAMETROS_DE_ENVIO_INCORRETOS)) });
    } else {
        await new Promise(resolve => { resolve(setMensagem(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO)) });
        await new Promise(resolve => { resolve(setMensagemDetalhe(ActionTypes.MESSAGE_DETALHE_ERRO_NAO_ESPERADO)) });
        mensagemSnackBar();
    }


    function mensagemSnackBar() {
        setVisible(true);
        setRenderSnack(renderSnack + 1);
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>

            {/* <TouchableOpacity onPress={onPress}>
                <View style={styles.card}>
                    <View style={styles.cardImgWrapper}>
                        <Image
                            source={itemData.image}
                            resizeMode="cover"
                            style={styles.cardImg}
                        />
                    </View>
                    <View style={styles.cardInfo}>
                        <Text style={styles.cardTitle}>{itemData.title}</Text>
                        <StarRating ratings={itemData.ratings} reviews={itemData.reviews} />
                        <Text numberOfLines={2} style={styles.cardDetails}>{itemData.description}</Text>
                    </View>
                </View>
            </TouchableOpacity> */}


            <SnackBarPaper key={renderSnack} title={mensagem} tintColor="blue" openSnack={visible} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 100,
        marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
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
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontWeight: 'bold',
    },
    cardDetails: {
        fontSize: 12,
        color: '#444',
    },
});
