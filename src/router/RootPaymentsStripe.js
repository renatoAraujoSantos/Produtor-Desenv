// import React, { useCallback, useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useTheme, Avatar } from 'react-native-paper';
// import { View } from 'react-native-animatable';
// import { useStripe } from '@stripe/stripe-react-native';
// import { Linking } from 'react-native';

// import PaymentsUICustomScreen from '../screens/paymentsStripe/PaymentsUICustomScreen';
// import PaymentsUICompleteScreen from '../screens/paymentsStripe/PaymentsUICompleteScreen';
// import WebhookPaymentScreen from '../screens/paymentsStripe/WebhookPaymentScreen';
// import PaymentResultScreen from '../screens/paymentsStripe/PaymentResultScreen';

// const Stack = createStackNavigator();

// const RootPaymentsStripe = ({ navigation }) => {

//     const { colors } = useTheme();
//     const { handleURLCallback } = useStripe();

//     const handleDeepLink = useCallback(
//         async (url) => {
//             if (url && url.includes('safepay')) {
//                 await handleURLCallback(url);
//                 navigation.navigate('PaymentResultScreen', { url });
//             }
//         },
//         [navigation, handleURLCallback]
//     );

//     useEffect(() => {
//         const getUrlAsync = async () => {
//             const initialUrl = await Linking.getInitialURL();
//             handleDeepLink(initialUrl);
//         };

//         const urlCallback = (event) => {
//             handleDeepLink(event.url);
//         };

//         getUrlAsync();

//         Linking.addEventListener('url', urlCallback);

//         return () => Linking.removeEventListener('url', urlCallback);
//     }, [handleDeepLink]);
    

//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 safeAreaInsets:{ top: 0, bottom: 0 },
//                 headerStyle: {
//                     backgroundColor: colors.background,
//                     shadowColor: colors.background, // iOS
//                     elevation: 0, // Android
//                 },
//                 headerTintColor: colors.text,
//             }}>
//             <Stack.Screen
//                 name="PaymentsUICustomScreen"
//                 component={PaymentsUICustomScreen}                
//                 options={{
//                     title: 'Pré-construído (Várias Etapas)',
//                     headerLeft: () => (
//                         <View style={{ marginLeft: 10 }}>
//                             <Icon.Button
//                                 name="ios-menu"
//                                 size={25}
//                                 backgroundColor={colors.background}
//                                 color={colors.text}
//                                 onPress={() => navigation.openDrawer()}
//                             />
//                         </View>
//                     ),
//                 }}
//             />

//             <Stack.Screen
//                 name="PaymentsUICompleteScreen"
//                 options={{
//                     title: 'Pré-construído (único passo)',
//                 }}
//                 component={PaymentsUICompleteScreen}
//             />
//             <Stack.Screen
//                 name="WebhookPaymentScreen"
//                 options={{
//                     title: 'Somente cartão',
//                 }}
//                 component={WebhookPaymentScreen}
//             />
//             <Stack.Screen
//                 name="PaymentResultScreen"
//                 options={{
//                     title: 'Result',
//                 }}
//                 component={PaymentResultScreen}
//             />

//         </Stack.Navigator>
//     );
// };


// export default RootPaymentsStripe;