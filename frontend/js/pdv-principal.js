console.log('Arquivo pdv-principal.js carregado!');
let logoSaida = document.querySelector('#perfil .saida');
let logoMenu = document.getElementsByClassName('b3 scale')[0];
let dropdownMenubackground = document.querySelector('.navinha');
let Esconder = document.querySelector('.dropdown-menu');
Esconder.style.display = 'none';
logoMenu.addEventListener('click', function() {
    console.log('A imagem do menu foi clicada!');
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