import { CaixaDeErro } from '../components/caixaDeErro.js';
import { updateState } from '../lib/state.js';

const signInBtn = document.getElementById('signInBtn');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        cnpj: document.getElementById('cnpjLogin').value,
        senha: document.getElementById('passLogin').value
    };

    console.log(dados);

    try {
        const response = await fetch('http://localhost:8080/backend/empresa/login', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })

        if(!response.ok) {
            console.error('Erro no logiasdasdn:', error);
        }
        const data = await response.json()
        console.log(data)
        updateState('id_empresa',data.id)
        if(data) {
            window.location.href = "../pages/pdv-principal.html"
        }
    } catch (error) {
        const box = new CaixaDeErro('<p>CNPJ ou SENHA invalidos</p>');
        box.show(loginBtn);
        console.error('Erro no login:', error);
    }

    // fetch('http://localhost:8080/backend/empresa/login', {
    //     method: 'POST', 
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(dados)
    // })
    // .then(response => response.json())
    // .then(data => console.log('Login Feito', data))
    // .catch(error => {
    //     const box = new CaixaDeErro('<p>Erro ao fazer login</p>');
    //     box.show(loginBtn);
    //     console.error('Erro no login:', error);
    // });
});

signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        nome_empresa: document.getElementById('nomeEmpresa').value,
        nome_criador: document.getElementById('nomeDono').value,
        cnpj: document.getElementById('cnpj').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value
    };

    console.log(dados);

    try {
        const response = await fetch('http://localhost:8080/backend/empresa/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }

        const resultado = await response.json();
        console.log('Empresa criada:', resultado);
    } catch (error) {
        const box = new CaixaDeErro('<p>Dados Inválidos</p>');
        box.show(signInBtn);
        console.error('Erro ao criar empresa:', error);
    }
});
