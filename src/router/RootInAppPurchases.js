import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, Avatar } from 'react-native-paper';
import { View } from 'react-native-animatable';
import InAppPurchases from '../screens/Purcheses/InAppPurchases';

const Stack = createStackNavigator();

const RootInAppPurchases = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                safeAreaInsets:{ top: 0, bottom: 0 },
                headerStyle: {
                    backgroundColor: colors.background,
                    shadowColor: colors.background, // iOS
                    elevation: 0, // Android
                },
                headerTintColor: colors.text,
            }}>
            <Stack.Screen
                name="InAppPurchases"
                component={InAppPurchases}                
                options={{
                    title: 'Pagamento',
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
        </Stack.Navigator>
    );
};


export default RootInAppPurchases;