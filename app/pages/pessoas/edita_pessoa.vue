<template>
  <div class="container pt-3 w-100">
    <div class="card">
      <div class="card-header fw-bold">{{ title }}</div>
      <div class="card-body">
        <form id="formulario" @submit.prevent="grava">
          <input type="hidden" id="id" name="id" v-model="pessoa._id" />
          <input type="hidden" id="total_promocoes" :value="pessoa.promocoes?.length || 0" />

            <!-- Info Alert -->
            <div class="alert alert-info alert-dismissible fade show">
              <strong>Info!</strong> O '*'' indica os campos obrigatórios.
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>

            <div v-if="localMessage" :class="['alert', localMessageType === 'error' ? 'alert-danger' : localMessageType === 'success' ? 'alert-success' : 'alert-info', 'alert-dismissible']">
              <strong v-if="localMessageType === 'error'">Erro:</strong>
              <strong v-else-if="localMessageType === 'success'">Ok:</strong>
              <strong v-else>Info:</strong>
              <span class="ms-1">{{ localMessage }}</span>
              <button type="button" class="btn-close" @click="localMessage = ''" aria-label="Fechar"></button>
            </div>

          <!-- Nome -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="nome" class="col-form-label">*Nome</label>
            </div>
            <div class="col">
              <input type="text" class="form-control" id="nome" name="nome" v-model="pessoa.nome"
              placeholder="O nome da pessoa"/>
            </div>
          </div>

          <!-- Matricula -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="matricula" class="col-form-label">Matrícula</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="matricula" name="matricula" v-model="pessoa.matricula"
              placeholder="O número de matrícula na FEPAI" size="10" data-toggle="tooltip" data-placement="top" 
              title="O número de matrícula na FEPAI">
            </div>
          </div>

          <!-- CPF -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="cpf" class="col-form-label">CPF</label>
            </div>
            <div class="col-3">
              <input type="text" class="form-control" id="cpf" name="cpf" v-model="pessoa.cpf"
              placeholder="O número do CPF" data-toggle="tooltip" data-placement="top" 
              title="O número do CPF no formato 999.999.999-99">
            </div>
          </div>

          <!--Graduacao atual-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="graduacao_atual" class="col-form-label">*Graduação atual</label>
            </div>
            <div class="col-2">
              <div v-if="pendingGraduacoes">Carregando...</div>
              <select
                v-else
                id="graduacao_atual" name="graduacao_atual"
                v-model="pessoa.id_graduacao" class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in items" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!--Situacao-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="situacao" class="form-label">Situação</label>
            </div>
            <div class="col-2">
              <select id="situacao" name="situacao" v-model="pessoa.situacao" 
              class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in itemsSituacao" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Aniversario -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="aniversario" class="col-form-label">Aniversário</label>
            </div>
            <div class="col-1">
              <input type="text" class="form-control" id="aniversario" name="aniversario" v-model="pessoa.aniversario"
              placeholder="A data de aniversário(dd/mm)" aria-colcount="10" data-toggle="tooltip" data-placement="top" 
              title="A data de aniversário(dd/mm)">
            </div>
          </div>

          <!-- Data inicio -->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="data_inicio" class="col-form-label">Data de início</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="data_inicio" name="data_inicio" v-model="pessoa.data_inicio_aikido"
              placeholder="A data de início no aikidô" size="10" data-toggle="tooltip" data-placement="top" 
              title="A data de início no aikidô">
            </div>
          </div>

          <!--Data de matricula-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="data_inicio" class="col-form-label">Data de matrícula</label>
            </div>
            <div class="col-2">
              <input type="text" class="form-control" id="data_matricula" name="data_matricula" 
              v-model="pessoa.data_matricula"
              placeholder="A data de matrícula" size="10" data-toggle="tooltip" data-placement="top" 
              title="A data de início no aikidô">
            </div>
          </div>

          <!--Tipo-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="tipo" class="form-label">Tipo</label>
            </div>
            <div class="col-2">
              <select id="tipo" name="tipo" v-model="pessoa.tipo" 
              class="form-select">
                <option value="">Selecione...</option>
                <option v-for="item in itemsTipo" :key="item.value" 
                :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>

          <!--Dojo-->
          <div class="form-group row mb-3">
            <div class="col-2">
              <label for="dojo" class="col-form-label">Dojo</label>
            </div>
            <div class="col-4">
                  <div v-if="pendingDojos">Carregando...</div>
                  <select
                    v-else
                    id="dojo" name="dojo" v-model="pessoa.id_dojo"
                    class="form-select">
                    <option value="">Selecione...</option>
                    <option v-for="item in itemsDojos" :key="item.value" 
                    :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
            </div>
          </div>

          <div class="card w-75 mx-auto mb-5">
            <div class="card-header fw-bold">Promoções</div>
            <div class="card-body" id="promocoes">

            <button 
              type="button" 
              class="btn btn-primary mb-3" 
              @click="adicionarPromocao">
              <i class="bi bi-plus-circle"> Adiciona Promoção</i>
            </button>

              <div v-if="pessoa.promocoes && pessoa.promocoes.length > 0">
                <div v-for="(promocao, index) in pessoa.promocoes" 
                  :key="index" class="form-group row mb-3">
                  
                  <div class="col-1">
                    <label :for="`data_promocao_${index + 1}`" 
                    class="col-form-label">Data</label>
                  </div>
                  <div class="col-3">
                    <input 
                      :id="`data_promocao_${index + 1}`" 
                      :name="`data_promocao_${index + 1}`" 
                      type="text" 
                      class="form-control" 
                      :value="promocao.data_formatada"/>
                  </div>
                
                  <div class="col-2">
                    <label :for="`graduacao_promocao_${index + 1}`" 
                    class="col-form-label">Graduação</label>
                  </div>
                  <div class="col-3">
                    <select 
                      :id="`id_graduacao_promocao_${index + 1}`" 
                      :name="`id_graduacao_promocao_${index + 1}`" 
                      class="form-select" 
                      aria-label="Graduação" 
                      required
                      :value="promocao.id_graduacao"      >
                      <option value="" selected>Selecione</option>
                      <option v-for="item in items" :key="item.value" 
                            :value="item.value">
                              {{ item.label }}
                            </option>
                    </select>
                  </div>

                  <div class="col-2">
                    <button 
                      type="button" 
                      class="btn btn-danger btn-sm" 
                      @click="removerPromocao(index)"
                      title="Remover">
                      <i class="bi bi-trash">Exlui</i>
                    </button>
                  </div>

                </div>
              </div> 
            </div>
          </div>

          <div class="col-12">
            <button :disabled="isSaving" type="submit" class="btn btn-primary btn-sm mt-4 me-2">Gravar</button>
            <a id="botao_cancela" name="botao_cancela" class="btn btn-secondary btn-sm mt-4" href="/pessoas/lista_pessoas">Cancela</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

