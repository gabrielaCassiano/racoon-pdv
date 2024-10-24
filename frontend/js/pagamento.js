


const btnConfig = document.querySelectorAll(".btnCadastrar")
const btnVoltar = document.querySelectorAll(".botvoltar")

const btnCash = document.getElementById("cashbackBtn")
const modalCash = document.getElementById("modalCashBack")




// MODAL INICIO
const modalConfig = document.getElementById("modalConfig")
for(let i = 0; i < btnConfig.length; i++){

    btnConfig[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        if (modalStateConfig == 'none') {
            modalConfig.style.display = 'flex'
        }
    })
}

for(let i = 0; i < btnVoltar.length; i++){
    btnVoltar[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        let modalCashState = modalCash.style.display
        
        if (modalStateConfig == 'flex') {
            modalConfig.style.display = 'none'
        }
        if(modalCashState === "flex") {
            console.log("entrou");
            modalCash.style.display = 'none'
        }
    })
}
// MODAL FIM

btnCash.addEventListener("click", () => {
    let modalCashState = modalCash.style.display
    
    if(modalCashState == "none") {
        modalCash.style.display = 'flex'
    }
})




const btnVoltar1 = document.getElementById("botvoltar");

btnVoltar1.addEventListener("click", () => {
    window.history.back()
})

const btnConfirmar = document.getElementById("btnConfirmar")

btnConfirmar.addEventListener("click", () => {
    window.location.href ="../pages/finalPage.html"
})


const btnConfirmarCashback = document.getElementById("confirmarCashback");

btnConfirmarCashback.addEventListener("click", () => {
    window.location.href ="../pages/pagamento.html"
})