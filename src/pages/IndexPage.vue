<template>
  <div class="layout-principal">
    <!-- TOPO -->
    <div class="painel-superior">
      <img :src="logo" alt="Logo" class="logo" />
      <label class="textonome">Controle de Orçamentos</label>
      <div class="perfil">
        <label class="texto">Dev. Luis Manuel Gimón</label>
        <img :src="usuario" alt="Usuario" class="usuariodev" />
      </div>
    </div>

    <!-- CONTEÚDO -->
    <div class="layout-conteudo" style="min-height: 80vh">
      <!-- MENU LATERAL -->
      <div class="painel-esquerdo" style="width: 288px; padding: 20px">
        <q-item
          clickable
          :class="{ 'menu-ativo': menuAtivo === 'cadastro' }"
          @click="
            () => {
              ocultar()
              mostrarCadastro = true
              menuAtivo = 'cadastro'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section> Cadastro de Cliente </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'listar'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'listar'
              listarClientes = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section>Listagem de Clientes</q-item-section>
        </q-item>
        <q-item
          clickable
          :active="menuAtivo === 'cadastroitem'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'cadastroitem'
              mostrarItens = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>
          <q-item-section> Cadastro de Item </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'listaitem'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'listaitem'
              listarItens = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section> Listagem de Itens </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'criaorca'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              limparOrcamento()
              trocartitulo()
              item.status = 'ABERTO'
              entrarOrcamento = false
              desabilitarTudo = false
              idOrcamentoEdicao = false
              menuAtivo = 'criaorca'
              criarOrcamento = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="note_add" />
          </q-item-section>
          <q-item-section> Cadastro de Orçamento </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'listaorca'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              entrarOrcamento = true
              menuAtivo = 'listaorca'
              listarOrcamento = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section> Listagem Orçamentos </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'relatoriorca'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              abrirRelatorioPeriodo()
              menuAtivo = 'relatoriorca'
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="format_list_bulleted" />
          </q-item-section>
          <q-item-section> Relatório Orçamentos </q-item-section>
        </q-item>

        <q-item
          clickable
          :active="menuAtivo === 'mostrarR'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'mostrarR'
              mostrarReceber = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="request_quote" />
          </q-item-section>
          <q-item-section> Lançamentos de Créditos </q-item-section>
        </q-item>
        <q-item
          clickable
          :active="menuAtivo === 'recebi'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'recebi'
              listarReceber = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="request_quote" />
          </q-item-section>
          <q-item-section> Contas a Receber </q-item-section>
        </q-item>
        <q-item
          clickable
          :active="menuAtivo === 'divida'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'divida'
              resumoDividas = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="request_quote" />
          </q-item-section>
          <q-item-section> Resumo de créditos </q-item-section>
        </q-item>
        <q-item
          clickable
          :active="menuAtivo === 'ldivida'"
          active-class="item-ativo"
          @click="
            () => {
              ocultar()
              menuAtivo = 'ldivida'
              listarDividas = true
            }
          "
        >
          <q-item-section avatar>
            <q-icon name="request_quote" />
          </q-item-section>
          <q-item-section> Quitação de créditos </q-item-section>
        </q-item>
      </div>

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="conteudo" style="flex-grow: 1; padding: 20px">
        <!-- ===================== -->
        <!--     CRIAR ORÇAMENTO   -->
        <!-- ===================== -->
        <div
          v-if="criarOrcamento"
          class="q-pa-md"
          :class="{ 'disabled-container': desabilitarTudo }"
        >
          <!-- TÍTULO -->
          <div style="margin-bottom: 50px" class="text-h4 text-primary q-mb-md">{{ titulo }}</div>

          <!-- SELEÇÃO DO CLIENTE -->
          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-6">
              <q-select
                filled
                v-model="clienteSelecionado"
                :options="clientes"
                option-value="id"
                option-label="nome"
                label="Selecione o cliente"
                emit-value
                map-options
              />
            </div>

            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-2">
              <q-input filled v-model="cpfCliente" label="CPF" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->
            <div class="col-12 col-md-2">
              <q-input
                filled
                v-model="validade"
                label="Validade do Orçamento"
                readonly
                class="sem-linha"
                @click="abrirCalendario"
              >
                <template #append>
                  <q-icon name="event" class="cursor-pointer" @click="abrirCalendario" />
                </template>

                <q-popup-proxy ref="popupValidade" transition-show="scale" transition-hide="scale">
                  <q-date v-model="validade" mask="DD-MM-YYYY" />
                </q-popup-proxy>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                filled
                v-model="item.status"
                :options="[
                  { label: 'ABERTO', value: 'ABERTO' },
                  { label: 'EM NEGOCIAÇÃO', value: 'EM NEGOCIAÇÃO' },
                  { label: 'FINALIZADO', value: 'FINALIZADO' },
                ]"
                label="Status"
                emit-value
                map-options
                class="sem-linha"
              />
            </div>
          </div>

          <div style="margin-bottom: 20px" class="row q-col-gutter-md">
            <!-- SELECT DO CLIENTE -->
            <div class="col-12 col-md-1">
              <q-input filled v-model="endCep" label="CEP" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-3">
              <q-input filled v-model="endCliente" label="Endereço" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="endBairro" label="Bairro" readonly class="sem-linha" />
            </div>
            <!-- CPF DO CLIENTE -->
            <div class="col-12 col-md-2">
              <q-input filled v-model="telCliente" label="Telefone" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="celCliente" label="Celular" readonly class="sem-linha" />
            </div>
            <div class="col-12 col-md-2">
              <q-input filled v-model="emailCliente" label="E-mail" readonly class="sem-linha" />
            </div>

            <!-- VALIDADE -->
          </div>

          <q-input
            v-model="buscaItem"
            label="Buscar item"
            @keyup="navegarLista"
            class="input-grande"
          >
            <template #append>
              <q-btn icon="search" @click="buscarItem" flat round />
            </template>
          </q-input>

          <q-list bordered separator v-if="resultadoBusca.length > 0">
            <q-item class="bg-grey-3 text-bold">
              <q-item-section> Nome </q-item-section>
              <q-item-section> Código </q-item-section>
              <q-item-section side> Preço </q-item-section>
            </q-item>

            <!-- LINHAS -->
            <q-item
              v-for="(item, index) in resultadoBusca"
              :key="item.controle"
              clickable
              @click="adicionarItem(item)"
              :class="{ 'bg-blue-2': index === itemSelecionado }"
            >
              <q-item-section>
                <q-item-label>{{ item.nome }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.codbarras }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label class="text-positive">
                  R$ {{ item.precovenda.toFixed(2) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator spaced />

          <!-- TABELA DO ORÇAMENTO -->
          <q-table
            title="Itens do Orçamento"
            :rows="itensOrcamento"
            :columns="colunasOrcamento"
            row-key="controle"
            flat
            bordered
          >
            <template #body-cell-quantidade="props">
              <q-td>
                <q-input
                  dense
                  type="number"
                  v-model.number="props.row.quantidade"
                  min="1"
                  style="width: 80px"
                  @update:model-value="atualizarTotais"
                />
              </q-td>
            </template>

            <template #body-cell-acoes="props">
              <q-td class="text-center">
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  dense
                  round
                  @click="excluirItemOrç(props.row.controle)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template #no-data />
          </q-table>

          <q-input
            filled
            v-model="observacao"
            type="textarea"
            autogrow
            label="Observação"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-input
            filled
            v-model="condicao"
            type="textarea"
            autogrow
            label="Condição de Pagamento"
            class="q-mt-md"
            :input-style="{ minHeight: '70px' }"
          />

          <q-separator spaced />

          <!-- DESCONTO / ACRÉSCIMO -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                filled
                v-model.number="desconto"
                type="number"
                label="Desconto (R$)"
                class="label-grande"
                @blur="atualizarTotais"
              />
            </div>

            <div class="col-6">
              <q-input
                filled
                v-model.number="acrescimo"
                type="number"
                label="Acréscimo (R$)"
                class="label-grande"
                ref="acrescimoRef"
              />
            </div>
          </div>

          <q-separator spaced />

          <!-- TOTAL GERAL -->
          <div class="text-h5 text-right q-mb-md">
            Total: <span class="text-positive">R$ {{ totalGeral.toFixed(2) }}</span>
          </div>

          <!-- BOTÃO SALVAR -->
          <q-btn
            :label="modoEdicao ? 'Salvar Alterações' : 'Salvar'"
            color="primary"
            icon="save"
            size="md"
            @click="modoEdicao ? salvarEdicao() : salvarOrcamento()"
          />

          <q-btn
            label="Limpar"
            color="negative"
            icon="delete_sweep"
            size="md"
            @click="limparOrcamento"
            class="q-ml-md"
          />
        </div>

        <div id="relatorio-impressao">
          <!-- TODO seu HTML para imprimir -->
        </div>

        <q-dialog v-model="dialogRelatorioPeriodo">
          <q-card class="q-pa-md">
            <div class="text-h6 q-mb-md">Relatório por Período</div>

            <q-input ref="DataInput" v-model="dataInicio" label="Data Inicial" type="date" filled />
            <q-input
              ref="DataInputFim"
              v-model="dataFim"
              label="Data Final"
              type="date"
              filled
              class="q-mt-md"
            />

            <q-btn
              class="q-mt-lg q-mr-md"
              color="primary"
              label="Gerar Relatório"
              @click="gerarRelatorio"
            />

            <q-btn
              class="q-mt-lg"
              color="primary"
              label="Fechar"
              @click="dialogRelatorioPeriodo = false"
            />
          </q-card>
        </q-dialog>

        <!-- MODULO CADASTRO -->
        <div v-if="mostrarCadastro">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Cadastro de Clientes</div>
                <q-form @submit.prevent="salvarCliente">
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        ref="cpfInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.cpf"
                        label="CPF"
                        mask="###.###.###-##"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="nomeInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.nome"
                        @update:model-value="(val) => (cliente.nome = val.toUpperCase())"
                        label="Nome Completo"
                        maxlength="50"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.fantasia"
                        @update:model-value="(val) => (cliente.fantasia = val.toUpperCase())"
                        label="Nome Fantasia"
                        maxlength="50"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div style="width: 10%">
                      <q-input
                        ref="cepInput"
                        outlined
                        color="black"
                        class="dark-border"
                        v-model="cliente.cep"
                        label="CEP"
                        mask="#####-###"
                        @update:model-value="buscarCep"
                      />
                    </div>
                    <div style="width: 40%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.endereco"
                        label="Endereço"
                        @keydown.prevent
                      />
                    </div>
                    <div style="width: 25%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.bairro"
                        @update:model-value="(val) => (cliente.bairro = val.toUpperCase())"
                        label="Bairro"
                        @keydown.prevent
                      />
                    </div>
                    <div style="width: 25%">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.email"
                        @update:model-value="(val) => (cliente.email = val.toUpperCase())"
                        label="Email"
                        maxlength="30"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.telefone"
                        label="Telefone"
                        mask="(##)####.####"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model="cliente.celular"
                        label="Celular"
                        mask="(##)#####.####"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="limiteInput"
                        outlined
                        color="black"
                        class="w-1/3 dark-border"
                        v-model.number="cliente.limite"
                        label="Limite de Crédito"
                        type="number"
                        @input="validarDecimal('limite')"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-md q-mt-md">
                    <q-btn label="Salvar" type="submit" color="primary" />
                    <q-btn label="Limpar" flat @click="limparFormulario" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>

        <div v-if="listarOrcamento">
          <q-table
            title="Listagem de Orçamentos"
            :rows="orcamentos"
            :columns="colunasOrcamentosg"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="((entrarOrcamento = true), editarOrcamento(props.row))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirOrcamento(props.row.id)"
                />
                <q-btn
                  size="sm"
                  color="blue"
                  icon="visibility"
                  @click="((entrarOrcamento = true), verOrcamento(props.row))"
                />
                <q-btn
                  size="sm"
                  color="positive"
                  icon="print"
                  @click="imprimirOrcamento(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- LISTAR CLIENTES -->
        <div v-if="listarClientes">
          <q-table
            title="Listagem de Clientes"
            :rows="clientes"
            :columns="colunas"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="(editarCliente(props.row), (mostrarCadastro = true))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirCliente(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- CADASTRO ITENS -->
        <div v-if="mostrarItens">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Cadastro de Itens</div>
                <q-form @submit.prevent="salvarItem">
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        ref="codInput"
                        outlined
                        color="black"
                        v-model="item.codbarras"
                        label="Código de barras"
                        type="text"
                        mask="#############"
                        class="w-1/3 dark-border"
                      />
                    </div>

                    <div class="col">
                      <q-input
                        ref="nomeiInput"
                        outlined
                        color="black"
                        :model-value="item.nome"
                        @update:model-value="(val) => (item.nome = val.toUpperCase())"
                        label="Nome do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.grupo"
                        @update:model-value="(val) => (item.grupo = val.toUpperCase())"
                        label="Grupo do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model="item.marca"
                        @update:model-value="(val) => (item.marca = val.toUpperCase())"
                        label="Marca do item"
                        maxlength="100"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="quanInput"
                        outlined
                        color="black"
                        v-model.number="item.quantidade"
                        label="Quantidade"
                        type="number"
                        @input="validarDecimal('quantidade')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="custoInput"
                        outlined
                        color="black"
                        v-model.number="item.precocusto"
                        label="Preço de Custo"
                        type="number"
                        @input="validarDecimal('precocusto')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="col">
                      <q-input
                        outlined
                        color="black"
                        v-model.number="item.perlucro"
                        label="% de lucro"
                        type="number"
                        @input="validarDecimal('perlucro')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="vendaInput"
                        outlined
                        color="black"
                        v-model.number="item.precovenda"
                        label="Preço de Venda"
                        type="number"
                        @input="validarDecimal('precovenda')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        ref="vendaInput"
                        outlined
                        color="black"
                        v-model.number="item.revenda"
                        label="Preço de Revenda"
                        type="number"
                        @input="validarDecimal('revenda')"
                        class="w-1/3 thick-border"
                      />
                    </div>
                  </div>
                  <div class="q-gutter-md q-mt-md">
                    <q-btn label="Salvar" type="submit" color="primary" />
                    <q-btn label="Limpar" flat @click="limparFormularioI" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>
        <!-- LISTAR ITENS -->
        <div v-if="listarItens">
          <q-table
            title="Listagem de Produtos"
            :rows="itens"
            :columns="colunasi"
            row-key="controle"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  size="sm"
                  color="warning"
                  icon="edit"
                  @click="(editarItem(props.row), (mostrarItens = true))"
                />
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirItem(props.row.controle)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- RECEBER -->
        <div v-if="mostrarReceber">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Lançamento de Crédito Cliente</div>
                <q-form @submit.prevent="salvarReceber">
                  <q-select
                    ref="clienteInput"
                    filled
                    v-model="receber.cliente_id"
                    :options="clientesFiltrados"
                    option-label="nome"
                    option-value="id"
                    label="Cliente"
                    emit-value
                    map-options
                    use-input
                    input-debounce="300"
                    clearable
                    @filter="onFiltrarClientes"
                    @focus="onMostrarTodosClientes"
                  />
                  <q-input
                    filled
                    v-model="receber.descricao"
                    label="Descrição"
                    @update:model-value="(val) => (receber.descricao = val.toUpperCase())"
                    maxlength="30"
                  />
                  <q-input
                    ref="valorrInput"
                    filled
                    v-model.number="receber.valor"
                    label="Valor"
                    type="number"
                  />
                  <div class="q-gutter-md q-mt-md">
                    <q-btn label="Salvar" type="submit" color="primary" />
                    <q-btn label="Limpar" flat @click="limparFormularioReceber" />
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-page>
        </div>

        <!-- LISTAR RECEBER -->
        <div v-if="listarReceber">
          <q-table
            title="Contas a Receber"
            :rows="receberes"
            :columns="colunasReceber"
            row-key="id"
            class="q-mt-md"
            dense
            title-class="text-h4 text-primary q-pa-md"
            :pagination="{ page: 1, rowsPerPage: 14 }"
          >
            <template v-slot:body-cell-acoes="props">
              <q-td align="center">
                <q-btn
                  size="sm"
                  color="negative"
                  icon="delete"
                  @click="excluirReceber(props.row.id)"
                />
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- QUITAÇÃO -->
        <div v-if="listarDividas">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Dívidas por Cliente</div>
                <q-table
                  title="Resumo de Dívidas"
                  :rows="dividasPorCliente"
                  :columns="colunasDividas"
                  row-key="cliente_id"
                  class="q-mt-md"
                  dense
                  title-class="text-h4 text-primary q-pa-md"
                  :pagination="{ page: 1, rowsPerPage: 14 }"
                >
                  <template v-slot:body-cell-acoes="props">
                    <q-td align="center">
                      <q-btn
                        size="sm"
                        color="positive"
                        icon="payments"
                        label="Pagar"
                        @click="pagarConta(props.row)"
                      />
                      <q-btn
                        size="sm"
                        color="grey-8"
                        icon="block"
                        label="Abonar"
                        @click="abonarConta(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </q-page>
        </div>

        <!-- RESUMO -->
        <div v-if="resumoDividas">
          <q-page padding>
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h4 text-blue-8 q-mb-lg">Resumo de crédidos por Cliente</div>
                <q-table
                  title="Resumo de Créditos"
                  :rows="dividasPorCliente"
                  :columns="colunasResumo"
                  row-key="cliente_id"
                  class="q-mt-md"
                  dense
                  title-class="text-h4 text-primary q-pa-md"
                  :pagination="{ page: 1, rowsPerPage: 12 }"
                >
                  <template v-slot:body-cell-acoes="props">
                    <q-td align="center">
                      <q-btn
                        size="sm"
                        color="positive"
                        icon="payments"
                        label="Pagar"
                        @click="pagarConta(props.row)"
                      />
                      <q-btn
                        size="sm"
                        color="grey-8"
                        icon="block"
                        label="Abonar"
                        @click="abonarConta(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </q-page>
        </div>
      </div>
    </div>
  </div>
  <div id="toast" class="toast" style="display: none"></div>
  <div id="toastv" class="toastv" style="display: none"></div>
</template>
<script setup>
import logo from 'src/assets/logo.png'
import usuario from 'src/assets/usuario.png'
import { imprimirOrcamentoPorId } from 'src/utils/impressao.js'
import { gerarRelatorioPeriodo } from 'src/utils/relatorio.js'
import { ref, onMounted, watch } from 'vue'
import novoCliente from 'src/models/Cliente'
import novoItem from 'src/models/Item'
import axios from 'axios'
import { Dialog, Notify } from 'quasar'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const receber = ref({
  cliente_id: '',
  descricao: '',
  valor: null,
  datavencimento: '',
})
const carregaraClientes = async () => {
  try {
    const resp = await fetch('http://localhost:3000/clientes')
    const data = await resp.json()
    clientes.value = data
  } catch (err) {
    console.error('Erro ao carregar clientes:', err)
    $q.notify({ type: 'negative', message: 'Erro ao buscar clientes.' })
  }
}

axios.defaults.baseURL = 'http://localhost:3000'
const API_URL = 'http://localhost:3000'
const cliente = ref(novoCliente())
const clientes = ref([])
const item = ref(novoItem())
const itens = ref([])
const nomeInput = ref(null)
const cpfInput = ref(null)
const DataInput = ref(null)
const DataInputFim = ref(null)
const cepInput = ref(null)
const nomeiInput = ref(null)
const limiteInput = ref(null)
const codInput = ref(null)
const quanInput = ref(null)
const custoInput = ref(null),
  vendaInput = ref(null)
const clienterInput = ref(null)
const valorrInput = ref(null)
const mostrarCadastro = ref(false)
const mostrarItens = ref(false)
const listarItens = ref(false)
const listarClientes = ref(false)
const listarDividas = ref(false)
const resumoDividas = ref(false)
const clientesFiltrados = ref([...clientes.value])
const resultadoBusca = ref([])
const buscaItem = ref('')
const observacao = ref(null)
const condicao = ref(null)
const validade = ref(null)
const menuAtivo = ref(null)
const titulo = ref(null)
const cepcerto = ref(null)

const atualizarListaFiltrada = (termo) => {
  if (!termo || termo.length < 3) {
    clientesFiltrados.value = [...clientes.value]
  } else {
    const termoMin = termo.toLowerCase()
    clientesFiltrados.value = clientes.value.filter((c) => c.nome.toLowerCase().includes(termoMin))
  }
}

const onFiltrarClientes = (val, update) => {
  atualizarListaFiltrada(val)
  update()
}

const onMostrarTodosClientes = () => {
  clientesFiltrados.value = [...clientes.value]
}

function ocultar() {
  listarReceber.value = false
  mostrarReceber.value = false
  listarDividas.value = false
  mostrarCadastro.value = false
  listarClientes.value = false
  mostrarItens.value = false
  listarItens.value = false
  resumoDividas.value = false
  criarOrcamento.value = false
  listarOrcamento.value = false
  dataInicio.value = ''
  dataFim.value = ''
}

function trocartitulo() {
  titulo.value = 'NOVO ORÇAMENTO'
}

const colunas = [
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'fantasia', label: 'Fantasia', field: 'fantasia', align: 'left' },
  { name: 'endereco', label: 'Endereço', field: 'endereco', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'celular', label: 'Celular', field: 'celular', align: 'left' },
  {
    name: 'limite',
    label: 'Limite de Crédito',
    field: 'limite',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const colunasi = [
  { name: 'codbarras', label: 'Barras', field: 'codbarras', align: 'left' },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
  { name: 'grupo', label: 'Grupo', field: 'grupo', align: 'left' },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
  {
    name: 'quantidade',
    label: 'Quantidade',
    field: 'quantidade',
    align: 'right',
    format: (val) => Number(val).toFixed(0),
  },
  {
    name: 'precocusto',
    label: 'Preço de custo',
    field: 'precocusto',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'perlucro',
    label: '% de lucro',
    field: 'perlucro',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'precovenda',
    label: 'Preço de venda',
    field: 'precovenda',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'revenda',
    label: 'Preço de revenda',
    field: 'revenda',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },

  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

async function carregarClientes() {
  const res = await fetch(`${API_URL}/clientes`)
  clientes.value = await res.json()
}

function bemvinda() {
  const dlg = Dialog.create({
    message: `
    <div class="column items-center" style="padding: 0; margin: 0;">
      <i class="material-icons" style="font-size:28px; color:#1976d2;">waving_hand</i>
      </i>
      <div class="text-body2">Bem-vindo ao Sistema de Controle de Orçamentos!</div>
    </div>
  `,
    html: true,
    class: 'q-pa-sm text-center',
    ok: false,
    cancel: false,
  })
  setTimeout(() => {
    dlg.hide()
  }, 1500)
}

const buscarCep = async (val) => {
  const cep = val.replace(/\D/g, '')

  if (cep.length !== 8) return

  try {
    const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

    if (res.data.erro) {
      showToast('CEP não encontrado ou inválido!', 1000)
      cepcerto.value = false
      return
    }
    //cliente.value.endereco = res.data.logradouro || ''  //cliente.value.cidade = res.data.localidade || ''  //cliente.value.estado = res.data.uf || ''
    cliente.value.bairro = res.data.bairro.toUpperCase() || ''
    cliente.value.endereco = res.data.logradouro.toUpperCase() || ''
    cepcerto.value = true
  } catch (err) {
    console.error('Erro ao buscar CEP', err)
    showToast('Erro ao buscar CEP!', 1000)
  }
}

async function salvarCliente() {
  //debugger
  if (!cliente.value.nome || !cliente.value.cpf || !cliente.value.limite) {
    showToast('Preencha todos os campos obrigatórios!', 1000)
    if (!cliente.value.cpf) return cpfInput.value?.focus()
    if (!cliente.value.nome) return nomeInput.value?.focus()
    if (!cliente.value.limite) return limiteInput.value?.focus()
    return
  }
  if (cepcerto.value == false) {
    showToast('Preencha um CEP correito!', 1000)
    cliente.value.cep = ''
    return cepInput.value?.focus()
  }

  if (!cliente.value.id) {
    const clientesExistentes = await fetch(`${API_URL}/clientes`).then((res) => res.json())
    const cpfDuplicado = clientesExistentes.find((c) => c.cpf === cliente.value.cpf)
    if (cpfDuplicado) {
      showToast('Já existe um cliente com este CPF!', 1500)
      return cpfInput.value?.focus()
    }
    const res = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente.value),
    })
    const data = await res.json()
    cliente.value.id = data.id
    showToastv('Cliente salvo com sucesso!', 1000)
    limparFormulario()
    carregarClientes()
    carregarDividasPorCliente()
  } else {
    await fetch(`${API_URL}/clientes/${cliente.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente.value),
    })
    showToastv('Cliente atualizado com sucesso!', 1000)
    limparFormulario()
    carregarClientes()
    carregarDividasPorCliente()
    ocultar()
    listarClientes.value = true
  }
}

async function excluirCliente(id) {
  Dialog.create({
    title: 'Excluir Cliente',
    message:
      'Tem certeza que deseja excluir esse cliente? Essa ação <b>não poderá ser desfeita</b>.',
    html: true,
    icon: 'warning',
    ok: {
      label: 'Sim, excluir',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' })
      Notify.create({ type: 'positive', message: 'Cliente excluído com sucesso.' })
      carregarClientes()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
      Notify.create({ type: 'negative', message: 'Erro ao excluir conta. Verifique a conexão.' })
    }
  })
}

function editarCliente(c) {
  cliente.value = { ...c }
}

function limparFormulario() {
  cliente.value = novoCliente()
  cpfInput.value.focus()
}

watch(
  () => [item.value.precocusto, item.value.perlucro],
  ([custo, lucro = 100]) => {
    if (!isNaN(custo) && !isNaN(lucro)) {
      item.value.precovenda = parseFloat((custo + (custo * lucro) / 100).toFixed(2))
    }
  },
)

watch(
  () => [item.value.precocusto, item.value.precovenda],
  ([custo, venda]) => {
    if (!isNaN(custo) && !isNaN(venda) && custo !== 0) {
      item.value.perlucro = parseFloat((((venda - custo) / custo) * 100).toFixed(2))
    }
  },
)

async function carregarItens() {
  const res = await fetch(`${API_URL}/itens`)
  itens.value = await res.json()
}

async function salvarItem() {
  if (
    !item.value.nome ||
    !item.value.codbarras ||
    !item.value.quantidade ||
    !item.value.precocusto ||
    !item.value.precovenda
  ) {
    showToast('Preencha todos os campos obrigatórios!', 1000)
    if (!item.value.codbarras) return codInput.value?.focus()
    if (!item.value.nome) return nomeiInput.value?.focus()
    if (!item.value.quantidade) return quanInput.value?.focus()
    if (!item.value.precocusto) return custoInput.value?.focus()
    if (!item.value.precovenda) return vendaInput.value?.focus()
    return
  }

  const resCheck = await fetch(`${API_URL}/itens/buscar-codigo/${item.value.codbarras}`)
  const itemExistente = await resCheck.json()

  if (!item.value.controle && itemExistente) {
    showToast('Código de barras já cadastrado!', 1500)
    return codInput.value?.focus()
  }

  if (item.value.controle && itemExistente && itemExistente.controle !== item.value.controle) {
    showToast('Código de barras já está sendo usado em outro item!', 1500)
    return codInput.value?.focus()
  }

  if (!item.value.controle) {
    const res = await fetch(`${API_URL}/itens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    const data = await res.json()
    item.value.controle = data.controle

    showToastv('Produto salvo com sucesso!', 1000)
    limparFormularioI()
    carregarItens()
  } else {
    await fetch(`${API_URL}/itens/${item.value.controle}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item.value),
    })

    showToastv('Produto atualizado com sucesso!', 1000)
    limparFormularioI()
    carregarItens()
    ocultar()
    listarItens.value = true
  }
}

async function excluirItem(controle) {
  Dialog.create({
    title: 'Excluir Produto',
    message:
      'Tem certeza que deseja excluir esse produto? Essa ação <b>não poderá ser desfeita</b>.',
    html: true,
    icon: 'warning',
    ok: {
      label: 'Sim, excluir',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/itens/${controle}`, { method: 'DELETE' })
      showToastv('Produto excluido com sucesso!', 1000)
      carregarItens()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
      Notify.create({ type: 'negative', message: 'Erro ao excluir item. Verifique a conexão.' })
    }
  })
}

