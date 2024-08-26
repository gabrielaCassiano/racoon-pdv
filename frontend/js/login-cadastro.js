cadastro =  document.getElementById("cadastro")
login = document.getElementById("login")
cadastrese =  document.getElementById("cadastrese")
cardCadastro = document.querySelector(".registro")
cardLogin = document.querySelector(".loginCard")

cadastrese.addEventListener('click', () => {
    cardCadastro.style.display = 'flex'
    cardLogin.style.display = 'none'
})