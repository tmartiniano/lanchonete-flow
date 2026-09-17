# Arquitetura — Trilha do Sabor

## Visão geral

Aplicação web de gestão de lanchonete construída com React 19, TypeScript, TanStack Start/Router, TanStack Query, Tailwind CSS v4 e um projeto Supabase externo. A fundação visual foi preservada e a base de identidade e acesso está implementada.

## Organização

- `src/routes`: páginas públicas de acesso e áreas de gestão protegidas.
- `src/components`: layout compartilhado e controles visuais acessíveis.
- `src/lib/navigation.ts`: fonte única da navegação principal.
- `src/lib/auth.functions.ts`: operações de acesso executadas no servidor.
- `src/styles.css`: cores semânticas, tipografia e estilos globais.

## Identidade e segurança

- O Supabase externo é a fonte exclusiva de usuários, perfis, papéis, bloqueios e auditoria.
- As áreas de gestão exigem uma sessão válida, perfil ativo e papel atribuído.
- Papéis ficam em `user_roles`, separados dos dados pessoais em `profiles`.
- As quatro tabelas de acesso têm RLS; usuários comuns consultam somente o próprio perfil e papel.
- A criação de usuários exige um administrador autenticado e é executada no servidor.
- Senhas provisórias exigem troca no primeiro acesso.
- Cinco falhas consecutivas bloqueiam o acesso de forma progressiva, começando em 15 minutos.
- Logs de acesso e ações administrativas são imutáveis e visíveis somente para administradores.
- Chaves privadas ficam disponíveis apenas no servidor por armazenamento seguro.

## Fluxos disponíveis

- Login por e-mail e senha.
- Link mágico sem criação pública de conta.
- Solicitação e página de recuperação de senha.
- Troca obrigatória da senha provisória.
- Cadastro de usuário e atribuição do perfil inicial por administrador.
- Saída segura, com limpeza dos dados protegidos e registro de auditoria.

## Pendências da configuração inicial

1. Criar o primeiro administrador no painel do Supabase com e-mail confirmado e senha provisória.
2. Associar esse usuário ao perfil `administrador` no banco.
3. Confirmar no Supabase Auth: cadastro público desativado, confirmação obrigatória desativada, URLs permitidas e envio de e-mails.
4. Executar os testes autenticados dos quatro perfis após a existência das contas.

## Próximas fases

1. Produtos e categorias.
2. Clientes e pedidos.
3. Pagamentos e regras financeiras aprovadas.
4. Relatórios baseados em dados reais.
5. Integrações aprovadas, testes finais e implantação.

Nenhuma tabela ou funcionalidade de produtos, categorias, clientes, pedidos, pagamentos ou relatórios foi criada nesta etapa.