function editarItem(i) {
  item.value = { ...i }
}

function limparFormularioI() {
  item.value.controle = null
  item.value.nome = ''
  item.value.codbarras = ''
  item.value.descricao = ''
  item.value.grupo = ''
  item.value.marca = ''
  item.value.quantidade = 0
  item.value.precocusto = 0
  item.value.perlucro = 0
  item.value.precovenda = 0
  item.value.revenda = 0
  codInput.value.focus()
}

const mostrarReceber = ref(false)
const listarReceber = ref(false)
const receberes = ref([])

const colunasReceber = [
  { name: 'cliente_id', label: 'Controle', field: 'cliente_id', align: 'left' },
  { name: 'cliente_cpf', label: 'Cpf', field: 'cliente_cpf', align: 'left' },
  { name: 'cliente_nome', label: 'Cliente', field: 'cliente_nome', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  {
    name: 'valororiginal',
    label: 'Valor Original',
    field: 'valororiginal',
    format: (vil) => `R$ ${vil.toFixed(2)}`,
    align: 'right',
  },
  {
    name: 'valor',
    label: 'Valor Pendente',
    field: 'valor',
    format: (vel) => `R$ ${vel.toFixed(2)}`,
    align: 'right',
  },
  {
    name: 'valorpago',
    label: 'Valor Pago',
    field: (row) => row.valororiginal - row.valor,
    format: (vwl) => `R$ ${vwl.toFixed(2)}`,
    align: 'right',
  },
  { name: 'status', label: 'Status', field: 'status', align: 'right' },
  {
    name: 'datacadastro',
    label: 'Cadastro',
    field: 'datacadastro',
    align: 'center',
    format: (vul) => {
      if (!vul) return ''
      const [ano, mes, dia] = vul.split('-')
      return `${dia}/${mes}/${ano}`
    },
  },
  {
    name: 'datavencimento',
    label: 'Vencimento',
    field: 'datavencimento',
    align: 'center',
    format: (val) => {
      if (!val) return ''
      const [ano, mes, dia] = val.split('-')
      return `${dia}/${mes}/${ano}`
    },
  },

  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

async function carregarReceber() {
  const res = await fetch(`${API_URL}/receber`)
  receberes.value = await res.json()
}

async function salvarReceber() {
  if (!receber.value.cliente_id || !receber.value.valor) {
    showToast('Preencha os campos obrigatórios!', 1500)
    if (!receber.value.cliente_id) return clienterInput.value?.focus()
    if (!receber.value.valor) return valorrInput.value?.focus()
    return
  }

  const hoje = new Date()
  const vencimento = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 5)
  vencimento.setHours(0, 0, 0, 0)
  receber.value.datavencimento = vencimento.toISOString().substring(0, 10)
  hoje.setHours(0, 0, 0, 0)
  receber.value.datacadastro = hoje.toISOString().substring(0, 10)
  try {
    const url = receber.value.id ? `${API_URL}/receber/${receber.value.id}` : `${API_URL}/receber`
    const metodo = receber.value.id ? 'PUT' : 'POST'
    const resposta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receber.value),
    })

    const data = await resposta.json()
    if (!resposta.ok) {
      if (resposta.status === 403 && data?.limite) {
        showToast(
          `⚠️ Limite excedido!\n\n` +
            `• Limite: R$${data.limite.toFixed(2)}\n` +
            `• Dívida atual: R$${data.dividaAtual.toFixed(2)}\n` +
            `• Crédito Disponível: R$${(data.limite - data.dividaAtual).toFixed(2)}\n` +
            `Tentativa de: R$${data.valorTentado.toFixed(2)}`,
          5000,
        )
        limparFormularioReceber()
      } else if (resposta.status === 404) {
        showToast('Cliente não encontrado.', 3000)
      } else {
        showToast(data.message || 'Erro ao salvar a conta.', 3000)
      }
      return
    }

    showToastv('✅ Lançamento feito com sucesso!', 2000)
    limparFormularioReceber()
    await carregarDividasPorCliente()
    await carregarReceber()
  } catch (erro) {
    console.error('Erro na requisição:', erro)
    showToast('Erro inesperado ao salvar!', 3000)
  }
}

