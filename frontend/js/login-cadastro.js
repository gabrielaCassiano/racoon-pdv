cadastro =  document.getElementById("cadastro")
login = document.getElementById("login")
cadastrese =  document.getElementById("cadastrese")
cardCadastro = document.querySelector(".registro")
cardLogin = document.querySelector(".loginCard")

cadastrese.addEventListener('click', () => {
    cardCadastro.style.opacity = '1'
    cardCadastro.style.visibility = 'visible'

    cardLogin.style.opacity = '0'
    cardLogin.style.visibility = 'hidden'
})