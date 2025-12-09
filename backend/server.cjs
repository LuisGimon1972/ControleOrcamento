const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const db = new sqlite3.Database('./banco.db')

app.use(cors())
app.use(express.json())

const receberRouter = require('./routes/receber')
const clientesRouter = require('./routes/clientes')

app.use('/receber', receberRouter)
app.use('/clientes', clientesRouter)

app.get('/', (req, res) => {
  res.send('API funcionando!')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

// Criação das tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf TEXT, nome TEXT, fantasia TEXT, cep TEXT, bairro TEXT,
    endereco TEXT, email TEXT,
    telefone TEXT, celular TEXT, limite REAL
  )`)
  db.run(`CREATE TABLE IF NOT EXISTS itens (
    controle INTEGER PRIMARY KEY AUTOINCREMENT,
    codbarras TEXT, nome TEXT, descricao TEXT,
    grupo TEXT, marca TEXT,
    quantidade REAL, precocusto REAL, perlucro REAL,
    precovenda REAL, revenda REAL
  )`)

  db.run(`
  CREATE TABLE IF NOT EXISTS ordemServico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numeroOS TEXT UNIQUE,                         -- número visível para controle (ex: OS0001)
    clienteId INTEGER NOT NULL,
    objetoVeiculoId INTEGER,
    funcionarioId INTEGER,
    laudo TEXT,                                    -- Ex: Manutenção, Instalação, Revisão
    dataAbertura TEXT NOT NULL,
    dataFinalizacao TEXT,
    status TEXT NOT NULL DEFAULT 'ABERTA',        -- ABERTA, EM ANDAMENTO, FINALIZADA, CANCELADA
    descricao TEXT,
    observacoes TEXT,
    garantia TEXT,
    desconto REAL DEFAULT 0,
    acrescimo REAL DEFAULT 0,
    valorTotalItem REAL DEFAULT 0,
    valorTotalServ REAL DEFAULT 0,
    valorTotal REAL DEFAULT 0,
    formaPagamento TEXT,
    dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    adiantamento REAL DEFAULT 0,
    FOREIGN KEY (clienteId) REFERENCES clientes(id),
    FOREIGN KEY (objetoVeiculoId) REFERENCES objetosVeiculos(id)
  )
`)

  //db.run('ALTER TABLE clientes ADD COLUMN bairro TEXT')

  // ================================
  // TABELA: itensOrdemServico
  // ================================
  db.run(`
  CREATE TABLE IF NOT EXISTS itensOrdemServico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ordemServicoId INTEGER NOT NULL,
    produtoId INTEGER,
    descricao TEXT,
    tipoItem TEXT DEFAULT 'PRODUTO',              -- PRODUTO ou SERVIÇO
    quantidade REAL NOT NULL,
    valorUnitario REAL NOT NULL,
    total REAL NOT NULL,
    tecnico TEXT,
    FOREIGN KEY (ordemServicoId) REFERENCES ordemServico(id),
    FOREIGN KEY (produtoId) REFERENCES itens(controle)
  )
`)

  db.run(`
  CREATE TABLE IF NOT EXISTS objetosVeiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clienteId INTEGER NOT NULL,
    tipo TEXT NOT NULL,                           -- Ex: Veículo, Impressora, Ar-condicionado, etc.
    marca TEXT,
    modelo TEXT,
    ano TEXT,
    cor TEXT,
    placaSerie TEXT,
    numeroSerie TEXT,
    status TEXT DEFAULT 'ATIVO',                  -- ATIVO, INATIVO, EM REPARO, etc.
    observacoes TEXT,
    ativo TEXT DEFAULT 'SIM',
    dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clienteId) REFERENCES clientes(id)
  )
`)

  db.run(`CREATE TABLE IF NOT EXISTS receber (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER,
  descricao TEXT,
  valororiginal REAL,
  valor REAL,
  valorpago REAL,
  valorpendente REAL,
  datavencimento TEXT,
  datapagamento TEXT,
  datacadastro TEXT,
  status TEXT,
  formapagamento TEXT,
  observacao TEXT,
  usuario TEXT,
  referencia TEXT,
  numero_documento TEXT,
  juros REAL,
  desconto REAL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
)`)

  db.run(`
CREATE TABLE IF NOT EXISTS orcamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT UNIQUE,                -- Ex: ORC0001
  clienteId INTEGER,
  dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP,
  validade TEXT,
  observacoes TEXT,
  condicao TEXT,
  desconto REAL DEFAULT 0,
  acrescimo REAL DEFAULT 0,
  valorTotalItens REAL DEFAULT 0,
  valorTotal REAL DEFAULT 0,
  status TEXT DEFAULT 'ABERTO',
  FOREIGN KEY (clienteId) REFERENCES clientes(id)
)
`)

  db.run(`
