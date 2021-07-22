import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import Shoes from './Shoes';

export default function Home() {
    const navigation = useNavigation({ navigation });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../../../assets/images/sejaUmProdutor.png')}
                    style={styles.image}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.text}>VENDAS</Text>
                    <Text style={[styles.text, { color: '#CECECF' }]}>•</Text>
                    <Text style={[styles.text2, { color: '#CECECF' }]}>COM SEGURANÇA</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: 0, alignSelf: 'center' }} onPress={() => alert('CLICOU')}>
                        <MaterialIcons
                            name="filter-list"
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.line} />

            <ScrollView>
                <Text style={styles.text3}>ANUNCIAR PRODUTO</Text>
                <View style={{ marginTop: 20 }} />
                <View style={styles.textContent}>
                    <Text style={styles.textContent}>
                        Aqui você pode fazer seus anuncios de forma segura e interativa, para garantir uma venda estável e confortável
                    </Text>
                </View>
                <View style={{ height: 90, backgroundColor: 'transparent' }} />
                <View style={{ alignItems: 'center', marginTop: 20, marginHorizontal: 20 }}>
                    <TouchableOpacity style={styles.signIn} onPress={() => { navigation.navigate('FornecedorTabScreen')  } } >
                        <LinearGradient
                            colors={['#56BA42', '#3c812e']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, { color: '#fff' }]}>Iniciar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    btnContainer: {
        width: '90%',
        height: 50,
        backgroundColor: '#17181a',
        borderRadius: 5,
        marginVertical: '5%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleButton: {
        fontSize: 17,
        color: '#FFF'
    },
    header: {
        marginBottom: 8
    },
    textContent: {
        fontSize: 16,
        lineHeight: 25,
        marginVertical: '2%',
        marginHorizontal: '1%',
        paddingHorizontal: '2%'
    },
    textTitle: {
        fontSize: 22,
        marginVertical: '2%'
    },
    textList: {
        fontSize: 16,
        lineHeight: 25,
    },

    image: {
        width: '100%'
    },
    textContainer: {
        flexDirection: 'row',
        marginVertical: '5%',
        marginHorizontal: '5%'
    },
    text: {
        //fontFamily: 'Roboto_400Regular',  space-mono  sourceSansPro-Regular sourceSansPro-Semibold
        fontFamily: 'Roboto_400Regular',
        fontSize: 20,
        marginHorizontal: '1%',
        fontWeight: '300'
    },
    text2: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 18,
        marginHorizontal: '1%'
    },
    text3: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 26,
        marginHorizontal: '6%',
        fontWeight: '200',
        marginTop: 30,
    },
    line: {
        borderBottomColor: '#D8d8d8',
        borderBottomWidth: 2,
    }
});