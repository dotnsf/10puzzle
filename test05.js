//. test04.js

//var N = [ n0, n1, n2, n3 ];
//var O = [ o0, o1, o2 ];
// -> [ n, n, *, *, *, *, o ] の組み合わせを作る
//    ただし [ n, n, o, o, n, o ] のみ対象外

//    P1 = [ n, n, n, n, o, o, o ]
//    P2 = [ n, n, n, o, n, o, o ]
//    P3 = [ n, n, n, o, o, n, o ]
//    P4 = [ n, n, o, n, n, o, o ]
//    P5 = [ n, n, o, n, o, n, o ]
//    P6 = [ n, n, o, o, n, n, o ] -> 対象外なので、上記５パターンのみ



//var N = [ n0, n1, n2, n3 ];
//var O = [ o0, o1, o2 ];
//から [ n, n, n, n, o, o, o ] を全て作る
var op = [ '+', '-', '*', '/' ];
function makePatternP1( N, O ){
  return [ N[0], N[1], N[2], N[3], op[O[0]], op[O[1]], op[O[2]] ];
}
function makePatternP2( N, O ){
  return [ N[0], N[1], N[2], op[O[0]], N[3], op[O[1]], op[O[2]] ];
}
function makePatternP3( N, O ){
  return [ N[0], N[1], N[2], op[O[0]], op[O[1]], N[3], op[O[2]] ];
}
function makePatternP4( N, O ){
  return [ N[0], N[1], op[O[0]], N[2], N[3], op[O[1]], op[O[2]] ];
}
function makePatternP5( N, O ){
  return [ N[0], N[1], op[O[0]], N[2], op[O[1]], N[3], op[O[2]] ];
}


//. [0, 1, .., n-1] を並び替えてできる全組み合わせを求める
function makeCombination( n ){
  //console.log( 'n = ' + n );
  var newCombination = [];
  if( n == 1 ){
    newCombination.push( [0] );
  }else{
    var prevCombination = makeCombination( n - 1 );
    for( var i = 0; i < prevCombination.length; i ++ ){
      for( var j = 0; j <= prevCombination[i].length; j ++ ){
        var copied = prevCombination[i].concat();
        copied.splice( j, 0, n - 1 );
        newCombination.push( copied );
      }
    }
  }

  return newCombination;
}

//. [0, 1, .., n-1] から１つ選ぶ、m回を行った時の全組み合わせを求める
function makePermutation( n, m ){
  //console.log( 'n = ' + n + ', m = ' + m );
  var newPermutation = [];
  if( m == 1 ){
    for( var k = 0; k < n; k ++ ){
      newPermutation.push( [k] );
    }
  }else{
    var prevPermutation = makePermutation( n, m - 1 );
    for( var i = 0; i < prevPermutation.length; i ++ ){
      for( var k = 0; k < n; k ++ ){
        var copied = prevPermutation[i].concat();
        copied.push( k );
        newPermutation.push( copied );
      }
    }
  }

  return newPermutation;
}

function rpn_calc( formula ){
  var r = true;
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
        if( ( c == '+' || c == '-' ) && c2 < 0 ){
          c2 = '(' + c2 + ')';
        }
        var c3 = eval( c1 + c + c2 );
        stack.push( c3 );
      }
    }

    a = stack.pop();
    if( typeof a !== 'number' || stack.length > 0 ){
      a = 'error';
    }
  }catch( e ){
    console.log( e );  //. ReferenceError: Invalid left-hand side expression in postfix operation(0123*--)
  }
  //console.log( formula + " = "+ a );
  if( a != 'error '){
    console.log( formula + " : " + rpn2infix( formula ) + " = " + a );
    if( 9.999999 <= a && a <= 10.000001 ){
      r = false;
    }
  }

  return r;
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

function arrayJoin( z ){
  var f = '' + z[0] + z[1] + z[2] + z[3] + z[4] + z[5] + z[6];
  return f;
}




var x = makeCombination( 4 );
var y = makePermutation( 4, 3 );
var b = true;

for( var i = 0; i < x.length && b; i ++ ){
  for( var j = 0; j < y.length && b; j ++ ){
    var b1 = true;
    var b2 = true;
    var b3 = true;
    var b4 = true;
    var b5 = true;
    var z1 = makePatternP1( x[i], y[j] );
    if( z1 && z1.length > 6 ){
      var f = arrayJoin( z1 );
      console.log( 'i = ' + i + ', j = ' + j + ', P = 1 : f = ' + f );
      b1 = rpn_calc( f );
    }
    var z2 = makePatternP2( x[i], y[j] );
    if( z2 && z2.length > 6 ){
      var f = arrayJoin( z2 );
      console.log( 'i = ' + i + ', j = ' + j + ', P = 2 : f = ' + f );
      b2 = rpn_calc( f );
    }
    var z3 = makePatternP3( x[i], y[j] );
    if( z3 && z3.length > 6 ){
      var f = arrayJoin( z3 );
      console.log( 'i = ' + i + ', j = ' + j + ', P = 3 : f = ' + f );
      b3 = rpn_calc( f );
    }
    var z4 = makePatternP4( x[i], y[j] );
    if( z4 && z4.length > 6 ){
      var f = arrayJoin( z4 );
      console.log( 'i = ' + i + ', j = ' + j + ', P = 4 : f = ' + f );
      b4 = rpn_calc( f );
    }
    var z5 = makePatternP5( x[i], y[j] );
    if( z5 && z5.length > 6 ){
      var f = arrayJoin( z5 );
      console.log( 'i = ' + i + ', j = ' + j + ', P = 5 : f = ' + f );
      b5 = rpn_calc( f );
    }

    b = b1 && b2 && b3 && b4 && b5;
  }
}