CREATE TABLE IF NOT EXISTS itensOrcamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  orcamentoId INTEGER NOT NULL,
  produtoId INTEGER,
  descricao TEXT,
  quantidade REAL NOT NULL,
  valorUnit REAL NOT NULL,
  total REAL NOT NULL,
  tipoItem TEXT DEFAULT 'PRODUTO',   -- PRODUTO ou SERVICO
  FOREIGN KEY (orcamentoId) REFERENCES orcamentos(id),
  FOREIGN KEY (produtoId) REFERENCES itens(controle)
)
`)
})

// Rotas para clientes
app.get('/clientes', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) return res.status(500).send(err)
    res.json(rows)
  })
})

app.post('/clientes', (req, res) => {
  const { cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite } = req.body
  db.run(
    `INSERT INTO clientes (cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite],
    function (err) {
      if (err) return res.status(500).send(err)
      res.json({ id: this.lastID })
    },
  )
})

app.put('/clientes/:id', (req, res) => {
  const { cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite } = req.body
  db.run(
    `UPDATE clientes SET cpf=?, nome=?, fantasia=?, endereco=?, cep=?, bairro=?, email=?, telefone=?, celular=?, limite =? WHERE id=?`,
    [cpf, nome, fantasia, endereco, cep, bairro, email, telefone, celular, limite, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err)
      res.sendStatus(200)
    },
  )
})

app.delete('/clientes/:id', (req, res) => {
  db.run(`DELETE FROM clientes WHERE id=?`, req.params.id, function (err) {
    if (err) return res.status(500).send(err)
    res.sendStatus(200)
  })
})

// Rotas para itens
app.get('/itens', (req, res) => {
  db.all('SELECT * FROM itens', [], (err, rows) => {
    if (err) return res.status(500).send(err)
    res.json(rows)
  })
})

app.post('/itens', (req, res) => {
  const {
    codbarras,
    nome,
    descricao,
    grupo,
    marca,
    quantidade,
    precocusto,
    perlucro,
    precovenda,
    revenda,
  } = req.body
  db.run(
    `INSERT INTO itens (codbarras, nome, descricao, grupo, marca, quantidade, precocusto, perlucro, precovenda, revenda)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      codbarras,
      nome,
      descricao,
      grupo,
      marca,
      quantidade,
      precocusto,
      perlucro,
      precovenda,
      revenda,
    ],
    function (err) {
      if (err) return res.status(500).send(err)
      res.json({ controle: this.lastID })
    },
  )
})

app.put('/itens/:controle', (req, res) => {
  const {
    codbarras,
    nome,
    descricao,
    grupo,
    marca,
    quantidade,
    precocusto,
    perlucro,
    precovenda,
    revenda,
  } = req.body
  db.run(
    `UPDATE itens SET codbarras=?, nome=?, descricao=?, grupo=?, marca=?, quantidade=?, precocusto=?, perlucro=?, precovenda=?, revenda =?
     WHERE controle=?`,
    [
      codbarras,
      nome,
      descricao,
      grupo,
      marca,
      quantidade,
      precocusto,
      perlucro,
      precovenda,
      revenda,
      req.params.controle,
    ],
    function (err) {
      if (err) return res.status(500).send(err)
      res.sendStatus(200)
    },
  )
})

app.delete('/itens/:controle', (req, res) => {
  db.run(`DELETE FROM itens WHERE controle=?`, req.params.controle, function (err) {
    if (err) return res.status(500).send(err)
    res.sendStatus(200)
  })
})

app.get('/itens/buscar-codigo/:codigo', (req, res) => {
  const { codigo } = req.params

  db.get('SELECT * FROM itens WHERE codbarras = ?', [codigo], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(row || null)
  })
})

// ===============================
// ROTA: Buscar itens por nome ou código de barras
// ===============================
app.get('/itens/busca/buscar', (req, res) => {
  const texto = req.query.texto || ''
  const like = `%${texto}%`

  db.all(
    `SELECT *
     FROM itens
     WHERE nome LIKE ?
        OR codbarras LIKE ?
        OR controle LIKE ?
     ORDER BY nome ASC
     LIMIT 50`,
    [like, like, like],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      }
      res.json(rows)
    },
  )
})

//ROTAS DE ORÇAMENTO

app.post('/orcamentos', (req, res) => {
  const {
    clienteId,
    itens,
    desconto,
    acrescimo,
    valorTotalItens,
    valorTotal,
    validade,
    observacoes,
    condicao,
    status,
  } = req.body

  // Gerar número sequencial ORC0001 Original Original

  db.get(`SELECT numero FROM orcamentos ORDER BY id DESC LIMIT 1`, (err, row) => {
    if (err) return res.status(500).json({ error: err.message })

    let novoNumero = 'ORC0001'

    if (row && row.numero) {
      const numAtual = parseInt(row.numero.replace('ORC', ''))
      const proximo = numAtual + 1
      novoNumero = 'ORC' + String(proximo).padStart(4, '0')
    }

    // Inserir Orçamento

    const sqlOrcamento = `
        INSERT INTO orcamentos
        (numero, clienteId, validade, observacoes, condicao, desconto, acrescimo, valorTotalItens, valorTotal, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

    db.run(
      sqlOrcamento,
      [
        novoNumero,
        clienteId,
        validade || null,
        observacoes || null,
        condicao || null,
        desconto || 0,
        acrescimo || 0,
        valorTotalItens || 0,
        valorTotal || 0,
        status || null,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message })

        const orcamentoId = this.lastID

        // -----------------------------
        // Inserir itens
        // -----------------------------
        const sqlItem = `
            INSERT INTO itensOrcamento
            (orcamentoId, produtoId, descricao, quantidade, valorUnit, total, tipoItem)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `

        const stmtItem = db.prepare(sqlItem)

        itens.forEach((item) => {
          stmtItem.run([
            orcamentoId,
            item.controle || null,
            item.nome || item.descricao || '',
            item.quantidade,
            item.precoUnit || item.valorUnit || 0,
            item.total || 0,
            item.tipoItem || 'PRODUTO',
          ])
        })

        stmtItem.finalize()

        return res.json({
          sucesso: true,
          mensagem: 'Orçamento criado com sucesso',
          orcamentoId,
          numero: novoNumero,
        })
      },
    )
  })
})

