import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import Login from '../screens/autenticacao/login/Login';
import ConfirmaPoliticaPrivacidade from '../screens/autenticacao/cadastro/ConfirmaPoliticaPrivacidade';
import CadastroValidarCodigo from '../screens/autenticacao/cadastro/CadastroValidarCodigo';
import CadastroUsuarioSemLocation from '../screens/autenticacao/cadastro/CadastroUsuarioSemLocation';
import EsqueciSenha from '../screens/autenticacao/esqueciSenha/EsqueciSenha';
import RedefinirSenh from '../screens/autenticacao/esqueciSenha/RedefinirSenha';
import ValidarCodigo from '../screens/autenticacao/esqueciSenha/ValidarCodigo';
//import ApresentacaoAplicativo from '../screens/autenticacao/inicio/ApresentacaoAplicativo';
//import SolicitarPermissoesUser from '../screens/autenticacao/inicio/SolicitarPermissoesUser';

const ProfileStack = createStackNavigator();

const RootAutenticacao = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <ProfileStack.Navigator initialRouteName="Login"
            screenOptions={{
                safeAreaInsets:{ top: 0, bottom: 0 },
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    //elevation: 0, // Android
                },
                headerTintColor: colors.text,
            }}>
            <ProfileStack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown:false,
                }}
            />            
            <ProfileStack.Screen
                name="CadastroUsuarioSemLocation"
                options={{
                    headerShown:false,
                }}
                component={CadastroUsuarioSemLocation}
            />
            <ProfileStack.Screen
                name="CadastroValidarCodigo"
                options={{
                    headerShown:false,                    
                }}
                component={CadastroValidarCodigo}
            />
            <ProfileStack.Screen
                name="ConfirmaPoliticaPrivacidade"
                options={{
                    headerShown:false,                    
                }}
                component={ConfirmaPoliticaPrivacidade}
            />
            <ProfileStack.Screen
                name="EsqueciSenha"
                options={{
                    headerShown:false,                    
                }}
                component={EsqueciSenha}
            />
            <ProfileStack.Screen
                name="RedefinirSenh"
                options={{
                    headerShown:false,                    
                }}
                component={RedefinirSenh}
            />
            <ProfileStack.Screen
                name="ValidarCodigo"
                options={{
                    headerShown:false,                    
                }}
                component={ValidarCodigo}
            />

        </ProfileStack.Navigator>
    );
};


export default RootAutenticacao;