//. test04

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

var x = makeCombination( 4 );
var y = makePermutation( 4, 3 );
