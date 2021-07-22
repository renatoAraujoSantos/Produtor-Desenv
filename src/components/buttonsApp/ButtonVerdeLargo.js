import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ButtonVerdeLargo = ({ titulo, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <LinearGradient colors={['#56BA42', '#3c812e']} style={styles.signIn} >
                <Text style={[styles.textSign, { color: '#fff' }]}>{titulo}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default ButtonVerdeLargo;

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
