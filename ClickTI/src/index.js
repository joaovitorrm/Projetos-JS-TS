import { criarElemento, formatarNumero } from "./utils.js";

const pc = document.querySelector(".pc");

const dinheiroDiv = document.querySelector(".dinheiro").querySelector(".valor");
const dinheiroPorSegundoDiv = document.querySelector(".dinheiroPorSegundo").querySelector(".produz");
const dinheiroPorClickDiv = document.querySelector(".dinheiroPorClick").querySelector(".produz");

const leftArea = document.querySelector(".left-area");

const cafe = document.createElement("div");

const tarefasDiv = document.querySelector(".tarefas");
const upgradesDiv = document.querySelector(".upgrades");

class Game {

    dinheiro = 0;
    dinheiroPorClick = 1;
    dinheiroPorSegundo = 0;

    cafeSpawnRate = 5; // Porcentagem
    cafeBaseBonus = 1; //
    cafeBonusQuantidade = 2; // Quantidade de bonus
    cafeBonus = 1; // Multiplicador    
    duracaoDoCafe = 10; // Segundos
    cafeDespawn = 2; // Segundos

    bonusPermanente = 1;
    bonusDPSPermanente = 1;

    upgrades = {
        "1": {
            descricao: ["Comprar um mouse melhor.","Melhorar o PC x2"],
            custo: 5000,
            icone: "👆🏻",
            comprar: () => {
                this.tarefas["melhorar o pc"].produz *= 2;
                this.tarefas["melhorar o pc"].div.querySelector(".produz").innerHTML = this.tarefas["melhorar o pc"].produz;
            },
            div: null
        },
        "2": {
            descricao: ["Passar o número de telefone da T.I para agilizar o processso.", "Chamar a T.I. x2"],
            custo: 10000,
            icone: "📱",
            comprar: () => {
                this.tarefas["chamar a ti"].produz *= 2;
                this.tarefas["chamar a ti"].div.querySelector(".produz").innerHTML = this.tarefas["chamar a ti"].produz
            },
            div: null
        },
        "3": {
            descricao: ["Melhorar a conexão de internet para abrir chamados mais rapidamente.", "Abrir Chamado x2"],
            custo: 50000,
            icone: "🌐",
            comprar: () => {
                this.tarefas["abrir chamado"].produz *= 2;
                this.tarefas["abrir chamado"].div.querySelector(".produz").innerHTML = this.tarefas["abrir chamado"].produz
            },
            div: null
        },
        "4": {
            descricao: ["Fazer Meet com o Meet", "Dinheiro por Segundo x2"],
            custo: 100000,
            icone: "☎️",
            comprar: () => {
                this.bonusDPSPermanente *= 2;
            },
            div: null
        },
        "5": {
            descricao: ["Fazer Upgrade para pc da Positivo", "Melhorar o PC +50%"],
            custo: 1000,
            icone: "⬆️",
            div: null,
            comprar: () => {
                this.tarefas["melhorar o pc"].produz *= 1.5;
                this.tarefas["melhorar o pc"].div.querySelector(".produz").innerHTML = this.tarefas["melhorar o pc"].produz;
            }
        },
        "6": {
            descricao: ["Bater várias vezes na porta para chamar a T.I. mais rápido", "Chamar a T.I. +50%"],
            custo: 2500,
            icone: "🚪",
            div: null,
            comprar: () => {
                this.tarefas["chamar a ti"].produz *= 1.5;
                this.tarefas["chamar a ti"].div.querySelector(".produz").innerHTML = this.tarefas["chamar a ti"].produz;
            }
        }

    }

