let idii = getState("id_empresa");
let funcionarioSolicitado = null;
let linhaSelecionada = null;   

console.log("ID da empresa:", idii);



import {addFuncionario, addProduto, getState, updateState} from "../lib/state.js";
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
        window.location.reload();
    } catch (error) {
        console.error('Erro em Cadastrar Funcionário:', error);
    }
});


async function fetchFuncionarios() {
    try {
        const id_empresa = getState("id_empresa"); 
        console.log("ID da empresa:", id_empresa);

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
        console.log("Dados recebidos:", data);

        if (!data.data || data.data.length === 0) {
            console.warn("Nenhum funcionário encontrado");
            return;
        }

        const funcionarios = data.data;
        const tbody = document.getElementById('funcionarios-body');
        tbody.innerHTML = '';
 
        
        funcionarios.forEach(funcionario => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${funcionario.cpf}</td>
            <td>${funcionario.id}</td>
            <td>${funcionario.senha || 'N/A'}</td>
            `;
            tbody.appendChild(row);
            addFuncionario({
                id: funcionario.id
            })

            row.addEventListener('click', () => {
                if (linhaSelecionada) {
                    linhaSelecionada.classList.remove('selected');
                }
    
                if (row === linhaSelecionada) {
                    linhaSelecionada = null;
                    funcionarioSolicitado = null;
                } else {
                    row.classList.add('selected');
                    linhaSelecionada = row;
                    funcionarioSolicitado = funcionario;   
                    demitir.disabled = false
                    demitir.style.backgroundColor = "red"
                }
            });
        });

        console.log("Funcionários carregados com sucesso!");
    } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
    }
}

const demitir = document.getElementById('btn4')

console.log(demitir)

demitir.addEventListener('click', async () => {
    if (!funcionarioSolicitado || !funcionarioSolicitado.id) {
        console.error('Funcionário não selecionado ou ID inválido.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/backend/funcionario/delete?id_funcionario=${funcionarioSolicitado.id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro ao deletar func:', errorData);
            throw new Error('Erro ao deletar func');
        }

        const data = await response.json();
        // console.log('Funcionário deletado com sucesso:', data);
        window.location.reload();
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
    }
});


window.onload = fetchFuncionarios;

