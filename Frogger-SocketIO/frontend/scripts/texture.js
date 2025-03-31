const textures = {}

const textures_paths = {
    sapo_verde: "/assets/sapin_verde_borda.png",
    sapo_verde_caminhar : "/assets/sapin_verde_caminhar_borda.png",
    agua : "/assets/agua.png",
    agua_movimento : "/assets/agua_movimento.png",
    tora : "/assets/tora.png",
    torinha : "/assets/torinha.png",
    derrota_aiger : "/assets/derrota_aiger.png",
    estrada_fudida: "/assets/estrada_fudida.png",
    estrada: "/assets/estrada.png",
    carro:"/assets/carro2.png",
    areia: "/assets/areia.png",
    parasol: "/assets/parasol.png",
    bola_volei : "/assets/bola_volei.png",
    castelo_areia : "/assets/castelo_areia.png"
}

for (const txt in textures_paths) {
    const img = new Image;
    img.src = textures_paths[txt];
    textures[txt] = img;
}

export default textures