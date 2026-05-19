function abrirConfiguracoes(){
   $.get("./modal-config.html", function(data){
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
          console.log(result)
          iniciarJogo(result.value.level, result.value.mode);
        }
      });
   })
}