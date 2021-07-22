import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, Avatar } from 'react-native-paper';
import { View } from 'react-native-animatable';

import ProfileTop from '../screens/profileTop/ProfileTop';
import EditProfile from '../screens/profileTop/EditProfile';
import AlterarSenhaUserAutenticado from '../screens/profileTop/AlterarSenhaUserAutenticado';
import PlantDetail from '../screens/profileTop/PlantDetail';
import EnderecoUsuario from '../screens/profileTop/EnderecoUsuario';
import DadosBancariosUsuario from '../screens/profileTop/DadosBancariosUsuario';

const ProfileStack = createStackNavigator();

const ProfileStackScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <ProfileStack.Navigator
            screenOptions={{
                safeAreaInsets:{ top: 0, bottom: 0 },
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    elevation: 0, // Android
                },
                headerTintColor: colors.text,
            }}>
            <ProfileStack.Screen
                name="ProfileTop"
                component={ProfileTop}
                options={{
                    title: 'Minha Conta',
                    headerLeft: () => (
                        <View style={{ marginLeft: 10 }}>
                            <Icon.Button
                                name="ios-menu"
                                size={25}
                                backgroundColor={colors.background}
                                color={colors.text}
                                onPress={() => navigation.openDrawer()}
                            />
                        </View>
                    ),
                    // headerRight: () => (
                    //     <View style={{ marginRight: 10 }}>
                    //         <MaterialCommunityIcons.Button
                    //             name="account-edit"
                    //             size={25}
                    //             backgroundColor={colors.background}
                    //             color={colors.text}
                    //             onPress={() => navigation.navigate('EditProfile')}
                    //         />
                    //     </View>
                    // ),
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                options={{
                    title: 'Editar Perfil',
                }}
                component={EditProfile}
            />
            <ProfileStack.Screen
                name="AlterarSenhaUserAutenticado"
                options={{
                    title: 'Auterar Senha',
                }}
                component={AlterarSenhaUserAutenticado}
            />
            <ProfileStack.Screen
                name="PlantDetail"
                options={{
                    title: 'Perfil',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center'
                }}
                component={PlantDetail}
            />

            <ProfileStack.Screen
                name="EnderecoUsuario"
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center'
                }}
                component={EnderecoUsuario}
            />
            <ProfileStack.Screen
                name="DadosBancariosUsuario"
                options={{
                    title: 'Dados Bancários',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center'
                }}
                component={DadosBancariosUsuario}
            />

        </ProfileStack.Navigator>
    );
};


export default ProfileStackScreen;