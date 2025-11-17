export default interface IPessoa {
  id?: string
  nome: string
  matricula?: string
  aniversario?: string
  situacao?: string
  cpf?: string
  tipo?: string
  dojo?: {
    _id: string,
    nome: string
  }
  data_inicio_aikido?: string
  data_matricula?: string
  graduacao: {
    _id: string,
    nome: string,
    faixa: string,
    sequencia: number

  }
  promocoes?: {
      data: string,
      id_graduacao: string,
  }[]
}
