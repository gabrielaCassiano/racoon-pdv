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
