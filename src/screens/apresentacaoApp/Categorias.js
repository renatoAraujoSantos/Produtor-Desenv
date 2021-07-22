import React, { useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,    
    Platform,
    TouchableOpacity,
} from 'react-native';
//import HeaderImageScrollView from 'react-native-image-header-scroll-view';

import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';

import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CATEGORIA, DESTAQUE } from '../../model/data';
import * as UrlImagensSistema from '../../constants/UrlImagensSistema';
import ButtonVerdeLargo from '../../components/buttonsApp/ButtonVerdeLargo';


const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const CardItemDetails = ({ navigation, route }) => {
    //const itemData = route.params.itemData;
    const navTitleView = useRef(null);

    return (
        <View style={styles.container}>            
            <ImageHeaderScrollView
                maxHeight={MAX_HEIGHT}
                minHeight={MIN_HEIGHT}
                headerImage={{ uri: UrlImagensSistema.URL_BANCA }}                
                renderForeground={() => (
                    <View style={styles.foregroundContainer}>

                        <View style={styles.titleContainer}>
                            <Text style={styles.imageTitle}>{''}</Text>
                        </View>
                    </View>
                )}
                renderFixedForeground={() => (
                    <Animatable.View style={styles.navTitleView} ref={navTitleView}>
                        <Text style={styles.navTitle}>{'Título222222'}</Text>
                    </Animatable.View>
                )}
            >


                {/* <View style={{ height: 10 }}>
                    <TriggeringView onHide={() => console.log("text hidden")}>
                    <Text>Scroll Me!</Text>
                    </TriggeringView>
                </View> */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop:20 }}>
                    <Text style={styles.title}>Visão Geral</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <FontAwesome name="star" size={16} color="#FF6347" />
                        <Text style={{ marginHorizontal: 2 }}>{'5(102)'}</Text>
                        <Text>{''}</Text>
                    </View>
                </View>

                <View style={[styles.section, styles.sectionLarge]}>
                    <Text style={styles.sectionContent}> {CATEGORIA.label} </Text>
                </View>

                <View style={{ height: 100, justifyContent: 'flex-end', backgroundColor: 'transparent' }} >
                    <View style={{ marginHorizontal: 20, marginVertical: 20 }} >
                        <ButtonVerdeLargo titulo={'Voltar'} onPress={() => { navigation.goBack() }} />
                    </View>
                </View>
            </ImageHeaderScrollView>

        </View>
    );
};

export default CardItemDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: MAX_HEIGHT,
        width: Dimensions.get('window').width,
        alignSelf: 'stretch',
        resizeMode: 'cover',
    },
    title: {
        fontSize: 20,
    },
    name: {
        fontWeight: 'bold',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: 'white',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        textAlign: 'justify',
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    categoryContainer: {
        flexDirection: 'row',
        backgroundColor: '#FF6347',
        borderRadius: 20,
        margin: 10,
        padding: 10,
        paddingHorizontal: 15,
    },
    category: {
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageTitle: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 24,
    },
    navTitleView: {
        height: MIN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 40 : 5,
        opacity: 0,
    },
    navTitle: {
        color: 'white',        
        fontSize: 38,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },
});
