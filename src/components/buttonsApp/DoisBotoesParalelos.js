import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DoisBotoesParalelos({ labelBotaoEsquerda, labelBotaoDireita, onPressBotaoEsquerda, onPressBotaoDireita }) {

    return (
        <View style={styles.container}>
            <View style={styles.viewButton}>
                <TouchableOpacity onPress={onPressBotaoEsquerda}>
                    <View style={styles.button} >
                        <Text style={styles.text}>{labelBotaoEsquerda}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.viewButton}>
                <TouchableOpacity onPress={onPressBotaoDireita}>
                    <View style={styles.button} >
                        <Text style={styles.text}>{labelBotaoDireita}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 7
    },
    viewButton: {
        flex: 0.5, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 10
    },
    button: {
        backgroundColor: '#3c812e', 
        alignItems: 'center', 
        borderRadius: 20, 
        padding: 10, 
        paddingHorizontal: 1, 
        width: 150
    },
    text: {
        fontSize: 16, 
        color: '#fff', 
        marginLeft: 0
    }
});
