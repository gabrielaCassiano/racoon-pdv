const btnVoltar = document.getElementById("btnVoltar");

btnVoltar.addEventListener("click", () => {
    window.history.back()
})
const botvoltarmodal = document.querySelectorAll(".botvoltarmodal")
const modalCadastrarFunc = document.getElementById('modalCadastrarFunc');
const modalPlano = document.getElementById('modalPlano');
const modalEditar = document.getElementById('modalEditar');

const editar = document.getElementById('btn')
const plano = document.getElementById('btn2')
const cadastrarF = document.getElementById('btn3')

for(let i = 0; i < botvoltarmodal.length; i++){
    botvoltarmodal[i].addEventListener('click', () => {
        let modalStateCadastrarF = modalCadastrarFunc.style.display
        let modalStatePlano = modalPlano.style.display
        let modalStateEditar = modalEditar.style.display
        if (modalStateCadastrarF == 'flex') {
            modalCadastrarFunc.style.display = 'none'
        }
        if (modalStatePlano == 'flex') {
            modalPlano.style.display = 'none'
        }
        if (modalStateEditar == 'flex') {
            modalEditar.style.display = 'none'
        }
    })
}

editar.addEventListener('click', (event) => {
    event.preventDefault()
    let modalStateCadastrarF = modalCadastrarFunc.style.display
    if (modalStateCadastrarF == 'none') {
        modalCadastrarFunc.style.display = 'flex'
    }
})
plano.addEventListener('click', (event) => {
    event.preventDefault()
    let modalStatePlano = modalPlano.style.display
    if (modalStatePlano == 'none') {
        modalPlano.style.display = 'flex'
    }
})
cadastrarF.addEventListener('click', (event) => {
    event.preventDefault()
    let modalStateEditar = modalEditar.style.display
    if (modalStateEditar == 'none') {
        modalEditar.style.display = 'flex'
    }
})