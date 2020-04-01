const { isAfter, format, sub, add } = require("date-fns");

/**
 * Essa função recebe uma data (JS Date) como parâmetro
 * e retorna o início e fim do primeiro e do segundo semestre.
 * @param {Date} [data=new Date()]
 */
const getSemestres = (data = new Date()) => ({
  1: {
    de: new Date(data.getFullYear(), 0, 1),
    ate: new Date(data.getFullYear(), 5, 30)
  },
  2: {
    de: new Date(data.getFullYear(), 6, 1),
    ate: new Date(data.getFullYear(), 11, 31)
  }
});

/**
 * Essa função recebe uma data (JS Date) como parâmetro
 * e retorna qual é o ano-safra correspondente indicando seu início e fim.
 * Opcionalmente pode ser passada uma string como separador do anoSafra
 * @param {Date} [data=new Date()]
 * @param {String} [separador="/"]
 * @returns {object} { anoSafra: "YY/YY", inicio: "YY", fim: "YY" }
 */
const anoSafra = (data = new Date(), separador = "/") => {
  const anoAtual = format(data, "yy");
  const anoAnterior = format(sub(data, { years: 1 }), "yy");
  const proximoAno = format(add(data, { years: 1 }), "yy");

  switch (semestreAtual(data)) {
    case 1:
      return {
        anoSafra: `${anoAnterior}${separador}${anoAtual}`,
        inicio: anoAnterior,
        fim: anoAtual
      };
    case 2:
      return {
        anoSafra: `${anoAtual}${separador}${proximoAno}`,
        inicio: anoAtual,
        fim: proximoAno
      };
    default:
      return {
        anoSafra: `${anoAtual}${separador}${anoAtual}`,
        inicio: anoAtual,
        fim: anoAtual
      };
  }
};

/**
 * Essa função recebe uma data (JS Date) como parâmetro
 * e retorna 1 se ela pertencer ao primeiro semestre ou 2 se ela pertencer ao segundo semestre do ano.
 * @param {Date} [data=new Date()]
 * @returns {number} 1 ou 2
 */
const semestreAtual = data => {
  return isAfter(data, getSemestres(data)[1].ate) ? 2 : 1;
};

/**
 * Essa função recebe uma data (JS Date) como parâmetro e retorna qual é o ano-safra correspondente
 * indicando seu início/fim e se a data pertence ao ano-safra atual.
 * @param {Date} [data=new Date()]
 * @returns {object} { anoSafra: "YY/YY", inicio: "YY", fim: "YY", isAtual: boolean }
 */
const safraAtual = (data = new Date()) => {
  const atual = anoSafra();
  const { anoSafra: safra, inicio, fim } = anoSafra(data);
  return {
    anoSafra: safra,
    inicio,
    fim,
    isAtual: inicio === atual.inicio && fim === atual.fim
  };
};

module.exports = { anoSafra, safraAtual, semestreAtual, getSemestres };
