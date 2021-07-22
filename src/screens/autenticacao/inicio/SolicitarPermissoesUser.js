import React from 'react';
import {View, Text, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import ButtonVerdeLargo from '../../../components/buttonsApp/ButtonVerdeLargo';
import * as UrlImagensSistema from '../../../constants/UrlImagensSistema';

export default function SolicitarPermissoesUser({ navigation }) {

    const [location, setLocation] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [labelButton, setLabelButton] = React.useState('Ativar Localização');
    const [count, setCount] = React.useState(1);


    const buttonClick = async () => {
        if (count === 1) {
            await solicitaPermissaoLocation();
            setLabelButton('Concluir');
            setCount(count +1);
        }
        if (count === 2) {
            navigation.navigate('Login');
        }
    }

    const solicitaPermissaoLocation = async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('A permissão para acessar o local foi negada');
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);        
    }


    return (
        <View style={styles.container}>
            <View style={{ height: 80, backgroundColor: 'transparent' }} >
                <Text>{''}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', }} >
                <View style={{ alignItems: 'center', }} >
                    <Image
                        style={{ width: 350, height: 250, resizeMode: 'contain', }}                        
                        source={{ uri: UrlImagensSistema.URL_IMAGEM_LOCALIZACAO }}
                    />
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10, marginTop: 40 }} >
                    <Text style={styles.text}>Ativar Localização</Text>
                </View>
                <View testID="Testo1" style={styles.slide1}>
                    <View style={{ marginBottom: 0 }} />
                    <Text style={styles.TextMensagemTela}>
                        {"Você precisa permitir a localização para usar o Produtor "}
                    </Text>
                </View>
            </View>
            <View style={{ height: 150, justifyContent: 'flex-start', backgroundColor: 'transparent' }} >
                <View style={{ marginVertical: 20, marginHorizontal: 20 }} >
                    <ButtonVerdeLargo titulo={labelButton} onPress={buttonClick} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,        
        backgroundColor: '#fff'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    TextMensagemTela: {
        color: "gray",
        fontSize: 22,
        fontWeight: "bold",
        fontFamily: 'Anton_400Regular',
        paddingHorizontal: 40,
        textAlign: 'center',
    },
    text: {
        color: "#1a0000",
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
    }
});
