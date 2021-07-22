import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import {
    Provider as PaperProvider,
    DefaultTheme as PaperDefaultTheme,
    DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './components/context';
import { DrawerContent } from './screens/DrawerContent';

//import Login from './screens/autenticacao/login/Login';
//import EsqueciSenhaScreen from './screens/autenticacao/esqueciSenha/EsqueciSenha';
//import RedefinirSenha from './screens/autenticacao/esqueciSenha/RedefinirSenha';
//import ValidarCodigoScreen from './screens/autenticacao/esqueciSenha/ValidarCodigo';
//import CadastroValidarCodigo from './screens/autenticacao/cadastro/CadastroValidarCodigo';
//import ApresentacaoAplicativo from './screens/autenticacao/inicio/ApresentacaoAplicativo';
//import SolicitarPermissoesUser from './screens/autenticacao/inicio/SolicitarPermissoesUser';
//import CadastroUsuarioSemLocation from './screens/autenticacao/cadastro/CadastroUsuarioSemLocation';
//import ConfirmaPoliticaPrivacidade from './screens/autenticacao/cadastro/ConfirmaPoliticaPrivacidade';

import RootSuporte from './router/RootSuporte';
import RootAutenticacao from './router/RootAutenticacao';
import RootProfile from './router/RootProfile';
import RootPesquisaProduto from './router/RootPesquisaProduto';
import RootApresentacao from './router/RootApresentacao';
import RootIntroducao from './router/RootIntroducao';
import FornecedorTabScreen from './screens/fornecedor/FornecedorTabScreen';
import PaginaEmManutencao from './screens/PaginaEmManutencao';
import RootSobreApp from './router/RootSobreApp';
import RootInAppPurchases from './router/RootInAppPurchases';
//import RootPaymentsStripe from './router/RootPaymentsStripe';

import PaymentResultScreen from './screens/paymentsStripe/PaymentResultScreen';
import PaymentsUICompleteScreen from './screens/paymentsStripe/PaymentsUICompleteScreen';
import PaymentsUICustomScreen from './screens/paymentsStripe/PaymentsUICustomScreen';
import WebhookPaymentScreen from './screens/paymentsStripe/WebhookPaymentScreen';
import HomeScreen from './screens/paymentsStripe/HomeScreen';

const Drawer = createDrawerNavigator();

export default function App() {

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [avisoInicial, setAvisoInicial] = React.useState(false);

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null,
    };

    const CustomDefaultTheme = {
        ...NavigationDefaultTheme,
        ...PaperDefaultTheme,
        colors: {
            ...NavigationDefaultTheme.colors,
            ...PaperDefaultTheme.colors,
            background: '#ffffff',
            text: '#333333',
            textSecund: '#818181'
        }
    }

    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: '#333333',
            text: '#ffffff',
            textSecund: '#989898'
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false,
                };
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false,
                };
        }
    };

    const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

    const authContext = React.useMemo(() => ({
        signIn: async (foundUser) => {
            const userToken = String(foundUser[0].userToken);
            const userName = foundUser[0].username;
            try {
                await AsyncStorage.setItem('userToken', userToken);
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('userToken');
            } catch (e) {
                console.log(e);
            }
            dispatch({ type: 'LOGOUT' });
        },
        signUp: () => {
            //setTeste1111('bbbbbbbbbbbbb');
        },
        toggleTheme: () => {
            setIsDarkTheme(isDarkTheme => !isDarkTheme);
        }
    }), []);

    React.useEffect(() => {
        async function loadResourcesAndDataAsync() {
            let userToken;
            userToken = null;
            try {
                userToken = await AsyncStorage.getItem('userToken');
                const avisoInicialP = await AsyncStorage.getItem('avisoInicial');                
                if (avisoInicialP === 'true' && avisoInicialP !== null) {
                    setAvisoInicial(true); // mudar para false
                } else {
                    setAvisoInicial(false);
                }
            } catch (e) {
                console.warn(e);
            }
            dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }
        loadResourcesAndDataAsync();
    }, []);


    if (loginState.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <PaperProvider theme={theme}>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer theme={theme}>
                    <Drawer.Navigator initialRouteName={avisoInicial? "RootAutenticacao" : "RootIntroducao"} drawerContent={props => <DrawerContent {...props} />}>
                    {/* <Drawer.Navigator initialRouteName={"RootAutenticacao"} drawerContent={props => <DrawerContent {...props} />}> */}

                        <Drawer.Screen name="RootAutenticacao" component={RootAutenticacao} /> 
                        <Drawer.Screen name="RootIntroducao" component={RootIntroducao} />

                        {/* <Drawer.Screen name="Login" component={Login} />
                        <Drawer.Screen name="EsqueciSenhaScreen" component={EsqueciSenhaScreen} />
                        <Drawer.Screen name="RedefinirSenha" component={RedefinirSenha} />
                        <Drawer.Screen name="ValidarCodigoScreen" component={ValidarCodigoScreen} />
                        <Drawer.Screen name="CadastroValidarCodigo" component={CadastroValidarCodigo} />                        
                        <Drawer.Screen name="ApresentacaoAplicativo" component={ApresentacaoAplicativo} />                          
                        <Drawer.Screen name="CadastroUsuarioSemLocation" component={CadastroUsuarioSemLocation} />
                        <Drawer.Screen name="ConfirmaPoliticaPrivacidade" component={ConfirmaPoliticaPrivacidade} /> */}
                        {/* <Drawer.Screen name="SolicitarPermissoesUser" component={SolicitarPermissoesUser} />  */}

                        <Drawer.Screen name="RootPesquisaProduto" component={RootPesquisaProduto} />
                        <Drawer.Screen name="RootApresentacao" component={RootApresentacao} />
                        <Drawer.Screen name="RootProfile" component={RootProfile} />
                        <Drawer.Screen name="FornecedorTabScreen" component={FornecedorTabScreen} />
                        <Drawer.Screen name="RootSuporte" component={RootSuporte} />
                        <Drawer.Screen name="PaginaEmManutencao" component={PaginaEmManutencao} />
                        <Drawer.Screen name="RootSobreApp" component={RootSobreApp} />
                        <Drawer.Screen name="RootInAppPurchases" component={RootInAppPurchases} />

                        <Drawer.Screen name="PaymentResultScreen" component={PaymentResultScreen} />
                        <Drawer.Screen name="PaymentsUICompleteScreen" component={PaymentsUICompleteScreen} />
                        <Drawer.Screen name="PaymentsUICustomScreen" component={PaymentsUICustomScreen} />
                        <Drawer.Screen name="WebhookPaymentScreen" component={WebhookPaymentScreen} />
                        <Drawer.Screen name="HomeScreen" component={HomeScreen} />                        
                        
                        {/* <Drawer.Screen name="RootPaymentsStripe" component={RootPaymentsStripe} /> */}
                                                
                        {/* <Drawer.Screen name="CalenderTabScreen" component={CalenderTabScreen} /> */}
                        {/* <Drawer.Screen name="SupportScreen" component={SupportScreen} />
                        <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
                        <Drawer.Screen name="SignInScreen" component={SignInScreen} />
                        <Drawer.Screen name="Toast" component={Toast} /> */}

                    </Drawer.Navigator>
                </NavigationContainer>

            </AuthContext.Provider>
        </PaperProvider>

    )
}
