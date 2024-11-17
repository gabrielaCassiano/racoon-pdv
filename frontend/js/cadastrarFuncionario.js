let idii = getState("id_empresa")

import {getState} from "../lib/state.js";
const cadastrarFuncionarioBtn = document.getElementById('btnCadastroFuncionario');

cadastrarFuncionarioBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(idii)

    const dados = {
        id_empresa: String(idii),
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




  


async function fetchFuncionarios() {
    try {
       
        const id_empresa = idii; 
        if (!id_empresa) {
            console.error("ID da empresa não encontrado.");
            return;
        }

        const response = await fetch(`http://localhost:8080/backend/funcionario/collect?id_empresa=${id_empresa}`);
        
        
        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.statusText);
            return;
        }

        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            console.error("Nenhum funcionário encontrado");
            return;
        }

        
        const funcionarios = data.data;
        const tbody = document.getElementById('funcionarios-body');
        tbody.innerHTML = '';

        funcionarios.forEach(funcionario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${funcionario.nome}</td>
                <td>${funcionario.funcao || 'Função não informada'}</td>
                <td>${funcionario.cpf}</td>
                <td>${funcionario.senha || 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
    }
}




window.onload = function() {
    
    fetchFuncionarios();
};

