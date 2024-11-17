import {getState} from '../lib/state.js';
const tbodyRelatorio = document.getElementById('tbodyRelatorio');
const vendasValorTotal = document.getElementById('vendasValorTotal');
const vendasQtdTotal = document.getElementById('vendasQtdTotal');

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

async function getCaixaAtual(id_empresa) {
    try {
        const response = await fetch(`http://localhost:8080/backend/caixa/collect?id_empresa=${id_empresa}`);
        if (!response.ok) throw new Error('Erro ao buscar caixa');
        const caixas = await response.json();
        console.log(caixas)
        return caixas.find(caixa => caixa.fechado === null);
    } catch (error) {
        console.error('Erro ao buscar caixa:', error);
        return null;
    }
}

const fetchProdutos = async () => {
    try {
        const id_empresa = getState('id_empresa');
        const caixaAtual = await getCaixaAtual(id_empresa);

        if (!caixaAtual) {
            tbodyRelatorio.innerHTML = '<tr><td colspan="3">Nenhum caixa aberto encontrado</td></tr>';
            atualizarTotais(0, 0);
            return;
        }

        console.log('Caixa atual:', caixaAtual.id);

        const response = await fetch(`http://localhost:8080/backend/compras/collect?id_empresa=${id_empresa}&id_caixa=${caixaAtual.id}`);
        
        console.log('Response status:', response.status);
        console.log(response)
        if (!response.ok) {
            
            tbodyRelatorio.innerHTML = '<tr><td colspan="3">Nenhuma compra encontrada</td></tr>';
            atualizarTotais(0, 0);
            return;
        }

          

        const data = await response.json();

        const dataFormated = data
        console.log('Dados recebidos:', dataFormated);
        
        const compras = Array.isArray(data) ? data : [];
        
        tbodyRelatorio.innerHTML = '';
        
        if(compras.length === 0) {
            tbodyRelatorio.innerHTML = '<tr><td colspan="3">Nenhuma compra encontrada neste caixa</td></tr>';
            atualizarTotais(0, 0);
            return;
        }
        
        let valorTotal = 0;
        compras.forEach(element => {
            const valor = parseFloat(element.valor_total);
            valorTotal += valor;
            
            tbodyRelatorio.innerHTML += `
                <tr>
                    <td>${element.cliente_nome || 'N/A'}</td>
                    <td>${element.cliente_cpf || 'N/A'}</td>
                    <td>R$ ${valor.toFixed(2)}</td>
                </tr>
            `;
        });
        
        atualizarTotais(valorTotal, compras.length);
        
    } catch (error) {
        console.error('Erro ao carregar compras:', error);
        tbodyRelatorio.innerHTML = '<tr><td colspan="3">Erro ao carregar compras</td></tr>';
        atualizarTotais(0, 0);
    }
}

const atualizarModalFechamento = async () => {
    try {
        const id_empresa = getState('id_empresa');
        const id_funcionario = getState('id_funcionario');
        const caixaAtual = await getCaixaAtual(id_empresa);
        
        if (!caixaAtual) throw new Error('Nenhum caixa aberto encontrado');

        const responseFuncionario = await fetch(`http://localhost:8080/backend/funcionario/collect?id_empresa=${id_empresa}&id_funcionario=${id_funcionario}`);
        
        let nome_funcionario = 'N/A';
        let senha_funcionario = 'N/A';
        
        if (responseFuncionario.ok) {
            const funcionario = await responseFuncionario.json();
            console.log("Dados do funcionário:", funcionario);
            if (funcionario?.data?.length > 0) {
                const primeiroFuncionario = funcionario.data[0];
                nome_funcionario = primeiroFuncionario.nome;
                senha_funcionario = primeiroFuncionario.senha;
            }
        }

        const response = await fetch(`http://localhost:8080/backend/compras/collect?id_empresa=${id_empresa}&id_caixa=${caixaAtual.id}`);
        
        if (!response.ok) throw new Error('Erro ao buscar compras');

        const data = await response.json();
        const compras = Array.isArray(data) ? data : [];

        const totais = {
            credito: 0,
            debito: 0,
            dinheiro: 0,
            pix: 0,
            cashback: 0
        };

        compras.forEach(compra => {
            if (!compra.metodo_pagamento) return;
            
            const valor = parseFloat(compra.valor_total) || 0;
            const metodos = compra.metodo_pagamento.toLowerCase().split(',');
            const valorPorMetodo = valor / metodos.length;

            metodos.forEach(metodo => {
                metodo = metodo.trim();
                if (totais.hasOwnProperty(metodo)) {
                    totais[metodo] += valorPorMetodo;
                }
            });

            if (compra.valor_cashback && compra.status_cashback != 'DISPONIVEL') {
                totais.cashback += parseFloat(compra.valor_cashback);
            }
        });

        document.querySelector('.infoFechamentoUl').innerHTML = `
            <li>Operador:<br> <span class="dentrinhoDoFechamento">${nome_funcionario}</span></li>
            <li>Codigo Operador: <span class="dentrinhoDoFechamento">${senha_funcionario}</span></li>
            <li>Data: <br><span class="dentrinhoDoFechamento">${new Date(caixaAtual.aberto).toLocaleDateString()}</span></li>
        `;
        const totalCalculado = ((totais.credito+totais.debito+totais.dinheiro+totais.pix)-totais.cashback).toFixed(2)
        const valorTotalH2 = document.getElementById('valorTotalH2')

        valorTotalH2.innerHTML = `Total (cashback calculado): R$ ${totalCalculado}`

        document.querySelector('.listagemfechamento tbody').innerHTML = `
            <tr>
                <td>${totais.credito.toFixed(2)}</td>
                <td>${totais.debito.toFixed(2)}</td>
                <td>${totais.dinheiro.toFixed(2)}</td>
                <td>${totais.pix.toFixed(2)}</td>
                <td>R$ ${totais.cashback.toFixed(2)}</td>
            </tr>
        `;

    } catch (error) {
        console.error('Erro ao atualizar modal:', error);
        document.querySelector('.listagemfechamento tbody').innerHTML = `
            <tr><td>0.00</td><td>0.00</td><td>0.00</td><td>0.00</td><td>R$ 0.00</td></tr>
        `;
    }
};

