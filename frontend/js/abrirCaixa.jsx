
const loginFuncionarioBtn = document.getElementById('botaoLoginFunc');
const optionsPdv = document.getElementById("optPdv")
const optionsOpen = document.getElementById("optOpen")
let idCaixa = null;

//fetch paa ver se o caixa está aberto.. hi hi ho 
async function estadoCaixa(){

    try {
        const response = await fetch('http://localhost:8080/backend/caixa/collect?id_caixa=14&id_empresa=1', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
            
        })

        if(!response.ok) {
            console.error('Erro na aberturadasda:', error);
        }
        const data = await response.text()
        console.log(data === '')
        if(data === '') {
            return 'a'
        }
        const dataJson = JSON.parse(data)
        if((dataJson[0].fechado === null)) {
            modalAbrirCaixa.style.display = 'none'
            optionsPdv.style.display = 'flex'
            optionsOpen.style.display = 'none'
        }
    } catch (error) {
        console.error('Erro na abertura:', error);
    }
}

window.onload = () => {
    estadoCaixa();
};





if(idCaixa == null){
    modalAbrirCaixa.style.display = 'none'
    optionsPdv.style.display = 'none'
    optionsOpen.style.display = 'flex'
}


loginFuncionarioBtn.addEventListener('click', async (event) => {
    event.preventDefault();




    const dados = {
        id_empresa: "1",
        valor_inicial: document.getElementById('fundoDeCaixa').value,
        id_funcionario: document.getElementById('numeroCadastrado').value
    };

    console.log(dados);

    try {
        const response = await fetch('http://localhost:8080/backend/caixa/open', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })

        if(!response.ok) {
            console.error('Erro na aberturadasda:', error);
        }
        const data = await response.json()
        if(data) {
            idCaixa = data.id
            modalAbrirCaixa.style.display = 'none'
            optionsPdv.style.display = 'flex'
            optionsOpen.style.display = 'none'
            console.log(idCaixa)
        }
    } catch (error) {
        console.error('Erro na abertura:', error);
    }


});