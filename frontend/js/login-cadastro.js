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

async function apiCall(cnpj, password) {

    return fetch(
        'http://localhost:8000/empresa/login', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'cnpj': cnpj,
                    'senha': password
                }
            )
        }
    )
    .then(
        response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`)  
    )
    .catch(
        error => {
            console.error('Fetch error:', error);
            throw error; 
        }
    );
}

document.querySelector('#loginForm').addEventListener('submit', function(event) {

    console.log("HHehehehehe");

    event.preventDefault();

    let cnpj = document.getElementById('cnpj').value;
    let pass = document.getElementById('pass').value;

    console.log(cnpj + ' | ' + pass);

    apiCall(cnpj, pass)
        .then(
            json => {
                console.log('Login successful:', json); 
            }
        )
        .catch(
            error => {
                console.error('Login failed:', error); 
            }
        )
    ;
});

