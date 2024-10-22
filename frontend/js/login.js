const container = document.getElementById('container');
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('loginBtn');
const signInBtn = document.getElementById('signInBtn');


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







