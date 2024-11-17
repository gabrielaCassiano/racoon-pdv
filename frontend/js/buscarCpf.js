import {getState} from "../lib/state.js";
let idii = getState("id_empresa")
const input = document.getElementById('cpfInput');
const resultadosDiv = document.createElement('div');

resultadosDiv.style.position = 'absolute';
resultadosDiv.style.top = '70px';
resultadosDiv.style.left = '4px';
resultadosDiv.style.border = '1px solid #ccc';
resultadosDiv.style.backgroundColor = 'white';
resultadosDiv.style.width = '26vw';
resultadosDiv.style.maxHeight = '200px';
resultadosDiv.style.overflowY = 'auto';
resultadosDiv.style.display = 'none';
resultadosDiv.style.zIndex = '1000';

input.parentNode.insertBefore(resultadosDiv, input.nextSibling);

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function ordenarResultados(dados, textoBusca) {
    const busca = textoBusca.replace(/[^\d]/g, "");
    
    return dados.sort((a, b) => {
        const cpfA = a.cpf.toString().replace(/[^\d]/g, "");
        const cpfB = b.cpf.toString().replace(/[^\d]/g, "");
        
        const aComeca = cpfA.startsWith(busca);
        const bComeca = cpfB.startsWith(busca);
        
        if (aComeca && !bComeca) return -1;
        if (!aComeca && bComeca) return 1;
        return 0;
    });
}

let tempoDigitacao;
input.addEventListener('input', () => {
    clearTimeout(tempoDigitacao);
    
    tempoDigitacao = setTimeout(async () => {
        const texto = input.value.trim();
        
        if (texto.length >= 2) {
            try {
                const resposta = await fetch(`http://localhost:8080/backend/cliente/collect?nome_ou_cpf=${texto}&id_empresa=${idii}`);
                const dados = await resposta.json();
                
                resultadosDiv.innerHTML = '';
                
                if (dados && dados.length > 0) {
                    const dadosOrdenados = ordenarResultados(dados, texto);
                    
                    dadosOrdenados.forEach(cliente => {
                        const itemDiv = document.createElement('div');
                        itemDiv.style.padding = '10px';
                        itemDiv.style.borderBottom = '1px solid #eee';
                        itemDiv.style.cursor = 'pointer';
                        
                        const cpfFormatado = formatarCPF(cliente.cpf);
                        
                        itemDiv.innerHTML = `
                            <div><b>${cliente.nome}</b></div>
                            <div>${cpfFormatado}</div>
                        `;
                        
                        itemDiv.onmouseover = () => itemDiv.style.backgroundColor = '#f0f0f0';
                        itemDiv.onmouseout = () => itemDiv.style.backgroundColor = 'white';
                        
                        itemDiv.onclick = () => {
                            input.value = cpfFormatado;
                              
                            resultadosDiv.style.display = 'none';
                        };
                        
                        resultadosDiv.appendChild(itemDiv);
                    });
                    
                    resultadosDiv.style.display = 'block';
                } else {
                    resultadosDiv.innerHTML = '<div style="padding: 10px">Nenhum resultado encontrado</div>';
                    resultadosDiv.style.display = 'block';
                }
            } catch (erro) {
                console.error('Erro na busca:', erro);
                resultadosDiv.innerHTML = '<div style="padding: 10px">Cliente não encontrado</div>';
                resultadosDiv.style.display = 'block';
            }
        } else {
            resultadosDiv.style.display = 'none';
        }
    }, 300);
});

document.addEventListener('click', (e) => {
    if (e.target !== input && e.target !== resultadosDiv) {
        resultadosDiv.style.display = 'none';
    }
});