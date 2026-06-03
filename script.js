let contador = 0;
let cardEditando = null;
let cardArrastado = null;

// ==========================
// LOCAL STORAGE
// ==========================

function salvarDados() {

    const dados = {
        alinhamento: document.getElementById("alinhamento").innerHTML,
        boleto: document.getElementById("boleto").innerHTML,
        pagamento: document.getElementById("pagamento").innerHTML,
        coleta: document.getElementById("coleta").innerHTML,
        excedentes: document.getElementById("listaExcedentes").innerHTML
    };

    localStorage.setItem(
        "posVenda",
        JSON.stringify(dados)
    );
}

function carregarDados() {

    const dados =
        JSON.parse(
            localStorage.getItem("posVenda")
        );

    if (!dados) return;

    document.getElementById("alinhamento").innerHTML =
        dados.alinhamento || "";

    document.getElementById("boleto").innerHTML =
        dados.boleto || "";

    document.getElementById("pagamento").innerHTML =
        dados.pagamento || "";

    document.getElementById("coleta").innerHTML =
        dados.coleta || "";

    document.getElementById("listaExcedentes").innerHTML =
        dados.excedentes || "";

    reativarCards();

    atualizarContadores();
    atualizarExcedentes();
}

// ==========================
// PEDIDOS
// ==========================

function adicionarPedido() {

    const cliente =
        document.getElementById("cliente").value;

    const empresa =
        document.getElementById("empresa").value;

    const pedido =
        document.getElementById("pedido").value;

    const obs =
        document.getElementById("obsFrete").value;

    if (!cliente || !empresa || !pedido) {

        alert(
            "Preencha Cliente, Empresa e Pedido"
        );

        return;
    }

    const card =
        criarCard(
            cliente,
            empresa,
            pedido,
            obs
        );

    document
        .getElementById("alinhamento")
        .appendChild(card);

    document.getElementById("cliente").value = "";
    document.getElementById("empresa").value = "";
    document.getElementById("pedido").value = "";
    document.getElementById("obsFrete").value = "";

    atualizarContadores();
    salvarDados();
}

function criarCard(
    cliente,
    empresa,
    pedido,
    obs
) {

    const card =
        document.createElement("div");

    card.className = "card";

    card.draggable = true;

    card.innerHTML = `
        <strong class="cliente">${cliente}</strong>

        <span class="empresa">
            Empresa: ${empresa}
        </span>

        <br>

        <span class="pedido">
            Pedido: ${pedido}
        </span>

        ${
            obs
            ?
            `<span class="obs">
                OBS/FRETE: ${obs}
            </span>`
            :
            ""
        }

        <div class="botoes">

            <button
                class="btn-voltar"
                onclick="voltarEtapa(this)">
                ⬅
            </button>

            <button
                class="btn-avancar"
                onclick="proximaEtapa(this)">
                ➡
            </button>

            <button
                class="btn-editar"
                onclick="abrirEdicao(this)">
                ✏️
            </button>

        </div>

        <button
            class="excluir"
            onclick="removerCard(this)">
            🗑 Excluir
        </button>
    `;

    configurarDrag(card);

    return card;
}

function removerCard(btn) {

    btn.closest(".card").remove();

    atualizarContadores();
    salvarDados();
}

function proximaEtapa(btn) {

    const card =
        btn.closest(".card");

    const coluna =
        card.parentElement.id;

    if (coluna === "alinhamento") {

        document
            .getElementById("boleto")
            .appendChild(card);

    }

    else if (coluna === "boleto") {

        document
            .getElementById("pagamento")
            .appendChild(card);

    }

    else if (coluna === "pagamento") {

        document
            .getElementById("coleta")
            .appendChild(card);

    }

    atualizarContadores();
    salvarDados();
}

function voltarEtapa(btn) {

    const card =
        btn.closest(".card");

    const coluna =
        card.parentElement.id;

    if (coluna === "coleta") {

        document
            .getElementById("pagamento")
            .appendChild(card);

    }

    else if (coluna === "pagamento") {

        document
            .getElementById("boleto")
            .appendChild(card);

    }

    else if (coluna === "boleto") {

        document
            .getElementById("alinhamento")
            .appendChild(card);

    }

    atualizarContadores();
    salvarDados();
}

// ==========================
// EDIÇÃO
// ==========================

function abrirEdicao(btn) {

    cardEditando =
        btn.closest(".card");

    document.getElementById(
        "editCliente"
    ).value =
        cardEditando
            .querySelector(".cliente")
            .innerText;

    document.getElementById(
        "editEmpresa"
    ).value =
        cardEditando
            .querySelector(".empresa")
            .innerText
            .replace("Empresa: ", "");

    document.getElementById(
        "editPedido"
    ).value =
        cardEditando
            .querySelector(".pedido")
            .innerText
            .replace("Pedido: ", "");

    const obs =
        cardEditando.querySelector(".obs");

    document.getElementById(
        "editObs"
    ).value =
        obs
        ? obs.innerText.replace(
            "OBS/FRETE: ",
            ""
        )
        : "";

    document.getElementById(
        "modalEditar"
    ).style.display =
        "flex";
}

function fecharModal() {

    document.getElementById(
        "modalEditar"
    ).style.display =
        "none";
}
// ==========================
// SALVAR EDIÇÃO
// ==========================

