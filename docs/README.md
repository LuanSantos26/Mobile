# Documentação QuickStock

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `DOCUMENTACAO_OFICIAL_QUICKSTOCK.docx` | Documento Word ABNT para entrega acadêmica |
| `DOCUMENTACAO_OFICIAL_QUICKSTOCK.md` | Versão resumida versionável no Git |
| `APRESENTACAO_QUICKSTOCK.md` | Guia de estudo para apresentação oral |
| `diagramas/` | Diagramas Mermaid (.mmd) e PNG |
| `scripts/` | Gerador do documento Word |

## Regenerar o Word

```bash
cd docs/scripts
npm install
node gerar_documentacao.mjs
```

## Após abrir o .docx

1. Preencher campos `[PREENCHER: ...]` na capa e folha de rosto
2. Clicar com botão direito no **Sumário** → **Atualizar campo** → **Atualizar página inteira**

## Formatação ABNT aplicada

- Fonte Times New Roman 12 pt
- Espaçamento 1,5
- Margem esquerda 3 cm; demais 2 cm
- Recuo de parágrafo 1,25 cm
- Numeração de páginas a partir do sumário
