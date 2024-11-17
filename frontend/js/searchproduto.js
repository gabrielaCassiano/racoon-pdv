console.log('Arquivo pdv-principal.js carregado!');

const btnEditar = document.querySelectorAll(".btnEditar")
const btnConfig = document.querySelectorAll(".btnCadastrar")
const btnVoltar1 = document.querySelectorAll(".botvoltar")

// MODAL INICIO 1
const modalConfig = document.getElementById("modalConfig")
console.log(btnConfig)
for(let i = 0; i < btnConfig.length; i++){
    console.log(btnConfig[i])

    btnConfig[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        console.log(modalStateConfig)
        if (modalStateConfig == 'none') {
            modalConfig.style.display = 'flex'
        }
    })
}

for(let i = 0; i < btnVoltar1.length; i++){
    btnVoltar1[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        console.log(modalStateConfig)
        if (modalStateConfig == 'flex') {
            modalConfig.style.display = 'none'
        }
    })
}
// MODAL FIM



// MODAL INICIO2
const modalmodifica = document.getElementById("modalmodifica")
console.log(btnEditar)
  
  

  
  
  
  
  
  
  
  

for(let i = 0; i < btnVoltar1.length; i++){
    btnVoltar1[i].addEventListener('click', () => {
        let modalStateConfig = modalmodifica.style.display
        console.log(modalStateConfig)
        if (modalStateConfig == 'flex') {
            modalmodifica.style.display = 'none'
        }
    })
}
// MODAL FIM















const btnVoltar = document.getElementById("botvoltarPage");

btnVoltar.addEventListener("click", () => {
    window.history.back()
})