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
//import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import * as Animatable from 'react-native-animatable';
//import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';




const MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 55;
const MAX_HEIGHT = 350;

const CardItemDetails = ({ route }) => {
    const itemData = route.params.itemData;
    const navTitleView = useRef(null);

    return (
        <View style={styles.container}>            
            <ImageHeaderScrollView

                maxHeight={MAX_HEIGHT}
                minHeight={MIN_HEIGHT}

                //      maxHeight={200}
                //      minHeight={100}


                
                headerImage={itemData.image}
                //headerImage={{ uri: UrlImagensSistema.URL_BANCA }}

                //headerImage={require('../../assets/NZ.jpg')}

                renderForeground={() => (
                    <View style={styles.titleContainer}>
                        <Text style={styles.imageTitle}>{itemData.title}</Text>
                    </View>
                )}



                // renderForeground={() => (
                //   <View style={styles.foregroundContainer}>
                //     <TouchableOpacity onPress={() => console.log('tap!!')}>
                //       <Text style={styles.header}>Tap Me!</Text>
                //     </TouchableOpacity>
                //   </View>
                // )}

                renderFixedForeground={() => (
                    <Animatable.View style={styles.navTitleView} ref={navTitleView}>
                        <Text style={styles.navTitle}>{itemData.title}</Text>
                    </Animatable.View>
                )}

            >

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                    <Text style={styles.title}>Visão Geral</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <FontAwesome name="star" size={16} color="#FF6347" />
                        <Text style={{ marginHorizontal: 2 }}>{itemData.rating}</Text>
                        <Text>({itemData.reviews})</Text>
                    </View>
                </View>


                <View style={[styles.section, styles.sectionLarge]}>
                    <Text style={styles.sectionContent}>{itemData.description}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.categories}>
                        {itemData.categories.map((category, index) => (
                            <View style={styles.categoryContainer} key={index}>
                                <FontAwesome name="tag" size={16} color="#fff" />
                                <Text style={styles.category}>{category}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* <View style={[styles.section, {height: 250}]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{flex: 1}}
            region={{
              latitude: itemData.coordinate.latitude,
              longitude: itemData.coordinate.longitude,
              latitudeDelta: 0.00864195044303443,
              longitudeDelta: 0.000142817690068,
            }}>
            <MapView.Marker
              coordinate={itemData.coordinate}
              image={require('../../assets/map_marker.png')}
            />
          </MapView>
        </View> */}


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
        fontSize: 18,
        backgroundColor: 'transparent',
    },
    sectionLarge: {
        minHeight: 300,
    },
});
