var paginaAtual = 1
const vagasPerPage = 5

async function GetMaxVagas() {
    return fetch("/api/vagas")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }

        return response.json();
    })
    .then(vagas => {
        return vagas.length
    })
}

function RenderVagas() {
    fetch("/api/vagas")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }

        return response.json();
    })
    .then(vagas => {
        const pageCounter = document.getElementById('pageCounter');
        GetMaxVagas().then(res => {
            pageCounter.innerText = `${paginaAtual} - ${Math.ceil(res / vagasPerPage)}`;
        });
        const ul = document.getElementById('lista-vagas');
        ul.innerHTML = ''

        const vagasVisiveis = vagas.slice((paginaAtual-1) * vagasPerPage, paginaAtual*vagasPerPage)
        
        vagasVisiveis.forEach(vaga => {
            const li = document.createElement('li');
            
            li.innerHTML = `
                <div class="titulo">${vaga.titulo}</div>
                <div class="empresa-local">${vaga.empresa} — ${vaga.local}</div>
                <div class="descricao">${vaga.descricao}</div>
                <div class="salario-tipo">Salário: R$${vaga.salario.toLocaleString('pt-BR')} — Contrato: ${vaga.tipoContrato}</div>
            `;

            li.addEventListener("click", (ev) => {
                const vagaId = document.getElementById("vaga");
                for (option of vagaId.options) {
                    if (option.id == `vaga-${vaga.id}`) {
                        vagaId.options[vaga.id].selected = true;
                        vagaId.scrollIntoView({ behavior:"smooth", block:"center"});
                    }
                }
            });

            ul.appendChild(li);
            adicionarVagaNaLista(vaga);
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}


function adicionarVagaNaLista(vaga) {
    const vagaId = document.getElementById("vaga");
    const option = document.createElement("option");

    option.id = `vaga-${vaga.id}`
    option.text = `${vaga.titulo} - ${vaga.empresa}`;
    vagaId.appendChild(option);
}

// Lidar com envio do formulário
function tratarEnvioFormulario(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const vagaId = document.getElementById("vaga");
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !vagaId) {
        alert("Por favor, preencha os campos obrigatórios.");
        return;
    }

    // Aqui você pode enviar esses dados para um backend via fetch ou outro método

    // Mostrar mensagem de sucesso
    fetch("/api/vagas")
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao carregar o arquivo JSON");
        }

        return response.json();
    })
    .then(vagas => {
        for (option of vagaId.options) {
            if (option.selected) {
                const vagaSelecionada = vagas.find(v => `vaga-${v.id}` == option.id);
                event.target.reset();
            }
        }
    })    
}

// Inicializar a página
function init() {
    const form = document.getElementById("form-candidatura");
    const botaoProxima = document.getElementById("botao-proxima");
    const botaoAnterior = document.getElementById("botao-anterior");

    botaoProxima.addEventListener("click", () => {
        GetMaxVagas().then((res) => {
            if (paginaAtual + 1 <= Math.ceil(res / vagasPerPage)) {
                paginaAtual += 1;
                RenderVagas();
            }
        });
        
    });

    botaoAnterior.addEventListener("click", () => {
        if (paginaAtual - 1 >= 1) {
            paginaAtual -= 1;
            RenderVagas();
        }
    });

    form.addEventListener("submit", tratarEnvioFormulario);
    
    RenderVagas();
}

window.addEventListener("DOMContentLoaded", init);