// import {updateState, getState} from '../lib/state.js'

const btnLoginFuncionario = document.getElementById("botaoLoginFunc")
const modalAbrirCaixa = document.getElementById("modalAberturaDeCaixa")
const optionsPdv = document.getElementById("optPdv")
const optionsOpen = document.getElementById("optOpen")



btnLoginFuncionario.addEventListener('click', () => {
    modalAbrirCaixa.style.display = 'none'
    optionsPdv.style.display = 'flex'
    optionsOpen.style.display = 'none'
})