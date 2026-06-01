let contador = 0;

function adicionarPedido(){

const cliente =
document.getElementById("cliente").value;

const empresa =
document.getElementById("empresa").value;

const pedido =
document.getElementById("pedido").value;

if(!cliente || !empresa || !pedido){
alert("Preencha todos os campos");
return;
}

contador++;

const card =
document.createElement("div");

card.className = "card";

card.innerHTML = `
<strong>${cliente}</strong>
Empresa: ${empresa}<br>
Pedido: ${pedido}

<div class="botoes">
<button onclick="voltarEtapa(this)">⬅</button>
<button onclick="proximaEtapa(this)">➡</button>
</div>

<button
class="excluir"
onclick="removerCard(this)">
🗑 Excluir
</button>
`;

document
.getElementById("alinhamento")
.appendChild(card);

document.getElementById("cliente").value="";
document.getElementById("empresa").value="";
document.getElementById("pedido").value="";

atualizarContadores();
}

function removerCard(btn){

btn.parentElement.remove();

atualizarContadores();
}

function proximaEtapa(btn){

const card = btn.closest(".card");

const coluna =
card.parentElement.id;

if(coluna==="alinhamento"){

document
.getElementById("boleto")
.appendChild(card);

}

else if(coluna==="boleto"){

document
.getElementById("pagamento")
.appendChild(card);

}

else if(coluna==="pagamento"){

document
.getElementById("coleta")
.appendChild(card);

}

atualizarContadores();
}

function voltarEtapa(btn){

const card = btn.closest(".card");

const coluna =
card.parentElement.id;

if(coluna==="coleta"){

document
.getElementById("pagamento")
.appendChild(card);

}

else if(coluna==="pagamento"){

document
.getElementById("boleto")
.appendChild(card);

}

else if(coluna==="boleto"){

document
.getElementById("alinhamento")
.appendChild(card);

}

atualizarContadores();
}

function atualizarContadores(){

const alinhamento =
document.getElementById("alinhamento")
.children.length;

const boleto =
document.getElementById("boleto")
.children.length;

const pagamento =
document.getElementById("pagamento")
.children.length;

const coleta =
document.getElementById("coleta")
.children.length;

document.getElementById("count-alinhamento").innerText = alinhamento;
document.getElementById("count-boleto").innerText = boleto;
document.getElementById("count-pagamento").innerText = pagamento;
document.getElementById("count-coleta").innerText = coleta;

document.getElementById("totalPedidos").innerText =
alinhamento +
boleto +
pagamento +
coleta;
}

function pesquisarPedidos(){

const termo =
document
.getElementById("pesquisa")
.value
.toLowerCase();

document
.querySelectorAll(".card")
.forEach(card=>{

const texto =
card.innerText.toLowerCase();

card.style.display =
texto.includes(termo)
? "block"
: "none";

});
}

function adicionarExcedente(){

const nome =
document.getElementById("nomeExcedente").value;

const valor =
parseFloat(
document.getElementById("valorExcedente").value
);

if(!nome || !valor){
return;
}

const item =
document.createElement("div");

item.className =
"excedente-item";

item.innerHTML = `
<span>${nome} - R$ ${valor.toFixed(2)}</span>

<button onclick="removerExcedente(this)">
Excluir
</button>
`;

document
.getElementById("listaExcedentes")
.appendChild(item);

document.getElementById("nomeExcedente").value="";
document.getElementById("valorExcedente").value="";

atualizarExcedentes();
}

function removerExcedente(btn){

btn.parentElement.remove();

atualizarExcedentes();
}

function atualizarExcedentes(){

let total = 0;

document
.querySelectorAll(".excedente-item span")
.forEach(item=>{

const valor =
parseFloat(
item.innerText.split("R$ ")[1]
);

total += valor;

});

document
.getElementById("totalExcedentes")
.innerText =
total.toFixed(2);
}