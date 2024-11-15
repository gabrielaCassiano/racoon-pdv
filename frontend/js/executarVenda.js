import { updateState, getState } from '../lib/state.js'

// Inicializa os produtos como array vazio
let todosProdutos = [];

// Tenta recuperar produtos do state de forma segura
try {
    const produtosState = getState('produtos');
    if (produtosState && Array.isArray(JSON.parse(produtosState))) {
        todosProdutos = JSON.parse(produtosState);
    }
} catch (e) {
    console.warn('Erro ao carregar produtos do state:', e);
    todosProdutos = [];
}

const codigo_barras_input = document.getElementById('produto');
const quantidade = document.getElementById('quantidade');
const qtdItensDisplay = document.getElementById("qtdItensDisplay");
const valorItensDisplay = document.getElementById("valorItensDisplay");
const payBtn = document.getElementById("payBtn");
const btnCancelarModalSim = document.getElementById("btnCancelarModalSim");
const btnCancelarModalNao = document.getElementById("btnCancelarModalNao");
const modalCancelar = document.getElementById("modalCancelar");

// Função segura para atualizar o state com produtos
function atualizarStateProdutos(produtos) {
    try {
        const produtosString = JSON.stringify(produtos);
        updateState('produtos', produtosString);
    } catch (e) {
        console.error('Erro ao atualizar state dos produtos:', e);
    }
}

const cancelar = () => {
    btnCancelarModalSim.addEventListener('click', () => {
        todosProdutos = [];
        atualizarStateProdutos(todosProdutos);
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
        alertDiv.textContent = 'Adicione pelo menos 1 produto';
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
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
            const codigo_barras = codigo.value;
            
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

            const produtosComQuantidade = data.map(produto => ({
                id: produto.id,
                nome: produto.nome,
                valor: parseFloat(produto.valor),
                quantidade: qtd
            }));
            
            todosProdutos = [...todosProdutos, ...produtosComQuantidade];
            atualizarStateProdutos(todosProdutos);
            renderProdutos(todosProdutos);
            
            codigo.value = '';
            quantidade.value = '';
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            alert(error.message);
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

    produtos.forEach((produto, index) => {
        const valorUnitario = parseFloat(produto.valor);
        const valorProduto = valorUnitario * produto.quantidade;
        valorTotal += valorProduto;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
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