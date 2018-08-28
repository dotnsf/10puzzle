//. test02.js


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

var x = makePermutation( 4, 3 );
console.log( x );

