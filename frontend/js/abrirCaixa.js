import { getState } from '../lib/state.js';
const loginFuncionarioBtn = document.getElementById('botaoLoginFunc');
const optionsPdv = document.getElementById("optPdv")
const optionsOpen = document.getElementById("optOpen")
let idCaixa = null;
const modalAbrirCaixa = document.getElementById("modalAberturaDeCaixa")

async function estadoCaixa() {
    try {
        const idEmpresa = getState('id_empresa') || 1;
        const response = await fetch(`http://localhost:8080/backend/caixa/collect?id_empresa=${idEmpresa}`, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            optionsPdv.style.display = 'none';
            optionsOpen.style.display = 'flex';
            return;
        }

        const caixa = data[0];
        if (caixa.fechado === null) {
            idCaixa = caixa.id;
            optionsPdv.style.display = 'flex';
            optionsOpen.style.display = 'none';
        } else {
            optionsPdv.style.display = 'none';
            optionsOpen.style.display = 'flex';
        }

        modalAbrirCaixa.style.display = 'none';

    } catch (error) {
        console.error("Erro na verificação:", error);
        optionsPdv.style.display = 'none';
        optionsOpen.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', estadoCaixa);

loginFuncionarioBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        id_empresa: getState('id_empresa') || "1",
        valor_inicial: document.getElementById('fundoDeCaixa').value,
        id_funcionario: document.getElementById('numeroCadastrado').value
    };

    try {
        const response = await fetch('http://localhost:8080/backend/caixa/open', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error('Erro ao abrir o caixa');

        const data = await response.json();
        if (data && data.id) {
            idCaixa = data.id;
            modalAbrirCaixa.style.display = 'none';
            optionsPdv.style.display = 'flex';
            optionsOpen.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao abrir o caixa:', error);
        alert('Erro ao abrir o caixa. Por favor, tente novamente.');
    }
});