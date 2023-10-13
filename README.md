# Gideon v3 with Beer Syntax support

Gideon V3 is now renamed into Beerlang. it now supports emoji syntax;

```beerlang
print "============= Scopes ===============";
var a = "global";
{
  fun showA() {
    print a;
  }

  showA();
  var a = "block";
  showA();
}
var a = "outer";
{
  print a;
  var a = "inner";
  print a;
}
print a;

print " ============== For Loop =============";
for(var a = 0; a < 12; a = a + 1){
    print a;
}

print "================ While Loop ============";
var val =12;
while(val > 0){
    print val;
    val = val - 1;
}

print " =========== Returns =============";
fun fib(n){
    if(n < 2) return n;
    return n * fib(n - 1);
}

var f = fib(10);
print f;

print "=========== Functions ==========";
var a = "global";
{
  fun showA() {
    print a;
  }

  showA();
  var a = "block";
  showA();
}
fun makeCounter() {
  var i = 0;
  fun count() {
    i = i + 1;
    print i;
  }

  return count;
}

var counter = makeCounter();
counter(); // "1".
counter(); // "2".
```