function salvarEdicao() {

    if (!cardEditando) return;

    const cliente =
        document.getElementById(
            "editCliente"
        ).value;

    const empresa =
        document.getElementById(
            "editEmpresa"
        ).value;

    const pedido =
        document.getElementById(
            "editPedido"
        ).value;

    const obs =
        document.getElementById(
            "editObs"
        ).value;

    cardEditando.querySelector(
        ".cliente"
    ).innerText = cliente;

    cardEditando.querySelector(
        ".empresa"
    ).innerText =
        "Empresa: " + empresa;

    cardEditando.querySelector(
        ".pedido"
    ).innerText =
        "Pedido: " + pedido;

    let obsElement =
        cardEditando.querySelector(
            ".obs"
        );

    if (obs) {

        if (!obsElement) {

            obsElement =
                document.createElement(
                    "span"
                );

            obsElement.className =
                "obs";

            const botoes =
                cardEditando.querySelector(
                    ".botoes"
                );

            cardEditando.insertBefore(
                obsElement,
                botoes
            );
        }

        obsElement.innerText =
            "OBS/FRETE: " + obs;

    } else {

        if (obsElement) {
            obsElement.remove();
        }
    }

    fecharModal();
    salvarDados();
}

// ==========================
// DRAG AND DROP
// ==========================

function configurarDrag(card) {

    card.addEventListener(
        "dragstart",
        () => {

            cardArrastado = card;

            card.classList.add(
                "dragging"
            );
        }
    );

    card.addEventListener(
        "dragend",
        () => {

            card.classList.remove(
                "dragging"
            );

            salvarDados();
        }
    );
}

document
.querySelectorAll(".dropzone")
.forEach(coluna => {

    coluna.addEventListener(
        "dragover",
        e => {

            e.preventDefault();

            coluna.classList.add(
                "drag-over"
            );
        }
    );

    coluna.addEventListener(
        "dragleave",
        () => {

            coluna.classList.remove(
                "drag-over"
            );
        }
    );

    coluna.addEventListener(
        "drop",
        () => {

            coluna.classList.remove(
                "drag-over"
            );

            if (cardArrastado) {

                coluna.appendChild(
                    cardArrastado
                );

                atualizarContadores();
                salvarDados();
            }
        }
    );
});

// ==========================
// REATIVAR CARDS
// ==========================

function reativarCards() {

    document
        .querySelectorAll(".card")
        .forEach(card => {

            card.draggable = true;

            configurarDrag(card);
        });
}

// ==========================
// CONTADORES
// ==========================

function atualizarContadores() {

    const alinhamento =
        document.getElementById(
            "alinhamento"
        ).children.length;

    const boleto =
        document.getElementById(
            "boleto"
        ).children.length;

    const pagamento =
        document.getElementById(
            "pagamento"
        ).children.length;

    const coleta =
        document.getElementById(
            "coleta"
        ).children.length;

    document.getElementById(
        "count-alinhamento"
    ).innerText =
        alinhamento;

    document.getElementById(
        "count-boleto"
    ).innerText =
        boleto;

    document.getElementById(
        "count-pagamento"
    ).innerText =
        pagamento;

    document.getElementById(
        "count-coleta"
    ).innerText =
        coleta;

    document.getElementById(
        "totalPedidos"
    ).innerText =
        alinhamento +
        boleto +
        pagamento +
        coleta;
}

// ==========================
// PESQUISA
// ==========================

function pesquisarPedidos() {

    const termo =
        document
            .getElementById(
                "pesquisa"
            )
            .value
            .toLowerCase();

    document
        .querySelectorAll(".card")
        .forEach(card => {

            const texto =
                card.innerText
                .toLowerCase();

            card.style.display =
                texto.includes(
                    termo
                )
                ? "block"
                : "none";
        });
}

// ==========================
// EXCEDENTES
// ==========================

function adicionarExcedente() {

    const nome =
        document.getElementById(
            "nomeExcedente"
        ).value;

    const valor =
        parseFloat(
            document.getElementById(
                "valorExcedente"
            ).value
        );

    if (!nome || !valor)
        return;

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "excedente-item";

    item.innerHTML = `
        <span>
            ${nome}
            - R$ ${valor.toFixed(2)}
        </span>

        <button
            onclick="removerExcedente(this)">
            Excluir
        </button>
    `;

    document
        .getElementById(
            "listaExcedentes"
        )
        .appendChild(item);

    document.getElementById(
        "nomeExcedente"
    ).value = "";

    document.getElementById(
        "valorExcedente"
    ).value = "";

    atualizarExcedentes();
    salvarDados();
}

function removerExcedente(btn) {

    btn.parentElement.remove();

    atualizarExcedentes();
    salvarDados();
}

function atualizarExcedentes() {

    let total = 0;

    document
        .querySelectorAll(
            ".excedente-item span"
        )
        .forEach(item => {

            const valor =
                parseFloat(
                    item.innerText.split(
                        "R$ "
                    )[1]
                );

            total += valor;
        });

    document.getElementById(
        "totalExcedentes"
    ).innerText =
        total.toFixed(2);
}

// ==========================
// LIMPAR TUDO
// ==========================

function limparTudo() {

    if (
        confirm(
            "Deseja apagar todos os dados?"
        )
    ) {

        localStorage.removeItem(
            "posVenda"
        );

        location.reload();
    }
}

// ==========================
// INICIAR SISTEMA
// ==========================

window.onload = () => {

    carregarDados();

    atualizarContadores();

    atualizarExcedentes();
};
