console.log('Arquivo pdv-principal.js carregado!');

const btnAbrirCaixa = document.getElementById("btnAbrirCaixa")
const btnConfig = document.querySelectorAll(".btnConfig")
const btnVoltar = document.querySelectorAll(".botvoltar")


const payBtn = document.getElementById("payBtn")
const perfilRedirectBtn = document.getElementById("perfilRedirectBtn")
const produtoRedirectBtn = document.getElementById("produtoRedirectBtn")
const relatorioRedirectBtn = document.getElementById("relatorioRedirectBtn")
const modalCancelar = document.getElementById("modalCancelar")
const btnCancelar = document.getElementById("btnCancelar")

btnCancelar.addEventListener('click', () => {
    let modalStateCancelar = modalCancelar.style.display
    if (modalStateCancelar == 'none') {
        modalCancelar.style.display = 'flex'
    }
})



import { mockFetch } from './mocks/mockProducts.js'
const fetchData = mockFetch;

const btnBuscarProduto = document.getElementById("buscarProduto")
const listagemProdutos = document.getElementById("listagemProdutos")
const inpProduto = document.getElementById("produto")

btnBuscarProduto.addEventListener('click', () => {
    let valueProd = String(inpProduto.value)
    console.log(valueProd)
    fetchData(`/api/products/${valueProd}`, {method: 'GET'})
        .then(response => response.json())
        .then(data => listagemProdutos.innerHTML += `<tr>
                                                        <td>${data.id}</td>
                                                        <td>${data.name}</td>
                                                        <td>${data.qtd}</td>
                                                        <td>${data.preco}</td>
                                                        <td>${data.preco}</td>
                                                    </tr>`)
        .catch(error => console.error('Erro na chamada /api/products: ', error))
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