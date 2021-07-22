import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import ApresentacaoAplicativo from '../screens/autenticacao/inicio/ApresentacaoAplicativo';
//import SolicitarPermissoesUser from '../screens/autenticacao/inicio/SolicitarPermissoesUser';

const ProfileStack = createStackNavigator();

const RootIntroducao = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <ProfileStack.Navigator 
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
                name="ApresentacaoAplicativo"
                component={ApresentacaoAplicativo}
                options={{
                    headerShown:false,
                }}
            />            

            {/* <ProfileStack.Screen
                name="SolicitarPermissoesUser"
                options={{
                    title: '',
                }}
                component={SolicitarPermissoesUser}
            /> */}

        </ProfileStack.Navigator>
    );
};


export default RootIntroducao;