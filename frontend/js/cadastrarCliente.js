import {getState} from "../lib/state.js";
import { CaixaDeErro } from '../components/caixaDeErro.js';
let idii = getState("id_empresa")



cadastroCliente.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
        id_empresa: idii,
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
        box.show(cadastroCliente);
        console.error('Erro ao cadastrar cliente:', error);
    }
});