    tarefas = {
        "melhorar o pc": {
            nome: "Melhorar o PC",
            qtd: 0,
            custo: 10,
            acrescimo: 10,
            produz: 1,
            tipo: "click",
            div: null,
            unlock: {
                0: () => {
                    this.adicionarUpgrade(this.upgrades["5"]);
                },
                25: () => {
                    this.adicionarUpgrade(this.upgrades["1"]);
                },
                45: () => {
                    this.adicionarUpgrade(this.upgrades["4"]);
                }
            }
        },
        "chamar a ti": {
            nome: "Chamar a T.I.",
            qtd: 0,
            custo: 100,
            produz: 10,
            acrescimo: 15,
            tipo: "dps",
            div: null,
            unlock: {
                0: () => {
                    this.adicionarUpgrade(this.upgrades["6"])
                },
                15: () => {
                    this.adicionarTarefa(this.tarefas["abrir chamado"]);
                },
                25: () => {
                    this.adicionarUpgrade(this.upgrades["2"]);
                }
            }
        },
        "abrir chamado": {
            nome: "Abrir Chamado",
            qtd: 0,
            custo: 2000,
            produz: 60,
            acrescimo: 25,
            tipo: "dps",
            div: null,
            unlock: {
                15: () => {
                    this.adicionarTarefa(this.tarefas["jogar xadrez"]);
                },
                25: () => {
                    this.adicionarUpgrade(this.upgrades["3"]);
                }
            }
        },
        "jogar xadrez": {
            nome: "Jogar Xadrez",
            qtd: 0,
            custo: 50000,
            produz: 500,
            acrescimo: 50,
            tipo: "dps",
            div: null,
            unlock: {}
        }
    }
    
    constructor() {
        pc.addEventListener("click", () => {
            this.dinheiro += parseInt(this.dinheiroPorClick * this.cafeBonus);
            
            pc.classList.remove("clickAnimation");
            pc.classList.add("clickAnimation");
            setTimeout(() => {
                pc.classList.remove("clickAnimation");
            }, 200)
        });
        
        setInterval(() => {
            this.dinheiro += this.dinheiroPorSegundo;
            if (Math.floor(Math.random() * 100) < this.cafeSpawnRate && this.cafeBonus === 1 && cafe.parentElement === null) {                
                this.spawnCafe();
            }
        }, 1000);

        setInterval(() => {
            this.update();
        }, 50)

        cafe.addEventListener("click", () => {
            cafe.remove();
            this.cafeBonus = this.cafeBonusQuantidade;
            dinheiroPorClickDiv.style.color = "red"
            setTimeout(() => {
                dinheiroPorClickDiv.style.color = "white"                
                this.cafeBonus = this.cafeBaseBonus;
            }, this.duracaoDoCafe * 1000)
        })

        this.adicionarTarefa(this.tarefas["melhorar o pc"]);
        this.adicionarTarefa(this.tarefas["chamar a ti"]);
    }

    spawnCafe() {
        cafe.innerHTML = "☕";
        cafe.classList = "cafe";

        leftArea.append(cafe);

        cafe.style.left = Math.floor(Math.random() * (leftArea.clientWidth - cafe.offsetWidth)) + "px";
        cafe.style.top = Math.floor(Math.random() * (leftArea.clientHeight - cafe.offsetHeight)) + "px";

        setTimeout(() => {
            cafe.classList.add("fadeOut");
            setTimeout(() => {
                cafe.classList.remove("fadeOut");
                cafe.remove();
            }, 500)
        }, 2 * 1000)
    }

    updateDinheiro() {
        dinheiroDiv.innerHTML = formatarNumero(this.dinheiro);
        dinheiroPorSegundoDiv.innerHTML = formatarNumero(this.dinheiroPorSegundo);
        dinheiroPorClickDiv.innerHTML = formatarNumero(this.dinheiroPorClick);
    }

    updateUpgrades() {
        for (const up in this.upgrades) {
            if (this.upgrades[up].div === null) continue;

            if (this.dinheiro >= this.upgrades[up].custo) {
                this.upgrades[up].div.classList.remove("indisponivel");
            } else {
                this.upgrades[up].div.classList.add("indisponivel");
            }
        }
    }

