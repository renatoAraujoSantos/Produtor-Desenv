import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Button from './Button';
import PaymentScreen from './PaymentScreen';
import { API_URL } from './Config';

export default function PaymentsUICompleteScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
    const [loading, setLoadng] = useState(false);
    const [clientSecret, setClientSecret] = useState();

    const fetchPaymentSheetParams = async () => {
        const response = await fetch(`${API_URL}/payment-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { paymentIntent, ephemeralKey, customer } = await response.json();
        setClientSecret(paymentIntent);
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const openPaymentSheet = async () => {
        if (!clientSecret) {
            return;
        }
        setLoadng(true);
        const { error } = await presentPaymentSheet({
            clientSecret,
        });

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Sucesso', 'O pagamento foi confirmado');
        }
        setPaymentSheetEnabled(false);
        setLoadng(false);
    };

    const initialisePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            customFlow: false,
            merchantDisplayName: 'Example Inc.',
            style: 'alwaysDark',
        });
        if (!error) {
            setPaymentSheetEnabled(true);
        }
    };

    useEffect(() => {
        // No check-out do seu aplicativo, faça uma solicitação de rede ao back-end e inicialize o PaymentSheet.
        // Para reduzir o tempo de carregamento, faça esta solicitação antes que o botão Checkout seja tocado, por exemplo, quando a tela é carregada.
        initialisePaymentSheet();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PaymentScreen>
            <Button
                variant="primary"
                loading={loading}
                disabled={!paymentSheetEnabled}
                title="Checkout"
                onPress={openPaymentSheet}
            />
        </PaymentScreen>
    );
}
