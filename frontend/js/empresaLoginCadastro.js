import { CaixaDeErro } from '../components/caixaDeErro.js';
import { updateState } from '../lib/state.js';

const signInBtn = document.getElementById('signInBtn');
const loginBtn = document.getElementById('loginBtn');

function alertBox(params) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ffebee;
        color: #c62828;
        padding: 10px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    `;
    alertDiv.textContent = `${params}`;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

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
    
      
});

let planoSelecionado = null;


  
const divs = document.querySelectorAll('.item');

function desmarcarTodas() {
    divs.forEach(div => {
        div.classList.remove('selecionada');
    });
}

  
divs.forEach(div => {
    div.addEventListener('click', () => {
        if (div === planoSelecionado) {
            div.classList.remove('selecionada');
            planoSelecionado = null;
        } else {
            desmarcarTodas();
            div.classList.add('selecionada');
            planoSelecionado = div.getAttribute('data-plano');
            console.log('Plano selecionado:', planoSelecionado);
        }
    });
});
const registerbtn = document.getElementById('register');
registerbtn.addEventListener('click', (event) => {
   event.preventDefault()
    container.classList.add("active");
});

const msgSucesso = document.getElementById("msgSucesso")

signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();

      
    if (!planoSelecionado) {
        alertBox("Por favor, selecione um plano antes de continuar.");
        return;
    }

      
    const dados = {
        nome_empresa: document.getElementById('nomeEmpresa').value,
        nome_criador: document.getElementById('nomeDono').value,
        cnpj: document.getElementById('cnpj').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value,
        plano: planoSelecionado   
    };

    console.log("Dados a serem enviados:", dados);

    try {
        const response = await fetch('http://localhost:8080/backend/empresa/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            console.log(response.text())
            throw new Error(`Erro: ${response}`);
        }

        const resultado = await response.json();

        console.log('Empresa criada:', resultado);
        msgSucesso.style.display = "block"
        document.getElementById('nomeEmpresa').value = ''
        document.getElementById('nomeDono').value = ''
        document.getElementById('cnpj').value = ''
        document.getElementById('cpf').value = ''
        document.getElementById('senha').value = ''
    } catch (error) {
        console.error('Erro ao criar empresa:', error   );
        const box = new CaixaDeErro('<p>Erro ao criar empresa</p>');
        box.show(signInBtn);
    }
});
