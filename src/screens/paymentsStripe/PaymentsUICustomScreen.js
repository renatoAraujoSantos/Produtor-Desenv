import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { colors } from './colors';
import Button from './Button';
import PaymentScreen from './PaymentScreen';
import { API_URL } from './Config';
import * as Api from '../../store/ApiSpring';
import * as ActionTypes from '../../constants/ActionTypes';

export default function PaymentsUICustomScreen() {
    const {
        initPaymentSheet,
        presentPaymentSheet,
        confirmPaymentSheetPayment,
    } = useStripe();
    const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

  /*╔═══════════════════════════════════════════════════════════════════════════╗
       RETORNO DA PRIMEIRA CONSULTA, AO CARREGAR A TELA 
       O BACK RETORNA ESSES TRES CARAS:
                                            paymentIntent,
                                            ephemeralKey,
                                            customer,
    ╚═══════════════════════════════════════════════════════════════════════════╝ */
    const fetchPaymentSheetParams = async () => {

        const payment = {
            name: 'Iphone',
            currency: 'brl',
            // amount on cents *10 => to be on dollar
            amount: 99900,
            quantity: '1',
            cancelUrl: 'http://localhost:4200/cancel',
            successUrl: 'http://localhost:4200/success',
          };

          const customerJson = {
            id: 'cus_JopsZ1YEF5YEiv',
            email: 'desenv.developer@gmail.com',
            currency: 'brl'
          };

          
        const response2 = await Api.postRequest(`api/customer`, `POST`, customerJson);
        console.log('444444444444444444444', response2.respostaRequisicao.data);

        let paymentIntent = '';
        let ephemeralKey = '';
        let customer = '';
        if (response2.numeroStatusResposta === ActionTypes.SUCESSO_NA_REQUISICAO) {
            paymentIntent = response2.respostaRequisicao.data.paymentIntent;
            ephemeralKey = response2.respostaRequisicao.data.ephemeralKey;
            customer = response2.respostaRequisicao.data.customer;
        }
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };

        // const response = await fetch(`${API_URL}/payment-sheet`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
        // const { paymentIntent, ephemeralKey, customer } = await response.json();
        // return {
        //     paymentIntent,
        //     ephemeralKey,
        //     customer,
        // };
    };

    const initialisePaymentSheet = async () => {
        setLoading(true);

        try {
            const {
                paymentIntent,
                ephemeralKey,
                customer,
            } = await fetchPaymentSheetParams();

             console.log('--------  front  paymentIntent', paymentIntent);
             console.log('--------  front  ephemeralKey', ephemeralKey);
             console.log('--------  front  customer', customer);

            const { error, paymentOption } = await initPaymentSheet({
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                customFlow: true,
                merchantDisplayName: 'Example Inc.',
                applePay: true,
                merchantCountryCode: 'BR',
                style: 'alwaysDark',
                googlePay: true,
                testEnv: true,
            });

            if (!error) {
                setPaymentSheetEnabled(true);
            }
            if (paymentOption) {
                setPaymentMethod(paymentOption);
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };


    //╔═══════════════════════════════════════════════════════════════════════════╗
    //   ESCOLHENDO FORMA DE PAGAMENTO
    //╚═══════════════════════════════════════════════════════════════════════════╝
    const choosePaymentOption = async () => {
        const { error, paymentOption } = await presentPaymentSheet({
            confirmPayment: false,
        });

        if (error) {
            console.log('error', error);
        } else if (paymentOption) {
            setPaymentMethod({
                label: paymentOption.label,
                image: paymentOption.image,
            });
        } else {
            setPaymentMethod(null);
        }
    };



    //╔═══════════════════════════════════════════════════════════════════════════╗
    //   FINALIZAR A COMPRA
    //╚═══════════════════════════════════════════════════════════════════════════╝
    const onPressBuy = async () => {
        setLoading(true);
        const { error } = await confirmPaymentSheetPayment();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Successo', 'O pagamento foi confirmado com sucesso!');
            setPaymentSheetEnabled(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        // No check-out do seu aplicativo, faça uma solicitação de rede ao back-end e inicialize o PaymentSheet.
        // Para reduzir o tempo de carregamento, faça esta solicitação antes que o botão Checkout seja tocado, por exemplo, quando a tela é carregada.
        initialisePaymentSheet();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PaymentScreen>
            <View>
                <Button
                    variant="primary"
                    loading={loading}
                    title={
                        paymentMethod ? (
                            <View style={styles.row}>
                                <Image
                                    source={{
                                        uri: `data:image/png;base64,${paymentMethod.image}`,
                                    }}
                                    style={styles.image}
                                />
                                <Text style={styles.text}>{paymentMethod.label}</Text>
                            </View>
                        ) : (
                            'Escolha a Forma de Pagamento'
                        )
                    }
                    disabled={!paymentSheetEnabled}
                    onPress={choosePaymentOption}
                />
            </View>

            <View style={styles.section}>
                <Button
                    variant="primary"
                    loading={loading}
                    disabled={!paymentMethod || !paymentSheetEnabled}
                    title="Comprar"
                    onPress={onPressBuy}
                />
            </View>
        </PaymentScreen>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginTop: 40,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    paymentMethodTitle: {
        color: colors.slate,
        fontWeight: 'bold',
    },
    image: {
        width: 26,
        height: 20,
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
});
