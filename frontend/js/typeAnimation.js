const texto = document.getElementById("texto");
const speed = 150;
const textoCompleto = "Ola!\nBem vindo ao\nRACCOON" ;

let i = 0;

function fazerAparecer() {
	if (i < textoCompleto.length) {
		if ( textoCompleto[i] === "O" && textoCompleto[i + 1] === "O" ) {
			texto.innerHTML += '<span class="oo">OO</span>';
			i += 2;
		} else {
			texto.innerHTML += textoCompleto[i] === "\n" ? "<br>" : textoCompleto[i];
			i++;
		}
		setTimeout(fazerAparecer, speed);
	}
}
fazerAparecer()

// VE SE FUNCIONO
