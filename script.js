const campoTarefas = document.getElementById("campo-tarefas");
const formularioTarefas = document.getElementById("formulario-tarefas");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");

const totalTarefas = document.getElementById("total-tarefas");
const tarefasPendentes = document.getElementById("tarefas-pendentes");
const tarefasConcluidas = document.getElementById("tarefas-concluidas");

const botaoAlterarTema = document.getElementById("botao-alterar-tema");
const botaoInformacoes = document.getElementById("botao-informacoes");

const modalInformacoes = document.getElementById("modal-informacoes");
const fecharInformacoes = document.getElementById("fechar-informacoes");
const botaoEntendi = document.getElementById("botao-entendi");

const mensagemVazia = document.getElementById("mensagem-vazia");
const botoesFiltro = document.querySelectorAll(".botao-filtro");

let tarefasSalvas = [];

try {
    const dadosSalvos = JSON.parse(
        localStorage.getItem("minhasTarefas")
    );

    if (Array.isArray(dadosSalvos)) {
        tarefasSalvas = dadosSalvos
            .filter(function(tarefa) {
                return tarefa &&
                    typeof tarefa.texto === "string";
            })
            .map(function(tarefa, indice) {
                return {
                    id: tarefa.id ?? indice + 1,
                    texto: tarefa.texto,
                    concluida: tarefa.concluida === true
                };
            });
    }
} catch (erro) {
    tarefasSalvas = [];
}

let tarefas = tarefasSalvas;
let filtroAtual = "todas";

let proximoId = tarefas.reduce(function(maior, tarefa) {
    return Math.max(maior, Number(tarefa.id) || 0);
}, 0) + 1;


// Salvar as tarefas no navegador
function salvarTarefas() {
    localStorage.setItem(
        "minhasTarefas",
        JSON.stringify(tarefas)
    );
}


// Atualizar os contadores
function atualizarContadores() {
    const concluidas = tarefas.filter(function(tarefa) {
        return tarefa.concluida;
    }).length;

    const pendentes = tarefas.length - concluidas;

    totalTarefas.textContent = tarefas.length;
    tarefasPendentes.textContent = pendentes;
    tarefasConcluidas.textContent = concluidas;

    contadorTarefas.textContent =
        tarefas.length === 1
        ? "1 tarefa"
        : tarefas.length + " tarefas";
}


// Exibir tarefas
function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(function(tarefa) {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    mensagemVazia.style.display =
        tarefasFiltradas.length === 0 ? "block" : "none";

    if (filtroAtual === "pendentes" && tarefasFiltradas.length === 0) {
        mensagemVazia.innerHTML =
            '<i class="fa-solid fa-check-circle"></i><br>' +
            'Você não tem tarefas pendentes!';
    } else if (
        filtroAtual === "concluidas" &&
        tarefasFiltradas.length === 0
    ) {
        mensagemVazia.innerHTML =
            '<i class="fa-solid fa-clipboard-check"></i><br>' +
            'Nenhuma tarefa concluída ainda.';
    } else if (tarefasFiltradas.length === 0) {
        mensagemVazia.innerHTML =
            '<i class="fa-regular fa-clipboard"></i><br>' +
            'Nenhuma tarefa cadastrada.';
    }

    tarefasFiltradas.forEach(function(tarefa) {
        const item = document.createElement("li");
        item.className = "item-tarefa";

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox-tarefa";
        checkbox.checked = tarefa.concluida;
        checkbox.setAttribute(
            "aria-label",
            "Marcar tarefa como concluída"
        );

        checkbox.addEventListener("change", function() {
            tarefa.concluida = checkbox.checked;
            salvarTarefas();
            mostrarTarefas();
        });

        const texto = document.createElement("span");
        texto.className = "texto-tarefa";
        texto.textContent = tarefa.texto;

        const acoes = document.createElement("div");
        acoes.className = "acoes-tarefa";

        // Botão de editar
        const botaoEditar = document.createElement("button");
        botaoEditar.className = "botao-editar";
        botaoEditar.innerHTML = '<i class="fa-solid fa-pen"></i>';
        botaoEditar.title = "Editar tarefa";
        botaoEditar.setAttribute("aria-label", "Editar tarefa");

        botaoEditar.addEventListener("click", function() {
            editarTarefa(tarefa.id);
        });

        // Botão de excluir
        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
        botaoExcluir.title = "Excluir tarefa";
        botaoExcluir.setAttribute("aria-label", "Excluir tarefa");

        botaoExcluir.addEventListener("click", function() {
            excluirTarefa(tarefa.id);
        });

        acoes.appendChild(botaoEditar);
        acoes.appendChild(botaoExcluir);

        item.appendChild(checkbox);
        item.appendChild(texto);
        item.appendChild(acoes);

        listaTarefas.appendChild(item);
    });

    atualizarContadores();
}


// Adicionar tarefa
formularioTarefas.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const texto = campoTarefas.value.trim();

    if (texto === "") {
        alert("Digite uma tarefa antes de adicionar!");
        return;
    }

    const novaTarefa = {
        id: proximoId++,
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();

    campoTarefas.value = "";

    // Mostrar a nova tarefa mesmo se outro filtro estiver ativo
    filtroAtual = "todas";

    botoesFiltro.forEach(function(botao) {
        botao.classList.toggle(
            "ativo",
            botao.dataset.filtro === "todas"
        );
    });

    mostrarTarefas();
    campoTarefas.focus();
});


