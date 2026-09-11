# Plano — Fase 1: Fundação do sistema da lanchonete

## Objetivo desta fase

Entregar a base navegável e responsiva do sistema, em português do Brasil, sem banco de dados, migrations, dados fictícios persistentes ou autenticação funcional.

## Interface e páginas

- Aplicar a direção visual escolhida **Balcão em Âmbar**: superfícies claras e quentes, destaque âmbar, tipografia Inter com apoio monoespaçado IBM Plex Mono, cantos discretos e transições curtas.
- Criar um layout compartilhado com barra superior, menu lateral no computador e navegação adaptada para tablet e celular.
- Criar rotas próprias para:
  - `/` — Dashboard
  - `/produtos`
  - `/categorias`
  - `/clientes`
  - `/pedidos`
  - `/pagamentos`
  - `/relatorios`
  - `/configuracoes`
  - `/login` — tela visual, sem autenticação ativa
- Manter todas as páginas internas como estados vazios honestos, explicando que os recursos serão disponibilizados nas fases seguintes.
- No dashboard, mostrar somente indicadores zerados/indisponíveis, movimentação vazia e o roteiro das próximas fases — sem simular vendas, clientes ou pedidos.
- Incluir estados ativos de navegação, foco por teclado, menu móvel e comportamento responsivo.

## Organização do código

- Separar o layout, navegação, cabeçalhos, estados vazios e elementos reutilizáveis em componentes pequenos.
- Centralizar nomes, caminhos e ícones das áreas em uma configuração única para evitar repetição.
- Usar os tokens semânticos globais para cores, tipografia, bordas e estados visuais.
- Manter cada área em sua própria rota para facilitar evolução, indexação e manutenção.
- Adicionar metadados únicos em português para cada página.

## Documentação

Criar uma documentação de arquitetura contendo:

- visão geral da aplicação;
- organização das páginas e componentes;
- responsabilidades entre interface, regras de negócio e futura camada de dados;
- estratégia futura para variáveis de ambiente e credenciais;
- convenções de manutenção;
- limites explícitos desta primeira fase.

## Roteiro das próximas fases

1. **Fase 2 — Backend e acesso:** conectar o backend, decidir se haverá perfis de usuário, implementar login/logout, recuperação de senha, proteção das páginas e permissões iniciais.
2. **Fase 3 — Modelo de dados:** definir entidades e relacionamentos; criar tabelas, migrations, políticas de segurança e armazenamento necessário.
3. **Fase 4 — Catálogo:** CRUD de categorias e produtos, validações e imagens.
4. **Fase 5 — Clientes e pedidos:** cadastro de clientes, composição do pedido e fluxo de status.
5. **Fase 6 — Pagamentos:** registros de pagamento e regras financeiras aprovadas.
6. **Fase 7 — Relatórios:** indicadores e relatórios baseados em dados reais.
7. **Fase 8 — Integrações e operação:** serviços externos aprovados, testes finais e preparação de implantação.

## Fora do escopo desta fase

- Conexão ou criação de tabelas no backend.
- Migrations, políticas de acesso e armazenamento.
- Autenticação funcional, cadastro, recuperação de senha ou perfis.
- CRUDs, integrações externas, IA, regras financeiras ou relatórios reais.
- Dados de demonstração permanentes e implantação.

## Validação

- Verificar navegação e apresentação em computador, tablet e celular.
- Confirmar que todas as rotas abrem, possuem metadados próprios e não exibem dados inventados como se fossem reais.
- Confirmar que a página de login é estritamente visual e comunica que o acesso será ativado na próxima fase.
- Registrar ao final o que foi criado, a estrutura das páginas, as tecnologias usadas, pendências e a próxima fase recomendada.

## Detalhes técnicos

- React 19, TanStack Start/Router, TypeScript, Tailwind CSS v4 e componentes acessíveis existentes.
- Backend principal planejado em Lovable Cloud, com credenciais somente por variáveis seguras de ambiente; ativação e modelagem ficam para a Fase 2/3 conforme o escopo.
- A futura autenticação será protegida tanto na navegação quanto nas operações de dados; nenhuma credencial será adicionada ao código-fonte.
