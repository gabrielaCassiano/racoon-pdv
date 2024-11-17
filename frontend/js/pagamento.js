import { clearState, getState } from '../lib/state.js';
  

const valorCompra = getState('valorCompra');
const todosProdutos = getState('produtos');
console.log(todosProdutos);
let metodoDePagamento = {
    metodo: '',
    valor: 0
};

const valorInput = document.getElementById("valorInput");
const btnConfig = document.querySelectorAll(".btnCadastrar");
const btnVoltar = document.querySelectorAll(".botvoltar");
const btnCash = document.getElementById("cashbackBtn");
const modalCash = document.getElementById("modalCashBack");
const totalVenda = document.getElementById("tdTotalVenda");
const cashback = document.getElementById("tdCashback");
const restante = document.getElementById("tdRestante");
const troco = document.getElementById("tdTroco");
const tbodyCash = document.getElementById("tbodyCash");
const valorCashDisplay = document.getElementById("valorCashDisplay");
const tbodyPagos = document.getElementById("tbodyPagos");
const btnMetodo = document.querySelectorAll('.btn');
const btnConfirmar = document.getElementById("btnConfirmar");

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

valorInput.addEventListener('input', () => {
    valorInput.value = valorInput.value.replace(/[^0-9.]/g, '');
    metodoDePagamento.valor = parseFloat(valorInput.value);
});

btnMetodo.forEach((element, index) => {
    if (index < btnMetodo.length - 1 && element.textContent !== "CashBack") {
        element.addEventListener('click', () => {
            metodoDePagamento.metodo = element.textContent;
            btnMetodo.forEach(btn => {
                if (btn.textContent !== "CashBack") {
                    btn.classList.remove("active");
                }
            });
            element.classList.add("active");
        });
    }
});

const limparValor = (texto) => parseFloat(texto.replace('R$', '').trim());
let valor_cashback_cliente = 0;

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

    if (pagamentoTotal >= valorTotal) {
        restante.textContent = 'R$ 0.00';
        troco.textContent = `R$ ${(pagamentoTotal - valorTotal).toFixed(2)}`;
    } else {
        restante.textContent = `R$ ${(valorTotal - pagamentoTotal).toFixed(2)}`;
        troco.textContent = `R$ 0.00`;
    }
}

window.onload = valores;

function finalizarCompra() {
    const valorRestante = limparValor(restante.textContent);
    if (valorRestante > 0) {
        alertBox('Ainda há valor restante a ser pago');
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

    const produtosTratados = todosProdutos.map(({ codigo_barras, quantidade }) => ({
        codigo_barras,
        quantidade
    }));

    const dados = {
        cpf_cliente: cpfinput.value.replace(/\D/g, ''),
        id_funcionario: String(getState('id_funcionario')),
        produtos: produtosTratados,
        pagamentos: [metodoDePagamento],
        cashback_utilizado: cashbacks_selecionados
    };
    console.log(dados);

    fetch('http://localhost:8080/backend/compras/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao finalizar compra');
        }
        return response.json();
    })
    .then(() => {
        window.location.href = "../pages/finalPage.html";
        clearState('produtos')
    })
    .catch(() => {
        console.log(dados)
        alertBox('Verifique se inseriu todos os dados - CPF | METODO | VALORES');
    });
}

btnConfirmar.addEventListener("click", () => {
    const valorRestante = limparValor(restante.textContent);

    if (valorRestante <= 0) {
        finalizarCompra();
        return;
    }

    if (metodoDePagamento.metodo && metodoDePagamento.valor && parseFloat(metodoDePagamento.valor) > 0) {
        tbodyPagos.innerHTML += `
            <tr>
                <td>${metodoDePagamento.metodo}</td>
                <td class="tdValorPago">R$ ${parseFloat(metodoDePagamento.valor).toFixed(2)}</td>
                <td>${new Date().toLocaleString()}</td>
            </tr>
        `;
        valorInput.value = "";
        btnMetodo.forEach(btn => {
            btn.classList.remove("active");
        });
        valores();
    } else {
        alertBox('Selecione um método de pagamento e digite um valor válido');
    }
});

const modalConfig = document.getElementById("modalConfig");
for(let i = 0; i < btnConfig.length; i++){
    btnConfig[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display;
        if (modalStateConfig == 'none') {
            modalConfig.style.display = 'flex';
        }
    });
}

for(let i = 0; i < btnVoltar.length; i++){
    btnVoltar[i].addEventListener('click', () => {
        let modalStateConfig = modalConfig.style.display;
        let modalCashState = modalCash.style.display;
        
        if (modalStateConfig == 'flex') {
            modalConfig.style.display = 'none';
        }
        if(modalCashState === "flex") {
            modalCash.style.display = 'none';
        }
    });
}

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
    
    valorCashDisplay.textContent = valor_cashback_cliente.toFixed(2);
}

btnCash.addEventListener("click", () => {
    let modalCashState = modalCash.style.display;
    const cpf = formatarCPF(cpfinput.value);
    const id_empresa = getState('id_empresa');
    
    if (cpf == '') {
        alertBox("Cpf Invalido");
        return
    }

    if (!id_empresa) {
        alertBox('ID da empresa não encontrado');
        return;
    }

    fetch(`http://localhost:8080/backend/compras/collect?cpf_cliente=${cpf}&id_empresa=${id_empresa}`)
        .then(response => {
            if (!response.ok) {
                alertBox('Erro ao buscar compras')
                throw new Error('Erro ao buscar compras');
            }
            return response.json();
        })
        .then(jsonData => {
            if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
                alertBox('Nenhuma compra encontrada');
                return;
            }

            tbodyCash.innerHTML = '';

            jsonData.forEach((element) => {
                tbodyCash.innerHTML += `
                    <tr>
                        <td>${element.produto_nome || ''}</td>
                        <td>${element.quantidade || 0}</td>
                        <td>R$ ${element.produto_valor || 0}</td>
                        <td>R$ ${element.valor_cashback || 0}</td>
                        <td>${element.status_cashback || ''}
                            <input type="checkbox" 
                                   class="checkbox-cashback" 
                                   name="${element.id}" 
                                   id="selecionar-${element.id}">
                        </td>
                    </tr>
                `;
            });

            const checkboxes = document.querySelectorAll('.checkbox-cashback');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateValorCashbackCliente);
            });
            
            if (modalCashState === "none") {
                modalCash.style.display = 'flex';
            }
        })
        .catch((error) => {
            alertBox('Nenhuma compra encontrada');
        });
});

const btnConfirmarCashback = document.getElementById("confirmarCashback");
btnConfirmarCashback.addEventListener("click", () => {
    let modalCashState = modalCash.style.display;
    if(modalCashState == "flex") {
        modalCash.style.display = 'none';
        cashback.textContent = `R$ ${(valor_cashback_cliente).toFixed(2)}`;
        valores();
    }
});

const btnVoltar1 = document.getElementById("botvoltar");
btnVoltar1.addEventListener("click", () => {
    window.history.back();
});
