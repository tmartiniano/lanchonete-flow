# Arquitetura — Ponto de Apoio

## Visão geral

Aplicação web de gestão de lanchonete construída com React 19, TypeScript, TanStack Start/Router, TanStack Query e Tailwind CSS v4. A primeira fase contém apenas a fundação visual, as rotas e a documentação.

## Organização

- `src/routes`: uma rota por área do sistema, com metadados próprios.
- `src/components`: layout compartilhado e estados de página reutilizáveis.
- `src/components/ui`: controles visuais acessíveis.
- `src/lib/navigation.ts`: fonte única dos itens de navegação.
- `src/styles.css`: tokens semânticos, tipografia e estilos globais.

## Limites entre camadas

- **Interface:** rotas e componentes apresentam informações e recebem ações.
- **Regras de negócio:** serão isoladas em funções próprias quando cada módulo for desenvolvido.
- **Dados:** serão acessados por funções de servidor autenticadas; páginas não terão acesso privilegiado direto.
- **Backend:** será conectado em uma fase posterior, antes de qualquer autenticação ou persistência.

## Segurança e configuração

- Chaves privadas, tokens e senhas nunca ficam no código-fonte.
- Configurações públicas usam variáveis de ambiente próprias para o navegador.
- Credenciais privadas ficam disponíveis somente no servidor por armazenamento seguro.
- Páginas privadas e operações de dados terão validação independente de autenticação.
- Permissões serão aplicadas no banco antes da implementação dos cadastros.

## Próximas fases

1. Backend, autenticação, recuperação de senha e permissões.
2. Modelo relacional, migrations e políticas de segurança.
3. Produtos e categorias.
4. Clientes e pedidos.
5. Pagamentos e regras financeiras aprovadas.
6. Relatórios baseados em dados reais.
7. Integrações aprovadas, testes finais e implantação.

## Fora da Fase 1

Não há banco conectado, tabelas, migrations, autenticação funcional, CRUD, dados de produção, integrações externas, IA, relatórios finais ou regras financeiras definitivas.