definePageMeta({
  middleware: ['authenticated']
})

const route = useRoute();
const query = route.query;
const id = (query.id as string) || '';

const title = id ? 'Edita Pessoa' : 'Nova Pessoa';

// Pessoa type
interface Pessoa {
  _id?: string
  nome: string
  matricula?: string
  aniversario?: string
  situacao?: string
  cpf?: string
  tipo?: string
  dojo?: string
  id_dojo?: string
  data_inicio_aikido?: string
  data_matricula?: string
  id_graduacao?: string
  graduacao?: string
  promocoes?: {
      data: Date,
      id_graduacao: string,
      data_formatada?: string,
      nome_graduacao?: string
  }[]
}

// Reactive pessoa object
const pessoa = reactive<Pessoa>({
  _id: '',
  nome: '',
  matricula: '',
  aniversario: '',
  situacao: '',
  cpf: '',
  tipo: '',
  dojo: '',
  id_dojo: '',
  data_inicio_aikido: '',
  data_matricula: '',
  id_graduacao: '',
  graduacao: '',
  promocoes: []
});

if (id) {
  const pessoaEndpoint = computed(() => `/api/pessoas/${id}`);
  const { data: pessoaData } = await useFetch<{ doc: any }>(pessoaEndpoint, 
    { 
      watch: [pessoaEndpoint] 
    });
    
  if (pessoaData.value?.doc) {
    Object.assign(pessoa, pessoaData.value.doc);
  }
}

