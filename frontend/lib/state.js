const stateConfig = {
    numericas: ['valorCompra', 'valorDesconto', 'valorTotal', 'cashback'],
    inteiras: ['id_cliente', 'id_funcionario', 'id_empresa', 'id_produto'],
    listas: ['produtos', 'funcionarios']
};

const state = {
    valorCompra: parseFloat(sessionStorage.getItem('valorCompra')) || 0,
    valorDesconto: parseFloat(sessionStorage.getItem('valorDesconto')) || 0,
    valorTotal: parseFloat(sessionStorage.getItem('valorTotal')) || 0,
    cashback: parseFloat(sessionStorage.getItem('cashback')) || 0,
    id_cliente: parseInt(localStorage.getItem('id_cliente')) || null,
    id_funcionario: JSON.parse(localStorage.getItem('id_funcionario')) ||  [],
    id_empresa: parseInt(localStorage.getItem('id_empresa')) || null,
    id_produto: parseInt(localStorage.getItem('id_produto')) || null,
    nome_cliente: localStorage.getItem('nome_cliente') || '',
    cpf_cliente: localStorage.getItem('cpf_cliente') || '',
    produtos: JSON.parse(localStorage.getItem('produtos')) || [],
    funcionarios: JSON.parse(localStorage.getItem('funcionarios')) || []
};

function processarValor(key, value) {
    if (stateConfig.numericas.includes(key)) {
        return parseFloat(value);
    }
    if (stateConfig.inteiras.includes(key)) {
        return parseInt(value);
    }
    if (stateConfig.listas.includes(key)) {
        return Array.isArray(value) ? value : [];
    }
    return value;
}

export function updateState(key, value) {
    if (key === undefined || value === undefined) {
        return 'Estado inválido';
    }
    
    const valorProcessado = processarValor(key, value);
    state[key] = valorProcessado;

    if (stateConfig.numericas.includes(key)) {
        sessionStorage.setItem(key, value);
    } else if (stateConfig.inteiras.includes(key) || stateConfig.listas.includes(key)) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    return 'Estado atualizado';
}

export function addProduto(produto) {
    if (!produto || typeof produto !== 'object') {
        return 'Produto inválido';
    }

    if (!Array.isArray(state.produtos)) {
        state.produtos = [];
    }

    const novoArray = [...state.produtos];
    const index = novoArray.findIndex(p => p.codigo_barras === produto.codigo_barras);

    if (index !== -1) {
        novoArray[index].quantidade += produto.quantidade;
    } else {
        novoArray.push({ 
            codigo_barras: produto.codigo_barras, 
            nome: produto.nome, 
            valor: produto.valor, 
            quantidade: produto.quantidade 
        });
    }

    state.produtos = novoArray;
    localStorage.setItem('produtos', JSON.stringify(state.produtos));
    return 'Produto adicionado';
}

export function addFuncionario(funcionario) {
    if (!funcionario || typeof funcionario !== 'object') {
        return 'Funcionário inválido';
    }

    if (!Array.isArray(state.funcionarios)) {
        state.funcionarios = [];
    }

    const novoArray = [...state.funcionarios];
    const index = novoArray.findIndex(f => f.id === funcionario.id);

    if (index !== -1) {
        return 'Funcionário já adicionado';
    } else {
        novoArray.push({ 
            id: funcionario.id, 
        });
    }

    state.funcionarios = novoArray;
    localStorage.setItem('funcionarios', JSON.stringify(state.funcionarios));
    return 'Funcionário adicionado';
}

export function getState(key) {
    if (key === undefined) {
        return 'Estado inválido';
    }
    
    if (key === 'produtos' || key === 'funcionarios') {
        return Array.isArray(state[key]) ? [...state[key]] : [];
    }
    
    const storage = stateConfig.numericas.includes(key) ? sessionStorage : localStorage;
    const valorStorage = storage.getItem(key);
    
    if (valorStorage !== null) {
        state[key] = processarValor(key, valorStorage);
    }
    
    return state[key];
}

export function clearState(key) {
    if (key) {
        if (stateConfig.numericas.includes(key)) {
            sessionStorage.removeItem(key);
            state[key] = 0;
        } else if (stateConfig.inteiras.includes(key) || stateConfig.listas.includes(key)) {
            localStorage.removeItem(key);
            state[key] = null;
            if (stateConfig.listas.includes(key)) {
                state[key] = [];
            }
        }
    } else {
        Object.keys(state).forEach(key => {
            if (stateConfig.numericas.includes(key)) {
                sessionStorage.removeItem(key);
                state[key] = 0;
            } else if (stateConfig.inteiras.includes(key) || stateConfig.listas.includes(key)) {
                localStorage.removeItem(key);
                state[key] = null;
                if (stateConfig.listas.includes(key)) {
                    state[key] = [];
                }
            }
        });
    }
}

export function debugState() {
    return { ...state };
}
