
import { getState } from '../lib/state.js';
import { CaixaDeErro } from '../components/caixaDeErro.js';
const valorCompra = getState('valorCompra')
let meotodoDePagamento = ''
let valorPagamento = ''

const valorInput = document.getElementById("valorInput")
const btnConfig = document.querySelectorAll(".btnCadastrar")
const btnVoltar = document.querySelectorAll(".botvoltar")

const btnCash = document.getElementById("cashbackBtn")
const modalCash = document.getElementById("modalCashBack")

const totalVenda = document.getElementById("tdTotalVenda");
const cashback = document.getElementById("tdCashback");
const restante = document.getElementById("tdRestante");
const troco = document.getElementById("tdTroco");
const tbodyCash = document.getElementById("tbodyCash");
const valorCashDisplay = document.getElementById("valorCashDisplay");
const tbodyPagos = document.getElementById("tbodyPagos");

const btnMetodo = document.querySelectorAll('.btn')

const btnConfirmar = document.getElementById("btnConfirmar")



valorInput.addEventListener('input', () => {
    valorInput.value = valorInput.value.replace(/[^0-9.]/g, '');
    valorPagamento = valorInput.value
    console.log(valorPagamento)
})

btnMetodo.forEach((element, index) => {
    if (index < btnMetodo.length - 1 && element.textContent !== "CashBack") {
        element.addEventListener('click', () => {
            meotodoDePagamento = element.textContent;
            btnMetodo.forEach(btn => {
                if (btn.textContent !== "CashBack") {
                    btn.classList.remove("active");
                }
            });
            
            element.classList.add("active");
        });
    }
});

const limparValor = (texto) => parseFloat(texto.replace('R$', '').trim())
let valor_cashback_cliente = 0

function valores() {
    totalVenda.textContent = `R$ ${valorCompra}`;
    const valoresPagos = document.querySelectorAll(".tdValorPago");
    let totalPago = 0;
    
    valoresPagos.forEach(valorPago => {
        totalPago += limparValor(valorPago.textContent);
    });

    const valorCashback = limparValor(cashback.textContent);
    const valorTotal = limparValor(totalVenda.textContent);
    const pagamentoTotal = totalPago + valorCashback;

    if(pagamentoTotal >= valorTotal) {
        restante.textContent = 'R$ 0.00';
        troco.textContent = `R$ ${(pagamentoTotal - valorTotal).toFixed(2)}`;
    } else {
        restante.textContent = `R$ ${(valorTotal - pagamentoTotal).toFixed(2)}`;
        troco.textContent = `R$ 0.00`;
    }
}

window.onload = valores ();


async function finalizarCompra() {
    const valorRestante = limparValor(restante.textContent);
    if(valorRestante > 0) {
        alert('Ainda há valor restante a ser pago');
        return;
    }

    const pagamentos = [];
    const elementos = document.querySelectorAll('.tdValorPago');
    elementos.forEach((el, index) => {
        pagamentos.push({
            metodo: tbodyPagos.rows[index].cells[0].textContent,
            valor: limparValor(el.textContent)
        });
    });

    const cashbacks_selecionados = [];
    document.querySelectorAll('.checkbox-cashback:checked').forEach(checkbox => {
        cashbacks_selecionados.push({
            id_compra: checkbox.getAttribute('name')
        });
    });

    const dados = {
        cpf_cliente: cpfinput.value,
        id_funcionario: '15', // Ajuste conforme necessário
        produtos: todosProdutos,
        pagamentos: pagamentos,
        cashback_utilizado: cashbacks_selecionados
    };

    try {
        const response = await fetch('http://localhost:8080/backend/compras/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error('Erro ao finalizar compra');

        window.location.href = "../pages/finalPage.html";
    } catch (error) {
        alert('Erro ao finalizar compra: ' + error.message);
    }
}   

btnConfirmar.addEventListener("click", () => {
    const valorRestante = limparValor(restante.textContent);

    if(valorRestante <= 0) {
        finalizarCompra();
        return;
    }

    if(meotodoDePagamento && valorPagamento && parseFloat(valorPagamento) > 0) {
        tbodyPagos.innerHTML += `
            <tr>
                <td>${meotodoDePagamento}</td>
                <td class="tdValorPago">R$ ${parseFloat(valorPagamento).toFixed(2)}</td>
                <td>${new Date().toLocaleString()}</td>
            </tr>
        `;
        valorInput.value = "";
        valorPagamento = "";
        meotodoDePagamento = "";
        btnMetodo.forEach(btn => {
            btn.classList.remove("active");
        });
        valores();
    } else {
        alert('Selecione um método de pagamento e digite um valor válido');
    }
});


// MODAL INICIO
const modalConfig = document.getElementById("modalConfig")
for(let i = 0; i < btnConfig.length; i++){

    btnConfig[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        if (modalStateConfig == 'none') {
            modalConfig.style.display = 'flex'
        }
    })
}

for(let i = 0; i < btnVoltar.length; i++){
    btnVoltar[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display
        let modalCashState = modalCash.style.display
        
        if (modalStateConfig == 'flex') {
            modalConfig.style.display = 'none'
        }
        if(modalCashState === "flex") {
            console.log("entrou");
            modalCash.style.display = 'none'
        }
    })
}
// MODAL FIM
const cpfinput = document.getElementById('cpfInput');
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1$2$3$4');
}

function updateValorCashbackCliente() {
    valor_cashback_cliente = 0;
    const checkboxes = document.querySelectorAll('.checkbox-cashback');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const valorCashback = parseFloat(checkbox.parentNode.previousElementSibling.textContent.replace('R$ ', ''));
            valor_cashback_cliente += valorCashback;
        }
    });
    
    valorCashDisplay.textContent = valor_cashback_cliente.toFixed(2)
    console.log('Valor Cashback Cliente:', valor_cashback_cliente.toFixed(2));
}


btnCash.addEventListener("click", async () => {
    let modalCashState = modalCash.style.display
    const response = await fetch(`http://localhost:8080/backend/compras/collect?cpf_cliente=${formatarCPF(cpfinput.value)} `)

    if(!response.ok) {
        console.error("Erro na resposta do servidor:", response.statusText);
        const box = new CaixaDeErro('<p>Nenhuma Compra Encontrada</p>');
        box.show(btnCash);
        return;
    }
    const data = await response.json();
    
    if (!data || data.length === 0) {
        const box = new CaixaDeErro('<p>Nenhuma Compra Encontrada</p>');
        box.show(btnCash);
        return;
    }


    data.forEach((element, index) => {
        tbodyCash.innerHTML += `
        <tr>
            <td>${element.produto_nome}</td>
            <td>${element.quantidade}</td>
            <td>R$ ${element.produto_valor}</td>
            <td>R$ ${element.valor_cashback}</td>
            <td>${element.status_cashback}<input type="checkbox" class="checkbox-cashback" name="${element.id_produto}" id="selecionar"></td>
        </tr>
    `;

    const checkboxes = document.querySelectorAll('.checkbox-cashback');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateValorCashbackCliente);
    });
});
    
    if(modalCashState == "none") {
        modalCash.style.display = 'flex'
    }
})

const btnConfirmarCashback = document.getElementById("confirmarCashback");

btnConfirmarCashback.addEventListener("click", () => {
    let modalCashState = modalCash.style.display
    if(modalCashState == "flex") {
        modalCash.style.display = 'none'
        cashback.textContent = `R$ ${(valor_cashback_cliente).toFixed(2)}`
        valores()
    }
})




const btnVoltar1 = document.getElementById("botvoltar");

btnVoltar1.addEventListener("click", () => {
    window.history.back()
})

