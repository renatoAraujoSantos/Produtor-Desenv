import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useToast } from 'react-native-styled-toast';

export default function Toast() {

//const BookmarkScreen = () => {
    const { toast } = useToast();
    
    const tempoVisivel = 5000;

    return (
      <View style={styles.container}>

        <View style={{margin: 10}}>
            <Button
              onPress={() =>
                toast({
                  message: 'Sucesso toast.',
                  intent: 'SUCCESS',
                  duration: tempoVisivel,
                  shouldVibrate: true,
                  subMessage: 'Operação realizada com sucesso',                  
                })
              }
              title="Show Success"
            />
        </View>

        <View style={{margin: 10}}>
            <Button
              onPress={() =>
                toast({
                  message: 'Informação toast.',
                  intent: 'INFO',
                  duration: tempoVisivel,
                  shouldVibrate: true,
                  subMessage: 'Campo infomativo...',                  
                })
              }
              title="Show Informação"
            />
        </View>

        <View style={{margin: 10}}>
            <Button
              onPress={() =>
                toast({
                  message: 'Erro toast.',
                  intent: 'ERROR',
                  duration: tempoVisivel,
                  shouldVibrate: true,
                  subMessage: 'Erro na operação ',
                })
              }
              title="Show Erro"
            />
        </View>

      </View>
    );
};

//export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
