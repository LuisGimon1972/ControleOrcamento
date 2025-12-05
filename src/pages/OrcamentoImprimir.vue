<template>
  <div class="print-container">
    <h3 class="text-center">Orçamento Nº {{ orcamento.numero }}</h3>

    <div class="q-mt-md">
      <strong>Cliente:</strong> {{ orcamento.clienteNome }} <br />
      <strong>Telefone:</strong> {{ orcamento.telefone }} <br />
      <strong>Validade:</strong> {{ orcamento.validade }}
    </div>

    <q-separator class="q-my-md" />

    <table class="tabela">
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Qt</th>
          <th>Unit.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itens" :key="item.id">
          <td>{{ item.descricao }}</td>
          <td>{{ item.quantidade }}</td>
          <td>{{ item.valorUnit.toFixed(2) }}</td>
          <td>{{ (item.quantidade * item.valorUnit).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="text-right q-mt-md">
      <strong>Total Geral: R$ {{ totalGeral.toFixed(2) }}</strong>
    </div>
    <q-btn color="primary" icon="print" label="Imprimir" @click="imprimirOrcamento(row)" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { API_URL } from '../config'
import { useRouter } from 'vue-router'
const router = useRouter()

function imprimirOrcamento(row) {
  router.push(`/imprimir-orcamento/${row.id}`)
}

const route = useRoute()
const orcamentoId = route.params.id

const orcamento = ref({})
const itens = ref([])
const totalGeral = ref(0)

async function carregar() {
  const res = await fetch(`${API_URL}/orcamentos/${orcamentoId}`)
  const data = await res.json()

  orcamento.value = data.orcamento
  itens.value = data.itens
  totalGeral.value = Number(data.orcamento.valorTotal)
}

onMounted(async () => {
  await carregar()
  setTimeout(() => window.print(), 400) // imprime após carregar
})
</script>

<style>
.print-container {
  padding: 20px;
  font-size: 14px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela th,
.tabela td {
  border: 1px solid #ccc;
  padding: 6px;
}
</style>
