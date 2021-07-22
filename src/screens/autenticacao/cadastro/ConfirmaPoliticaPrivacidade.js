import React from 'react';
import { View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConfirmaPoliticaPrivacidade({ navigation }) {

    return (
        <View style={styles.container}>                              

            <View style={styles.headerTitle}>
                <View style={{ justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 50}}>
                    <Text style={styles.text_header}>Termos de Uso</Text>
                </View>                
                <TouchableOpacity style={{ justifyContent: 'flex-end',}} onPress={() => navigation.goBack()} >
                    <View style={{ justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 50}}>
                        <Text style={styles.text_header}>X</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Animatable.View animation="fadeInUpBig" style={styles.footer} >
                <ScrollView>                    
                    <Text style={styles.textSubTitle}>Bem vindo</Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start' }}>                    
                        <Text style={{ fontSize: 16, marginTop: 25, margin: 10}}>
                            {'O de acordo com esses Termos de Uso é essencial para o uso da plataforma PRODUTOR, bem como de todas as suas funcionalidades.'}                            
                            {'\n\nEsta página é usada para informar os visitantes sobre minhas políticas de coleta, uso e divulgação de Informações Pessoais, caso alguém decida usar meu Serviço. '}
                            {'\n\nSe você optar por usar meu Serviço, você concorda com a coleta e uso de informações em relação a esta política. As informações pessoais que recolho são usadas para fornecer e melhorar o serviço. Não vou usar ou compartilhar suas informações com ninguém, exceto conforme descrito nesta Política de Privacidade.'}
                            {'\n\nOs termos usados ​​nesta Política de Privacidade têm os mesmos significados que em nossos Termos e Condições, que podem ser acessados​​no Produtor, a menos que definido de outra forma nesta Política de Privacidade.'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Definições'}</Text>                        
                            {'\n\na) USUÁRIO – qualquer pessoa física ou jurídica que acesse a plataforma do PRODUTOR, independentemente do fato de ter feito ou não o seu cadastro como ANUNCIANTE;'}
                            {'\n\nb) ANUNCIANTE – qualquer pessoa que tenha interesse em vender ou comprar um produto agrícola ou um serviço relacionado, divulgando sua intenção através da inserção de um anúncio na plataforma PRODUTOR; o ANUNCIANTE poderá ser também um terceiro autorizado a realizar o ANÚNCIO em nome do proprietário da mercadoria, do prestador do serviço relacionado, do interessado na compra do produto ou na contratação do serviço;'}
                            {'\n\nc) COMPRADOR – qualquer pessoa interessada na compra da mercadoria ofertada; '}
                            {'\n\nd) ANÚNCIO – é a oferta de compra ou venda de mercadorias, bens e serviços relacionados ao agronegócio, publicada pelo ANUNCIANTE na plataforma, contendo a descrição detalhada do produto ou serviço que está sendo ofertado para venda ou compra e o preço para a concretização da transação;'}
                            {'\n\ne) TRANSAÇÃO – operação realizada entre o ANUNCIANTE e o COMPRADOR, cujo produto tenha sido anunciado na plataforma PRODUTOR;'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Cadastro, Login, Senha e Segurança'}</Text>
                            {'\n\nO Usuário poderá ser pessoa física ou jurídica. É vedado o cadastro de menores de 18 (dezoito) anos na plataforma PRODUTOR. Ao utilizar o PRODUTOR, o USUÁRIO declara ser maior de 18 anos e estar em plena capacidade para o exercício de todos os atos da vida civil.'}
                            {'\n\nSerá permitido indicar apenas um telefone e apenas um e-mail para a criação de conta e publicação de anúncios de um mesmo USUÁRIO.'}
                            {'\n\nValorizo ​​sua confiança em nos fornecer suas informações pessoais, portanto, estamos nos empenhando para usar meios comercialmente aceitáveis ​​de protegê-las. Mas lembre-se que nenhum método de transmissão pela internet, ou método de armazenamento eletrônico é 100% seguro e confiável, e não posso garantir sua segurança absoluta.'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Coleta e uso de informações'}</Text>                        
                            {'\n\nPara uma melhor experiência, ao usar nosso Serviço, posso solicitar que você nos forneça certas informações de identificação pessoal. As informações que solicito serão retidas em seu dispositivo e não são coletadas por mim de forma alguma.'}
                            {'\n\nO aplicativo usa serviços de terceiros que podem coletar informações usadas para identificá-lo.'}
                            {'\n\nLink para a política de privacidade de provedores de serviços terceirizados usados ​​pelo aplicativo'}
                            
                            {'\n\n'}
                            <Text style = {styles.textLink} onPress = {() => Linking.openURL ('https://www.google.com/policies/privacy/')}>{'Serviços do Google Play'}</Text>
                            {'\n\n'}
                            <Text style = {styles.textLink} onPress = {() => Linking.openURL ('https://firebase.google.com/policies/analytics')}>{'Google Analytics para Firebase'}</Text>
                            {'\n\n'}
                            <Text style = {styles.textLink} onPress = {() => Linking.openURL ('https://firebase.google.com/support/privacy/')}>{'Firebase Crashlytics'}</Text>
                            {'\n\n'}
                            <Text style = {styles.textLink} onPress = {() => Linking.openURL ('https://expo.io/privacy')}>{'Expo'}</Text>

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Dados de registro'}</Text>                            
                            {'\n\nQuero informar que sempre que você utiliza o meu Serviço, em caso de erro no aplicativo, eu coleto dados e informações (através de produtos de terceiros) no seu telefone chamado Log Data. Estes dados de registro podem incluir informações como endereço de protocolo de Internet ("IP") do dispositivo, nome do dispositivo, versão do sistema operacional, configuração do aplicativo ao utilizar meu serviço, hora e data de uso do serviço e outras estatísticas .'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Provedores de serviço'}</Text>                            
                            {'\n\nPosso empregar empresas terceirizadas e indivíduos pelos seguintes motivos:'}
                            {'\n\nPara facilitar nosso serviço;'}
                            {'\n\nPara fornecer o Serviço em nosso nome;'}
                            {'\n\nPara executar serviços relacionados com o serviço ou;'}
                            {'\n\nPara nos ajudar a analisar como nosso Serviço é usado.'}
                            {'\n\nDesejo informar aos usuários deste Serviço que esses terceiros têm acesso às suas Informações Pessoais. O motivo é realizar as tarefas atribuídas a eles em nosso nome. No entanto, eles são obrigados a não divulgar ou usar as informações para qualquer outra finalidade.'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Links para outros sites'}</Text>                            
                            {'\n\nEste serviço pode conter links para outros sites. Se você clicar em um link de terceiros, você será direcionado a esse site. Observe que esses sites externos não são operados por mim. Portanto, eu recomendo fortemente que você analise a Política de Privacidade desses sites. Não tenho controle e não assumo qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Privacidade infantil'}</Text>
                            {'\n\nEstes Serviços não se dirigem a ninguém com idade inferior a 13 anos. Não recolho intencionalmente informações de identificação pessoal de crianças com menos de 13 anos. No caso de descobrir que uma criança com menos de 13 anos forneceu-me informações pessoais, as elimino imediatamente dos nossos servidores. Se você é um dos pais ou responsável e sabe que seu filho nos forneceu informações pessoais, entre em contato comigo para que eu possa tomar as medidas necessárias.'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Mudanças nesta Política de Privacidade'}</Text>                            
                            {'\n\nPosso atualizar nossa Política de Privacidade de tempos em tempos. Portanto, recomendamos que você revise esta página periodicamente para verificar quaisquer alterações. Irei notificá-lo de quaisquer alterações, postando a nova Política de Privacidade nesta página.'}
                            {'\n\nEsta política entra em vigor em 2020-10-15'}

                            {'\n\n\n'}
                            <Text style={styles.textSubTitle}>{'Contate-Nos'}</Text>                            
                            {'\n\nSe você tiver alguma dúvida ou sugestão sobre a minha Política de Privacidade, não hesite em me contatar em renato.colossus@gmail.com.'}
                            {/* {'\n\nEsta página de política de privacidade foi criada em privacypolicytemplate.net e modificada / gerada pelo App Privacy Generator'} */}
                            
                        </Text>
                    </View>

                </ScrollView>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.signIn} onPress={() => navigation.navigate('CadastroUsuarioSemLocation')}  >
                            <LinearGradient colors={['#56BA42', '#3c812e']} style={styles.signIn} >
                                <Text style={[styles.textButton, { color: '#fff' }]}>Concordo</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>                
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3c812e'
    },
    textSubTitle: {
        color: '#05375a', 
        fontSize: 18, 
        fontWeight: 'bold'
    },
    textLink: {
        color: 'skyblue', 
        fontSize: 18, 
        fontWeight: 'bold'
    },
    textButton: {
        fontSize: 18,
        fontFamily: 'Roboto_400Regular',        
        fontWeight: 'bold',        
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    headerTitle: {
        flex: 1, 
        flexDirection:'row', 
        justifyContent: 'space-between', 
        marginTop: 20,         
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    button: {
        alignItems: 'center',
        marginTop: 20,        
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,        
    },

});
