function $DONE(){
  if(!arguments[0])
    print('Test262:AsyncTestComplete');
  else
    print('Error: ' + arguments[0]);
}
