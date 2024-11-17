import { updateState, getState, addProduto, clearState} from '../lib/state.js';

let todosProdutos = [];

try {
    const produtosState = getState('produtos');
    if (Array.isArray(produtosState)) {
        todosProdutos = produtosState;
    }
} catch (e) {
    todosProdutos = [];
}

let codigoDeBarras = '';
let quantidadeItens = '';

const codigo_barras_input = document.getElementById('produto');
const quantidade = document.getElementById('quantidade');
const qtdItensDisplay = document.getElementById("qtdItensDisplay");
const valorItensDisplay = document.getElementById("valorItensDisplay");
const payBtn = document.getElementById("payBtn");
const btnCancelarModalSim = document.getElementById("btnCancelarModalSim");
const btnCancelarModalNao = document.getElementById("btnCancelarModalNao");
const modalCancelar = document.getElementById("modalCancelar");

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

function atualizarStateProdutos(produtos) {
    try {
        localStorage.setItem('produtos', JSON.stringify(produtos));
        state.produtos = produtos;
    } catch (e) {
    }
}

const cancelar = () => {
    btnCancelarModalSim.addEventListener('click', () => {
        todosProdutos = [];
        atualizarStateProdutos(todosProdutos);
        clearState('produtos')
        let modalStateCancelar = modalCancelar.style.display;
        if (modalStateCancelar == 'flex') {
            modalCancelar.style.display = 'none';
        }
        renderProdutos(todosProdutos);
    });
    
    btnCancelarModalNao.addEventListener('click', () => {
        let modalStateCancelar = modalCancelar.style.display;
        if (modalStateCancelar == 'flex') {
            modalCancelar.style.display = 'none';
        }
    });
}

window.onload = () => {
    renderProdutos(todosProdutos);
};

cancelar();

payBtn.addEventListener('click', () => {
    if (todosProdutos.length === 0) {
       alertBox('Adicione pelo menos 1 produto');
    } else {
        window.location.href = "../pages/pagamento.html";
    }
});

codigo_barras_input.addEventListener('change', async (event) => {
    event.preventDefault();
    const qtd = quantidade.value && !isNaN(quantidade.value) ? parseFloat(quantidade.value) : 1;

    async function fetchProdutos() {
        try {
            const codigo = document.getElementById('produto');
            const id_empresa = 1;
            const codigo_barras = codigo.value.trim();

            if (!codigo_barras) {
                throw new Error("Código inválido");
            }

            const response = await fetch(`http://localhost:8080/backend/produto/collect?id_empresa=${id_empresa}&codigo_barras=${codigo_barras}`);
            
            if (!response.ok) {
                throw new Error("Erro na resposta do servidor: " + response.statusText);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error("Nenhum produto encontrado");
            }
            codigoDeBarras = codigo_barras;
            data.forEach(produto => {
                addProduto({
                    codigo_barras:codigoDeBarras,
                    nome: produto.nome,
                    valor: parseFloat(produto.valor),
                    quantidade: qtd
                });
            });

            todosProdutos = getState('produtos');
            renderProdutos(todosProdutos);

            codigo.value = '';
            quantidade.value = '';
        } catch (error) {
            const codigo = document.getElementById('produto');
            alertBox('Produto não encontrado na base de dados')
            codigo.value = '';
        }
    }

    fetchProdutos();
});

function atualizarQuantidade(index, novaQuantidade) {
    if (index >= 0 && index < todosProdutos.length) {
        todosProdutos[index].quantidade = parseFloat(novaQuantidade);
        atualizarStateProdutos(todosProdutos);
        renderProdutos(todosProdutos);
    }
}

function renderProdutos(produtos) {
    const tbody = document.getElementById('listagemProdutos');
    tbody.innerHTML = '';
    let valorTotal = 0;

    produtos.forEach((produto) => {
        const valorUnitario = parseFloat(produto.valor);
        const valorProduto = valorUnitario * produto.quantidade;
        valorTotal += valorProduto;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.codigo_barras}</td>
            <td>${produto.nome}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${valorUnitario.toFixed(2)}</td>
            <td>R$ ${valorProduto.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    valorItensDisplay.innerText = `R$ ${valorTotal.toFixed(2)}`;
    updateState('valorCompra', valorTotal.toFixed(2));
    qtdItensDisplay.innerText = produtos.length;
}

window.atualizarQuantidade = atualizarQuantidade;
