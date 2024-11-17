import {getState} from "../lib/state.js";
let idii = getState("id_empresa")

const btnConf = document.getElementById('btnConf');

btnConf.addEventListener('click', async (event) => {
    event.preventDefault();

    const dados = {
       
        id_empresa: String(idii),
        categoria: document.getElementById('cat').value,    
        nome: document.getElementById('nome').value,
        codigo_barras: document.getElementById('codigoDeBarra').value,
        valor: document.getElementById('preco').value,
        porcentagem_cashback: document.getElementById('cashBack').value,
        
    };

    console.log('Dados enviados:', dados.categoria);

    try {
        const response = await fetch('http://localhost:8080/backend/produto/create', {
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
        window.location.reload();
        console.log('produto cadastrado com sucesso:', data);
    } catch (error) {
        console.error('Erro em Cadastrar produto:', error);
    }
});

function searchProdutos() {
    const query = document.getElementById('nomeproduto').value.toLowerCase();

   
    const filteredProdutos = produtosCache.filter(produto => 
        produto.nome.toLowerCase().includes(query) ||
        produto.categoria.toLowerCase().includes(query) ||
        produto.codigo_barras.toLowerCase().includes(query)
    );

    
    renderProdutos(filteredProdutos);
}


const lupa = document.getElementById('lupa');
lupa.addEventListener('click', (event) => {
    event.preventDefault();
    searchProdutos();
});


window.onload = fetchProdutos;


  

let produtosCache = [];


async function fetchProdutos() {
    try {
        const id_empresa = idii;
        const response = await fetch(`http://localhost:8080/backend/produto/collect?id_empresa=${id_empresa}`);
        
        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.statusText);
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.error("Nenhum produto encontrado");
            return;
        }

        produtosCache = data; 
        renderProdutos(data);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

let produtoSelecionado = null;
let linhaSelecionada = null;
function renderProdutos(produtos) {
    const tbody = document.getElementById('produtos-body');
    tbody.innerHTML = '';

    produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.classList.add('clickable-row')
        row.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
           
            <td>${produto.codigo_barras}</td>
            <td>${produto.valor.toFixed(2)}</td>
            <td>${produto.porcentagem_cashback}</td>
        `;

        row.addEventListener('click', () => {
            if (linhaSelecionada) {
                linhaSelecionada.classList.remove('selected');
            }

            if (row === linhaSelecionada) {
                linhaSelecionada = null;
                produtoSelecionado = null;
            } else {
                row.classList.add('selected');
                linhaSelecionada = row;
                produtoSelecionado = produto;   
            }
        });

        tbody.appendChild(row);
    });
}



function abrirModalEdicao() {
    if (!produtoSelecionado) {
        alert("Por favor, selecione um produto para editar.");
        return;
    }
    document.getElementById('nome1').value += produtoSelecionado.nome;
    document.getElementById('codigoDeBarra1').value = produtoSelecionado.codigo_barras;
    document.getElementById('preco1').value = produtoSelecionado.valor.toFixed(2)
    document.getElementById('cashBack1').value = produtoSelecionado.porcentagem_cashback;
    document.getElementById('cat1').value = produtoSelecionado.categoria;

      
    document.getElementById('modalmodifica').style.display = 'flex';
}




  
const btnEditar = document.getElementById('btnEditar');
btnEditar.addEventListener('click', abrirModalEdicao);














