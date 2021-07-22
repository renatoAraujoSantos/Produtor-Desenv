import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, Avatar, Title, Caption, Paragraph, Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../components/context';
import { LogoutUsuario } from '../util/ValidarAutenticacaoUser';
import * as UrlImagensSistema from '../constants/UrlImagensSistema';
import { MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';


export function DrawerContent(props) {

    const sairApp = async () => {
        const autenticado = await LogoutUsuario();        
        props.navigation.navigate('Login');        
    }

    const [urlImagemPerfil, setUrlImagemPerfil] = React.useState(UrlImagensSistema.URL_IMAGEM_NAO_EXISTE);
    const [nomeUsuarioLogado, setNomeUsuarioLogado] = React.useState('');
    const [qtdProtutos, setQtdProtutos] = React.useState('');
    const [qtdCategoria, setQtdCategoria] = React.useState('');

    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            const nomeUsuarioLogadoP = await AsyncStorage.getItem('nomeUsuarioLogado');
            const imagemPerfilUserLogado = await AsyncStorage.getItem('imagemPerfilUserLogado');            
            if (nomeUsuarioLogadoP !== '' && nomeUsuarioLogadoP !== null) {
                setNomeUsuarioLogado(nomeUsuarioLogadoP);
                setQtdProtutos('20');
                setQtdCategoria('8')
            } else {
                setNomeUsuarioLogado('');
                setQtdProtutos('');
                setQtdCategoria('');
            }
            if (imagemPerfilUserLogado !== '' && imagemPerfilUserLogado !== null) {
                setUrlImagemPerfil(imagemPerfilUserLogado);
            } else {
                setUrlImagemPerfil(UrlImagensSistema.URL_IMAGEM_NAO_EXISTE);
            }
        }
        loadResourcesAndDataAsync();
    });

    const paperTheme = useTheme();
    const { signOut, toggleTheme } = React.useContext(AuthContext);

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{ marginTop: -5 }}>
                    <View style={{ alignItems: 'center', backgroundColor: '#3c812e' }}>
                        <View style={{ marginTop: 10, alignItems: 'center' }}>
                            <Avatar.Image
                                source={{ uri: urlImagemPerfil }}
                                size={70}
                            />
                            <View style={{ marginLeft: 1, flexDirection: 'column' }}>
                                <Title style={styles.title}>{nomeUsuarioLogado}</Title>
                                {/* <Caption style={styles.caption}>Produtor</Caption> */}
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>                        
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="home-outline" color={color} size={size} />
                            )}
                            label="Início"
                            onPress={() => { props.navigation.navigate('RootApresentacao') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (                                
                                <MaterialCommunityIcons name="sprout" size={size} color={color} />
                            )}
                            label="Anúncios"
                            onPress={() => { props.navigation.navigate('RootPesquisaProduto') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (                                
                                <MaterialCommunityIcons name="storefront-outline" size={size} color={color} />                                
                            )}
                            label="Meus Anúncios"
                            onPress={() => { props.navigation.navigate('FornecedorTabScreen') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="account-outline" color={color} size={size} />
                            )}
                            label="Meus Dados"
                            onPress={() => { props.navigation.navigate('RootProfile') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="account-outline" color={color} size={size} />
                            )}
                            label="Pagamento"
                            onPress={() => { props.navigation.navigate('RootInAppPurchases') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (                                
                                <Feather name="tool" color={color} size={size} />
                            )}
                            label="Suporte"
                            onPress={() => { props.navigation.navigate('RootSuporte') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (                                
                                <Feather name="info" color={color} size={size} />
                            )}
                            label="Sobre"
                            onPress={() => { props.navigation.navigate('RootSobreApp') }}
                        />

                        {/* <DrawerItem
                            icon={({ color, size }) => (
                                <AntDesign name="creditcard" size={size} color={color} />                                
                            )}
                            label="Forma de Pagamento"
                            onPress={() => { props.navigation.navigate('RootPaymentsStripe') }}
                        /> */}


                    </Drawer.Section>

                    {/* <Drawer.Section style={styles.bottomDrawerLogin}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <AntDesign name="shoppingcart" size={size} color={color} />                                
                            )}
                            label="Comprar"
                            onPress={() => { props.navigation.navigate('RootPurchases') }}
                        />                        
                    </Drawer.Section> */}

                </View>
            </DrawerContentScrollView>
            <View style={{ backgroundColor: '#3c812e' }}>
                <Drawer.Section style={styles.bottomDrawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="exit-to-app" color={'#FFFFFF'} size={size} />
                        )}
                        label="Sair"
                        labelStyle={{ color: '#FFFFFF' }}                        
                        onPress={sairApp}
                    />
                </Drawer.Section>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        //fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tituloFildBase: {
        fontSize: 13,
        lineHeight: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        //lineHeight: 14,
        color: '#FFFFFF',
        marginRight: 3,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontSize: 11,
        color: '#FFFFFF',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        //marginBottom: 5,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    bottomDrawerLogin: {
        marginBottom: 15,
        borderTopColor: '#C0C0C0',
        borderTopWidth: 1,
        //        marginHorizontal:
    },
    segundaListaItensMenus: {
        marginBottom: 15,
        borderTopColor: '#C0C0C0',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});