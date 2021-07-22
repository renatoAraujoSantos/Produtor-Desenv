import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import * as ActionTypes from '../../constants/ActionTypes';

export default function SnackBarMensagemSistema({ tintColor, openSnack, numeroResposta }) {

    const [navTitle, setNavTitle] = useState('');
    const [navColor, setNavColor] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        async function loadScreen() {
            if (numeroResposta === ActionTypes.SEM_CONEXAO_COM_INTERNET) {
                setNavTitle(ActionTypes.MESSAGE_SEM_CONEXAO_COM_INTERNET);
            } else if (numeroResposta === ActionTypes.TIME_OUT_BACK_END) {
                setNavTitle(ActionTypes.MESSAGE_TIME_OUT_BACK_END);
            } else if (numeroResposta === ActionTypes.PARAMETROS_DE_ENVIO_INCORRETOS) {
                setNavTitle(ActionTypes.MESSAGE_PARAMETROS_DE_ENVIO_INCORRETOS);
            } else {
                setNavTitle(ActionTypes.MESSAGE_ERRO_NAO_ESPERADO);
            }
        
            //setNavTitle(title);
            setNavColor(tintColor);
            setVisible(openSnack);
        }
        loadScreen();
    }, []);

    const onVisibleSnackBar = () => {
        setVisible(false);
    }

    return (
        <Snackbar
            style={{ marginHorizontal: 1, backgroundColor: 'black' }}
            visible={visible}
            onDismiss={onVisibleSnackBar}
            action={{
                label: 'OK',
                textColor: 'green',
                onPress: () => {
                    // Faça alguma coisa
                },
            }}
            duration={7000}
            //theme={withTheme}
            //theme={{ colors: { accent: 'red'}}}
        >
            <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 14, color: 'white', fontWeight: 'bold', }}>
                {navTitle}

            </Text>

        </Snackbar>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 45,
    },
});
