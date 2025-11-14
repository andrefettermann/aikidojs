import { get } from 'http';
import { tokenManager } from '../../utils/tokenManager';

import { getProfessores, RespostaPessoas } from './pessoas.service';

export default defineEventHandler(async (event): Promise<RespostaPessoas> => {
    try {
        const dados = await getProfessores();

        return dados;
    } catch (error: any) {
        // Se receber 401, invalida o token e tenta novamente
        if (error?.statusCode === 401) {
        tokenManager.invalidateToken();
        
        try {
            const dados = await getProfessores();

            return dados;
        } catch (retryError) {
            throw createError({
            statusCode: 500,
            message: 'Erro ao buscar dados após renovação do token'
            });
        }
        }

        throw createError({
        statusCode: error?.statusCode || 500,
        message: error?.message || 'Erro ao buscar dados'
        });
    }
});
