/**
 * CONFIGURAÇÃO CENTRALIZADA DOS SUPERMERCADOS PARCEIROS E SEUS CANAIS OFICIAIS
 * 
 * Regra de Segurança:
 * - Apenas domínios HTTPS oficiais permitidos.
 * - Proteção contra redirecionamentos abertos ou links maliciosos.
 */

const SUPERMERCADOS_CONFIG = {
  "Atacadão": {
    id: "atacadao",
    nome: "Atacadão",
    dominioOficial: "atacadao.com.br",
    urlHome: "https://www.atacadao.com.br/",
    urlBusca: (query) => query ? `https://www.atacadao.com.br/busca?q=${encodeURIComponent(query)}` : "https://www.atacadao.com.br/",
    logo: "/image/atacadao-logo2.webp",
    corBadge: "atacadao"
  },
  "Assaí": {
    id: "assai",
    nome: "Assaí Atacadista",
    dominioOficial: "assai.com.br",
    urlHome: "https://www.assai.com.br/",
    urlBusca: (query) => "https://www.assai.com.br/",
    logo: "/image/assaí-logo.png",
    corBadge: "assai"
  },
  "Mateus": {
    id: "mateus",
    nome: "Grupo Mateus",
    dominioOficial: "mateusmais.com.br",
    urlHome: "https://www.mateusmais.com.br/",
    urlBusca: (query) => query ? `https://www.mateusmais.com.br/busca?q=${encodeURIComponent(query)}` : "https://www.mateusmais.com.br/",
    logo: "/image/grupo-mateus-logo.png",
    corBadge: "mateus"
  }
};

/**
 * Validador de Segurança para URLs Oficiais de Compra
 */
function validarUrlOficial(urlStr, mercadoNome) {
  try {
    if (!urlStr || typeof urlStr !== 'string') return false;
    const parsed = new URL(urlStr);

    // Exigir HTTPS obrigatoriamente
    if (parsed.protocol !== 'https:') return false;

    // Buscar configuração do mercado
    const config = SUPERMERCADOS_CONFIG[mercadoNome] || Object.values(SUPERMERCADOS_CONFIG).find(c => urlStr.includes(c.dominioOficial));
    if (!config) return false;

    // Validar se o hostname termina no domínio oficial permitido
    const host = parsed.hostname.toLowerCase();
    const domain = config.dominioOficial.toLowerCase();
    
    return host === domain || host.endsWith('.' + domain);
  } catch (e) {
    return false;
  }
}

/**
 * Gerador de URL Oficial Segura para um Produto
 */
function obterUrlCompraOficial(produto) {
  const mercadoNome = produto.mercado_principal || produto.mercado_nome || "Atacadão";
  const config = SUPERMERCADOS_CONFIG[mercadoNome] || SUPERMERCADOS_CONFIG["Atacadão"];

  // Se o produto possui uma URL oficial válida do n8n/banco, utiliza-a
  if (produto.url_oficial && validarUrlOficial(produto.url_oficial, mercadoNome)) {
    return {
      url: produto.url_oficial,
      mercado: config.nome,
      dominio: config.dominioOficial,
      tipoLink: "direto"
    };
  }

  // Caso contrário, gera o link oficial seguro de busca/home do supermercado
  const urlCalculada = config.urlBusca(produto.nome);
  return {
    url: urlCalculada,
    mercado: config.nome,
    dominio: config.dominioOficial,
    tipoLink: "busca"
  };
}

module.exports = {
  SUPERMERCADOS_CONFIG,
  validarUrlOficial,
  obterUrlCompraOficial
};
