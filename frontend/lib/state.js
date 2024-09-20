const state = {
    isCaixaOpen: false
}
export function updateState (key, value) {
    if (key === undefined || value === undefined) {
        return 'Estado invalido'
    }
    state[key] = value
    return 'Estado Atualizado'
}   
export function getState (key) {
    if (key === undefined) {
        return 'Estado invalido'
    }
    return state[key]
}   