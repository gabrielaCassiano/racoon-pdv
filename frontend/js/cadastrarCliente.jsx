



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
        console.log('Cliente criado:', resultado);
    } catch (error) {
        const box = new CaixaDeErro('<p>Dados Inválidos</p>');
        box.show(signInBtn);
        console.error('Erro ao cadastrar cliente:', error);
    }
});

