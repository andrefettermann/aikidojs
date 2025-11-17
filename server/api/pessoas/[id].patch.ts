import { tokenManager } from '../../utils/tokenManager';
import { patchPessoa, RespostaPessoas } from './pessoas.service';

export default defineEventHandler(async (event): Promise<RespostaPessoas> => {
    const id = getRouterParam(event, 'id') ?? '';

    try {
        const dados = await patchPessoa(event, id);
        return dados;
    } catch (error: any) {
        // Se receber 401, invalida o token e tenta novamente
        if (error?.statusCode === 401) {
            tokenManager.invalidateToken();
        
            try {
                const dados = await patchPessoa(event, id);
                return dados;
            } catch (retryError: any) {
                throw createError({
                    statusCode: 500,
                    message: 'Erro ao buscar dados após renovação do token'
                });
            }
        }

        throw createError({
            statusCode: error?.statusCode || 500,
            message: error?.message || 'Erro ao gravar dados'
        });
    }
});
