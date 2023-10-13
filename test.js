var a = "outer";
{
  console.log(a);
  var a = "inner";
    console.log(a);
}
