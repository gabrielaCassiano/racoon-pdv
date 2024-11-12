// localStorage.setItem('caixaAberto', 'false')
// const estadoCaixa = localStorage.getItem('caixaAberto') === "true";

// const optionsPdv = document.getElementById("optPdv")
// const optionsOpen = document.getElementById("optOpen")
// console.log(estadoCaixa)
// if(estadoCaixa ){
//     optionsPdv.style.display = 'flex'
//     optionsOpen.style.display = 'none'
// }




const btnAbrirCaixa = document.getElementById("btnAbrirCaixa")
const btnConfig = document.querySelectorAll(".btnConfig")
const btnVoltar = document.querySelectorAll(".botvoltar")


const payBtn = document.getElementById("payBtn")
const perfilRedirectBtn = document.getElementById("perfilRedirectBtn")
const produtoRedirectBtn = document.getElementById("produtoRedirectBtn")
const relatorioRedirectBtn = document.getElementById("relatorioRedirectBtn")
const modalCancelar = document.getElementById("modalCancelar")
const btnCancelar = document.getElementById("btnCancelar")

// const btnLoginFuncionario = document.getElementById("botaoLoginFunc")

const btnBuscarProduto = document.getElementById("buscarProduto")
const listagemProdutos = document.getElementById("listagemProdutos")
const inpProduto = document.getElementById("produto")

btnCancelar.addEventListener('click', () => {
    let modalStateCancelar = modalCancelar.style.display
    if (modalStateCancelar == 'none') {
        modalCancelar.style.display = 'flex'
    }
})

perfilRedirectBtn.addEventListener('click', () => {

    window.location.href ="../pages/perfilEmpresa.html"
})

produtoRedirectBtn.addEventListener('click', () => {

    window.location.href ="../pages/produtos.html"
})

relatorioRedirectBtn.addEventListener('click', () => {

    window.location.href ="../pages/relatorioVendas.html"
})


payBtn.addEventListener('click', () => {

    window.location.href ="../pages/pagamento.html"
})



// MODAL INICIO
const modalAbrirCaixa = document.getElementById("modalAberturaDeCaixa")

btnAbrirCaixa.addEventListener('click', () => {
    let modalStateAbrirCaixa = modalAbrirCaixa.style.display
    console.log(modalStateAbrirCaixa)
    if (modalStateAbrirCaixa == 'none') {
        modalAbrirCaixa.style.display = 'flex'
    }
})
// btnLoginFuncionario.addEventListener('click', () => {
//     modalAbrirCaixa.style.display = 'none'
//     optionsPdv.style.display = 'flex'
//     optionsOpen.style.display = 'none'
//     localStorage.setItem('caixaAberto', 'true')
// })
// MODAL FIM
// MODAL INICIO
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

for(let i = 0; i < btnVoltar.length; i++){
    btnVoltar[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        let modalStateAbrirCaixa = modalAbrirCaixa.style.display
        console.log(modalStateConfig)
        if (modalStateConfig == 'flex') {
            modalConfig.style.display = 'none'
        }
        if (modalStateAbrirCaixa == 'flex') {
            modalAbrirCaixa.style.display = 'none'
        }
    })
}
// MODAL FIM