# 🤖 Arquitetura & Integração com n8n (Meu Carrinho)

O **n8n** é a camada responsável por automações, captura de encartes, normalização de dados, identificação de alterações de preços, atualização do histórico e envio de notificações para a plataforma **Meu Carrinho**.

---

## 🏗️ Arquitetura do Sistema

```
[ Fontes de Dados ] ➔ [ Workflow n8n ] ➔ [ Validação & Normalização ]
                                                  │
                                                  ▼ (HTTP POST Webhooks)
                                    [ Backend Express.js API ]
                                                  │
                                                  ▼
                                    [ Banco de Dados / Dataset ]
                                                  │
                                                  ▼
                                    [ Frontend HTML/CSS/Vanilla JS ]
```

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Design em Tom Azul)
* **Backend:** Node.js + Express.js + EJS
* **Automação & Processamento:** n8n (Workflows Agendados & Webhooks)

---

## 🔐 Autenticação nos Webhooks

Todas as requisições enviadas do n8n para o Express devem incluir o cabeçalho de autenticação:

```http
x-n8n-api-key: meucarrinho-n8n-secret-2024
```

*(Ou configurar a variável de ambiente `N8N_WEBHOOK_SECRET` no servidor Node).*

---

## 📡 Endpoints de Webhook Disponíveis

### 1. `POST /api/webhooks/prices` — Sincronização Automática de Preços

Atualiza os preços dos produtos e registra automaticamente as alterações no histórico.

**Exemplo de Payload enviado pelo n8n:**

```json
{
  "price_updates": [
    {
      "product_id": 1,
      "nome": "Arroz Agulhinha Tipo 1",
      "supermercado": "Atacadão",
      "novo_preco": 4.99
    },
    {
      "product_id": 2,
      "nome": "Café União Tradicional",
      "supermercado": "Assaí",
      "novo_preco": 8.49
    }
  ]
}
```

---

### 2. `POST /api/webhooks/products` — Carga & Ingestão de Produtos

Cadastra ou atualiza produtos em lote provenientes de scrapers ou planilhas dos supermercados.

**Exemplo de Payload:**

```json
{
  "products": [
    {
      "id": 25,
      "nome": "Açúcar Refinado União 1kg",
      "marca": "União",
      "quantidade_peso": "1kg",
      "categoria": "Mercearia",
      "imagem": "/produtos/arroz.jfif",
      "mercado_principal": "Mateus",
      "preco_atual": 4.29,
      "preco_anterior": 4.99
    }
  ]
}
```

---

### 3. `POST /api/webhooks/offers` — Ofertas Relâmpago

Atualiza promoções do dia e ajusta os descontos percentuais.

**Exemplo de Payload:**

```json
{
  "offers": [
    {
      "product_id": 6,
      "nome": "Guaraná Antarctica Original Lata 350ml",
      "preco_oferta": 1.79,
      "preco_anterior": 3.69
    }
  ]
}
```

---

### 4. `POST /api/webhooks/notify` — Alerta de Queda de Preço

Notifica os usuários quando um produto favoritado sofre redução substancial de preço.

```json
{
  "user_email": "usuario@exemplo.com",
  "product_id": 2,
  "trigger_type": "PRICE_DROP_ALERT",
  "message": "🔥 O Café União baixou para R$ 8,49 no Assaí!"
}
```

---

## ⚡ Como Importar os Workflows no n8n

1. Abra o painel do seu servidor **n8n**.
2. Clique em **Workflows ➔ Import from File**.
3. Selecione o arquivo em `n8n/workflows/price_sync_workflow.json`.
4. Configure as credenciais do nó HTTP Request adicionando o cabeçalho `x-n8n-api-key`.
5. Ative o gatilho **Cron / Schedule Trigger** para rodar diariamente nos horários desejados (ex: 06:00 AM).
