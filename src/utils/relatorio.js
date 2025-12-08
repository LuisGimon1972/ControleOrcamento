export async function gerarRelatorioPeriodo(inicio, fim) {
  try {
    const url = `http://localhost:3000/orcamentos/periodo?inicio=${inicio}&fim=${fim}`
    const res = await fetch(url)
    const dados = await res.json()

    if (!dados.length) {
      return false
    }

    // Monta o HTML do relatório (A4) dkjsakljdksaljdklsajdklsajdkljs
    let conteudo = `
      <html>
      <head>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: Arial; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #777; padding: 8px; font-size: 13px; }
          th { background: #eee; }
        </style>
      </head>
      <body>

        <h1>Relatório de Orçamentos</h1>
        <p><b>Período:</b> ${inicio} até ${fim}</p>

        <table>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
    `

    dados.forEach((o) => {
      conteudo += `
        <tr>
          <td>${o.id}</td>
          <td>${o.numero}</td>
          <td>${o.clienteNome || '-'}</td>
          <td>${o.dataCriacao}</td>
          <td>R$ ${Number(o.valorTotal).toFixed(2)}</td>
          <td>${o.status}</td>
        </tr>
      `
    })

    conteudo += `
        </table>

      </body>
      </html>
    `

    // 👉 Criar iframe invisível
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'

    document.body.appendChild(iframe)

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(conteudo)
    doc.close()

    // 👉 Delay curto para carregar conteúdo e imprimir
    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()

      // remove iframe após imprimir
      setTimeout(() => iframe.remove(), 500)
    }, 300)
    return true
  } catch (err) {
    console.error('Erro ao gerar relatório:', err)
    return false
  }
}
