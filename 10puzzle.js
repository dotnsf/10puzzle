//. 10puzzle.js
class p10{
  constructor( arr ){
    //. 与えられた数列
    this.a = arr;
    //. 数列のサイズ
    this.num = arr.length;

    //. 与えられた数列 a を並べ替えてできる全組み合わせ（の並べ替え順序パターン）
    this.x = this.makeCombination( this.num );
    //. 四則演算
    this.y = [ '+', '-', '*', '/' ];

    //. [ p(0), p(1), .., p(k) ] と [ q(0), q(1), .., q(k) ] を順序を変えずに混ぜてできる配列の全組み合わせ
    this.c = [];
    //. y の中から１つを選ぶ、を (num-1) 回繰り返してできる全組み合わせ
    this.d = [];
  }


  //. [0, 1, .., n-1] を並び替えてできる全組み合わせを求める
  makeCombination( n ){
    //console.log( 'n = ' + n );
    var newCombination = [];
    if( n == 1 ){
      newCombination.push( [0] );
    }else{
      var prevCombination = this.makeCombination( n - 1 );
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

  //. [0, 1, .., n-1] から m 個を重複有りで選ぶ全組み合わせを求める
  findAllCombination( n, m ){
    this.d = [];
    var ans = [];
    this.arec( 0, n, m, ans );
  }

  arec( i, n, m, ans ){
    if( i == m ){
      this.d.push( JSON.parse( JSON.stringify( ans ) ) );
    }else{
      for( var j = 0; j < n; j ++ ){
        ans[i] = j;
        this.arec( i + 1, n, m, ans );
      }
    }
  }

  //. [0, 1, .., n-1] から m 個を重複無しで選ぶ全組み合わせを求める
  findCombination( n, m ){
    this.c = []; //new Array(n);
    var ans = [];
    this.rec( 0, n, m, ans );
  }

  rec( i, n, m, ans ){
    if( i == n ){
      var cnt = 0;
      for( var j = 0; j < ans.length; j ++ ){
        if( ans[j] == 1 ){ cnt ++; }
      }
      if( cnt == m ){
        var f = [];
        for( var j = 0; j < ans.length; j ++ ){
          if( ans[j] == 1 ){ f.push( j ) }
        }
        this.c.push( f );
      }
    }else{
      ans[i] = 0;
      this.rec( i + 1, n, m, ans );

      ans[i] = 1;
      this.rec( i + 1, n, m, ans );
    }
  }

  //. '1 2 3 4 + - *' 式を '1 * ( 2 - ( 3 + 4 ) )' に変換する
  toNormalFormula( formula ){
    var stack = [];
    for( var i = 0; i < formula.length; i ++ ){
      var f = formula[i];
      if( typeof f == 'string' ){
        var a2 = stack.pop();
        var a1 = stack.pop();

        //if( typeof a1 == 'number' && a1 < 0 ){ a1 = '(' + a1 + ')'; }
        if( typeof a1 == 'number' && a1 < 0 ){
          a1 = '(' + a1 + ')';
        }else if( typeof a1 == 'string' ){
          switch( f ){
          case '+':
            a1 = a1.substr( 1, a1.length - 2 );
            break;
          case '-':
            a1 = a1.substr( 1, a1.length - 2 );
            break;
          case '*':
            break;
          case '/':
            break;
          }
        }
        //if( typeof a2 == 'number' && a2 < 0 ){ a2 = '(' + a2 + ')'; }
        if( typeof a2 == 'number' && a2 < 0 ){
          a2 = '(' + a2 + ')';
        }else if( typeof a2 == 'string' ){
          switch( f ){
          case '+':
            a2 = a2.substr( 1, a2.length - 2 );
            break;
          case '-':
            break;
          case '*':
            break;
          case '/':
            break;
          }
        }
        f = '(' + a1 + f + a2 + ')';
      }
      stack.push( f );
    }

    var r = stack.pop();
    r = r.substr( 1, r.length - 2 );

    return r;
  }

  filo_eval( formula ){
    var stack = [];
    for( var i = 0; i < formula.length; i ++ ){
      var f = formula[i];
      if( typeof f == 'string' ){
        var a2 = stack.pop();
        var a1 = stack.pop();
        if( f == '/' && a2 == 0 ){
          return undefined;
        }else{
          f = eval( '(' + a1 + ')' + f + '(' + a2 + ')' );
        }
      }
      stack.push( f );
    }

    var r = stack.pop();
    /*
    if( r != Math.floor( r ) ){
      //. 丸め誤差が発生している可能性？
    }
    */

    return r;
  }

  findAnswer(){
    var r = null; //'not found.';
    var b = false;

    //. 数値は a = [ a(0), a(1), .., a(num-1) ] に入っているとする。
    //. 演算で使う四則演算( y = [ '+', '-', '*', '/' ])は ( num - 1 ) 個

    //. 求める必要があるのは以下の２つ：
    //. - a = [ a(0), a(1), .., a(num-1) ] を並び替えた n = [ n(0), n(1), .., n(num-1) ]
    //. - y から１つを (num-1) 個選んだ d = [ d(0), d(1), .., d(num-2) ]
    //. - n と d を組み合わせて RP = [ r(0), r(1), r(2), ..., r(2*num-4), r(2*num-3) ]式を作る。
    //.   ただし r(0) = n(0), r(1) = n(1), r(2*num-3) = d(num-2) は固定、それ以外を全ての組み合わせで求める
    //.   つまり r(2) から r(2*num-4) の部分を n や d から組み合わせて求める(*)
    //. - RP を計算して、10 になるかどうかを調べる
    //. - 10 になっていたら RP 式を NP 式に変換して表示

    //. (*) 全ての組み合わせで RP 式が成立するわけではない。
    //.     例えば r = [ d(0), d(1), n(0), .. ] のように r の数列の登場順で n よりも d が２つ以上先行してしまうと NP 式としては不成立
    //.        1 2 + + 3 ...
    //.     また 0 で割るケースも考慮に含める必要がある

    var len = ( this.num - 2 ) * 2;
    this.findCombination( len, len / 2 );
    //console.log( this.c.join( ' ' ) );

    for( var i = 0; i < this.x.length && !b; i ++ ){
      var z = this.x[i];  //. [ 0, 3, 2, 1 ];
      var n = new Array( this.a.length );
      for( var j = 0; j < this.a.length; j ++ ){
        var idx = z[j];
        n[j] = this.a[idx];
      }

      //. ( num - 1 ) 個の要素からなる m を生成する必要がある
      this.findAllCombination( 4, this.num - 1 );
      //console.log( this.d.join( ' ' ) );

      for( var idx0 = 0; idx0 < this.d.length && !b; idx0 ++ ){
        var _d = this.d[idx0];
        //. _d = [ 0, 1, 0 ];
        var m = [];
        for( var idx1 = 0; idx1 < _d.length; idx1 ++ ){
          var __d = _d[idx1];
          m.push( this.y[__d] );
        } //. m = [ '+', '-', '*' ];

        for( var idx2 = 0; idx2 < this.c.length && !b; idx2 ++ ){
          var _c = this.c[idx2];

          //. _c の妥当性を確認する
          var _p = [ n[0], n[1] ];
          var n_idx = 2;
          var m_idx = 0;
          var idx_flag = true;
          for( var j = 0; j < _c.length * 2; j ++ ){
            if( _c.indexOf( j ) > -1 ){
              _p.push( n[n_idx++] );
            }else{
              _p.push( m[m_idx++] );

              if( m_idx + 1 > n_idx ){
                idx_flag = false;
              }
            }
          }

          if( idx_flag ){
            _p.push( m[m_idx] );

            var e = this.filo_eval( _p );
            if( e == 10 ){
              r = this.toNormalFormula( _p );
              b = true;
            }
          }
        }
      }
    }

    return r;
  }
}

/*
//. 理論上では３つ以上ならイケるはず
var l = process.argv.length;
if( l > 4 && l < 8 ){
  var a = [];
  for( var i = 2; i < l; i ++ ){
    a.push( parseInt( process.argv[i] ) );
  }

  var p = new p10( a );
  var ans = p.findAnswer();
  console.log( ans );
}else{
  console.log( '$ node 10puzzle n1 n2 n3 (n4) (n5)' );
}
*/