// Busca as graduações para popular o select
const graduacoesEndpoint = '/api/graduacoes/todas';
const { data: dataGraduacoes, pending: pendingGraduacoes } = await useFetch<{ docs: any }>(graduacoesEndpoint);

const items = computed(() => {
  const docs = dataGraduacoes.value?.docs || [];
  return docs.map((grad: any) => ({ label: `${grad.nome} (${grad.categoria})`, value: grad._id }));
});

// Itens para o select de situação
const itemsSituacao = computed(() => [
  { label: 'Ativo', value: 'Ativo' },
  { label: 'Inativo', value: 'Inativo' }
]);

// Itens para o select de tipo
const itemsTipo = computed(() => [
  { label: 'Aluno', value: 'aluno' },
  { label: 'Professor', value: 'professor' }
]);

// Busca os dojos para popular o select
const dojosEndpoint = '/api/dojos/todos';
const { data: dataDojos, pending: pendingDojos } = await useFetch<{ docs: any }>(dojosEndpoint);

const itemsDojos = computed(() => {
  const docs = dataDojos.value?.docs || [];
  return docs.map((dojo: any) => ({ label: `${dojo.nome}`, value: dojo._id }));
});

// Mensagem composable
const { setMensagem } = useMensagem();

const isSaving = ref(false);

// Local reactive alert state (replaces manual DOM toggling)
const localMessage = ref('');
const localMessageType = ref<'success' | 'error' | 'info'>('info');

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'info') {
  localMessage.value = text;
  localMessageType.value = type;
  // keep existing global composable for consistency
  setMensagem(text, type === 'error' ? 'error' : 'success');
}

function isValidCPF(cpf = '') {
  if (!cpf) return true;
  const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return re.test(cpf);
}

function isValidDateDDMM(s = '') {
  if (!s) return true;
  const re = /^\d{2}\/\d{2}$/;
  return re.test(s);
}

// Função para gravar a pessoa
async function grava() {
  if (!pessoa.nome || pessoa.nome.trimStart() === '') {
    showMessage('Preencha o campo obrigatório: nome.', 'error');
    return;
  }

  if (!pessoa.id_graduacao || pessoa.id_graduacao === '') {
    showMessage('Preencha o campo obrigatório: graduação.', 'error');
    return;
  }

  if (!isValidCPF(pessoa.cpf || '')) {
    showMessage('CPF inválido. Utilize o formato 999.999.999-99', 'error');
    return;
  }

  if (!isValidDateDDMM(pessoa.aniversario || '') 
    || !isValidDateDDMM(pessoa.data_inicio_aikido || '') 
    || !isValidDateDDMM(pessoa.data_matricula || '')) {
    showMessage('Datas devem estar no formato dd/mm ou ficar em branco.', 'error');
    return;
  }

  const endpoint = pessoa._id ? `/api/pessoas/${pessoa._id}` : '/api/pessoas';
  const method = pessoa._id ? 'PUT' : 'POST';

  try {
    isSaving.value = true;
    await $fetch(endpoint, {
      method,
      body: pessoa
    });

    showMessage('Pessoa gravada com sucesso!', 'success');
    await navigateTo('/pessoas/lista_pessoas', { replace: true });
  } catch (err: any) {
    console.error(err);
    showMessage(err?.data?.message || 'Erro ao gravar pessoa', 'error');
  } finally {
    isSaving.value = false;
  }
}

// Função para adicionar nova promoção
const adicionarPromocao = () => {
  // Inicializa o array se não existir
  if (!pessoa.promocoes) {
    pessoa.promocoes = []
  }
  
  pessoa.promocoes.push({
    data: new Date(),
    data_formatada: '',
    id_graduacao: ''
  })
}

// Função para remover promoção
const removerPromocao = (index: number) => {
  pessoa?.promocoes?.splice(index, 1)
}
</script>
