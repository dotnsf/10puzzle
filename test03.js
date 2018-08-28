//. test03.js

function rpn_calc( formula ){
  var a = 'error';
  try{
    var stack = [];
    for( var i = 0; i < formula.length; i ++ ){
      var c = formula.substr( i, 1 );
      if( '0' <= c && c <= '9' ){
        c = parseInt( c );
      }

      if( typeof c === "number" ){
        stack.push( c );
      }else{
        var c2 = stack.pop();
        var c1 = stack.pop();
        var c3 = eval( c1 + c + c2 );
        stack.push( c3 );
      }
    }

    a = stack.pop();
    if( typeof a !== 'number' || stack.length > 0 ){
      a = 'error';
    }
  }catch( e ){
    console.log( e );
  }
  //console.log( formula + " = "+ a );
  console.log( formula + " : " + rpn2infix( formula ) + " = "+ a );
}

function rpn2infix( rpn ){
  var stack = [];
  for( var i = 0; i < rpn.length; i ++ ){
    var c = rpn.substr( i, 1 );
    if( '0' <= c && c <= '9' ){
      c = parseInt( c );
    }

    if( typeof c === "number" ){
      stack.push( c );
    }else{
      var c2 = stack.pop();
      var c1 = stack.pop();
      if( ( c == '+' || c == '-' ) ){
        c1 = emitBracket( c1 );
        c2 = emitBracket( c2 );
      }
      var c3 = c1 + c + c2;
      if( c == '+' || c == '-' ){
        c3 = '(' + c3 + ')';
      }
      stack.push( c3 );
    }
  }

  var a = stack.pop();
  a = emitBracket( a );
  return a;
}

function emitBracket( infix ){
  if( typeof infix == 'string' && infix.indexOf( '(' ) == 0 && infix.lastIndexOf( ')' ) == infix.length - 1 ){
    var level = 1;
    for( var i = 1; i < infix.length - 1 && level > 0; i ++ ){
      var c = infix.substr( i , 1 );
      if( c == ')' ){
        level --;
      }else if( c == '(' ){
        level ++;
      }
    }
    if( level > 0 ){
      infix = infix.substr( 1, infix.length - 2 );
    }
  }

  return infix;
}

var rpn_formula = process.argv.length > 2 ? process.argv[2] : "12+3*";
rpn_calc( rpn_formula );
