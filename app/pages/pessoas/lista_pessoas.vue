<template>
  <div class="container pt-3 w-100">

    
    
    <div class="mb-2">
        <nuxt-link id="botao_nova_pessoa" name="botao_nova_pessoa" 
            class="btn btn-primary btn-sm m-1" href="/pessoas/edita_pessoa">
                Nova pessoa
        </nuxt-link>

        <nuxt-link 
          id="botao_todas" 
          name="botao_todas" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas`">
          Todos
        </nuxt-link>
        
        <nuxt-link 
          id="botao_ativas" 
          name="botao_ativas" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas?situacao=Ativo`">
          Em atividade
        </nuxt-link>

        <nuxt-link 
          id="botao_inativas" 
          name="botao_inativas" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas?situacao=Inativo`">
          Inativos
        </nuxt-link>

        <nuxt-link 
          id="botao_aniversariantes" 
          name="botao_aniversariantes" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas?mes=${mesCorrente}`">
          Aniversariantes do mês
        </nuxt-link>

        <nuxt-link 
          id="botao_professores" 
          name="botao_professores" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas?tipo=Professor`">
          Professores
        </nuxt-link>

    </div>

    <input 
      class="form-control mt-2 mb-2" 
      id="myInput" 
      type="text" 
      placeholder="Filtrar.."
      v-model="filtro">

    <div class="card">
      <div class="card-header fw-bold">
        <span v-if="tituloFiltro"> {{ tituloFiltro }}:</span>
        {{ pessoasFiltradas.length }} registro(s) encontrado(s)
      </div>
      <div class="card-body">
          <div class="row">
              <div class="col">

                <!-- Exibe a mensagem -->
                <div v-if="mensagem" 
                    :class="`alert alert-${tipo} alert-dismissible fade show`" 
                    role="alert">
                  {{ mensagem }}
                  <button type="button" class="btn-close" @click="limparMensagem"></button>
                </div>

                <div v-if="pending" class="loading">
                  Carregando dados...
                </div>

                <div v-else-if="error" class="error">
                  Erro ao carregar dados: {{ error.message }}
                  <button @click="() => refresh()" class="btn">Tentar novamente</button>
                </div>

                <div v-else-if="data" class="col">
                  <!--
                  <pre>{{ data }}</pre>
                  -->
                  <ul id="lista" class="list-group mb-2">
                    <li v-for="pessoa in pessoasFiltradas" :key="pessoa.id" class="list-group-item">
                      <h5>{{ pessoa.nome }}</h5>
                      <p class="fs-6 text-secondary">
                        {{ pessoa.matricula?pessoa.matricula:'N/A' }} | 
                        {{ pessoa.graduacao?.nome }}
                        | {{ pessoa.situacao }} | {{ pessoa.aniversario }} | 
                        {{ pessoa.dojo?.nome?pessoa.dojo?.nome:'N/A' }}
                      </p>
                      <div>
                          Ações: 
                          <nuxt-link 
                            id="bota_detalhes_pessoa" 
                            name="botao_detalhes_pessoa" 
                            class="btn btn-primary btn-sm m-1" 
                            :to="`/pessoas/detalhes_pessoa?id=${pessoa.id}`">
                            Detalhes
                          </nuxt-link>

                          <nuxt-link 
                            id="bota_editar_pessoa" 
                            name="botao_editar_pessoa" 
                            class="btn btn-primary btn-sm m-1" 
                            :to="`/pessoas/edita_pessoa?id=${pessoa.id}`">
                            Edita
                          </nuxt-link>
                      </div>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type IPessoa from '~~/shared/types/IPessoa';


// Verifica se esta logado
definePageMeta({
  middleware: ['authenticated']
})

//const { user, session, clear: clearSession } = useUserSession();

const { mensagem, tipo, limparMensagem } = useMensagem();

// Auto-remove a mensagem após 5 segundos
/*
if (mensagem.value) {
  setTimeout(() => {
    limparMensagem();
  }, 5000);
}
*/

// Acessa os parâmetros da rota
const route = useRoute();
const mesCorrente = new Date().getMonth() + 1;

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
  const query = route.query;
  
  if (query.situacao) {
    return `/api/pessoas/situacao/${query.situacao}`;
  }
  if (query.mes) {
    return `/api/pessoas/aniversariantes/${query.mes}`;
  }
  if (query.tipo === 'Professor') {
    return `/api/pessoas/professores`;
  }
  if (query.id) {
    return `/api/pessoas/id/${query.id}`;
  }
  
  // Endpoint padrão (todas as pessoas)
  return '/api/pessoas/todas';
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = await useFetch<{ docs: any }>(endpoint, {
  watch: [endpoint]
})

// Computed para o título do filtro aplicado
const tituloFiltro = computed(() => {
  const query = route.query;
  
  if (query.situacao === 'Ativo') return 'Em atividade';
  if (query.situacao === 'Inativo') return 'Inativos';
  if (query.mes) return 'Aniversariantes do mês';
  if (query.tipo === 'Professor') return 'Professores';
  
  return 'Todas as pessoas';
});

// Variável reativa para o filtro
const filtro = ref('');

// Computed property que filtra as pessoas baseado no texto digitado
const pessoasFiltradas = computed(() => {
  if (!data.value?.docs) return [];
  
  if (!filtro.value) return data.value.docs;
  
  const valorFiltro = filtro.value.toLowerCase();
  
  return data.value.docs.filter((pessoa: any) => {
    const textoCompleto = [
      pessoa.nome,
      pessoa.matricula,
      pessoa.graduacao?.nome,
      pessoa.situacao,
      pessoa.aniversario,
      pessoa.dojo?.nome
    ].join(' ').toLowerCase();
    
    return textoCompleto.includes(valorFiltro);
  });
});
</script>
