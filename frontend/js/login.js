const container = document.getElementById('container');
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('loginBtn');
const signInBtn = document.getElementById('signInBtn');
const esqueceuSenha = document.getElementById('esqueceuSenha');
const modalEsqueceuSenha = document.getElementById('modalEsqueceuSenha');
const entreEmContato = document.getElementById('entreEmContato');
const modalEntreContato = document.getElementById('modalEntreContato');
const botvoltarmodal = document.querySelectorAll(".botvoltarmodal")

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


registerbtn.addEventListener('click', (event) => {
   event.preventDefault()
    container.classList.add("active");
});

signInBtn.addEventListener('click', (event) => {
    
    event.preventDefault()
    container.classList.remove("active");
});


loginbtn.addEventListener('click', (event) => {
    event.preventDefault()

    window.location.href = "../pages/pdv-principal.html"
});

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

let items = document.querySelectorAll('.slider .item');
let active = 1; 

function loadShow() {
    items.forEach(item => {
        item.style.transform = '';
        item.style.zIndex = '';
        item.style.filter = '';
        item.style.opacity = '';
    });
    items[active].style.transform = `none`;
    items[active].style.zIndex = 10; 
    items[active].style.filter = 'none';
    items[active].style.opacity = 1;

    let stt = 0;
    for (let i = active + 1; i < items.length; i++) {
        stt++;
        items[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
        items[i].style.zIndex = 10 - stt;
        items[i].style.filter = 'blur(5px)';
        items[i].style.opacity = 0.6; 
    }

    stt = 0;
    for (let i = active - 1; i >= 0; i--) {
        stt++;
        items[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
        items[i].style.zIndex = 10 - stt; 
        items[i].style.filter = 'blur(5px)';
        items[i].style.opacity = 0.6; 
    }
}

loadShow();

let next = document.getElementById('next');
let prev = document.getElementById('prev');

next.onclick = function() {
    if (active + 1 < items.length) {
        active++;
        loadShow();
    }
}

prev.onclick = function() {
    if (active - 1 >= 0) {
        active--;
        loadShow();
    }
}

// const card = document.getElementById('item1');

// let bordaOriginal = true;

// card.addEventListener('click', () => {

//     if (bordaOriginal) {
        
//         card.style.borderColor = ' #a5e85d';
//     } else {
        
//         card.style.borderColor = 'white';
//     }
    
//     bordaOriginal = !bordaOriginal;


// })

// const card1 = document.getElementById('item2');

// let bordaOriginal1 = true;

// card1.addEventListener('click', () => {

//     if (bordaOriginal1) {
        
//         card1.style.borderColor = ' #a5e85d';
//     } else {
        
//         card1.style.borderColor = 'white';
//     }
    
//     bordaOriginal1 = !bordaOriginal1;


// })

// const card3 = document.getElementById('item3');

// let bordaOriginal3 = true;

// card3.addEventListener('click', () => {

//     if (bordaOriginal3) {
        
//         card3.style.borderColor = ' #a5e85d';
//     } else {
        
//         card3.style.borderColor = 'white';
//     }
    
//     bordaOriginal3 = !bordaOriginal3;


// })


const divs = document.querySelectorAll('.item');
        let divSelecionada = null; 

        function desmarcarTodas() {
            divs.forEach(div => {
                div.classList.remove('selecionada');
            });
        }

        
        divs.forEach(div => {
            div.addEventListener('click', () => {
               
                if (div === divSelecionada) {
                    div.classList.remove('selecionada');
                    divSelecionada = null; 
                } else {
                    
                    desmarcarTodas();
                    div.classList.add('selecionada');
                    divSelecionada = div; 
                }
            });
        });






