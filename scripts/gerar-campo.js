function iniciar(){
  Swal.fire({
  title: "Campo Minado",
  text: "Escolha uma opção",
  iconHtml: '<i class="fa-solid fa-bomb" "></i>',

  html: `
    <div style="display:flex; flex-direction: column; gap: 10px">
      <button id="btnJogar" class="swal2-confirm swal2-styled">Jogar</button>
      <button id="btnConfig" class="swal2-cancel swal2-styled">Configuração</button>
    </div>
  `,

  showConfirmButton: false,
  showCancelButton: false,

  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,
  showCloseButton: false,

  didOpen: () => {
      $("#btnJogar").on("click", function () {
        Swal.close();
        iniciarJogo();
      });

      $("#btnConfig").on("click", function () {
        Swal.close();
        abrirConfiguracoes();
      });
    }
  });

}

iniciar();

function abrirConfiguracoes(){
 
 Swal.fire({
    title: "Configurações ⚙️",
    html: `
      <div style="text-align:left">
        <p><strong>Nível:</strong></p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <label><input type="radio" name="level" value="facil" checked> Fácil</label>
          <label><input type="radio" name="level" value="medio"> Médio</label>
          <label><input type="radio" name="level" value="dificio"> Difícil</label>
        </div>
        <p style="margin-top:10px"><strong>Modo:</strong></p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <label><input type="radio" name="mode" value="iniciante" checked> Iniciante</label>
          <label><input type="radio" name="mode" value="intermediario"> Intermediario</label>
          <label><input type="radio" name="mode" value="especialista"> Especialista</label>
        </div>
    `,
    confirmButtonText: "Jogar ▶",

    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showCloseButton: false,

    preConfirm: function () {
      const level = $('input[name="level"]:checked').val();
      const mode = $('input[name="mode"]:checked').val();

      console.log(level)

      if (!level || !mode) {
        Swal.showValidationMessage("Selecione level e mode!");
        return false;
      }

      return { level, mode };
    }
  }).then(function (result) {
    if (result.isConfirmed) {
      iniciarJogo(result.value.level, result.value.mode);
    }
  });

}

const inicialJogo = {
  tamanhoMatriz: null,
  dificuldade: null,
  mapa: null
};

function iniciarJogo(level = "facil", mode = "iniciante") {
  $("#mapaArea").empty();

  const levelMap = {
    facil: 0.1,
    medio: 0.2,
    dificil: 0.35
  };

  const modeMap = {
    iniciante: 6,
    intermediario: 8,
    especialista: 12
  };

  inicialJogo.dificuldade = levelMap[level];
  inicialJogo.tamanhoMatriz = modeMap[mode];

  console.log("Matriz:", inicialJogo.tamanhoMatriz);
  console.log("Dificuldade:", inicialJogo.dificuldade);

  inicialJogo.mapa = CampoMinado.Mapa(
    inicialJogo.tamanhoMatriz,
    inicialJogo.dificuldade
  );
  $(".intro").css("display", "block");
  adicionaMapa();
}

$("#configBtn").click(function(){
  abrirConfiguracoes();
})

$("#reiniciarBtn").click(function(){
  iniciar();
})

function adicionaMapa(){
  let containerMapa = $("<div>", {class:"posicaoLista", style:""});

  for(let linhaButton = 0; linhaButton < inicialJogo.tamanhoMatriz; linhaButton++){
    let linhaMapa = $("<div>", {class:"linhaMapa", style:""});
    for(let colunaButton = 0; colunaButton < inicialJogo.tamanhoMatriz; colunaButton++){
      let posicaoItem = $("<div>", {class:"posicaoItem", isOpening:"false",  "data-linha": linhaButton,"data-coluna": colunaButton })
      $(linhaMapa).append(posicaoItem);
    }
    $(containerMapa).append(linhaMapa);
  }
  $("#mapaArea").append(containerMapa);
}

$(document).on("click", ".posicaoItem", function(ev){
  let linha=  parseInt($(this).attr("data-linha"));
  let coluna=  parseInt($(this).attr("data-coluna"));

  let valorPosicao= adicionarValorPosicao(linha, coluna);

  if(inicialJogo.mapa[linha][coluna] !== 9 && inicialJogo.mapa[linha][coluna] == 0){
    revelarPosicaoVizinhas(linha, coluna);
  }

  if($(this).attr("isOpening") === "false"){
    
    $(this).attr("isOpening", true);
    $(this).append( valorPosicao );

    if(inicialJogo.mapa[linha][coluna] === 9){
      perdeuPartida();
      $(this).addClass("last-click");
    }
  }

  ganhouPartida();
})

