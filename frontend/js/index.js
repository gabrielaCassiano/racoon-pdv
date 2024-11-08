const container = document.getElementById('container');
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('loginBtn');
// const signInBtn = document.getElementById('signInBtn');
const esqueceuSenha = document.getElementById('esqueceuSenha');
const modalEsqueceuSenha = document.getElementById('modalEsqueceuSenha');
const entreEmContato = document.getElementById('entreEmContato');
const modalEntreContato = document.getElementById('modalEntreContato');
const botvoltarmodal = document.querySelectorAll(".botvoltarmodal")
const botvoltarmodal3 = document.getElementById('botvoltarmodal3')


for(let i = 0; i < botvoltarmodal.length; i++){
    botvoltarmodal[i].addEventListener('click', () => {
        let modalStateEsqueceu = modalEsqueceuSenha.style.display
        let modalStateEntrarEmContato = modalEntreContato.style.display
        if (modalStateEsqueceu == 'flex') {
            modalEsqueceuSenha.style.display = 'none'
        }
        if (modalStateEntrarEmContato == 'flex') {
            modalEntreContato.style.display = 'none'
        }
    })
}

botvoltarmodal3.addEventListener("click", () => {
    window.location.href ="../pages/index.html"
})
// AQUI
registerbtn.addEventListener('click', (event) => {
   event.preventDefault()
    container.classList.add("active");
});

voltarLogin.addEventListener('click', (event) => {
    
    event.preventDefault()
    container.classList.remove("active");
});


// loginbtn.addEventListener('click', (event) => {
//     event.preventDefault()

//     window.location.href = "../pages/pdv-principal.html"
// });

// MODAL INICIO

esqueceuSenha.addEventListener('click', (event) => {
    event.preventDefault()
    let modalStateEsqueceu = modalEsqueceuSenha.style.display
    console.log(modalStateEsqueceu)
    if (modalStateEsqueceu == 'none') {
        modalEsqueceuSenha.style.display = 'flex'
    }
})
// MODAL FIM

// MODAL INICIO

entreEmContato.addEventListener('click', (event) => {
    event.preventDefault()
    let modalStateEntrarEmContato = modalEntreContato.style.display
    console.log(modalStateEntrarEmContato)
    if (modalStateEntrarEmContato == 'none') {
        modalEntreContato.style.display = 'flex'
    }
})
// MODAL FIM







