class CampoMinado{
  constructor(tamanho, dificuldade){
    this.tamanhoMatriz = tamanho ?? 6;
    this.dificuldade = dificuldade ?? 0.5;
    this.qtdMinas = 0;
    this.listaMinas = [];
    this.mapa = [];
  }

  static Mapa(tamanho, dificuldade){
    const novoMapa = new CampoMinado(tamanho, dificuldade);
    novoMapa.initialize();
    return novoMapa.mapa;
  }

  initialize(){
    this.calcQtdMinas();
    this.criarMinas();
    this.inicializaMapa();
    this.adicionarMinasMapa();
    this.vericarQtdMinas();
    // this.imprimir();
  }

  calcQtdMinas(){
   return this.qtdMinas = Math.floor(Math.pow(this.tamanhoMatriz - 1, 2) * this.dificuldade)
  }

  geradorPosicaoMina() {
    return Math.floor(Math.random() * (this.tamanhoMatriz - 0) + 0);
  }

  criarMinas(){
    while (this.listaMinas.length < this.qtdMinas){
      let linhaMina = this.geradorPosicaoMina();
      let colunaMina = this.geradorPosicaoMina();

      if(!this.listaMinas.some(item => item[0] === linhaMina && item[1]== colunaMina)){
        this.listaMinas.push([linhaMina, colunaMina]);  
      }
    }
  }

  inicializaMapa(){
    for (let linMatriz = 0; linMatriz < this.tamanhoMatriz; linMatriz++) {
      this.mapa[linMatriz] = [];

      for (let colMatriz = 0; colMatriz < this.tamanhoMatriz; colMatriz++) {
        this.mapa[linMatriz][colMatriz] = 0;
      }
    }
  }

  adicionarMinasMapa(){
    for (let indexMina = 0; indexMina< this.listaMinas.length; indexMina++) {
      const [x, y] = this.listaMinas[indexMina];
      this.mapa[x][y] = 9;
    }
  }

  vericarQtdMinas(){
    for (let linha = 0; linha < this.mapa.length; linha++) {
      for (let coluna = 0; coluna < this.mapa.length; coluna++) {

        if((this.mapa[linha][coluna] !== 9)){

          let leste = [ linha, coluna + 1 ];
          let oeste = [linha,  coluna - 1];
          let norte = [ linha - 1, coluna];
          let sul = [linha + 1 , coluna];
          let nordeste = [linha - 1 , coluna + 1];
          let noroeste = [linha - 1, coluna - 1 ];
          let sudeste = [linha + 1 , coluna + 1 ];
          let sudoeste = [linha + 1, coluna - 1 ];
        
          let posicoes = [leste, oeste, norte, sul, nordeste, noroeste, sudeste, sudoeste];
          let count = 0;
          
          for(let indexPosicao = 0; indexPosicao < posicoes.length; indexPosicao++){
            let [linPosicao, colPosicao] = posicoes[indexPosicao]
            
            if((linPosicao >= 0 && linPosicao <= this.tamanhoMatriz - 1) && (colPosicao >= 0 && colPosicao <=  this.tamanhoMatriz - 1)){
            
              if(this.mapa[linPosicao][colPosicao] === 9){
                count++;
                this.mapa[linha][coluna] = count;
              }
            }
          }
        }
      }
    }
  }

  imprimir(){
    this.mapa.forEach((element) => {
      console.log(element);
    });
  }
}