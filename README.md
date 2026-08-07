# 💧 SIVA — Sistema Inteligente de Vazão de Água

Sistema de monitoramento e controle de vazão de água em tempo real, voltado para ambientes industriais, utilizando IoT para coletar, transmitir e analisar dados de consumo hídrico por setor/equipamento.

Projeto de Trabalho de Conclusão de Curso (TCC) — **ETEC Dr. Nelson Alves Vianna**, Médio Técnico em Desenvolvimento de Sistemas (Período Integral).

## 🎯 Sobre o projeto

A gestão hídrica tradicional em indústrias depende de leituras manuais e periódicas, o que atrasa a detecção de vazamentos e contribui para altos índices de desperdício de água tratada.

O SIVA propõe uma central de vazão com sensores instalados em diferentes pontos da rede hidráulica, enviando dados em tempo real para um sistema central que permite:

- Visualizar o consumo por setor ou equipamento (resfriamento, produção, limpeza etc.)
- Identificar padrões de consumo
- Detectar vazamentos e desperdícios rapidamente
- Apoiar decisões mais eficientes na gestão de recursos hídricos

O projeto está alinhado aos seguintes Objetivos de Desenvolvimento Sustentável (ODS):

- Indústria, Inovação e Infraestrutura
- Cidades e Comunidades Sustentáveis
- Consumo e Produção Responsáveis
- Combate às Alterações Climáticas

## 🏗️ Arquitetura

```
[Sensor de Fluxo YF-S201] → [ESP32] → [API Node.js/Express] → [MySQL] → [Dashboard Web]
                                ↑
                        [Display OLED SSD1306]
```

Hierarquia dos dados: **Empresa → Setor → ESP32 → Sensor**

## ⚙️ Tecnologias

**Firmware (ESP32)**
- C/C++ (Arduino)
- Estrutura modular: `main.ino`, `config.h`, `sensor.h`, `display.h`, `wifi_manager.h`

**Backend**
- Node.js 22+, TypeScript, ESM
- Express 5 + Zod (validação) + Prisma (MySQL)
- Autenticação de usuários via JWT e de dispositivos ESP32 via `X-Token`
- Documentação OpenAPI/Swagger servida em `/docs`
- Modo mock em memória (`MOCK_MODE=true`) para desenvolver sem depender de MySQL

**Hardware**
- Microcontrolador ESP32
- Sensor de vazão YF-S201
- Display OLED SSD1306

**Dashboard**
- Interface web com atualização em tempo real (`fetch` / `setInterval`)

## 📦 Payload de dados

Cada sensor envia um JSON identificando sua origem na hierarquia do sistema:

```json
{
  "esp_id": "esp_01",
  "setor": "producao",
  "sensor_id": "sensor_01",
  "vazao": 0.0
}
```

## 👥 Autores

- João Henrique Da Silva Gonçalves
- Natanael Oliveira
- Rafael Pereira

## 🚀 Como executar

O backend fica na raiz deste repositório (`src/`, `prisma/`, etc). Requer Node.js 22+.

### Opção 1 — API fake em memória (recomendado para o frontend)

Não precisa de MySQL nem de `prisma migrate`. Sobe com dados de exemplo já
populados (empresas, setores, ESP32s, sensores e leituras).

```bash
npm install
npm run dev:mock
```

A API sobe em `http://localhost:3000`. Usuários de teste (senha `senha123`
para todos): `super@siva.com` (super_admin), `carla.mendes@aquaplas.com`
(admin_empresa), `diego.ramos@aquaplas.com` (funcionario).

### Opção 2 — Com MySQL de verdade

```bash
cp .env.example .env        # ajuste DATABASE_URL/JWT_SECRET se necessário
npm install
npm run prisma:migrate      # cria as tabelas a partir de prisma/schema.prisma
npm run seed                # popula um usuário super_admin e uma empresa de exemplo
npm run dev
```

### Opção 3 — Docker Compose (API + MySQL)

```bash
docker compose up --build
```

### Documentação da API

Com o servidor rodando, a documentação interativa (Swagger UI) fica em
`http://localhost:3000/docs`, e o JSON do OpenAPI em `/docs/openapi.json`.

### Simulando um ESP32

Para testar o endpoint de ingestão de leituras (`POST /api/readings`,
autenticado por `X-Token`) sem hardware:

```bash
npm run simulate:esp32
```

### Scripts úteis

| Script | Descrição |
| --- | --- |
| `npm run dev` / `npm run dev:mock` | sobe a API com hot-reload (real / mock) |
| `npm run build` / `npm start` | build de produção e execução do build |
| `npm run lint` / `npm run format` | ESLint / Prettier |
| `npm run typecheck` | checagem de tipos sem emitir arquivos |
| `npm test` / `npm run test:watch` | testes com Vitest |
| `npm run prisma:migrate` / `npm run prisma:studio` | migrações / explorador do banco |
| `npm run seed` | popula o banco com dados de exemplo |

```bash
# Firmware
# Abrir main.ino na Arduino IDE, configurar Wi-Fi em wifi_manager.h e fazer upload para o ESP32
```

## 📄 Licença

Projeto acadêmico desenvolvido para fins de TCC.
