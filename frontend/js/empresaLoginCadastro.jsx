const signInBtn = document.getElementById('signInBtn')
const loginBtn = document.getElementById('loginBtn')

// http://localhost:80/backend/empresa/collect?id_empresa=2
// http://localhost:80/backend/empresa/create
// http://localhost:80/backend/empresa/login


loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const dados = {
        cnpj: document.getElementById('cnpjLogin').value,
        senha: document.getElementById('passLogin').value
    };

    console.log(dados);

    fetch('http://localhost:8080/backend/empresa/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => console.log('Login Feito', data))
    .catch(error => console.error('Erro no login:', error));
});

/*
async await

.then.catch


*/


signInBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        nome_empresa: document.getElementById('nomeEmpresa').value,
        nome_criador: document.getElementById('nomeDono').value,
        cnpj: document.getElementById('cnpj').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senha').value
    };

    console.log(dados)

     try {
        const response = await fetch('http://localhost:8080/backend/empresa/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        console.log(response)
        if (!response.ok) {
            throw new Error(`Erroa: ${response.statusText}`);
        }

        const resultado = await response.json();
        console.log('Empresa criada:', resultado);
    } catch (error) {
        console.error('Erro criar empresa:', error);
    }
});
