const loginBtn = document.getElementById('loginBtn');
const cadastroBtn = document.getElementById('cadastroBtn');
const slideWindow = document.querySelector('.slideWindow');
const toggleSlider = document.querySelector('.toggle-slider');

loginBtn.addEventListener('click', () => {
    slideWindow.style.transform = 'translateX(0)';
    toggleSlider.style.transform = 'translateX(0)';
});

cadastroBtn.addEventListener('click', () => {
    slideWindow.style.transform = 'translateX(-50%)';
    toggleSlider.style.transform = 'translateX(100%)';
});


//JS menu de recuperação de senha
console.log('Arquivo login-cadastro.js carregado!');
let logoMenu = document.getElementsByClassName('PwRecover')[0];
let Esconder = document.querySelector('.menu');
let voltar = document.querySelector('.back-icon');
Esconder.style.display = 'none';
logoMenu.addEventListener('click', function() {
    console.log('A imagem do menu foi clicada!');
    if (Esconder.style.display === 'none') {
        Esconder.style.display = 'flex';
    } else {
        Esconder.style.display = 'none';
    }
});
voltar.addEventListener('click', function() {
    console.log('A imagem do menu1 foi clicada!');
    if (Esconder.style.display === 'none') {
        Esconder.style.display = 'flex';
    } else {
        Esconder.style.display = 'none';
    }
});