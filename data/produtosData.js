const produtos = [
  {
    id: 1,
    nome: "Arroz Agulhinha Tipo 1",
    marca: "Butu",
    quantidade_peso: "1kg",
    categoria: "Alimentos",
    imagem: "/produtos/arroz-tipo-1-butu-1kg-0-7896079450111.webp",
    mercado_principal: "Atacadão",
    url_oficial: "https://www.atacadao.com.br/busca?q=arroz",
    preco_anterior: 6.50,
    preco_atual: 5.29,
    precos_mercados: {
      "Atacadão": 5.29,
      "Assaí": 5.89,
      "Mateus": 6.19
    },
    historico_precos: [
      { mes: "Jan", preco: 6.80 },
      { mes: "Fev", preco: 6.50 },
      { mes: "Mar", preco: 6.20 },
      { mes: "Abr", preco: 5.90 },
      { mes: "Mai", preco: 5.50 },
      { mes: "Jun", preco: 5.29 }
    ]
  },
  {
    id: 2,
    nome: "Café União Tradicional",
    marca: "União",
    quantidade_peso: "250g",
    categoria: "Mercearia",
    imagem: "/produtos/cafe-uniao-tradicional-250g.jpg",
    mercado_principal: "Assaí",
    url_oficial: "https://www.assai.com.br/",
    preco_anterior: 9.99,
    preco_atual: 8.99,
    precos_mercados: {
      "Atacadão": 9.49,
      "Assaí": 8.99,
      "Mateus": 9.99
    },
    historico_precos: [
      { mes: "Jan", preco: 10.90 },
      { mes: "Fev", preco: 10.50 },
      { mes: "Mar", preco: 9.99 },
      { mes: "Abr", preco: 9.50 },
      { mes: "Mai", preco: 9.20 },
      { mes: "Jun", preco: 8.99 }
    ]
  },
  {
    id: 3,
    nome: "Feijão Preto Tipo 1",
    marca: "Kicaldo",
    quantidade_peso: "1kg",
    categoria: "Alimentos",
    imagem: "/produtos/feijão.jfif",
    mercado_principal: "Atacadão",
    url_oficial: "https://www.atacadao.com.br/busca?q=feijao",
    preco_anterior: 8.00,
    preco_atual: 5.00,
    precos_mercados: {
      "Atacadão": 5.00,
      "Assaí": 5.99,
      "Mateus": 6.49
    },
    historico_precos: [
      { mes: "Jan", preco: 8.50 },
      { mes: "Fev", preco: 8.00 },
      { mes: "Mar", preco: 7.20 },
      { mes: "Abr", preco: 6.50 },
      { mes: "Mai", preco: 5.80 },
      { mes: "Jun", preco: 5.00 }
    ]
  },
  {
    id: 4,
    nome: "Leite Longa Vida Integral",
    marca: "Betânia",
    quantidade_peso: "1L",
    categoria: "Laticínios",
    imagem: "/produtos/leite-int-betania-1L.webp",
    mercado_principal: "Assaí",
    url_oficial: "https://www.assai.com.br/",
    preco_anterior: 6.39,
    preco_atual: 4.95,
    precos_mercados: {
      "Atacadão": 5.29,
      "Assaí": 4.95,
      "Mateus": 5.49
    },
    historico_precos: [
      { mes: "Jan", preco: 6.50 },
      { mes: "Fev", preco: 6.39 },
      { mes: "Mar", preco: 5.89 },
      { mes: "Abr", preco: 5.49 },
      { mes: "Mai", preco: 5.10 },
      { mes: "Jun", preco: 4.95 }
    ]
  },
  {
    id: 5,
    nome: "Coxa de Frango Congelada",
    marca: "Friato",
    quantidade_peso: "1kg",
    categoria: "Carnes",
    imagem: "/produtos/coxadefrangoFriato.webp",
    mercado_principal: "Mateus",
    url_oficial: "https://www.mateusmais.com.br/busca?q=frango",
    preco_anterior: 20.00,
    preco_atual: 18.99,
    precos_mercados: {
      "Atacadão": 19.50,
      "Assaí": 19.20,
      "Mateus": 18.99
    },
    historico_precos: [
      { mes: "Jan", preco: 21.00 },
      { mes: "Fev", preco: 20.00 },
      { mes: "Mar", preco: 19.80 },
      { mes: "Abr", preco: 19.50 },
      { mes: "Mai", preco: 19.10 },
      { mes: "Jun", preco: 18.99 }
    ]
  },
  {
    id: 6,
    nome: "Guaraná Antarctica Original Lata",
    marca: "Antarctica",
    quantidade_peso: "350ml",
    categoria: "Bebidas",
    imagem: "/produtos/BGuarana.png",
    mercado_principal: "Assaí",
    url_oficial: "https://www.assai.com.br/",
    preco_anterior: 3.69,
    preco_atual: 1.99,
    precos_mercados: {
      "Atacadão": 2.29,
      "Assaí": 1.99,
      "Mateus": 2.49
    },
    historico_precos: [
      { mes: "Jan", preco: 3.80 },
      { mes: "Fev", preco: 3.69 },
      { mes: "Mar", preco: 2.99 },
      { mes: "Abr", preco: 2.50 },
      { mes: "Mai", preco: 2.20 },
      { mes: "Jun", preco: 1.99 }
    ]
  },
  {
    id: 7,
    nome: "Creme de Avelã Nutella",
    marca: "Ferrero",
    quantidade_peso: "650g",
    categoria: "Mercearia",
    imagem: "/produtos/potenutella650g.webp",
    mercado_principal: "Mateus",
    url_oficial: "https://www.mateusmais.com.br/busca?q=nutella",
    preco_anterior: 45.00,
    preco_atual: 38.25,
    precos_mercados: {
      "Atacadão": 39.90,
      "Assaí": 39.50,
      "Mateus": 38.25
    },
    historico_precos: [
      { mes: "Jan", preco: 46.90 },
      { mes: "Fev", preco: 45.00 },
      { mes: "Mar", preco: 42.50 },
      { mes: "Abr", preco: 40.90 },
      { mes: "Mai", preco: 39.00 },
      { mes: "Jun", preco: 38.25 }
    ]
  },
  {
    id: 8,
    nome: "Achocolatado Nescau Caixinha",
    marca: "Nestlé",
    quantidade_peso: "1L",
    categoria: "Bebidas",
    imagem: "/produtos/nescau-caixa.webp",
    mercado_principal: "Atacadão",
    url_oficial: "https://www.atacadao.com.br/busca?q=nescau",
    preco_anterior: 11.20,
    preco_atual: 8.96,
    precos_mercados: {
      "Atacadão": 8.96,
      "Assaí": 9.49,
      "Mateus": 9.80
    },
    historico_precos: [
      { mes: "Jan", preco: 11.50 },
      { mes: "Fev", preco: 11.20 },
      { mes: "Mar", preco: 10.50 },
      { mes: "Abr", preco: 9.80 },
      { mes: "Mai", preco: 9.20 },
      { mes: "Jun", preco: 8.96 }
    ]
  },
  {
    id: 9,
    nome: "Brócolis Congelado",
    marca: "Seara",
    quantidade_peso: "300g",
    categoria: "Congelados",
    imagem: "/produtos/BROCOLIS-CONGELADO-SEARA-300G.webp",
    mercado_principal: "Assaí",
    url_oficial: "https://www.assai.com.br/",
    preco_anterior: 15.90,
    preco_atual: 13.99,
    precos_mercados: {
      "Atacadão": 14.50,
      "Assaí": 13.99,
      "Mateus": 14.89
    },
    historico_precos: [
      { mes: "Jan", preco: 16.50 },
      { mes: "Fev", preco: 15.90 },
      { mes: "Mar", preco: 15.00 },
      { mes: "Abr", preco: 14.80 },
      { mes: "Mai", preco: 14.20 },
      { mes: "Jun", preco: 13.99 }
    ]
  },
  {
    id: 10,
    nome: "Pão de Queijo Tradicional",
    marca: "Jeito de Minas",
    quantidade_peso: "400g",
    categoria: "Congelados",
    imagem: "/produtos/Pao-de-Queijo-Congelado-JEITO-DE-MINAS-Tradicional-Pacote-400g.webp",
    mercado_principal: "Mateus",
    url_oficial: "https://www.mateusmais.com.br/busca?q=pao+de+queijo",
    preco_anterior: 12.80,
    preco_atual: 10.49,
    precos_mercados: {
      "Atacadão": 11.20,
      "Assaí": 10.99,
      "Mateus": 10.49
    },
    historico_precos: [
      { mes: "Jan", preco: 13.50 },
      { mes: "Fev", preco: 12.80 },
      { mes: "Mar", preco: 12.00 },
      { mes: "Abr", preco: 11.50 },
      { mes: "Mai", preco: 10.90 },
      { mes: "Jun", preco: 10.49 }
    ]
  }
];

// Calcular descontos e urls oficiais
const { obterUrlCompraOficial } = require('../config/supermercados');

produtos.forEach(p => {
  if (p.preco_anterior && p.preco_anterior > p.preco_atual) {
    p.desconto = Math.round(((p.preco_anterior - p.preco_atual) / p.preco_anterior) * 100);
    p.valor_economizado = parseFloat((p.preco_anterior - p.preco_atual).toFixed(2));
  } else {
    p.desconto = 0;
    p.valor_economizado = 0;
  }
  
  p.link_oficial_info = obterUrlCompraOficial(p);
});

module.exports = produtos;
