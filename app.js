// Classe Despesa para armazenar os dados da despesa
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		// Inicializa os atributos da despesa
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	// Método para validar se todos os dados foram preenchidos corretamente
	validarDados() {
		// Itera sobre cada atributo da instância da classe
		for(let i in this) {
			// Se algum atributo for undefined, vazio ou null, retorna falso
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

// Classe Bd (Banco de Dados) para manipular o localStorage
class Bd {

	constructor() {
		// Verifica se já existe o id no localStorage, caso contrário inicializa com 0
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	// Método para obter o próximo id disponível no localStorage
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	// Método para gravar uma despesa no localStorage
	gravar(d) {
		let id = this.getProximoId()

		// Armazena a despesa com o próximo id como chave
		localStorage.setItem(id, JSON.stringify(d))

		// Atualiza o id no localStorage
		localStorage.setItem('id', id)
	}

	// Método para recuperar todas as despesas cadastradas
	recuperarTodosRegistros() {

		// Array para armazenar as despesas recuperadas
		let despesas = Array()

		let id = localStorage.getItem('id')

		// Itera sobre todos os ids de despesas armazenadas no localStorage
		for(let i = 1; i <= id; i++) {

			// Recupera a despesa do localStorage e converte de volta para objeto
			let despesa = JSON.parse(localStorage.getItem(i))

			// Pula se a despesa não existir (foi removida ou nunca existiu)
			if(despesa === null) {
				continue
			}
			despesa.id = i // Adiciona o id à despesa
			despesas.push(despesa) // Adiciona ao array de despesas
		}

		return despesas // Retorna o array de todas as despesas recuperadas
	}

	// Método para pesquisar despesas com base em filtros
	pesquisar(despesa){

		// Array para armazenar as despesas filtradas
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros() // Recupera todas as despesas

		// Aplica os filtros conforme os dados da despesa fornecida
		if(despesa.ano != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		if(despesa.mes != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		if(despesa.dia != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		// Retorna as despesas filtradas
		return despesasFiltradas

	}

	// Método para remover uma despesa com base no id
	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd() // Instancia a classe Bd


// Função para cadastrar uma nova despesa
function cadastrarDespesa() {

	// Coleta os dados do formulário
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	// Cria uma nova instância de Despesa com os valores do formulário
	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)

	// Valida se todos os dados foram preenchidos corretamente
	if(despesa.validarDados()) {
		bd.gravar(despesa) // Grava a despesa no localStorage

		// Exibe um modal de sucesso
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		$('#modalRegistraDespesa').modal('show') // Exibe o modal

		// Limpa os campos do formulário
		ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
		
	} else {
		// Exibe um modal de erro
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		$('#modalRegistraDespesa').modal('show') // Exibe o modal
	}
}

// Função para carregar a lista de despesas no DOM
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() // Se não houver despesas ou filtro, recupera todas
	}

	let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = '' // Limpa a lista atual
	despesas.forEach(function(d){

		// Cria uma nova linha na tabela para cada despesa
		var linha = listaDespesas.insertRow();

		// Preenche as colunas com os dados da despesa
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		// Ajusta o valor do tipo de despesa
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		// Cria o botão de exclusão
		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fa fa-times"  ></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			let id = this.id.replace('id_despesa_','') // Obtém o id da despesa a ser removida
			bd.remover(id) // Remove a despesa
			window.location.reload() // Recarrega a página
		}
		linha.insertCell(4).append(btn) // Adiciona o botão à linha
	})

 }

// Função para pesquisar despesas com base nos filtros do formulário
function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	// Cria uma nova instância de Despesa com os filtros preenchidos
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	// Pesquisa as despesas que correspondem aos filtros
	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true) // Carrega a lista filtrada

}