app.get('/orcamentos', (req, res) => {
  const sql = `
    SELECT
      o.*,
      c.nome AS clienteNome
    FROM orcamentos o
    LEFT JOIN clientes c ON c.id = o.clienteId
    ORDER BY o.id DESC
  `

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao buscar orçamentos',
        details: err.message,
      })
    }

    res.json(rows)
  })
})

app.get('/orcamentos/periodo', (req, res) => {
  const { inicio, fim } = req.query

  if (!inicio || !fim) {
    return res.status(400).json({
      error: 'Informe os parâmetros ?inicio=YYYY-MM-DD&fim=YYYY-MM-DD',
    })
  }

  const sql = `
    SELECT
      o.*,
      c.nome AS clienteNome
    FROM orcamentos o
    LEFT JOIN clientes c ON c.id = o.clienteId
    WHERE DATE(o.dataCriacao) BETWEEN DATE(?) AND DATE(?)
    ORDER BY o.dataCriacao DESC
  `

  db.all(sql, [inicio, fim], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao buscar orçamentos por período',
        details: err.message,
      })
    }

    res.json(rows)
  })
})

app.get('/orcamentos/status/:status', (req, res) => {
  const { status } = req.params

  const sql = `
    SELECT
      o.*,
      c.nome AS clienteNome
    FROM orcamentos o
    LEFT JOIN clientes c ON c.id = o.clienteId
    WHERE o.status = ?
    ORDER BY clienteNome ASC
  `

  db.all(sql, [status], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: 'Erro ao buscar orçamentos por status',
        details: err.message,
      })
    }

    res.json(rows)
  })
})

app.get('/orcamentos/:id', (req, res) => {
  const { id } = req.params

  db.get(`SELECT * FROM orcamentos WHERE id = ?`, [id], (err, orcamento) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!orcamento) return res.status(404).json({ error: 'Orçamento não encontrado' })

    db.all(`SELECT * FROM itensOrcamento WHERE orcamentoId = ?`, [id], (err, itens) => {
      if (err) return res.status(500).json({ error: err.message })

      res.json({
        ...orcamento,
        itens,
      })
    })
  })
})

app.get('/orcamentos-detalhe/:id', (req, res) => {
  const { id } = req.params

  const sqlOrcamento = `
    SELECT o.*, c.nome AS clienteNome, c.cpf AS clienteCPF,
           c.endereco AS clienteEndereco, c.telefone AS clienteTelefone,
           c.celular AS clienteCelular, c.email AS clienteEmail
    FROM orcamentos o
    LEFT JOIN clientes c ON c.id = o.clienteId
    WHERE o.id = ?
  `

  db.get(sqlOrcamento, [id], (err, orcamento) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!orcamento) return res.status(404).json({ error: 'Orçamento não encontrado' })

    db.all(`SELECT * FROM itensOrcamento WHERE orcamentoId = ?`, [id], (err, itens) => {
      if (err) return res.status(500).json({ error: err.message })

      res.json({
        ...orcamento,
        itens,
      })
    })
  })
})

