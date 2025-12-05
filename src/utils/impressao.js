export async function buscarOrcamento(id) {
  const res = await fetch(`http://localhost:3000/orcamentos-detalhe/${id}`)

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
  const numero = orc?.numero ?? '-'
  const cliente = orc?.clienteNome ?? '-'
  const data = orc?.dataCriacao ?? '-'
  const validade = orc?.validade ?? '-'

  const itens = Array.isArray(orc?.itens)
    ? orc.itens
        .map((i) => {
          const desc = (i.descricao ?? '').padEnd(15).slice(0, 15)
          const qtd = String(i.quantidade ?? 0).padStart(3)
          const total = Number(i.total ?? 0).toFixed(2)
          return `${desc} ${qtd}  R$ ${total}`
        })
        .join('\n')
    : 'Nenhum item'

  const subtotal = Number(orc?.valorTotalItens ?? 0).toFixed(2)
  const desconto = Number(orc?.desconto ?? 0).toFixed(2)
  const acrescimo = Number(orc?.acrescimo ?? 0).toFixed(2)
  const total = Number(orc?.valorTotal ?? 0).toFixed(2)

  return `
================================
        ORÇAMENTO Nº ${numero}
================================
CLIENTE: ${cliente}
DATA: ${data}
VALIDADE: ${validade}

--------------------------------
ITEM             QTD    TOTAL
--------------------------------
${itens}

--------------------------------
SUBTOTAL:   R$ ${subtotal}
DESCONTO:   R$ ${desconto}
ACRÉSCIMO:  R$ ${acrescimo}
TOTAL:      R$ ${total}
--------------------------------

Obrigado pela preferência!
`
}

// Abre impressão
export function imprimirTexto(texto) {
  const w = window.open('', '_blank', 'width=700,height=600')
  w.document.write(`<pre style="font-size:14px">${texto}</pre>`)
  w.document.close()
  w.print()
  w.close()
}
