    <!-- layouts/default.vue -->
    <template>
      <div class="container">
        <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
            <a href="/pessoas" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"> 
                <!--
                <svg class="bi me-2" width="40" height="32" aria-hidden="true"><use xlink:href="#bootstrap"></use></svg> 
                -->
                <img src="/images/logo.png" width="42" height="50"/>
                <span class="fs-4">E.M.A. - Escola Meirelles de Aikidô</span>
            </a> 
            <nav class="navbar navbar-expand-lg" v-if="user">
                <div class="container-fluid">
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto"> 
                            <li class="nav-item">
                                <a id="menu-dojos" name="menu-dojos" href="/dojos" 
                                class="nav-link " 
                                aria-current="page">Dojos</a>
                            </li> 
                            
                            <li class="nav-item">
                                <a id="menu-pessoas" name="menu-pessoas" 
                                class="nav-link" 
                                href="/pessoas/lista_pessoas">Pessoas</a>
                            </li> 

                            <li class="nav-item">
                                <a id="menu-graduacoes" name="menu-graduacoes" 
                                href="/graduacoes" class="nav-link">Graduações</a>
                            </li>

                            <li class="nav-item dropdown">
                                <a id="menu-financeiro" name="menu-financeiro" 
                                class="nav-link dropdown-toggle" href="#" 
                                role="button" data-bs-toggle="dropdown" 
                                aria-expanded="false">
                                        Financeiro
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a id="menu-taxas" name="menu-taxas" href="/taxas" 
                                        class="nav-link" aria-current="page">Taxas</a></li>
                                    <li><a id="menu-cobrancas" name="menu-cobrancas" href="/cobrancas" 
                                        class="nav-link" aria-current="page">Cobranças</a></li>
                                </ul>
                            </li>

                            <li class="nav-item"><a id="menu-sair" name="menu-sair" 
                                @click="logout" class="nav-link">Sair</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
        <slot /> <!-- This is where your page content will be injected -->
        
        
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"> 
            <div class="col-md-4 d-flex align-items-center"> 
                <span class="mb-3 mb-md-0 text-body-secondary">v. 2025.01 - AikidoJS (nuxt) </span>
            </div> 
            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex"></ul> 
        </footer>
        
        
      </div>
    </template>

    <script setup lang="ts">
        const { user, clear: clearSession } = useUserSession()

        async function logout () {
            await clearSession()
            await navigateTo('/login')
        }
    </script>