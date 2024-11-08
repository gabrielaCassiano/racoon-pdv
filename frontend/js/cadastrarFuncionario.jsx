

const cadastrarFuncionarioBtn = document.getElementById('btnCadastroFuncionario');

cadastrarFuncionarioBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        id_empresa: "1",
        nome: document.getElementById('nomeFuncionario').value,
        cpf: document.getElementById('cpfFuncionario').value,
        senha: document.getElementById('codigoFuncionario').value
    };

    console.log('Dados enviados:', dados);

    try {
        const response = await fetch('http://localhost:8080/backend/funcionario/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

       
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro no cadastro:', errorData);
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Funcionário cadastrado com sucesso:', data);
    } catch (error) {
        console.error('Erro em Cadastrar Funcionário:', error);
    }
});
