import { tokenManager } from '../../utils/tokenManager';

export type RespostaDojos = {
  sucesso: boolean;
  doc?: Dojo;
  docs?: Dojo[];
  mensagem?: string;
  erro?: string;
};

type Dojo = {
  _id: string;
  nome: string;
}


export async function getDojos(): Promise<RespostaDojos> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaDojos>(`${apiUrl}/api/dojos/lista/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}

export async function getDojoById(id: string): Promise<RespostaDojos> {
  const apiUrl = process.env.API_URL || 'https://fettermannaikidoapi.vercel.app/';

  const token = await tokenManager.getToken();
  
  return await $fetch<RespostaDojos>(`${apiUrl}/api/dojos/busca/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
}   