function excluirReceber(id) {
  Dialog.create({
    title: 'Excluir Conta',
    message: 'Tem certeza que deseja excluir esta conta? Essa ação <b>não poderá ser desfeita</b>.',
    html: true,
    icon: 'warning',
    ok: {
      label: 'Sim, excluir',
      color: 'negative',
      unelevated: true,
    },
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-8',
    },
    persistent: true,
  }).onOk(async () => {
    try {
      await fetch(`${API_URL}/receber/${id}`, { method: 'DELETE' })
      Notify.create({ type: 'positive', message: 'Conta excluída com sucesso.' })
      carregarReceber()
      carregarDividasPorCliente()
    } catch (err) {
      console.error('Erro ao excluir conta:', err)
      Notify.create({ type: 'negative', message: 'Erro ao excluir conta. Verifique a conexão.' })
    }
  })
}

function limparFormularioReceber() {
  receber.value = {
    cliente_id: '',
    descricao: '',
    valor: 0,
    vencimento: '',
  }
}

const colunasDividas = [
  { name: 'nome', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'nome', label: 'Cliente', field: 'nome', align: 'left' },
  {
    name: 'divida_total',
    label: 'Dívida Total',
    field: 'divida_total',
    align: 'right',
    format: (vel) => `R$ ${vel.toFixed(2)}`,
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const colunasResumo = [
  { name: 'nome', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'nome', align: 'left' },
  {
    name: 'limite',
    label: 'Limite',
    field: 'limite',
    align: 'right',
    format: (vel) => `R$ ${vel.toFixed(2)}`,
  },
  {
    name: 'divida_total',
    label: 'Dívida Total',
    field: 'divida_total',
    align: 'right',
    format: (vel) => `R$ ${vel.toFixed(2)}`,
  },
  {
    name: 'disponivel',
    label: 'Disponível',
    field: (row) => row.limite - row.divida_total,
    format: (vwl) => `R$ ${vwl.toFixed(2)}`,
    align: 'right',
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const dividasPorCliente = ref([])

async function carregarDividasPorCliente() {
  try {
    const res = await axios.get('/clientes/dividas')
    dividasPorCliente.value = res.data.filter((c) => c.divida_total > 0)
  } catch (error) {
    console.error('Erro ao carregar dívidas:', error)
    showToast(`Erro ao carregar dívidas dos clientes.`, 3000)
  }
}

async function pagarConta(cliente) {
  if (!cliente?.id) {
    showToast(`Cliente inválido.!`, 3000)
    return
  }

  try {
    const response = await axios.put(`/receber/${cliente.id}/pagar-todas`)

    if (response.data?.linhasAfetadas > 0) {
      showToast(`Pagamentos do cliente ${cliente.nome} registrados com sucesso!`, 3000)
      carregarReceber()
    } else {
      showToast(`O cliente ${cliente.nome} não possui dívidas para pagar.`, 3000)
    }

    await carregarDividasPorCliente()
  } catch (error) {
    console.error('Erro ao pagar contas:', error)

    if (error.response?.data?.error) {
      alert(`Erro: ${error.response.data.error}`)
    } else {
      showToast(`Erro ao pagar as contas do cliente. Verifique a conexão com o servidor.`, 3000)
    }
  }
}

function abonarConta(cliente) {
  Dialog.create({
    title: `Abonar dívida de ${cliente.nome}`,
    message: 'Informe o valor a abonar:',
    prompt: {
      model: '',
      type: 'text',
      isValid: (val) => {
        const valorLimpo = val.trim().replace(',', '.')
        const apenasNumero = /^(\d+(\.\d{1,2})?)$/
        return apenasNumero.test(valorLimpo) && parseFloat(valorLimpo) > 0
      },
      isValidMessage: 'Digite um valor numérico maior que zero.',
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data) => {
    const valorAbono = data.trim().replace(',', '.')
    const valor = parseFloat(valorAbono)

    try {
      await axios.put(`/receber/${cliente.id}/abonar`, {
        valorAbono: valor,
      })

      Notify.create({
        type: 'positive',
        message: `Abonado R$${valor.toFixed(2)} para ${cliente.nome} com sucesso!`,
      })

      carregarReceber()
      await carregarDividasPorCliente()
    } catch (error) {
      console.error('Erro ao abonar:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao abonar a dívida do cliente.',
      })
    }
  })
}
//MODULO NOVO ORÇAMENTO
const criarOrcamento = ref(false)
const entrarOrcamento = ref(false)
const clienteSelecionado = ref(null)
const cpfCliente = ref('')
const endCliente = ref('')
const endCep = ref('')
const endBairro = ref('')
const celCliente = ref('')
const telCliente = ref('')
const emailCliente = ref('')
const itensOrcamento = ref([])
const itemSelecionado = ref(-1)
const acrescimoRef = ref(null)
const dialogRelatorioPeriodo = ref(false)
const dataInicio = ref('')
const dataFim = ref('')
titulo.value = 'NOVO ORÇAMENTO'
const colunasOrcamento = [
  {
    name: 'nome',
    label: 'Item',
    field: 'nome',
    align: 'left',
    style: 'width: 40%',
    headerStyle: 'text-align: left',
  },
  {
    name: 'quantidade',
    label: 'Quantidade',
    field: 'quantidade',
    align: 'center',
    style: 'width: 50px; text-align: right',
    headerStyle: 'text-align: left',
  },
  {
    name: 'valorUnit',
    label: 'Valor Unit.',
    field: 'valorUnit',
    align: 'right',
    style: 'width: 120px; text-align: right',
    headerStyle: 'text-align: right',
  },
  {
    name: 'total',
    label: 'Total',
    field: 'total',
    align: 'right',
    style: 'width: 120px; text-align: right; font-weight: bold',
    headerStyle: 'text-align: right',
    format: (val) => Number(val).toFixed(2),
  },
  { name: 'acoes', label: 'Ações', field: 'controle', align: 'center' },
]

const desconto = ref(0)
const acrescimo = ref(0)
const totalGeral = ref(0)
//Pegar dados
watch(
  () => clienteSelecionado.value,
  (novoId) => {
    if (!novoId) {
      cpfCliente.value = ''
      endCliente.value = ''
      return
    }

    const cliente = clientes.value.find((c) => c.id === novoId)
    cpfCliente.value = cliente?.cpf || ''
    endCliente.value = cliente?.endereco || ''
    endCep.value = cliente?.cep || ''
    endBairro.value = cliente?.bairro || ''
    celCliente.value = cliente?.celular || ''
    telCliente.value = cliente?.telefone || ''
    emailCliente.value = cliente?.email || ''
  },
)

function navegarLista(event) {
  if (event.key === 'Enter') {
    if (itemSelecionado.value < 0) {
      buscarItem()
    } else {
      adicionarItem(resultadoBusca.value[itemSelecionado.value])
    }
    return
  }
  const total = resultadoBusca.value.length

  if (total === 0) return

  if (event.key === 'ArrowDown') {
    itemSelecionado.value = (itemSelecionado.value + 1) % total
  }

  if (event.key === 'ArrowUp') {
    itemSelecionado.value = (itemSelecionado.value - 1 + total) % total
  }

  if (event.key === 'Enter') {
    if (itemSelecionado.value >= 0) {
      adicionarItem(resultadoBusca.value[itemSelecionado.value])
    } else {
      buscarItem()
    }
  }
}

const buscarItem = async () => {
  try {
    const res = await axios.get('http://localhost:3000/itens/busca/buscar', {
      params: { texto: buscaItem.value },
    })

    resultadoBusca.value = res.data || []

    if (resultadoBusca.value.length === 0) {
      showToast('Nenhum item encontrado!', 1500)
      itemSelecionado.value = -1
    } else {
      itemSelecionado.value = 0
    }

    console.log('Itens encontrados:', resultadoBusca.value)
  } catch (err) {
    console.error('Erro ao buscar itens:', err)
    showToast('Erro ao buscar itens!', 3000)

    resultadoBusca.value = []
    itemSelecionado.value = -1
  }
}

function adicionarItem(item) {
  if (!item) return

  itensOrcamento.value.push({
    controle: item.controle,
    nome: item.nome,
    quantidade: 1,
    valorUnit: item.precovenda,
    total: item.precovenda,
  })

  atualizarTotais()

  resultadoBusca.value = []
  buscaItem.value = ''
  itemSelecionado.value = -1
}

function excluirItemOrç(controle) {
  itensOrcamento.value = itensOrcamento.value.filter((i) => i.controle !== controle)
  atualizarTotais()
}

// Atualizar totais

function atualizarTotais() {
  // debugger
  let subtotal = itensOrcamento.value.reduce((acc, i) => {
    i.total = i.quantidade * i.valorUnit
    return acc + i.total
  }, 0)

  const descontoMaximo = Math.max(0, subtotal - 0.01)
  if (entrarOrcamento.value == false) {
    if (desconto.value > descontoMaximo) {
      showToast('O desconto informado é maior que o permitido e foi reajustado!', 3000)
      desconto.value = descontoMaximo.toFixed(2)
      if (acrescimoRef.value) {
        setTimeout(() => {
          acrescimoRef.value.focus()
        }, 50)
      }
    }
  }
  let soma = subtotal - desconto.value + Number(acrescimo.value)
  totalGeral.value = Math.max(0, soma)
}

watch(desconto, () => {
  atualizarTotais()
})

watch(acrescimo, () => {
  atualizarTotais()
})

async function salvarOrcamento() {
  if (!clienteSelecionado.value) {
    showToast('Selecione um cliente!', 3000)
    return
  }

  if (!itensOrcamento.value || itensOrcamento.value.length === 0) {
    showToast('Adicione pelo menos 1 item!', 3000)
    return
  }

  if (!validade.value || validade.value.trim() === '') {
    showToast('Selecione a validade do orçamento!', 3000)
    return
  }

  if (!validarValidade(validade.value, entrarOrcamento.value)) {
    return
  }

  if (!totalGeral.value || totalGeral.value <= 0) {
    showToast('Total do orçamento não pode ser zero!', 3000)
    return
  }

  // --- Calcular valor votal final ---
  const valorTotalFinal = totalGeral.value + desconto.value - acrescimo.value

  const payload = {
    clienteId: clienteSelecionado.value,
    itens: itensOrcamento.value,
    desconto: desconto.value,
    acrescimo: acrescimo.value,
    observacoes: observacao.value,
    condicao: condicao.value,
    valorTotalItens: valorTotalFinal,
    validade: validade.value,
    valorTotal: totalGeral.value,
    status: item.value.status,
  }

  try {
    let res
    if (idOrcamentoEdicao.value) {
      console.log('Atualizando orçamento ID:', idOrcamentoEdicao.value)
      res = await axios.put(`/orcamentos/${idOrcamentoEdicao.value}`, payload)
      showToastv('Orçamento atualizado com sucesso!', 1000)
      ocultar()
      carregarOrcamento()
      listarOrcamento.value = true
    } else {
      res = await axios.post('/orcamentos', payload)
      showToastv('Orçamento criado com sucesso!', 1000)
    }
    console.log('Retorno:', res.data)
    limparOrcamento()
    carregarOrcamento()
  } catch (error) {
    console.error('Erro ao salvar orçamento:', error)
    showToast('Erro ao salvar orçamento!', 3000)
  }
}

async function limparOrcamento() {
  clienteSelecionado.value = null
  itensOrcamento.value = []
  desconto.value = 0
  acrescimo.value = 0
  totalGeral.value = 0
  buscaItem.value = ''
  resultadoBusca.value = []
  observacao.value = ''
  condicao.value = ''
  validade.value = ''
  endCliente.value = ''
  endCep.value = ''
  endBairro.value = ''
  telCliente.value = ''
  celCliente.value = ''
  emailCliente.value = ''
  item.value.status = 'ABERTO'
}

watch(
  () => validade.value,
  (novaData) => {
    if (!novaData) return
    const [dia, mes, ano] = novaData.split('-')
    const dataFormatada = `${ano}-${mes}-${dia}`
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const dataEscolhida = new Date(dataFormatada + 'T00:00:00')
    if (dataEscolhida < hoje && entrarOrcamento.value == false) {
      showToast(`A validade não pode ser menor que a data atual!`, 3000)
      validade.value = null
    }
  },
)

function validarValidade(val, entrarOrcamento) {
  if (!val) return false

  const [dia, mes, ano] = val.split('-')
  const dataFormatada = `${ano}-${mes}-${dia}`

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dataEscolhida = new Date(dataFormatada + 'T00:00:00')

  if (dataEscolhida < hoje && !entrarOrcamento) {
    showToast('A validade não pode ser menor que a data atual!', 3000)
    return false
  }
  return true
}

// MÓDULO LISTAGEM ORÇAMENTO

const listarOrcamento = ref(false)
const orcamentos = ref([])

const colunasOrcamentosg = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'clienteNome', align: 'left' },
  {
    name: 'dataCriacao',
    label: 'Data',
    field: 'dataCriacao',
    align: 'left',
    format: (val) => {
      if (!val) return ''
      const d = new Date(val)
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
  {
    name: 'validade',
    label: 'Validade',
    field: 'validade',
    align: 'left',
    format: (val) => {
      if (!val) return ''
      if (val.includes('-')) {
        const partes = val.split('-')
        if (partes[0].length === 2) {
          return `${partes[0]}/${partes[1]}/${partes[2]}`
        }
        if (partes[0].length === 4) {
          return `${partes[2]}/${partes[1]}/${partes[0]}`
        }
      }

      return val
    },
  },
  {
    name: 'valorTotalItens',
    label: 'Itens',
    field: 'valorTotalItens',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'desconto',
    label: 'Desc.',
    field: 'desconto',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'acrescimo',
    label: 'Acrésc.',
    field: 'acrescimo',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },
  {
    name: 'valorTotal',
    label: 'Total',
    field: 'valorTotal',
    align: 'right',
    format: (val) => Number(val).toFixed(2),
  },

  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

async function carregarOrcamento() {
  const res = await fetch(`${API_URL}/orcamentos`)
  orcamentos.value = await res.json()
}

function excluirOrcamento(id) {
  Notify.create({
    message: 'Tem certeza que deseja excluir esse Orçamento?',
    caption: 'Essa ação não poderá ser desfeita.',
    color: 'blue-10',
    icon: 'warning',
    position: 'center',

    actions: [
      {
        label: 'Cancelar',
        color: 'white',
      },
      {
        label: 'Excluir',
        color: 'red-6',
        handler: async () => {
          try {
            await fetch(`${API_URL}/orcamentos/${id}`, {
              method: 'DELETE',
            })
            showToastv(`Orçamento excluído com sucesso!`, 1500)
            carregarOrcamento()
          } catch (err) {
            console.error('Erro ao excluir orçamento:', err)

            Notify.create({
              type: 'negative',
              message: 'Erro ao excluir orçamento. Verifique sua conexão.',
            })
          }
        },
      },
    ],
  })
}

// MÓDULO EDITAR ORÇAMENTO

const modoEdicao = ref(false)
const idOrcamentoEdicao = ref(null)

const editarOrcamento = async (row) => {
  //debugger
  if (row.status?.toLowerCase() === 'finalizado') {
    showToast('Este orçamento está Finalizado e não pode ser editado!', 2000)
    return
  }
  console.log('DADOS ENVIADOS PARA EDITAR:', row)
  titulo.value = 'ATUALIZAR ORÇAMENTO' + '  -  ' + 'Nº:' + row.numero
  entrarOrcamento.value = true
  criarOrcamento.value = true
  listarOrcamento.value = false
  idOrcamentoEdicao.value = row.id
  clienteSelecionado.value = row.clienteId
  validade.value = row.validade
  observacao.value = row.observacoes || ''
  condicao.value = row.condicao || ''
  desconto.value = row.desconto.toFixed(2) || 0
  acrescimo.value = row.acrescimo.toFixed(2) || 0
  item.value.status = row.status || 'ABERTO'
  await carregarItensDoOrcamento(row.id)
  atualizarTotais()
  entrarOrcamento.value = false
  desabilitarTudo.value = false
}

const verOrcamento = async (row) => {
  console.log('DADOS ENVIADOS PARA EDITAR:', row)
  titulo.value = 'VISUALIZAR ORÇAMENTO' + '  -  ' + 'Nº:' + row.numero
  entrarOrcamento.value = true
  criarOrcamento.value = true
  listarOrcamento.value = false
  idOrcamentoEdicao.value = row.id
  clienteSelecionado.value = row.clienteId
  validade.value = row.validade
  observacao.value = row.observacoes || ''
  condicao.value = row.condicao || ''
  desconto.value = row.desconto.toFixed(2) || 0
  acrescimo.value = row.acrescimo.toFixed(2) || 0
  item.value.status = row.status || 'ABERTO'
  await carregarItensDoOrcamento(row.id)
  atualizarTotais()
  desabilitarTudo.value = true
  entrarOrcamento.value = false
}

async function carregarItensDoOrcamento(id) {
  const res = await fetch(`${API_URL}/orcamentos/${id}`)
  const dados = await res.json()

  itensOrcamento.value = dados.itens.map((item) => ({
    controle: item.id,
    produtoId: item.produtoId,
    nome: item.descricao,
    quantidade: item.quantidade,
    valorUnit: item.valorUnit,
    total: item.total,
  }))
}

async function salvarEdicao() {
  const dados = {
    clienteId: clienteSelecionado.value,
    validade: validade.value,
    observacoes: observacao.value,
    condicao: condicao.value,
    desconto: desconto.value,
    acrescimo: acrescimo.value.toFixed(2),
    itens: itensOrcamento.value,
  }

  const res = await fetch(`${API_URL}/orcamentos/${idOrcamentoEdicao.value}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  const resultado = await res.json()

  if (resultado.success) {
    ocultar()
    listarOrcamento.value = true
    carregarOrcamento()
  } else {
    showToast('Erro ao atualizar orçamento!')
  }
}

function abrirCalendario() {
  console.log('Abrindo calendário...')
}

//import { useRouter } from 'vue-router'

function imprimirOrcamento(id) {
  imprimirOrcamentoPorId(id)
}

function abrirRelatorioPeriodo() {
  dialogRelatorioPeriodo.value = true
}

async function gerarRelatorio() {
  if (!dataInicio.value || !dataFim.value) {
    $q.notify({
      type: 'warning',
      message: 'É necessário selecionar as datas do período!',
    })
    if (!dataInicio.value) DataInput.value?.focus()
    else DataInputFim.value?.focus()
    return
  }
  if (dataInicio.value > dataFim.value) {
    $q.notify({
      type: 'warning',
      message: 'A data inicial é maior que a data final!',
    })
    dataFim.value = ''
    dataInicio.value = ''
    DataInput.value?.focus()
    return
  }

  const ok = await gerarRelatorioPeriodo(dataInicio.value, dataFim.value)
  if (!ok) {
    $q.notify({
      type: 'warning',
      message: 'Nenhum orçamento encontrado no período!',
    })
    dataInicio.value = ''
    dataFim.value = ''
    DataInput.value?.focus()
    return
  }
  dataInicio.value = ''
  dataFim.value = ''
  dialogRelatorioPeriodo.value = false
  return
}

//const router = useRouter()

/*function imprimirOrcamento(row) {
  if (!row?.id) {
    showToast('ID do orçamento não encontrado!', 1500)
    console.error('ID do orçamento não encontrado:', row)
    return
  }

  router.push(`/imprimir-orcamento/${row.id}`)
}*/

const desabilitarTudo = ref(false)

function showToast(message, tempo = 3000) {
  const toast = document.getElementById('toast')
  if (toast) {
    toast.textContent = message
    toast.classList.add('show')
    toast.style.display = 'block'
    setTimeout(() => {
      toast.classList.remove('show')
      toast.style.display = 'none'
    }, tempo)
  }
}

function showToastv(message, tempo = 3000) {
  const toast = document.getElementById('toastv')
  if (toast) {
    toast.textContent = message
    toast.classList.add('show')
    toast.style.display = 'block'
    setTimeout(() => {
      toast.classList.remove('show')
      toast.style.display = 'none'
    }, tempo)
  }
}

function validarDecimal(campo) {
  let valor = item.value[campo]
  if (typeof valor === 'string') {
    valor = valor.replace(',', '.')
  }
  const num = parseFloat(valor)
  item.value[campo] = isNaN(num) ? 0 : num
}

onMounted(() => {
  bemvinda()
  carregarClientes()
  carregarItens()
  carregarReceber()
  carregarDividasPorCliente()
  carregarOrcamento()
  carregaraClientes()
})

onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/clientes`)
    clientes.value = res.data
  } catch (err) {
    console.error('Erro ao carregar clientes:', err)
  }
})
</script>
<style scoped></style>