// RF01: filtrar tarefas
botoesFiltro.forEach(function(botao) {
    botao.addEventListener("click", function() {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function(outroBotao) {
            outroBotao.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        mostrarTarefas();
    });
});


// RF02: editar tarefa
function editarTarefa(id) {
    const tarefa = tarefas.find(function(item) {
        return item.id === id;
    });

    if (!tarefa) {
        return;
    }

    const novoTexto = prompt(
        "Digite o novo texto da tarefa:",
        tarefa.texto
    );

    if (novoTexto === null) {
        return;
    }

    if (novoTexto.trim() === "") {
        alert("A tarefa não pode ficar vazia!");
        return;
    }

    tarefa.texto = novoTexto.trim();

    salvarTarefas();
    mostrarTarefas();
}


// Excluir tarefa
function excluirTarefa(id) {
    const confirmar = confirm(
        "Deseja realmente excluir esta tarefa?"
    );

    if (!confirmar) {
        return;
    }

    tarefas = tarefas.filter(function(tarefa) {
        return tarefa.id !== id;
    });

    salvarTarefas();
    mostrarTarefas();
}


// Alterar tema claro/escuro
botaoAlterarTema.addEventListener("click", function() {
    document.body.classList.toggle("escuro");

    const temaEscuro =
        document.body.classList.contains("escuro");

    if (temaEscuro) {
        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

        localStorage.setItem("temaTarefas", "escuro");
    } else {
        botaoAlterarTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

        localStorage.setItem("temaTarefas", "claro");
    }
});


// Recuperar o tema salvo
const temaSalvo = localStorage.getItem("temaTarefas");

if (temaSalvo === "escuro") {
    document.body.classList.add("escuro");

    botaoAlterarTema.innerHTML =
        '<i class="fa-solid fa-sun"></i>';
}


// Abrir janela de informações
botaoInformacoes.addEventListener("click", function() {
    modalInformacoes.showModal();
});


// Fechar janela de informações
fecharInformacoes.addEventListener("click", function() {
    modalInformacoes.close();
});

botaoEntendi.addEventListener("click", function() {
    modalInformacoes.close();
});


// Fechar ao clicar fora da janela
modalInformacoes.addEventListener("click", function(evento) {
    if (evento.target === modalInformacoes) {
        modalInformacoes.close();
    }
});


// Mostrar as tarefas ao abrir o site
mostrarTarefas();