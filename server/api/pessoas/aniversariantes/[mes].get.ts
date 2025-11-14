import { tokenManager } from '../../../utils/tokenManager';

import { getAniversariantes, RespostaPessoas } from '../pessoas.service';

export default defineEventHandler(async (event): Promise<RespostaPessoas> => {
    const mes = getRouterParam(event, 'mes') ?? '';

    try {
        const dados = await getAniversariantes(mes);

        return dados;
    } catch (error: any) {
        // Se receber 401, invalida o token e tenta novamente
        if (error?.statusCode === 401) {
        tokenManager.invalidateToken();
        
        try {
            const dados = await getAniversariantes(mes);

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