    update() {
        this.updateUpgrades();

        this.dinheiroPorClick = 1;
        this.dinheiroPorSegundo = 0;

        for (const x in this.tarefas) {
            const t = this.tarefas[x];
            if (t.tipo === "dps") {
                this.dinheiroPorSegundo += t.qtd * t.produz;
            } else {
                this.dinheiroPorClick += t.qtd * t.produz;
            }

            for (const u in t.unlock) {
                if (t.qtd >= u) {
                    t.unlock[u]()
                    delete t.unlock[u];
                }
            }
        }

        this.dinheiroPorClick *= this.cafeBonus * this.bonusPermanente;

        this.dinheiroPorSegundo *= this.bonusDPSPermanente;

        this.updateDinheiro();
    }

    adicionarUpgrade(upgrade) {
        const upgradeDiv = document.createElement("div");
        const icone = document.createElement("div");

        upgradeDiv.className = "upgrade indisponivel";
        upgradeDiv.setAttribute("data-name", upgrade.descricao.join("\n\n ") + `\n $ ${formatarNumero(upgrade.custo)}`);
        
        icone.classList.add("icone");
        icone.innerHTML = upgrade.icone;

        upgradeDiv.addEventListener("click", () => {
            if (this.dinheiro >= upgrade.custo) {
                this.dinheiro -= upgrade.custo;
                upgrade.comprar();
                upgradeDiv.remove();
            }
        })

        upgrade.div = upgradeDiv;

        upgradeDiv.append(icone);
        upgradesDiv.append(upgradeDiv);
    }

    adicionarTarefa(tarefa) {
        const tarefaDiv = criarElemento("div", "tarefa");
        const qtd = criarElemento("div", "qtd", "0");
        const nome = criarElemento("div", "nome", tarefa.nome);
        const geracao = criarElemento("div", "geracao");
        const produz = criarElemento("div", "produz", tarefa.produz);
        const barra = criarElemento("div", "barra", "/");
        const segundo = criarElemento("div", "segundo", tarefa.tipo === "dps" ? "s" : "c");
        const custo = criarElemento("div", "custo");
        const cifrao = criarElemento("div", "", "$");
        const preco = criarElemento("div", "valor", formatarNumero(tarefa.custo));
        const comprar = criarElemento("div", "comprar");

        for (const x of [1, 10, 25, 100, "Max"]) {
            const btn = criarElemento("button", "", x);
            if (x != "Max") {
                btn.addEventListener("click", () => {
                    let custo = tarefa.custo;
                    let total = 0;
                    let acrescimo = 0;
                    for (let c = 0; c < x; c++) {
                        custo += acrescimo;
                        total += custo;
                        acrescimo = parseInt(custo * tarefa.acrescimo / 100);
                    }
                    if (this.dinheiro >= total) {

                        tarefa.qtd += x;
                        qtd.innerHTML = tarefa.qtd;

                        tarefa.custo = total + acrescimo;
                        preco.innerHTML = formatarNumero(tarefa.custo);                        
                        
                        this.dinheiro -= total;

                        if (tarefa.tipo === "dps") {
                            this.dinheiroPorSegundo += x * tarefa.produz;
                        } else if (tarefa.tipo === "click") {
                            this.dinheiroPorClick += tarefa.produz * x;
                        };
                    };
                });
                btn.addEventListener("mouseover", () => {
                    let custo = tarefa.custo;
                    let total = 0;
                    let acrescimo = 0;
                    for (let c = 0; c < x; c++) {
                        custo += acrescimo;
                        total += custo;
                        acrescimo = parseInt(custo * tarefa.acrescimo / 100);
                    }
                    btn.setAttribute("data-value",formatarNumero(total));
                })
            }
            comprar.append(btn);
        }

        tarefa.div = tarefaDiv;

        custo.append(cifrao, preco);
        geracao.append(produz, barra, segundo);
        tarefaDiv.append(qtd, nome, geracao, custo, comprar);

        tarefasDiv.append(tarefaDiv);
    }
}

const main = () => {
    const game = new Game();
}

main();