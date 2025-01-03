const parede = new Image;
parede.src = "../imagens/parede1.png";

const parede2 = new Image;
parede2.src = "../imagens/parede2.png";

const tijolo = new Image;
tijolo.src = "../imagens/tijolo3.png";

const porta_vermelha = new Image;
porta_vermelha.src = "../imagens/porta_vermelha.png";

const porta_amarela = new Image;
porta_amarela.src = "../imagens/porta_amarela.png";

const chave_amarela = new Image;
chave_amarela.src = "../imagens/chave_amarela.png";
chave_amarela.className = "small"

const chave_vermelha = new Image;
chave_vermelha.src = "../imagens/chave_vermelha.png";
chave_vermelha.className = "small";

const cura = new Image;
cura.src = "../imagens/cura.png";
cura.className = "medium";

const vidaBom = new Image;
vidaBom.src = "../imagens/vida_bom.png";

const vidaRuim = new Image;
vidaRuim.src = "../imagens/vida_ruim.png";

const bau = new Image;
bau.src = "../imagens/bau.png";
bau.className = "big";

const textures = {
    esponja: parede,
    vidaBom: vidaBom,
    vidaRuim: vidaRuim,
    w: tijolo,
    dr: porta_vermelha,
    dy: porta_amarela,
    ky: chave_amarela,
    kr: chave_vermelha,
    cr: cura,
    ch: bau,
    " ": "grey",
    "notFound": "purple"
}

export default textures