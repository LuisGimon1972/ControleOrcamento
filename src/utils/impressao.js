// utils/impressao.js

export function imprimirOrcamento(orc) {
  if (!orc) {
    console.error('Nenhum orçamento foi enviado para impressão.')
    return
  }

  console.log('Gerando impressão do orçamento...', orc)

  // -----------------------------
  //   TEMPLATE DO CUPOM 80mm
  // -----------------------------
  const texto = `
================================
        ORÇAMENTO Nº ${orc.numero}
================================
CLIENTE: ${orc.cliente || '-'}
FONE: ${orc.telefone || '-'}
DATA: ${orc.data || '-'}

--------------------------------
ITEM             QTD   TOTAL
--------------------------------
${orc.itens
  ?.map(
    (i) =>
      `${i.nome.padEnd(15).substring(0, 15)} ${String(i.quantidade).padEnd(
        3,
      )} R$ ${i.total.toFixed(2)}`,
  )
  .join('\n')}

--------------------------------
SUBTOTAL: R$ ${orc.subtotal?.toFixed(2) || '0.00'}
DESCONTO: R$ ${orc.desconto?.toFixed(2) || '0.00'}
ACRÉSCIMO: R$ ${orc.acrescimo?.toFixed(2) || '0.00'}
TOTAL: R$ ${orc.total?.toFixed(2) || '0.00'}
--------------------------------

Obrigado pela preferência!
`

  // --------------------------------------------------------
  //  AQUI VOCÊ ENVIA PARA A IMPRESSORA REAL (Node, ESC/POS…)
  // --------------------------------------------------------

  try {
    // Exemplo: impressão via janela popup
    const printWindow = window.open('', '_blank', 'width=300,height=600')
    printWindow.document.write(`<pre style="font-size:14px">${texto}</pre>`)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  } catch (e) {
    console.error('Erro ao imprimir:', e)
  }
}
