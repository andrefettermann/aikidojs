<template>
  <div class="container pt-3 w-100">
    
    <div class="mb-2">
        <nuxt-link 
          id="edita_pessoa" 
          name="edita_pessoa" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/edita_pessoa?id=${id}`">
          Edita
        </nuxt-link>
        
        <nuxt-link 
          id="cancela_edicao" 
          name="cancela_edicao" 
          class="btn btn-primary btn-sm m-1" 
          :to="`/pessoas/lista_pessoas`">
          Cancela
        </nuxt-link>

    </div>

    <div class="card">
      <div class="card-header fw-bold">
        <span>{{ pessoa.nome }}</span>
      </div>
      <div class="card-body">
          <div class="row">
              <div class="col">

                
                <div v-if="pending" class="loading">
                  Carregando dados...
                </div>

                <div v-else-if="error" class="error">
                  Erro ao carregar dados: {{ error.message }}
                  <button @click="() => refresh()" class="btn">Tentar novamente</button>
                </div>

                <div v-else-if="data" class="col">
                  <p><strong>Matrícula:</strong> {{ pessoa.matricula }}</p>
                  <p><strong>Aniversário:</strong> {{ pessoa.aniversario }}</p>
                  <p><strong>CPF:</strong> {{ pessoa.cpf }}</p>
                  <p><strong>Situação:</strong> {{ pessoa.situacao }}</p>
                  <p><strong>Dojo:</strong> {{ pessoa.dojo }}</p>
                  <p><strong>Graduação:</strong> {{ pessoa.graduacao }}</p>
                  <p><strong>Tipo:</strong> {{ pessoa.tipo }}</p>

                  <div class="card mb-3 mt-4">
                    <div class="card-header fw-bold">Promoções</div>
                      <div class="card-body">
                        <ul id="lista" class="list-group mb-2">
                          <li v-for="promocao in pessoa.promocoes" :key="promocao.id" class="list-group-item">
                            {{ promocao.data }} - {{ promocao.nome_graduacao }}
                          </li>
                      </ul>
                    </div>
                  </div>

                </div>

                
              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated']
})

const route = useRoute();
const query = route.query;
const id = query.id as string;

// Computed para determinar qual endpoint usar baseado nos query params
const endpoint = computed(() => {
    return `/api/pessoas/${id}`;
});

// Busca os dados através da API route do servidor
// O watch: ['endpoint'] faz o refetch automático quando a rota mudar
const { data, pending, error, refresh } = await useFetch<{ doc: any }>(endpoint, {
  watch: [endpoint]
})

const pessoa =  {
    nome: data.value?.doc.nome,
    matricula: data.value?.doc?.matricula || 'N/A',
    aniversario: data.value?.doc?.aniversario || 'N/A',
    situacao: data.value?.doc?.situacao,
    cpf: data.value?.doc?.cpf || 'N/A',
    tipo: data.value?.doc?.tipo.charAt(0).toUpperCase() 
                                + data.value?.doc?.tipo.slice(1),
    dojo: data.value?.doc?.dojo?.nome || 'N/A',
    graduacao: data.value?.doc?.graduacao?.nome || 'N/A',
    promocoes: data.value?.doc?.promocoes || []
};

</script>
