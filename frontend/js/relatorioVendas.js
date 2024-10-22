document.addEventListener("DOMContentLoaded", () => {
    const botVoltar = document.getElementById("botVoltar");

    if (botVoltar) {
        botVoltar.addEventListener("click", () => {
            console.log("entoru")
            window.history.back();
        });
    } else {
        console.error("Botão 'Voltar' não encontrado!");
    }
});

const btnConfig = document.querySelectorAll(".fechamento1")
const btnVoltar1 = document.querySelectorAll(".botvoltar")

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
