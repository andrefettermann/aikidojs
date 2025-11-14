import { tokenManager } from '../../utils/tokenManager';

export type RespostaGraduacoes = {
  sucesso: boolean;
  doc?: Graduacao;
  docs?: Graduacao[];
  mensagem?: string;
  erro?: string;
};

type Graduacao = {
  nome: string;
}


export async function getGraduacoes(): Promise<RespostaGraduacoes> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaGraduacoes>(`${apiUrl}/api/graduacoes/lista/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

export async function getGraduacaoById(id: string): Promise<RespostaGraduacoes> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaGraduacoes>(`${apiUrl}/api/graduacoes/busca/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}   