app.put('/orcamentos/:id', (req, res) => {
  const orcamentoId = req.params.id

  const { clienteId, itens, desconto, acrescimo, validade, observacoes, condicao, status } =
    req.body

  // -----------------------------------
  // Recalcular totais
  // -----------------------------------
  let somaItens = 0

  itens.forEach((item) => {
    const unit = Number(item.precoUnit || item.valorUnit || 0)
    const qt = Number(item.quantidade)
    somaItens += qt * unit
  })

  const valorTotalFinal = somaItens - (Number(desconto) || 0) + (Number(acrescimo) || 0)

  db.serialize(() => {
    db.run('BEGIN TRANSACTION')

    const sqlUpdate = `
      UPDATE orcamentos
      SET clienteId=?, validade=?, observacoes=?, condicao=?,
          desconto=?, acrescimo=?, valorTotalItens=?, valorTotal=?, status=?
      WHERE id=?
    `

    db.run(
      sqlUpdate,
      [
        clienteId,
        validade || null,
        observacoes || null,
        condicao || null,
        desconto || 0,
        acrescimo || 0,
        somaItens,
        valorTotalFinal,
        status,
        orcamentoId,
      ],
      function (err) {
        if (err) {
          db.run('ROLLBACK')
          return res.status(500).json({ error: err.message })
        }
      },
    )

    // Apagar itens antigos
    db.run(`DELETE FROM itensOrcamento WHERE orcamentoId = ?`, [orcamentoId], function (err) {
      if (err) {
        db.run('ROLLBACK')
        return res.status(500).json({ error: err.message })
      }

      const sqlItem = `
          INSERT INTO itensOrcamento
          (orcamentoId, produtoId, descricao, quantidade, valorUnit, total, tipoItem)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `

      const stmtItem = db.prepare(sqlItem)

      itens.forEach((item) => {
        const unit = Number(item.precoUnit || item.valorUnit || 0)
        const qt = Number(item.quantidade)
        const total = qt * unit

        stmtItem.run([
          orcamentoId,
          item.controle || null,
          item.nome || item.descricao || '',
          qt,
          unit,
          total,
          item.tipoItem || 'PRODUTO',
        ])
      })

      stmtItem.finalize((err) => {
        if (err) {
          db.run('ROLLBACK')
          return res.status(500).json({ error: err.message })
        }

        db.run('COMMIT')
        return res.json({
          sucesso: true,
          mensagem: 'Orçamento atualizado com sucesso',
          orcamentoId,
          valorTotalFinal,
          somaItens,
        })
      })
    })
  })
})

app.delete('/orcamentos/:id', (req, res) => {
  const { id } = req.params

  db.run(`DELETE FROM itensOrcamento WHERE orcamentoId=?`, [id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message })

    db.run(`DELETE FROM orcamentos WHERE id=?`, [id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message })

      res.json({
        success: true,
        deleted: this.changes,
      })
    })
  })
})

app.post('/orcamentos/:id/itens', (req, res) => {
  const { id } = req.params
  const { produtoId, descricao, quantidade, valorUnit, tipoItem } = req.body

  const total = quantidade * valorUnit

  const sql = `
    INSERT INTO itensOrcamento (orcamentoId, produtoId, descricao, quantidade, valorUnit, total, tipoItem)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.run(sql, [id, produtoId, descricao, quantidade, valorUnit, total, tipoItem], function (err) {
    if (err) return res.status(500).json({ error: err.message })

    res.json({ id: this.lastID })
  })
})

app.get('/orcamentos/:id/itens', (req, res) => {
  const { id } = req.params

  db.all(`SELECT * FROM itensOrcamento WHERE orcamentoId = ?`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })

    res.json(rows)
  })
})

app.put('/itensOrcamento/:itemId', (req, res) => {
  const { itemId } = req.params
  const { descricao, quantidade, valorUnit, tipoItem } = req.body

  const total = quantidade * valorUnit

  const sql = `
    UPDATE itensOrcamento
    SET descricao=?, quantidade=?, valorUnit=?, total=?, tipoItem=?
    WHERE id=?
  `

  db.run(sql, [descricao, quantidade, valorUnit, total, tipoItem, itemId], function (err) {
    if (err) return res.status(500).json({ error: err.message })

    res.json({ updated: this.changes })
  })
})

app.delete('/itensOrcamento/:itemId', (req, res) => {
  const { itemId } = req.params

  db.run(`DELETE FROM itensOrcamento WHERE id=?`, [itemId], function (err) {
    if (err) return res.status(500).json({ error: err.message })

    res.json({ deleted: this.changes })
  })
})

//app.listen(3000, () => console.log('API rodando em http://localhost:3000'))
