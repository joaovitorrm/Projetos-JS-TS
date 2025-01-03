

export function criarElemento(el, className="", value="") {
    const element = document.createElement(el);
    if (className) element.className = className;
    element.innerHTML = value;

    return element;
}

export function formatarNumero(numero) {
    if (numero >= 1e12) { // Trilhão
        return (numero / 1e12).toFixed(2) + 'T';
    } else if (numero >= 1e9) { // Bilhão
        return (numero / 1e9).toFixed(2) + 'B';
    } else if (numero >= 1e6) { // Milhão
        return (numero / 1e6).toFixed(2) + 'M';
    } else if (numero >= 1e3) { // Mil
        return (numero / 1e3).toFixed(2) + 'K';
    } else {
        return numero.toFixed(0); // Menor que mil
    }
}