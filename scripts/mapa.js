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
    for (let i = 0; i < this.mapa.length; i++) {
      for (let j = 0; j < this.mapa.length; j++) {

        let [xLeste, yLeste] = [ i, j + 1 ];
        let [xOeste, yOeste] = [i,  j - 1];
        let [xNorte, yNorte] = [ i - 1, j];
        let [xSul, ySul] = [i + 1 , j];
        let [xNordeste, yNordeste] = [i - 1 , j + 1];
        let [xNoroeste, yNoroeste] = [i - 1, j - 1 ];
        let [xSudeste, ySudeste] = [i + 1 , j + 1 ];
        let [xSudoeste, ySudoeste] = [i + 1, j - 1 ];
        
        let count = 0;

        if(i !== this.tamanhoMatriz - 1){
          if (this.mapa[xSul][ySul] === 9 && this.mapa[i][j] !== 9) {
            count++;

            this.mapa[i][j] = count;
          }

          if (this.mapa[xSudeste][ySudeste] === 9 && this.mapa[i][j] !== 9) {
            count++;

            this.mapa[i][j] = count;
          }

          if ( this.mapa[xSudoeste][ySudoeste] === 9 && this.mapa[i][j] !== 9) {
            count++;

            this.mapa[i][j] = count;
          }
        }

        if(i !== 0 ){

          if ( this.mapa[xNorte][yNorte] === 9 && this.mapa[i][j] !== 9) {
          count++;

            this.mapa[i][j] = count;
          }

          if (this.mapa[xNordeste][yNordeste] === 9 && this.mapa[i][j] !== 9) {
            count++;

            this.mapa[i][j] = count;
          }

          if (this.mapa[xNoroeste][yNoroeste] === 9 && this.mapa[i][j] !== 9) {
            count++;

            this.mapa[i][j] = count;
          }
        }

        if (j !== this.tamanhoMatriz - 1 && this.mapa[xLeste][yLeste] === 9 && this.mapa[i][j] !== 9) {
          count++;

          this.mapa[i][j] = count;
        }

        if ( j != 0 && this.mapa[xOeste][yOeste] === 9 && this.mapa[i][j] !== 9) {
          count++;

          this.mapa[i][j] = count;
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