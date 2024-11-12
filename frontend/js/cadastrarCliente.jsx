
// const cadastroCliente = document.getElementById('cadastroCliente');

// cadastroCliente.addEventListener('click', async (event) => {
//     event.preventDefault();

//     const dados = {

//         nome: document.getElementById('nomeCliente').value,
//         cpf: document.getElementById('cpfCliente').value,
        
//     };

//     console.log('Dados enviados:', dados);

//     try {
//         const response = await fetch('http://localhost:8080/backend/cliente/create', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(dados)
//         });

       
//         if (!response.ok) {
//             const errorData = await response.json();
//             console.error('Erro no cadastro:', errorData);
//             throw new Error(`Erro: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log('Cliente cadastrado com sucesso:', data);
//     } catch (error) {
//         console.error('Erro em Cadastrar Cliente:', error);
//     }
// });


cadastroCliente.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nomeCliente').value,
        cpf: document.getElementById('cpfCliente').value   
    };

    console.log(dados);

    try {
        const response = await fetch('http://localhost:8080/backend/cliente/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`)
        }

        const resultado = await response.json();
        console.log('Empresa criada:', resultado);
    } catch (error) {
        const box = new CaixaDeErro('<p>Dados Inválidos</p>');
        box.show(signInBtn);
        console.error('Erro ao cadastrar cliente:', error);
    }
});

