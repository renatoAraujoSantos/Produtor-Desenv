//import type { CardFieldInput, PaymentMethodCreateParams } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import Button from './Button';
import PaymentScreen from './PaymentScreen';
import { API_URL } from './Config';
import { colors } from './colors';

export default function WebhookPaymentScreen() {
    const [email, setEmail] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    const { confirmPayment, loading } = useConfirmPayment();

    const fetchPaymentIntentClientSecret = async () => {
        const response = await fetch(`${API_URL}/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                //currency: 'usd',
                currency: 'brl',
                items: [{ id: 'id' }],
                // request_three_d_secure: 'any',
            }),
        });
        const { clientSecret } = await response.json();

        return clientSecret;
    };

    const handlePayPress = async () => {
        // 1. fetch Intent Client Secret from backend          buscar dados do cliente no back-end
        const clientSecret = await fetchPaymentIntentClientSecret();

        // 2. Colete informações de faturamento do cliente (ex. E-mail)
        const billingDetails = {
            email: 'email@stripe.com',
            phone: '+48888000888',
            addressCity: 'Houston',
            //addressCountry: 'US',
            addressCountry: 'BR',
            addressLine1: '1459  Circle Drive',
            addressLine2: 'Texas',
            addressPostalCode: '77063',
        }; // dados simulados para testes

        // 3. Confirme o pagamento com os detalhes do cartão
        // O resto será feito automaticamente usando webhooks
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
            type: 'Card',
            billingDetails,
            setupFutureUsage: saveCard ? 'OffSession' : undefined,
        });

        if (error) {
            Alert.alert(`Erro de código: ${error.code}`, error.message);
            console.log('Erro de confirmação de pagamento', error.message);
        } else if (paymentIntent) {
            Alert.alert(
                'Successo',
                `O pagamento foi confirmado com sucesso! moeda: ${paymentIntent.currency}`   // The payment was confirmed successfully! currency
            );
            console.log('Successo na promise', paymentIntent);
        }
    };

    return (
        <PaymentScreen>
            <TextInput
                autoCapitalize="none"
                placeholder="E-mail"
                keyboardType="email-address"
                onChange={(value) => setEmail(value.nativeEvent.text)}
                style={styles.input}
            />
            <CardField
                postalCodeEnabled={false}
                //autofocus
                placeholder={{
                    number: '4242 4242 4242 4242',
                    postalCode: '12345',
                    cvc: 'CVC',
                    expiration: 'MM|YY',
                }}
                onCardChange={(cardDetails) => {
                    console.log('cardDetails', cardDetails);
                }}
                onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                }}
                cardStyle={inputStyles}
                style={styles.cardField}
            />
            <View style={styles.row}>
                <Switch
                    onValueChange={(value) => setSaveCard(value)}
                    value={saveCard}
                />
                <Text style={styles.text}>Salvar cartão durante o pagamento</Text>
            </View>
            <Button
                variant="primary"
                onPress={handlePayPress}
                title="Pagar"
                loading={loading}
            />
        </PaymentScreen>
    );
}

const styles = StyleSheet.create({
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        marginLeft: 12,
    },
    input: {
        height: 44,
        borderBottomColor: colors.slate,
        borderBottomWidth: 1.5,
    },
});

const inputStyles = {
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderRadius: 8,
    fontSize: 14,
    placeholderColor: '#999999',
};
