import * as UrlImagensSistema from '../constants/UrlImagensSistema';

const Images = [
    { image: source = { uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER1 } },
    { image: source = { uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER2 } },
    { image: source = { uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER3 } },
    { image: source = { uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER4 } },
    { image: source = { uri: UrlImagensSistema.URL_BANNER_FOOD_BANNER5 } },
];

export const data = [
    {
        id: '1',
        coordinate: {
            latitude: 22.6293867,
            longitude: 88.4354486,
        },
        title: 'Produtor 1',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[0].image,
        rating: 4,
        reviews: 99,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '2',
        coordinate: {
            latitude: 22.6345648,
            longitude: 88.4377279,
        },
        title: 'Produtor 2',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[1].image,
        rating: 5,
        reviews: 102,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '3',
        coordinate: {
            latitude: 22.6281662,
            longitude: 88.4410113,
        },
        title: 'Produtor 3',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[2].image,
        rating: 3,
        reviews: 220,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '4',
        coordinate: {
            latitude: 22.6341137,
            longitude: 88.4497463,
        },
        title: 'Produtor 4',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[3].image,
        rating: 4,
        reviews: 48,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '5',
        coordinate: {
            latitude: 22.6292757,
            longitude: 88.444781,
        },
        title: 'Produtor 5',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[4].image,
        rating: 4,
        reviews: 178,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '6',
        coordinate: {
            latitude: 22.6293867,
            longitude: 88.4354486,
        },
        title: 'Produtor 6',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque est metus, gravida vel ex volutpat, posuere euismod tortor. Pellentesque tincidunt, mi ac varius blandit, quam orci dignissim risus, vitae rutrum orci urna ut neque.
      
      Pellentesque condimentum ut libero id blandit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`,
        image: Images[0].image,
        rating: 4,
        reviews: 99,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
    {
        id: '7',
        coordinate: {
            latitude: 22.6345648,
            longitude: 88.4377279,
        },
        title: 'Produtor 7',
        description: `Uma das principais condições para a viabilidade econômica de um empreendimento agropecuário é a escala mínima de operação em determinado mercado. Este indicador depende, entre outros fatores, das tecnologias disponíveis e das condições de comercialização do produtor. A escala é critica porque em muitas atividades existem economias de escala, isto é, o aumento na produção acumulada reduz os custos unitários (recursos gastos por unidade de produto).
      
    Ainda segundo o levantamento, a agricultura familiar produz 70% do feijão nacional, 34% do arroz, 87% da mandioca, 46% do milho, 38% do café e 21% do trigo. O setor também é responsável por 60% da produção de leite, 59% do rebanho suíno, 50% das aves e 30% dos bovinos.`,
        image: Images[1].image,
        rating: 5,
        reviews: 102,
        categories: ['Verduras', 'Frutas', 'Pescados'],
    },
];

export const MESES = [
    {
        label: 'AC',
        value: '1'
    },
    {
        label: 'AL',
        value: '2'
    },
    {
        label: 'AM',
        value: '3'
    },
    {
        label: 'AP',
        value: '4'
    },
    {
        label: 'BA',
        value: '5'
    },
    {
        label: 'CE',
        value: '6'
    },
    {
        label: 'DF',
        value: '7'
    },
    {
        label: 'ES',
        value: '8'
    },
    {
        label: 'GO',
        value: '9'
    },
    {
        label: 'MA',
        value: '10'
    },
    {
        label: 'MG',
        value: '11'
    },
    {
        label: 'MS',
        value: '12'
    },
    {
        label: 'MT',
        value: '13'
    },
    {
        label: 'PA',
        value: '14'
    },
    {
        label: 'PB',
        value: '15'
    },
    {
        label: 'PE',
        value: '16'
    },
    {
        label: 'PI',
        value: '17'
    },
    {
        label: 'PR',
        value: '18'
    },
    {
        label: 'RJ',
        value: '19'
    },
    {
        label: 'RN',
        value: '20'
    },
    {
        label: 'RO',
        value: '21'
    },
    {
        label: 'RR',
        value: '22'
    },
    {
        label: 'RS',
        value: '23'
    },
    {
        label: 'SC',
        value: '24'
    },
    {
        label: 'SE',
        value: '25'
    },
    {
        label: 'SP',
        value: '26'
    },
    {
        label: 'TO',
        value: '27'
    },
];

export const CATEGORIA =
{
    label: 'A definição dos produtos e serviços que compõem um mercado depende da maneira como se deseja analisá-lo. Para uma análise abrangente (por exemplo, do mercado de alimentos), é necessário agregar (ou incluir) diferentes tipos de produtos em uma mesma categoria (grãos, carnes, frutas, legumes, etc.). \n\n Para uma análise res-trita, é necessário diferenciar os bens e serviços em categorias bem específicas (por exemplo, cortes especiais de carne suína em embalagem para uma pessoa). \n\n De forma geral, as categorias de análise agregam produtos e serviços que mantêm certo grau de similaridade entre si (possibilidade de substituição). Assim, ao definir o mercado de alimentos, entende-se que há maior substitutibilidade entre grãos e carnes do que entre grãos e vestuário (que não compõem o grupo alimentos). Da mesma forma, há maior substitutibilidade entre carne bovina e carne suína (que compõem o grupo de carnes) do que entre carne bovina e frutas (que compõem o grupo chamado FLV, ou seja, frutas, legumes e verduras).'
}

export const DESTAQUE = [
    {
        titulo: 'Café',
        label: 'O Brasil ainda é o maior produtor mundial, responsável por cerca de 1/3 do total mundial, seguido por Colômbia e Vietnã. Os principais estados produtores são Minas Gerais, Espírito Santo, São Paulo, Paraná, Bahia e Rondônia.o Brasil ainda é o maior produtor mundial, responsável por cerca de 1/3 do total mundial, seguido por Colômbia e Vietnã. Os principais estados produtores são Minas Gerais, Espírito Santo, São Paulo, Paraná, Bahia e Rondônia.'
    },
    {
        titulo: 'Cana-de-açúcar',
        label: 'Também é o maior produtor mundial, seguido de Índia, China, EUA e Tailândia. O estado de São Paulo responde por mais de 70% da produção nacional, com destaque também para Pernambuco, Alagoas, Paraná, Minas Gerais, Goiás, Mato Grosso e Mato Grosso do Sul.'
    },
    {
        titulo: 'Laranja',
        label: 'O país é o maior produtor mundial tanto da fruta quanto do suco, sendo responsável por mais de 80% do comércio mundial dessa commodity. São Paulo é o principal polo citricultor do país, com destaque para as cidades de Araraquara, Matão, Itápolis, Bebedouro, Olímpia e Monte Azul Paulista. EUA, China e Índia vêm na sequência, na produção mundial.'
    },
    {
        titulo: 'Soja',
        label: 'A sojicultura tem sido, nas últimas décadas, o maior destaque da produção agrícola nacional. Até a década de 1970, restrita praticamente à região Sul, essa espécie originalmente de climas temperados ganhou novas variedades, mais adaptadas a climas quentes, espalhando-se em todas as regiões do país, até o Norte e o Nordeste.'
    },
    {
        titulo: 'Milho',
        label: 'O país está entre os maiores produtores mundiais, com destaque para os estados do Paraná, Rio Grande do Sul, Santa Catarina, Minas Gerais e Goiás.'
    },
    {
        titulo: 'Frutas',
        label: 'O clima tropical, que abrange a maior parte do território brasileiro, torna-o favorável à produção de grande variedade de frutas. Merece destaque a fruticultura irrigada, na região entre Petrolina (PE) e Juazeiro (BA), situadas no vale médio do rio São Francisco, cuja produção de manga, melancia, maracujá, melão, acerola, entre outras, visa principalmente à exportação.'
    },
]

export const LISTADESTAQUE = [
    [
        0,
        "",
    ],
    [
        1,
        "",
    ],
    [
        2,
        "",
    ],
    [
        3,
        "",
    ],
    [
        4,
        "",
    ],

]





export function getIngredientName(ingredientID) {
    let name;
    ingredients.map(data => {
        if (data.ingredientId == ingredientID) {
            name = data.name;
        }
    });
    return name;
}


export function getAllIngredients(idArray) {
    const ingredientsArray = [];
    idArray.map(index => {
        ingredients.map(data => {
            if (data.ingredientId == index[0]) {
                ingredientsArray.push([data, index[1]]);
            }
        });
    });
    return ingredientsArray;
}




export const ingredients = [
    {
        ingredientId: 0,
        name: 'Café',
        photo_url: 'http://i.mlcdn.com.br/portaldalu/fotosconteudo/11869.jpg'
    },
    {
        ingredientId: 1,
        name: 'Cana-de-açúcar',
        photo_url:
            'https://img.vixdata.io/pd/webp-large/pt/sites/default/files/c/cana-de-acucar-0117-1400x800.jpg'
    },
    {
        ingredientId: 2,
        name: 'Laranja',
        photo_url: 'https://img.elo7.com.br/product/main/185C05A/aromatizador-de-ambiente-laranja-aromatizador-de-ambiente-laranja.jpg'
    },
    {
        ingredientId: 3,
        name: 'Soja',
        photo_url:
            'https://www.udop.com.br/u_img/noticias/2020/soja3.jpg'
    },
    {
        ingredientId: 4,
        name: 'Milho',
        photo_url: 'https://www.confianca.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/3/9/39148-4.jpg.jpg'
    },
    {
        ingredientId: 5,
        name: 'Frutas',
        photo_url: 'https://www.abracomex.org/wp-content/uploads/2019/08/exportacao-de-frutas.png'
    },
    {
        ingredientId: 6,
        name: 'Dried sage',
        photo_url:
            'https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/Esxjvv7/super-slow-motion-dried-sage-falling-on-white-background_n1xg2gxzg__F0000.png'
    },
];


export const TIPOS_CONTA_BANCO = [
    {
        label: 'Conta Corrente',
        value: '1'
    },
    {
        label: 'Conta Popança',
        value: '2'
    },
];
