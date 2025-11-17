
import IPessoa from '~~/shared/types/IPessoa';
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
  _id?: string,
  nome: string;
}

type Graduacao = {
  _id?: string,
  nome: string;
}

type Pessoa = {
  id: string;
  aniversario: string;
  cpf: string;
  matricula: string;
  nome: string;
  situacao: string;
  dojo?: Dojo;
  graduacao: Graduacao;
  data_inicio_aikido: string;
  data_matricula: string;
  promocoes?: Array<{
    data: string;
    id_graduacao: string;
  }>;
  
  tipo: string;
};

function formataData(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // meses vão de 0 a 11
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export async function getPessoas(): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  const response = await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/lista/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

  return response;
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

  const resposta = await $fetch<RespostaPessoas>(`${apiUrl}/api/pessoas/busca/${id}`, {
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
            data: formataData(new Date(promocao.data)),
            nome_graduacao: graduacaoResponse.doc ? graduacaoResponse.doc.nome : 'Desconhecido',
          };
        }));
        response.doc.promocoes = promocoesComNomes;
      }
      return response;
    }
  );
  return resposta;
}   

interface IDoc {
  _id?: string,
  nome: string,
  matricula: string,
  aniversario: string,
  situacao: string,
  cpf: string,
  tipo: string,
  id_dojo: string,
  id_graduacao: string,
  data_inicio_aikido: string,
  data_matricula: string,
  promocoes: []
}

export async function postPessoa(event: any): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();

  const endpoint = `${apiUrl}/api/pessoas/inclui`;

  const body = await readBody(event);

  const doc: IDoc = {
    aniversario: body.aniversario,
    cpf: body.cpf,
    data_inicio_aikido: body.data_inicio_aikido,
    data_matricula: body.data_matricula,
    id_dojo: body.dojo._id,
    id_graduacao: body.graduacao._id,
    matricula: body.matricula,
    nome: body.nome,
    situacao: body.situacao,
    tipo: body.tipo,
    promocoes: body.promocoes
  };
  

  const response = await $fetch<RespostaPessoas>(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: doc
    }).catch(error => {
      throw error;
    }
  );

  return response;
} 

export async function patchPessoa(event: any, id?: string): Promise<RespostaPessoas> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();

  const endpoint = `${apiUrl}/api/pessoas/altera/${id}`;

  const body = await readBody(event);

  const doc: IDoc = {
    _id: id,
    aniversario: body.aniversario,
    cpf: body.cpf,
    data_inicio_aikido: body.data_inicio_aikido,
    data_matricula: body.data_matricula,
    id_dojo: body.dojo._id,
    id_graduacao: body.graduacao._id,
    matricula: body.matricula,
    nome: body.nome,
    situacao: body.situacao,
    tipo: body.tipo,
    promocoes: body.promocoes
  };

  return await $fetch<RespostaPessoas>(endpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: doc
    });
} 