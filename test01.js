//. test01.js


//. [0, 1, .., n-1] を並び替えてできる全組み合わせを求める
function makeCombination( n ){
console.log( 'n = ' + n );
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

var x = makeCombination( 3 );
console.log( x );

