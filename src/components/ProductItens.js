import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { Avatar } from "react-native-elements";

const Product = ({ product: { url, nome, typeIcon } }) => {
    return (
        <View style={styles.container}>

            {typeIcon === 'lock' ? null :
                (
                    <Avatar
                        size="small"
                        overlayContainerStyle={{ backgroundColor: '#FFFFFF' }}
                        rounded
                        icon={{ name: 'trash', color: 'black', type: 'font-awesome', size: 23 }}
                        //onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        containerStyle={{ position: 'absolute', left: 15, top: 15, color: '#2d8425', zIndex: 1, }}
                    />
                )}

            <View style={styles.imageContainer}>
                <Image source={{ uri: url }} style={styles.image} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{nome}</Text>
            </View>
        </View>
    );
}


export default Product;

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({

    container: {
        backgroundColor: '#FFF',
        //borderRadius: 3,
        width: (width - 70) / 2,
        marginBottom: 15,
        shadowColor: '#C0C0C0',
        shadowRadius: 2,
        shadowOpacity: 0.1,
        shadowOffset: { x: 0, y: 0 },
        alignSelf: 'flex-start',
        borderColor: '#cccccc',
        borderWidth: 0.5,
        borderRadius: 15,        
      },
      imageContainer: {
        padding: 1,
      },
      image: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0    
      },    
      infoContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
      },            
      title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
      },    
});
