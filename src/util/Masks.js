

//█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ MASCARAS ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█

    // ═════════════════════════ MASCARANDO O CPF ═════════════════════════
    export function mascaraCpf (cpf) {
        var cpfComMascara = '';        
        try { 
            cpfComMascara = cpf.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada

        } catch (error) {
            console.error("Error na classe Masks / mascaraCpf");
        }
        return cpfComMascara;                
    }

    // ═════════════════════════ MASCARANDO O C ═════════════════════════
    export function mascaraCep (cep) {
        var cepComMascara = '';        
        try { 
            cepComMascara = cep.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero            
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1') // captura 3 numeros seguidos de um traço e não deixa ser digitado mais nada

        } catch (error) {
            console.error("Error na classe Masks / mascaraCep");
        }
        return cepComMascara;                
    }

    // ═════════════════════════ RETIRA MASCARA CPF ═════════════════════════
    export function retiraMascaraCpf (cpfComMascara) {
        var cpfSemMascara = '';        
        try { 
            cpfSemMascara =  cpfComMascara.replace(/[^\d]+/g,'');  

        } catch (error) {
            console.error("Error na classe Masks / retiraMascaraCpf");
        }
        return cpfSemMascara;                
    }

    // ═════════════════════════ RETIRA CARACTERES E MANTER SOMENTE NUMEROS ═════════════════════════
    export function retiraMascaraMaterNumeros (string) {
        var somenteNumeros = '';        
        try { 
            somenteNumeros =  string.replace(/[^\d]+/g,'');  

        } catch (error) {
            console.error("Error na classe Masks / retiraMascaraMaterNumeros");
        }
        return somenteNumeros;                
    }


    // ═════════════════════════ MASCARANDO O TELEFONE ═════════════════════════
    export function mascaraTelefone (fone) {
        var foneComMascara = '';        
        try { 


            var x = fone.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            foneComMascara = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    
        } catch (error) {
            console.error("Error na classe Masks / mascaraTelefone");
        }
        return foneComMascara;                
    }



    // document.getElementById('phone').addEventListener('input', function (e) {
    //     var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    //     e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    //   });

    export function mascaraTelefoneCelular( input ) {
        let output = "(";
        input.replace( /^\D*(\d{0,2})\D*(\d{0,4})\D*(\d{0,5})/, function( match, g1, g2, g3 )
            {
              if ( g1.length ) {
                output += g1;
                if ( g1.length == 2 ) {
                    output += ")";
                    if ( g2.length ) {
                        output += " " + g2; 
                        if ( g2.length == 4 ) {
                            output += " - ";
                            if ( g3.length ) {
                                output += g3;
                            }
                        }
                    }
                 }
              }
            }       
          );        
        return output;
       }  




    export function getFormattedPhoneNum( input ) {
        let output = "(";
        input.replace( /^\D*(\d{0,3})\D*(\d{0,3})\D*(\d{0,4})/, function( match, g1, g2, g3 )
            {
              if ( g1.length ) {
                output += g1;
                if ( g1.length == 3 ) {
                    output += ")";
                    if ( g2.length ) {
                        output += " " + g2; 
                        if ( g2.length == 3 ) {
                            output += " - ";
                            if ( g3.length ) {
                                output += g3;
                            }
                        }
                    }
                 }
              }
            }       
          );        
        return output;
       }  


    // ═════════════════════════ MASCARANDO O TELEFONE ═════════════════════════
    export function mascaraValorMoeda (valor) {
        var valorComMascara = '';        
        var v = '0';        
        if(valor === undefined){
            //console.log('8888888888',valor);
        } else {
            v = valor;
        }
        try {                         
            v=v.replace(/\D/g,"") // permite digitar apenas numero
            v=v.replace(/(\d{1})(\d{11})$/,"$1.$2") // coloca ponto antes dos ultimos 11 digitos
            v=v.replace(/(\d{1})(\d{8})$/,"$1.$2") // coloca ponto antes dos ultimos 8 digitos
            v=v.replace(/(\d{1})(\d{5})$/,"$1.$2") // coloca ponto antes dos ultimos 5 digitos
            v=v.replace(/(\d{1})(\d{1,2})$/,"$1,$2") // coloca virgula antes dos ultimos 2 digitos
            //console.log('6666',v);
    
            valorComMascara = v;
        } catch (error) {
            console.error("Error na classe Masks / mascaraValorMoeda  ", error);
        }
        return valorComMascara;                
    }


//█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█