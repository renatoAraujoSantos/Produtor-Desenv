


//╔═══════════════════════════════════════════════════════════════════════════╗
//   SALVANDO IMAGEM
//╚═══════════════════════════════════════════════════════════════════════════╝
export async function mergeArrays(array1, array2) {        

    var result1 = [
        {id:1, name:'Sandra', type:'user', username:'sandra'},
        {id:2, name:'John', type:'admin', username:'johnny2'},
        {id:3, name:'Peter', type:'user', username:'pete'},
        {id:4, name:'Bobby', type:'user', username:'be_bob'}
    ];
    
    var result2 = [
        {id:2, name:'John', email:'johnny@example.com'},
        {id:4, name:'Bobby', email:'bobby@example.com'}
    ];
    
    var props = ['id', 'name'];
    
    var result = result1.filter(function(o1){
        // filter out (!) items in result2
        return !result2.some(function(o2){
            return o1.id === o2.id;          // assumes unique id
        });
    }).map(function(o){
        // use reduce to make objects with only the required properties
        // and map to apply this to the filtered array as a whole
        return props.reduce(function(newo, name){
            newo[name] = o[name];
            return newo;
        }, {});
    });

    return result;
}



export async function organizaArrayMarcadoProdutosSelecionados(arrayPesquisaBanco, arrayItensCarrinhoSelecionado) {        

    var resultado = [];
    var itensSELECIONADOCarrinho = arrayPesquisaBanco.filter(function(o1){                        
        return arrayItensCarrinhoSelecionado.some(function(o2){
            return o1.idProduto === o2.idProduto;          // assumes unique id
        });
    }).map(x => {
        x.selecionado = true;                                   
        return x;
    });

    var itensNAOSelecionadoDoCarrinho = arrayPesquisaBanco.filter(function(o1){                        
        return !arrayItensCarrinhoSelecionado.some(function(o2){
            return o1.idProduto === o2.idProduto;          // assumes unique id
        });
    }).map(x => {
        x.selecionado = false;
        return x;
    })    
    
    itensSELECIONADOCarrinho.map(x => {
        resultado.push(x);
    });
    itensNAOSelecionadoDoCarrinho.map(x => {
        resultado.push(x);
    });

    // Teste caso encontre alguma duplicidade --- estou nem usando nesse momeno mas deixa aqui kkkkk
    let x = resultado.filter((a, b) => resultado.indexOf(a) === b)

    return resultado;
    
}