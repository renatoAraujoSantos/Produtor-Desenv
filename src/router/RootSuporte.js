import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import Suporte from '../screens/Suporte';
import { useTheme, Avatar } from 'react-native-paper';
import { View } from 'react-native-animatable';

const ProfileStack = createStackNavigator();

const RootSuporte = ({ navigation }) => {
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
                name="Suporte"
                component={Suporte}
                options={{
                    title: 'Suporte',
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
                }}
            />
        </ProfileStack.Navigator>
    );
};


export default RootSuporte;