import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as UrlImagensSistema from '../../../constants/UrlImagensSistema';
import ButtonVerdeLargo from '../../../components/buttonsApp/ButtonVerdeLargo';

export default function ApresentacaoAplicativo({ navigation }) {

    const [subTitulo, setSubTitulo] = React.useState('AUMENTE SUAS VENDAS');
    const [arrayUrlImagens, setArrayUrlImagens] = React.useState(UrlImagensSistema.URL_FRUTAS_VERDURAS_1);
    const [labelButton, setLabelButton] = React.useState('Próximo');
    const [mensagemTela, setMensagemTela] = React.useState('Comercialize diretamente com o seu cliente final, sem atravessadores.');
    const [count, setCount] = React.useState(1);
    
    const buttonClick = async () => {
        if (count === 1) {
            setSubTitulo('CERTEZA DE PAGAMENTO');
            setArrayUrlImagens(UrlImagensSistema.URL_FRUTAS_VERDURAS_2);
            setMensagemTela('Não cobraremos mensalidade, apenas um adicional de 3,99% sobre o valor de cada venda efetivamente realizada através do site.');
            setCount(count +1);
        }
        if (count === 2) {
            setSubTitulo('SEM MENSALIDADE');
            setArrayUrlImagens(UrlImagensSistema.URL_FRUTAS_VERDURAS_3);
            setMensagemTela('Não cobraremos mensalidade, apenas um adicional de 3,99% sobre o valor de cada venda efetivamente realizada através do site.');
            setCount(count +1);
        }
        if (count === 3) {
            setSubTitulo('GARANTIMOS SUA SEGURANÇA');
            setArrayUrlImagens(UrlImagensSistema.URL_FRUTAS_VERDURAS_4);
            setMensagemTela('Garantimos a segurança dos seus dados e de suas futuras transações.');
            setLabelButton('Concluir')
            setCount(count +1);
        }
        if (count === 4) {
            await AsyncStorage.setItem('avisoInicial', 'true');
            //navigation.navigate('SolicitarPermissoesUser');
            navigation.navigate('RootAutenticacao');
        }        
    }

    return (
        <View style={styles.container}>
            <View style={{ height: 50, backgroundColor: 'transparent' }} >
                <Text>{''}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: 'transparent', }} >
                <View style={{ alignItems: 'center', }} >
                    <Image
                        style={{ width: 300, height: 250, resizeMode: 'contain', }}                        
                        source={{ uri: arrayUrlImagens }}
                    />
                </View>
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginVertical: 10, marginTop: 20 }} >
                    <Text style={styles.text}>{subTitulo}</Text>
                </View>
                <View testID="Testo1" style={styles.slide1}>
                    <View style={{ marginBottom: 0 }} />
                    <Text style={styles.TextMensagemTela}>
                        {mensagemTela}
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
        //backgroundColor: '#3c812e',
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
        //fontFamily: 'Anton_400Regular',
        paddingHorizontal: 40,
        textAlign: 'center',
    },
    text: {
        color: "#1a0000",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
    }

});
