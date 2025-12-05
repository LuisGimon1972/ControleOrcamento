// src/utils/impressao.js

// Busca orçamento real no backend
export async function buscarOrcamento(id) {
  const res = await fetch(`http://localhost:3000/orcamentos/${id}`)

  if (!res.ok) {
    throw new Error('Erro ao buscar orçamento')
  }

  return await res.json()
}

// Função para imprimir orçamento via ID
export async function imprimirOrcamentoPorId(id) {
  const dados = await buscarOrcamento(id)

  const texto = gerarTextoCupom(dados)
  imprimirTexto(texto)
}

// Monta texto 80mm
export function gerarTextoCupom(orc) {
  return `
================================
        ORÇAMENTO Nº ${orc.numero}
================================
CLIENTE: ${orc.cliente || '-'}
DATA: ${orc.data || '-'}

--------------------------------
ITEM             QTD   TOTAL
--------------------------------
${orc.itens
  ?.map(
    (i) =>
      `${i.descricao.padEnd(15).slice(0, 15)} ${String(i.quantidade).padEnd(
        3,
      )} R$ ${i.total.toFixed(2)}`,
  )
  .join('\n')}

--------------------------------
SUBTOTAL: R$ ${orc.valorTotalItens?.toFixed(2) || '0.00'}
DESCONTO: R$ ${orc.desconto?.toFixed(2) || '0.00'}
ACRÉSCIMO: R$ ${orc.acrescimo?.toFixed(2) || '0.00'}
TOTAL: R$ ${orc.valorTotal?.toFixed(2) || '0.00'}
--------------------------------

Obrigado pela preferência!
`
}

// Abre impressão
export function imprimirTexto(texto) {
  const w = window.open('', '_blank', 'width=300,height=600')
  w.document.write(`<pre style="font-size:14px">${texto}</pre>`)
  w.document.close()
  w.print()
  w.close()
}
