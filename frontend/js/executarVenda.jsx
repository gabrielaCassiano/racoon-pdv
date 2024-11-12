let todosProdutos = [];
let valorTotal = 0;
const codigo_barras_input = document.getElementById('produto');
const quantidade = document.getElementById('quantidade');
const qtdItensDisplay = document.getElementById("qtdItensDisplay");
const valorItensDisplay = document.getElementById("valorItensDisplay");

codigo_barras_input.addEventListener('change', async (event) => {
    event.preventDefault();

    async function fetchProdutos() {
        try {
            const codigo = document.getElementById('produto');
            const id_empresa = 1;
            const codigo_barras = codigo.value;
            if (codigo_barras == "") {
                throw new Error("codigo invalido");
            }
            const response = await fetch(`http://localhost:8080/backend/produto/collect?id_empresa=${id_empresa}&codigo_barras=${codigo_barras}`);
            
            if (!response.ok) {
                console.error("Erro na resposta do servidor:", response.statusText);
                return;
            }
            
            const data = await response.json();
    
            if (!data || data.length === 0) {
                console.error("Nenhum produto encontrado");
                return;
            }
            todosProdutos = [...todosProdutos, ...data];
            renderProdutos(todosProdutos);
            codigo.value = '';
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }
    fetchProdutos()
});

function renderProdutos(produtos) {
    const tbody = document.getElementById('listagemProdutos');
    tbody.innerHTML = '';
    let qtd = 1;
    if(parseInt(quantidade.value) != NaN) {
        qtd = parseInt(quantidade.value)
    }


    produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${qtd}</td>
            <td>${produto.valor.toFixed(2)}</td>
            <td>${produto.valor.toFixed(2) * qtd}</td>
        `;
        tbody.appendChild(row);
    });

    valorTotal = produtos.reduce((total, produto) => total + produto.valor, 0);
    
    valorItensDisplay.innerText = `R$ ${valorTotal.toFixed(2)}`;
    qtdItensDisplay.innerText = produtos.length;
}