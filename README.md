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
    return n + fib(n - 1);
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

## Emoji support for the memes

I am currently figuring out syntax with emojis for Beerlang feel free to leave a pr if you have any suggestions.

```
print  6 ✔ 6;
print  6 ❗10;
print  13 ➡ 6;
print 12 ⬅ 13;
print 12 ➕ 100;

```

```

class Node{
    init(value){
        this.left = nil;
        this.value= value;
        this.right= nil;
    }
}

class Tree{
    init(){
        this.root = nil;
    }
    add(val){
        var newNode = Node(val);
        if(this.root == nil){
            this.root = newNode;
            return newNode;
        }
        var tmp = this.root;
        while(tmp!=nil){
            if(val < tmp.value){
                if(tmp.left == nil){
                    tmp.left = newNode;
                    return newNode;
                }
                tmp = tmp.left;
            }
            else{
                if(tmp.right== nil){
                    tmp.right= newNode;
                    return newNode;
                }
                tmp = tmp.right;
            }
        }
    }
}

fun traverse(node){
    if(node == nil) return;
    print node.value;
    traverse(node.left);
    traverse(node.right);
}

var t = Tree();
t.add(3);
t.add(1);
t.add(0);
t.add(2);
t.add(6);
t.add(9);

trverse(t.root);
```
