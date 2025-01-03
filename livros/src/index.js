import livros from "./livros.json" with {type: "json"};

const livrosLength = Object.keys(livros).length;

const prateleiras = document.querySelectorAll(".prateleira");
const limitePrateleira = 6;

const mesa = document.querySelector(".mesa");
const livroMesa = document.querySelector(".mesa").querySelector(".livro");

const abrirBtn = document.querySelector(".abrir-btn");
const fecharBtn = document.querySelector(".fechar-btn");
const voltarBtn = document.querySelector(".voltar-btn");
const proximaBtn = document.querySelector(".proxima-btn");

let pagina = 0;
let livroSelecionado = null;

// Função que lida com a prateleira quando tem livro na mesa
const handleClickVazio = () => {
    if (livroSelecionado != null) {

        livroSelecionado.classList.remove("fechado", "aberto");
        livroSelecionado.querySelector(".p1").innerHTML = "";
        livroSelecionado.querySelector(".p2").innerHTML = "";
        pagina = 0;

        livroMesa.replaceWith(livroSelecionado);
        mesa.appendChild(livroMesa);

        livroSelecionado = null;
    }
}

const handleClickAbrir = () => {
    abrirFecharLivro();
    carregarPagina();
}

const carregarPagina = () => {
    const p1 = livroSelecionado.querySelector(".p1");
    p1.innerHTML = livros[livroSelecionado.id].textos[pagina];
    p1.setAttribute("style", '--pagina: ' + '"' + (pagina + 1) + '"');

    const p2 = livroSelecionado.querySelector(".p2");
    p2.setAttribute("style", '--pagina: ' + '"' + (pagina + 2) + '"');
    if (livros[livroSelecionado.id].textos[pagina + 1] != undefined) {
        p2.innerHTML = livros[livroSelecionado.id].textos[pagina + 1];
    } else {
        p2.innerHTML = "";
    }
}

const abrirFecharLivro = () => {
    livroSelecionado.classList.toggle("fechado");
    livroSelecionado.classList.toggle("aberto");
}


const handleClickVoltar = () => {
    if (pagina === 0) return;
    pagina -= 2;
    carregarPagina();
}

const handleClickProxima = () => {
    if (livros[livroSelecionado.id].textos[pagina + 2] != undefined) {
        pagina += 2;
        carregarPagina();
    }
}

// Função que lida com o click nos livros da prateleira
const handleClickLivro = (e) => {
    if (livroSelecionado === null) {
        livroSelecionado = e.target;        
        livroSelecionado.classList.add("fechado");
        livroSelecionado.replaceWith(livroMesa);
        mesa.appendChild(livroSelecionado);
    }
}

const main = () => {
    let c = 0;
    for (let i = 1; i < livrosLength + 1; i++) {

        // Muda de prateleira caso fique cheio de livros
        if (prateleiras[c].children.length === limitePrateleira) {
            c++;
        }

        // Cria os livros e adiciona nas prateleiras
        const livro = document.createElement("div");
        livro.className = "livro";
        livro.id = i;
        livro.addEventListener("click", (e) => handleClickLivro(e, i));

        if (livros[i].color) {
            livro.style.setProperty("--color", livros[i].color);
        } else {
            livro.style.setProperty("--color", Math.floor((Math.random() * 360) - 180));
        }

        const nome = document.createElement("span");
        nome.classList = "nome";
        nome.innerHTML = livros[i].nome;

        const p1 = document.createElement("div");
        p1.classList.add("pagina", "p1");

        const p2 = document.createElement("div");
        p2.classList.add("pagina", "p2");

        livro.append(nome, p1, p2);
        prateleiras[c].appendChild(livro);
    }
}

livroMesa.addEventListener("click", handleClickVazio);
abrirBtn.addEventListener("click", handleClickAbrir);
fecharBtn.addEventListener("click", abrirFecharLivro);
voltarBtn.addEventListener("click", handleClickVoltar);
proximaBtn.addEventListener("click", handleClickProxima);

main()