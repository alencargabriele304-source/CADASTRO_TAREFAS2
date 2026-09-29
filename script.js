const campoTarefas = document.getElementById("campo-tarefas");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoAlterarTema = document.getElementById("botao-alterar-tema");


// Adicionar tarefa

function adicionarTarefa() {
    const texto = campoTarefas.value.trim();

    if (texto === "") {
        return;
    }
    const itemTarefa = document.createElement("li");

    itemTarefa.className = "item-tarefa";

    itemTarefa.innerHTML = `
        <span>${texto}</span>

        <div class="acoes-tarefa">
            <button class="botao-acao concluir">
                <i class="fa-solid fa-check"></i>
            </button>
            <button class="botao-acao excluir">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>
    `;
    listaTarefas.appendChild(itemTarefa);

    campoTarefas.value = "";

    atualizarContador();
}


// Botão adicionar
botaoAdicionar.addEventListener("click", adicionarTarefa);

// Adicionar usando Enter
campoTarefas.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        adicionarTarefa();
    }

});


// Ações das tarefas
listaTarefas.addEventListener("click", function(event) {

    const botao = event.target.closest("button");

    if (!botao) {
        return;
    }
    const tarefa = botao.closest(".item-tarefa");
    if (botao.classList.contains("concluir")) {
        tarefa.classList.toggle("concluido");

    }
    if (botao.classList.contains("excluir")) {

        tarefa.remove();

    }
    atualizarContador();

});

// Atualizar contador

function atualizarContador() {

    const quantidade = listaTarefas.children.length;

    if (quantidade === 1) {
        contadorTarefas.textContent = "1 tarefa na lista";
    } else {
        contadorTarefas.textContent =
            quantidade + " tarefas na lista";
    }

}

// Alterar tema

botaoAlterarTema.addEventListener("click", function() {

    document.body.classList.toggle("modo-escuro");
    const icone = botaoAlterarTema.querySelector("i");

    if (document.body.classList.contains("modo-escuro")) {

        icone.classList.remove("fa-moon");
        icone.classList.add("fa-sun");

    } else {
        icone.classList.remove("fa-sun");
        icone.classList.add("fa-moon");
    }

});