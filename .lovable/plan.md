# Revisão final da Fase 1

## Correções dentro do escopo

- Ajustar o documento para português do Brasil (`pt-BR`) e traduzir as telas globais de erro e página não encontrada.
- Melhorar a acessibilidade da navegação sem alterar seu visual:
  - manter “Entrar” com nome acessível no celular;
  - ocultar do leitor de tela a letra decorativa da marca e a numeração visual do menu;
  - estruturar os itens do menu como lista e identificar melhor a navegação lateral;
  - preservar os anéis de foco visíveis nos links e botões.

## Validação final

- Revalidar `/`, `/produtos`, `/categorias`, `/clientes`, `/pedidos`, `/pagamentos`, `/relatorios`, `/configuracoes` e `/login`.
- Testar navegação lateral no computador e menu recolhido em tablet e celular.
- Percorrer os controles por teclado e confirmar foco visível.
- Confirmar títulos, descrições e metadados sociais em português em todas as páginas.
- Revisar estados vazios, login somente visual e ausência de dados fictícios persistentes.
- Fazer nova busca por credenciais, conexão de backend, tabelas, migrations, políticas e funções externas.
- Confirmar a presença e coerência da documentação de arquitetura e do roteiro.

## Relatório de entrega

Apresentar uma lista objetiva das rotas validadas, problemas encontrados e corrigidos, arquivos alterados e itens que permanecem fora do escopo.

## Limites preservados

Não serão criados banco, backend, CRUD, autenticação funcional, integrações, dados de produção, migrations, políticas ou funções externas.
