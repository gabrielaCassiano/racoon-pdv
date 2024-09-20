console.log('Arquivo pdv-principal.js carregado!');
let logoSaida = document.querySelector('#perfil .saida');
let logoMenu = document.getElementsByClassName('b3 scale')[0];
let dropdownMenubackground = document.querySelector('.nav');
let fecharmenu = document.querySelector('.back-icon');
let Esconder = document.querySelector('.menu');

const btnAbrirCaixa = document.getElementById("btnAbrirCaixa")
const modalAbrirCaixa = document.getElementById("modalAberturaDeCaixa")

btnAbrirCaixa.addEventListener('click', () => {
    let modalStateAbrirCaixa = modalAbrirCaixa.style.display
    console.log(modalStateAbrirCaixa)
    if (modalStateAbrirCaixa == 'none') {
        modalAbrirCaixa.style.display = 'flex'
    }
})


Esconder.style.display = 'none';
logoMenu.addEventListener('click', function() {
    console.log('A imagem do menu foi clicada!');
    if (Esconder.style.display === 'none') {
        Esconder.style.display = 'flex';
    } else {
        Esconder.style.display = 'none';
    }
});
fecharmenu.addEventListener('click', function() {
    console.log('A imagem do menu1 foi clicada!');
    if (Esconder.style.display === 'none') {
        Esconder.style.display = 'flex';
    } else {
        Esconder.style.display = 'none';
    }
});



logoSaida.addEventListener('click', function() {
    console.log('A imagem do logo foi clicada!');
    location.href = "../pages/index.html";
});