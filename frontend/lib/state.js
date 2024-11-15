const stateConfig = {
    numericas: ['valorCompra', 'valorDesconto', 'valorTotal', 'cashback'],
    inteiras: ['id_cliente', 'id_funcionario', 'id_empresa', 'id_produto']
};

const state = {
    valorCompra: parseFloat(sessionStorage.getItem('valorCompra')) || 0,
    valorDesconto: parseFloat(sessionStorage.getItem('valorDesconto')) || 0,
    valorTotal: parseFloat(sessionStorage.getItem('valorTotal')) || 0,
    cashback: parseFloat(sessionStorage.getItem('cashback')) || 0,
    
    id_cliente: parseInt(localStorage.getItem('id_cliente')) || null,
    id_funcionario: parseInt(localStorage.getItem('id_funcionario')) || null,
    id_empresa: parseInt(localStorage.getItem('id_empresa')) || null,
    id_produto: parseInt(localStorage.getItem('id_produto')) || null,
    
    nome_cliente: localStorage.getItem('nome_cliente') || '',
    cpf_cliente: localStorage.getItem('cpf_cliente') || ''
};

function processarValor(key, value) {
    if (stateConfig.numericas.includes(key)) {
        return parseFloat(value);
    }
    if (stateConfig.inteiras.includes(key)) {
        return parseInt(value);
    }
    return value;
}

export function updateState(key, value) {
    if (key === undefined || value === undefined) {
        return 'Estado invalido';
    }
    
    const valorProcessado = processarValor(key, value);
    state[key] = valorProcessado;
    
    if (stateConfig.numericas.includes(key)) {
        sessionStorage.setItem(key, value);
    } else {
        localStorage.setItem(key, value);
    }
    
    return 'Estado Atualizado';
}   

export function getState(key) {
    if (key === undefined) {
        return 'Estado invalido';
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
        } else {
            localStorage.removeItem(key);
            state[key] = stateConfig.inteiras.includes(key) ? null : '';
        }
    } else {
        Object.keys(state).forEach(key => {
            if (stateConfig.numericas.includes(key)) {
                sessionStorage.removeItem(key);
                state[key] = 0;
            } else {
                localStorage.removeItem(key);
                state[key] = stateConfig.inteiras.includes(key) ? null : '';
            }
        });
    }
}

export function debugState() {
    return { ...state };
}