function adicionarValorPosicao(linha, coluna){
  if(inicialJogo.mapa[linha][coluna] !== 9){  
    return  $("<p>",{class:"valorPosicao",  text: inicialJogo.mapa[linha][coluna]});
  }else{
    return  $("<i>",{class:"fa-solid fa-bomb"});
  }
}

function perdeuPartida(){
  let posicoes = document.querySelectorAll(".posicaoItem");

  posicoes.forEach(e =>{
    let linha= $(e).attr("data-linha");
    let coluna= $(e).attr("data-coluna");

    $(e).css("pointer-events","none");
    
    if(inicialJogo.mapa[linha][coluna] === 9 && $(e).attr("isOpening") === "false"){
      let valorPosicao= adicionarValorPosicao(linha, coluna);
      $(e).attr("isOpening", "true");
      $(e).append( valorPosicao );
    }
  })

  mostrarDerrota()
}

function posicaoVizinhas(linha, coluna){
  let leste = [linha, coluna + 1];
  let oeste = [linha, coluna - 1 ];
  let norte = [linha - 1, coluna];
  let sul = [linha + 1, coluna];
  let nordeste = [linha - 1, coluna + 1];
  let noroeste = [linha - 1, coluna - 1];
  let sudeste = [linha + 1, coluna + 1];
  let sudoeste = [linha + 1, coluna -1];

  return [leste, oeste, norte, sul, nordeste, noroeste, sudeste, sudoeste ];
}

function revelarPosicaoVizinhas(linha, coluna){
  let listaVizinhos = posicaoVizinhas(linha, coluna);
  let posicoes = document.querySelectorAll(".posicaoItem");

  listaVizinhos.forEach(vizinho => {
    let [x , y] = vizinho;
  
    if($(`[data-linha="${x}"][data-coluna="${y}"]`).attr("isOpening") === "false"){

      if(x >= 0 && y >= 0 && x < inicialJogo.mapa.length && y < inicialJogo.mapa.length ){

        if(inicialJogo.mapa[x][y] === 0){
          let valorPosicao= adicionarValorPosicao(x, y);
          $(`[data-linha="${x}"][data-coluna="${y}"]`).attr("isOpening", "true");
          $(`[data-linha="${x}"][data-coluna="${y}"]`).append( valorPosicao );
          revelarPosicaoVizinhas(x , y);
        }

        if(inicialJogo.mapa[x][y] > 0 && inicialJogo.mapa[x][y] < 9){
          let valorPosicao= adicionarValorPosicao(x, y);
              
          $(`[data-linha="${x}"][data-coluna="${y}"]`).attr("isOpening", "true");
          $(`[data-linha="${x}"][data-coluna="${y}"]`).append( valorPosicao );
        }
      }
    }
  })
}

function ganhouPartida() {
  let totalSeguras = 0;
  let abertas = 0;

  for (let i = 0; i < inicialJogo.mapa.length; i++) {
    for (let j = 0; j < inicialJogo.mapa.length; j++) {

      if (inicialJogo.mapa[i][j] !== 9) {
        totalSeguras++;

        let el = $(`[data-linha="${i}"][data-coluna="${j}"]`);
        if (el.attr("isOpening") === "true") {
          abertas++;
        }
      }
    }
  }

  if (abertas === totalSeguras) {
    mostrarVitoria();
  }
}

function mostrarVitoria() {
  Swal.fire({
    title: "🎉 Você ganhou!",
    html: `
      <div style="text-align:center">
        <div style="font-size:40px;">🏆</div>
       
      </div>
    `,
    confirmButtonText: "Jogar novamente 🔄",

    allowOutsideClick: false,
    allowEscapeKey: false,

  }).then(() => {
    iniciarJogo(inicialJogo.level, inicialJogo.mode);
  });
}

function mostrarDerrota() {
  Swal.fire({
    title: "💥 Você perdeu!",
    html: `
      <div style="text-align:center">
        <div style="font-size:40px; margin-bottom:10px;">💣</div>
        
      </div>
    `,
    
    confirmButtonText: "Jogar novamente 🔄",


  }).then((result) => {
    if (result.isConfirmed) {
      iniciar();
    }
  });
}