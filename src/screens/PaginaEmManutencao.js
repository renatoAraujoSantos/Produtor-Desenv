import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';
import ButtonVerdeLargo from '../components/buttonsApp/ButtonVerdeLargo';
//import SnackBarPaper from '../components/snackBar/SnackBarPaper';
import SnackBarMensagemSistema from '../components/snackBar/SnackBarMensagemSistema';
import { useNavigation } from '@react-navigation/native';

const PaginaEmManutencao = () => {
    const [renderSnack, setRenderSnack] = React.useState(0);
    const [visible, setVisible] = React.useState(false);

    const navigation = useNavigation();

    const funcaoTeste = () => {
        //navigation.goBack();
        setVisible(true);
        setRenderSnack(renderSnack + 1);        
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: 100, }} >
                    <Text>{''}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', }} >
                    <View style={{ alignItems: 'center', }} >
                        <Image
                            style={{ width: 250, height: 250, resizeMode: 'contain', }}
                            source={{ uri: UrlImagensSistema.URL_MANUTENCAO }}
                        />
                    </View>
                </View>
                <View style={{ height: 220, justifyContent: 'flex-end' }} >
                    <View style={{ marginVertical: 10 }} >
                        <Text style={styles.text}>Página em Manutenção</Text>
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 20 }} >
                        <ButtonVerdeLargo titulo={'Voltar'} onPress={() => funcaoTeste()} />
                    </View>
                </View>
            </ScrollView>
            
            <SnackBarMensagemSistema key={renderSnack} tintColor="blue" openSnack={visible} numeroResposta={'04'} />
        </View>
    );
};

export default PaginaEmManutencao;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    text: {
        color: "#000061",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    }
});
