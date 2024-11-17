import { getState } from "../lib/state.js";


let idii = getState("id_empresa");

let planoSelecionado = null;


const divs = document.querySelectorAll('.item');

function desmarcarTodas() {
    divs.forEach(div => {
        div.classList.remove('selecionada');
    });
}


divs.forEach(div => {
    div.addEventListener('click', () => {
        if (div === planoSelecionado) {
            div.classList.remove('selecionada');
            planoSelecionado = null;
        } else {
            desmarcarTodas();
            div.classList.add('selecionada');
            planoSelecionado = div.getAttribute('data-plano');
            console.log('Plano selecionado:', planoSelecionado);
        }
    });
});


const enviarPlanoNovoBtn = document.getElementById('enviarPlano');
enviarPlanoNovoBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    if (!planoSelecionado) {
        alert("Por favor, selecione um plano antes de continuar.");
        return;
    }

    if (!idii) {
        alert("ID da empresa não encontrado.");
        return;
    }

    const dados = {
        id_empresa: String(idii),
        plano: planoSelecionado
    };

    try {
        const response = await fetch('http://localhost:8080/backend/empresa/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao atualizar plano: ${errorData.message || response.statusText}`);
            return;
        }

        alert('Plano atualizado com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Erro ao atualizar plano, tente novamente.');
    }
});



  


async function fetchEmpresa() {
    try {
        const id_empresa = idii; 
        if (!id_empresa) {
            console.error("ID da empresa não encontrado.");
            return;
        }

        const response = await fetch(`http://localhost:8080/backend/empresa/collect?id_empresa=${id_empresa}`);
        
        if (!response.ok) {
            console.error("Erro na resposta do servidor:", response.statusText);
            return;
        }

        const data = await response.json();
        console.log("Dados recebidos:", data);

       
        if (!data) {
            console.error("Nenhuma informação da empresa encontrada");
            return;
        }

        const empresa = data; 
        const infoDiv = document.getElementById('EmpresaInfo');

        if (!infoDiv) {
            console.error("Elemento 'EmpresaInfo' não encontrado.");
            return;
        }

        
        infoDiv.innerHTML = '';

        
        const conteudo = `
            <p><strong>Nome da Empresa:</strong> ${empresa.nome_empresa}</p>
            
            <p><strong>CNPJ:</strong> ${empresa.cnpj}</p>
            
            <p><strong>Plano:</strong> ${empresa.plano}</p>
        `;
        infoDiv.innerHTML = conteudo;

    } catch (error) {
        console.error("Erro ao buscar empresa:", error);
    }
}


document.addEventListener('DOMContentLoaded', fetchEmpresa());



  




document.getElementById('enviarEdicao').addEventListener('click', async (event) => {
    event.preventDefault();

    const nomeNovo = document.getElementById('nomeNovo').value;
    const cnpjNovo = document.getElementById('cnpjNovo').value;

    if (!nomeNovo && !cnpjNovo) {
        alert("Por favor, preencha pelo menos um campo para atualizar.");
        return;
    }

    if (!idii) {
        alert("ID da empresa não encontrado.");
        return;
    }

    const dados = {
        id_empresa: String(idii),
        ...(nomeNovo && { nome_empresa: nomeNovo }),
        ...(cnpjNovo && { cnpj: cnpjNovo })
    };

    try {
        const response = await fetch('http://localhost:8080/backend/empresa/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Erro ao atualizar informações: ${errorData.message || response.statusText}`);
            return;
        }

        alert('Informações da empresa atualizadas com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Erro ao atualizar informações, tente novamente.');
    }
});




