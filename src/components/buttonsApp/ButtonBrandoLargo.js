import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const ButtonBrandoLargo = ({ titulo, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.signIn, { borderColor: '#3c812e', borderWidth: 1 }]} >            
            <Text style={[styles.textSign, { color: '#3c812e' }]}>{titulo}</Text>
        </TouchableOpacity>
    );
};

export default ButtonBrandoLargo;

const styles = StyleSheet.create({
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
});
