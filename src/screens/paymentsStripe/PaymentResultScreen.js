import React from 'react';
import { PaymentIntent, useStripe } from '@stripe/stripe-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import PaymentScreen from './PaymentScreen';

export default function PaymentResultScreen({ route }) {
    const [result, setResult] = useState();
    const [
        paymentIntentResult,
        setPaymentIntentResult,
    ] = useState();
    const { retrievePaymentIntent } = useStripe();

    const retrievePaymentIntentObject = useCallback(
        async (clientSecret) => {
            const { paymentIntent, error } = await retrievePaymentIntent(
                clientSecret
            );
            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
            } else if (paymentIntent) {
                setPaymentIntentResult(paymentIntent);
                setResult(JSON.stringify(paymentIntent, null, 2));
            }
        },
        [retrievePaymentIntent]
    );

    useEffect(() => {
        const { url } = route.params;
        const paymentIntentClientSecret = /payment_intent_client_secret=(.*)&/.exec(
            url
        );

        if (paymentIntentClientSecret?.[1]) {
            retrievePaymentIntentObject(paymentIntentClientSecret[1]);
        } else {
            setResult(url);
        }
    }, [retrievePaymentIntentObject, route]);

    return (
        <PaymentScreen>
            {paymentIntentResult && (
                <Text style={styles.text}>
                    Status de intenção de pagamento: {paymentIntentResult?.status}
                </Text>
            )}

            <Text>{result}</Text>
        </PaymentScreen>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        fontWeight: '700',
        paddingBottom: 20,
    },
});
