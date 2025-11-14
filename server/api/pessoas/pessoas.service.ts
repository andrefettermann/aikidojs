import { tokenManager } from '../../utils/tokenManager';
import { getGraduacaoById } from '../graduacoes/graduacoes.service';

export type RespostaPessoas = {
  sucesso: boolean;
  doc?: Pessoa;
  docs?: Pessoa[];
  mensagem?: string;
  erro?: string;
};

type Dojo = {
  nome: string;
}

type Graduacao = {
  nome: string;
}

type Pessoa = {
  // Defina os campos esperados do objeto pessoa aqui
  id: string;
  nome: string;
  situacao: string;
  graduacao: Graduacao;
  dojo: Dojo[];
  matricula: string;
  aniversario: string;
  data_inicio_aikido: string;
  data_matricula: string;
  promocoes?: Array<{
    data: string;
    data_formatada?: string;
    nome_graduacao?: string;
    id_graduacao: string;
  }>;
  cpf: string;
  tipo: string;
  // ... outros campos
  // Adicione outros campos conforme necessário
};

export async function getPessoas(): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/lista/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

export async function getBySituacao(situacao: string): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/lista/situacao/${situacao}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

export async function getProfessores(): Promise<RespostaPessoas> {
    const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';
    const token = await tokenManager.getToken();
    
    return await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/lista/professores`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function getAniversariantes(mes: string): Promise<RespostaPessoas> {
    const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';
    const token = await tokenManager.getToken();
    
    return await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/lista/aniversariantes/${mes}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export async function getPessoaById(id: string): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();

  const pessoa: RespostaPessoas = await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/busca/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(async response => {
      // Se a pessoa tiver promoções, buscar os nomes das graduações
      if (response.doc && response.doc.promocoes && response.doc.promocoes.length > 0) {
        const promocoesComNomes = await Promise.all(response.doc.promocoes.map(async promocao => {
          const graduacaoResponse = await getGraduacaoById(promocao.id_graduacao);
          return {
            ...promocao,
            nome_graduacao: graduacaoResponse.doc ? graduacaoResponse.doc.nome : 'Desconhecido',
          };
        }));
        response.doc.promocoes = promocoesComNomes;
      }
      return response;
    }
  );

  return pessoa;
}   