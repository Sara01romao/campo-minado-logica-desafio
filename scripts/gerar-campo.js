function gameStorage(mode="iniciante", level="facil", wins="0", lose="0"){
  localStorage.setItem("game", JSON.stringify({mode: mode, level: level, wins:wins, lose:lose}));
}

function getGameStorage(){
  let configStorage = localStorage.getItem("game");
  let config = JSON.parse(configStorage);

  let level = config.level;
  let mode = config.mode;

  return ([mode, level]);
}

function iniciar(){
  $.get('./modais/start-modal.html', function(data){
    Swal.fire({
    html: data,
    showConfirmButton: false,
    showCancelButton: false,

    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showCloseButton: false,

    didOpen: () => {
        $("#btnJogar").on("click", function () {
          Swal.close();
          
          if(!localStorage.getItem("game")){
            gameStorage()
          }
          iniciarJogo();
        });

        $("#btnConfig").on("click", function () {
          abrirConfiguracoes("home");
        });
      }
    });

  })
}

iniciar();

function abrirConfiguracoes(screenContext){

 $.get("./modais/config-modal.html", function(data){
    Swal.fire({
        title: `<h3 class="title-config-modal"><i class="fa-solid fa-gear"></i> Configuração</h3>`,
        html:data,
        showClass:{popup:"modal-config"},
        confirmButtonText: "Salvar",
        showCloseButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        
        preConfirm: function () {
          const level = $('input[name="level"]:checked').val();
          const mode = $('input[name="mode"]:checked').val();

          if (!level || !mode) {
            Swal.showValidationMessage("Selecione level e mode!");
            return false;
          }

          return { level, mode };
        }
      }).then(function (result) {
        
        if (result.isConfirmed) {
          if(screenContext === "home"){
            gameStorage( result.value.mode, result.value.level,)
            iniciar();
          }else if(screenContext === "game"){
            gameStorage( result.value.mode, result.value.level,)
            iniciarJogo();
          }

        }
      });

   }).then(()=>{
      let [mode, level] = getGameStorage();

      $('[name=mode]').prop('checked',false);
      $('[name="mode"][value="' + mode + '"]').prop('checked', true);
      $('[name=level]').prop('checked',false);
      $('[name="level"][value="' + level + '"]').prop('checked', true);
   })
}

const inicialJogo = {
  tamanhoMatriz: null,
  dificuldade: null,
  mapa: null
};

function iniciarJogo() {
  let [mode, level] = getGameStorage();
  gameStorage(mode, level)

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

  inicialJogo.tamanhoMatriz = modeMap[mode];
  inicialJogo.dificuldade = levelMap[level];

  inicialJogo.mapa = CampoMinado.Mapa(
   inicialJogo.tamanhoMatriz,
   inicialJogo.dificuldade 
  );
 
  $(".intro").css("display", "block");
  adicionaMapa();
}

$("#configBtn").click(function(){
  abrirConfiguracoes("game");
})

$("#reiniciarBtn").click(function(){
 iniciarJogo()
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
    title: `<h3 class="title-config-modal"><i class="fa-solid fa-trophy"></i> Você Ganhou</h3>`,
    confirmButtonText: "Jogar",

    allowOutsideClick: false,
    allowEscapeKey: false,

  }).then(() => {
    iniciarJogo();
  });
}

function mostrarDerrota() {

  Swal.fire({
    title: `<h3 class="title-config-modal"><i class="fa-solid fa-skull"></i> Perdeu</h3>`,
    confirmButtonText: "Jogar ",

  }).then((result) => {
    if (result.isConfirmed) {
      iniciarJogo();
    }
  });
  
}