const atualizarTotais = (valorTotal, quantidade) => {
    vendasValorTotal.textContent = `Valor Vendas: R$ ${valorTotal.toFixed(2)}`;
    vendasQtdTotal.textContent = `Total Vendas: ${quantidade}`;
}

document.addEventListener('DOMContentLoaded', function() {
    fetchProdutos();
    
    const dataInput = document.getElementById('nomeproduto');
    const lupaButton = document.querySelector('.botlupa');

    if (lupaButton) {
        lupaButton.addEventListener('click', async (event) => {
            event.preventDefault();
            let dataSelect = dataInput.value;
            const id_empresa = getState('id_empresa');

            if (dataSelect) {
                const data = new Date(dataSelect);
                data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
                dataSelect = data.toISOString().slice(0, 10);
            }

            try {
                const response = await fetch(`http://localhost:8080/backend/compras/collect?id_empresa=${id_empresa}&data=${dataSelect}`);
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                const compras = Array.isArray(data) ? data : [];
                
                tbodyRelatorio.innerHTML = '';
                
                if(compras.length === 0) {
                    tbodyRelatorio.innerHTML = '<tr><td colspan="3">Nenhuma compra encontrada para esta data</td></tr>';
                    atualizarTotais(0, 0);
                    return;
                }
                
                let valorTotal = 0;
                compras.forEach(element => {
                    const valor = parseFloat(element.valor_total);
                    valorTotal += valor;
                    
                    tbodyRelatorio.innerHTML += `
                        <tr>
                            <td>${element.cliente_nome}</td>
                            <td>${element.cliente_cpf}</td>
                            <td>R$ ${valor.toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                atualizarTotais(valorTotal, compras.length);
                
            } catch (error) {
                console.error('Erro ao buscar compras:', error);
                tbodyRelatorio.innerHTML = '<tr><td colspan="3">Erro ao buscar compras</td></tr>';
                atualizarTotais(0, 0);
            }
        });
    }

    const btnFechamento = document.getElementById('fecharCaixa');
    if (btnFechamento) {
        btnFechamento.addEventListener('click', async () => {
            const id_empresa = getState('id_empresa');
            const id_funcionario = getState('id_funcionario');

            if (!id_empresa || !id_funcionario) {
                alertBox('Dados da empresa ou funcionário não encontrados.');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/backend/caixa/close', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_empresa,
                        id_funcionario
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alertBox('Caixa fechado com sucesso!');
                    window.location.reload();
                } else {
                    alertBox(`Erro ao fechar o caixa: ${data.message}`);
                }
            } catch (error) {
                console.error('Erro ao fechar o caixa:', error);
                alertBox('Ocorreu um erro ao tentar fechar o caixa.');
            }
        });
    }
});

const botVoltar = document.getElementById("botVoltar");
if(botVoltar) {
    botVoltar.addEventListener("click", () => {
        window.history.back();
    });
}

const btnFechamento = document.querySelectorAll(".fechamento1");
const btnVoltarFechamento = document.querySelectorAll(".botVoltarModal");
const modalConfig = document.getElementById("modalConfig");

btnFechamento.forEach(btn => {
    btn.addEventListener('click', async () => {
        if (modalConfig && modalConfig.style.display === 'none') {
            await atualizarModalFechamento();
            modalConfig.style.display = 'flex';
        }
    });
});

btnVoltarFechamento.forEach(btn => {
    btn.addEventListener('click', () => {
        if (modalConfig && modalConfig.style.display === 'flex') {
            modalConfig.style.display = 'none';
        }
    });
});