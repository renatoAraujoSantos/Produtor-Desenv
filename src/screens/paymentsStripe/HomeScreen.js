import React, { useCallback, useEffect } from 'react';
//import { useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { Linking, StyleSheet, View, ScrollView, Platform } from 'react-native';
import { colors } from './colors';
import Button from './Button';
import { Collapse } from './Collapse';

export default function HomeScreen({ navigation, route }) {
    //const navigation = useNavigation();
    const { handleURLCallback } = useStripe();

    const handleDeepLink = useCallback(
        async (url) => {
            if (url && url.includes('safepay')) {
                await handleURLCallback(url);
                navigation.navigate('PaymentResultScreen', { url });
            }
        },
        [navigation, handleURLCallback]
    );

    useEffect(() => {
        const carregaParametrosRoute = async () => {
            const { cartItensParam, totalPagamentoPram } = await route.params;
            console.log('///////////////////',cartItensParam);
            console.log('*******************',totalPagamentoPram);
        }
        carregaParametrosRoute();
    },[])

    useEffect(() => {
        const getUrlAsync = async () => {
            const initialUrl = await Linking.getInitialURL();
            handleDeepLink(initialUrl);
        };

        const urlCallback = (event) => {
            handleDeepLink(event.url);
        };

        getUrlAsync();

        Linking.addEventListener('url', urlCallback);

        return () => Linking.removeEventListener('url', urlCallback);
    }, [handleDeepLink]);

    return (
        <ScrollView accessibilityLabel="app-root" style={styles.container}>
            <Collapse title="Forma de pagamento">
                <>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Pré-construído (único passo)"   // Prebuilt UI (single-step)
                            onPress={() => {
                                navigation.navigate('PaymentsUICompleteScreen');
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Pré-construído (Várias Etapas)"  // Prebuilt UI (multi-step)
                            onPress={() => {
                                navigation.navigate('PaymentsUICustomScreen');
                            }}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Somente cartão"  // Card element only
                            onPress={() => {
                                navigation.navigate('WebhookPaymentScreen');
                            }}
                        />
                    </View>
                </>
            </Collapse>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomColor: colors.light_gray,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});
