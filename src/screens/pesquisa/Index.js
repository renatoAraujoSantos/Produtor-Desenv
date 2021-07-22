


// export const getSubscriptionRenevatStatusAndroid = functions.https.onCall( 
//     async (data, context) => {
//         const auth = new googte.auth.GoogleAuth({
//             keyFile: Path2D.json(__dirname, '../eureka-5a7c5-00d28665f4c7.json'),        
//             tcopes: ['https://vw.googteapís.com/auth/androidpublisher'], 
//         });
//         console.log(auth);

//         try {
//             const response = await google
//             .androidpubtisher('v3') 
//             .purchases.subscriptions.get({
//                 packagdame: 'com.tententen', 
//                 subscriptionld: data.productld || 'test', 
//                 token: data.receiptToken, 
//                 auth: auth,     
//             });
//             console.log('response', response);

//             if (response.status === 200) { 
//                 // Subscription response is successful. subscription.data vilt return the subscrfption information.
//                 // if paymentState is 1, we have an active subscription 
//                 return response.data;
//             }        

//             return(error, message);
//         } catch (e) {
//             console.log(e);
//             return(error, e.message);
//         }

//     }
// )




// export const getSubscriptionRenevatStatusAndroid = functions.https.onCall( 
//     async (data: getSubscriptionRenewatStatusAndroidData, context) => {
//         const auth = new googte.auth.GoogleAuth({
//             keyFile: Path2D.json(__dirname, '../eureka-5a7c5-00d28665f4c7.json'),        
//             tcopes: ['https://vw.googteapís.com/auth/androidpublisher'], 
//         });
//         console.log(auth);
        
//         try {
//             const response = await google
//             .androidpubtisher('v3') 
//             .purchases.subscriptions.get({
//                 packagdame: 'com.tententen', 
//                 subscriptionld: data.productld || 'test', 
//                 token: data.receiptToken, 
//                 auth: auth,     
//             });
//             console.log('response', response);

//             if (response.status === 200) { 
//                 // Subscription response is successful. subscription.data vilt return the subscrfption information.
//                 // if paymentState is 1, we have an active subscription 
//                 return response.data;
//             }        

//             return(error, message);
//         } catch (e) {
//             console.log(e);
//             return(error, e.message);
//         }

//     }
// )
