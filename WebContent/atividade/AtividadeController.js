var myControllers = angular.module('AtividadeControllers',[]);

myControllers.controller('ListarAtividadeController', function($scope,$http) {
	$scope.Titulo = "Atividades";
	$scope.BuscarInformacao = function() {
		$http.get('http://localhost:8080/CRM/rest/restAtividade/listarTodos')
		.success(function(data) {
			$scope.atividadelist = data["atividade"];
			$scope.Quantidade = $scope.atividadelist.length+' Atividades Encontradas!' ;
		});
	};
	$scope.BuscarInformacao();

	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
});
myControllers.controller('GetAtividadeController', function($scope, $rootScope, $routeParams,$http, Upload, $timeout, $filter, $location) {
	//$scope.Titulo = "Atividade: "+ atividade.nome;

	$scope.Titulo = 'Editar Atividade';
	var atividade =  new Object();

	if($routeParams.atividadeId){
		$http.get('http://localhost:8080/CRM/rest/restAtividade/Editar/'+$routeParams.atividadeId)
		.success(function(data) {
			$scope.atividade = data;
			atividade = $scope.atividade
			$scope.Titulo = "Atividade: "+ atividade.nome;

			//validação de array de comunicadores
			if($scope.atividade.comunicadores_atividade){//caso o array existe
					if($scope.atividade.comunicadores_atividade.constructor == Array){//caso seja um array de objetos
						$scope.listComunicadores = $scope.atividade.comunicadores_atividade;
					}else{//caso seja um objeto apenas
						$scope.listComunicadores = [];
						var comunicador = $scope.atividade.comunicadores_atividade;
		 				$scope.listComunicadores.push(comunicador);
					}
			}else{//caso nao exista
				$scope.listComunicadores = [];
			}

			//Listar tipos de comunicadores
			$http.get('http://localhost:8080/CRM/rest/restTipoComunicador/listarTodos')
			.success(function(data) {
			 $scope.tiposcomunicador = data["tipoComunicador"];
			});


			//validação de array de ligações
			if($scope.atividade.ligacoes){//caso o array existe
					if($scope.atividade.ligacoes.constructor == Array){//caso seja um array de objetos
						$scope.listLigacoes = $scope.atividade.ligacoes;
					}else{//caso seja um objeto apenas
						$scope.listLigacoes = [];
						var ligacao = $scope.atividade.ligacoes;
		 				$scope.listLigacoes.push(ligacao);
					}
			}else{//caso nao exista
				$scope.listLigacoes = [];
			}

			//Listar ligações
			$http.get('http://localhost:8080/CRM/rest/restLigacao/listarTodos')
			.success(function(data) {
				$scope.ligacaolist = data["ligacao"];
			});



			$scope.EnviarInformacao = function() {

				//limpando ids de novos cadastros de comunicadores
				for(var i=0; i <  Object.keys($scope.listComunicadores).length; i ++){
					var x = $scope.listComunicadores[i].id;
					var y = "#";
					if(x.indexOf(y) !== -1){
						$scope.listComunicadores[i].id = null;
					}
				}

				$scope.atividade.comunicadores_atividade = $scope.listComunicadores;


				//limpando ids de novos cadastros de ligações
				for(var i=0; i <  Object.keys($scope.listLigacoes).length; i ++){
					var x = $scope.listLigacoes[i].id;
					var y = "#";
					if(x.indexOf(y) !== -1){
						$scope.listLigacoes[i].id = null;
					}
				}

				$scope.atividade.ligacoes = $scope.listLigacoes;

				var parameter = JSON.stringify({

					type : "atividade",
					id : $scope.atividade.id,
					usuarioresponsavel : $scope.atividade.usuarioresponsavel,
					empresa : $scope.atividade.empresa,
					contato : $scope.atividade.contato,
					tipoatividade : $scope.atividade.tipoatividade,

					nome : $scope.atividade.nome,
					datacadastro : $scope.atividade.datacadastro,
					datainicio : $scope.atividade.datainicio,
					datafim : $scope.atividade.datafim,
					descricao : $scope.atividade.descricao,
					situacao: $scope.atividade.situacao,

					comunicadores_atividade : $scope.atividade.comunicadores_atividade,
					ligacoes : $scope.atividade.ligacoes

				});
				var config = {
					headers : {
						'Content-Type' : 'application/json;charset=utf-8;'
					}
				}

				$http.post(
						'http://localhost:8080/CRM/rest/restAtividade/Salvar',
						parameter, config).success(
						function(data, status, headers, config) {

							alert("Atividade: "+ $scope.atividade.nome +". Salva Com Sucesso!");

							$location.path("/Atividade");


						}).error(
						function(data, status, header, config) {
							$scope.Resposta = "Data: " + data + "<hr />status: "
									+ status + "<hr />headers: " + header
									+ "<hr />config: " + config;
						});
			   };

				 //Genrenciar comunicadores
				 $scope.addComunicador = function(){

					if(validarCamposComunicador()){
						if($scope.comunicador.id == null){
									autoincrementComunicador();
									$scope.listComunicadores.push({
											id: $scope.comunicador.id ,
										nome:$scope.comunicador.nome,
										resumo:$scope.comunicador.resumo,
										tipocomunicador:$scope.comunicador.tipocomunicador
										});
									$scope.comunicador = { "id": null,"nome": '',"resumo":'',"tipocomunicador":''};

								}else{
										var index = getSelectedIndexComunicador($scope.comunicador.id);
										$scope.listComunicadores[index].tipocomunicador = $scope.comunicador.tipocomunicador;
										$scope.listComunicadores[index].nome = $scope.comunicador.nome;
										$scope.listComunicadores[index].resumo = $scope.comunicador.resumo;
									$scope.comunicador = {
												"id": null,
												"nome": '',
												"resumo": '',
												"tipocomunicador":''
									};
								}
					}
				 }
				 $scope.selectEditComunicador = function(id){
							var SelComunicador = getSelectedComunicador(id);
							$scope.comunicador = {
									"id": SelComunicador.id,
									"nome": SelComunicador.nome,
									"resumo": SelComunicador.resumo,
									"tipocomunicador":SelComunicador.tipocomunicador
							};
				 };
				 $scope.delComunicador = function(id){
					var result = confirm('Tem certeza?');
						if (result === true){
							for(var j = 0; j < $scope.listComunicadores.length;j ++){
									if($scope.listComunicadores[j].id == id){
										$scope.listComunicadores.splice(j, 1);
									}
								}
						}
				 };
				 function getSelectedIndexComunicador(id){
					for(var i=0; i <  Object.keys($scope.listComunicadores).length; i ++)
						if($scope.listComunicadores[i].id == id)
							return i;
					return 1;

				 }
				 function autoincrementComunicador(){
					if($scope.listComunicadores){
							$scope.comunicador.id = "#"+Object.keys($scope.listComunicadores).length;
					}else{
							$scope.comunicador.id = "#"+1;
					}

				 }
				 function validarComunicador(){
							var i;
							if($scope.comunicador){
							if(! $scope.comunicador.nome ){
								alert("O campo nome de interações está vázio, favor preencher o campo.");
							i = false;

						}else if(! $scope.comunicador.resumo){
							alert("O campo resumo de interações está vázio, favor preencher o campo.");
						}else if(! $scope.comunicador.tipocomunicador){
							alert("Selecione um tipo de interações para continuar.");
						}else{
							i = true
						}
					}else{
						alert("Favor preencher os campos Nome, Tipo de Interação e Resumo");
							i = false;
						}
							return i;
				 }
				 function getSelectedComunicador(id){
					for(var i=0; i <  Object.keys($scope.listComunicadores).length; i ++)
						if($scope.listComunicadores[i].id == id)
							return $scope.listComunicadores[i];
					return 1;
				 }
				 function getSelectedIndexComunicador(id){
						for(var i=0; i <  Object.keys($scope.listComunicadores).length; i ++)
							if($scope.listComunicadores[i].id == id)
								return i;
						return 1;
				 }
				 function validarCamposComunicador(){
							var i;
							if($scope.comunicador){
							if(! $scope.comunicador.nome ){
								alert("O campo nome de interações está vázio, favor preencher o campo.");
							i = false;

						}else if(! $scope.comunicador.resumo){
							alert("O campo resumo de interações está vázio, favor preencher o campo.");
						}else if(! $scope.comunicador.tipocomunicador){
							alert("Selecione um tipo de interações para continuar.");
						}else{
							i = true
						}
					}else{
						alert("Favor preencher os campos Nome, Tipo de Interação e Resumo");
							i = false;
						}
							return i;
				 }

				 $http.get('http://localhost:8080/CRM/rest/restCollections/situacao')
					.success(function(data) {
						$scope.situacoes = data["situacao"];
					});
					$http.get('http://localhost:8080/CRM/rest/restContato/listarTodos')
					.success(function(data) {
						$scope.contatos = data["contato"];
					});
					$http.get('http://localhost:8080/CRM/rest/restEmpresa/listarTodos')
					.success(function(data) {
						$scope.empresas = data["empresa"];
					});
//					$http.get('http://localhost:8080/CRM/rest/restUsuario/listarTodos')
//					.success(function(data) {
//						$scope.usuarios = data["usuario"];
//					});
					$http.get('http://localhost:8080/CRM/rest/restTipoAtividade/listarTodos')
					.success(function(data) {

						$scope.tiposatividade = data["tipoAtividade"];
					});
					$http.get('http://localhost:8080/CRM/rest/restCollections/tipoligacao')
					.success(function(data) {
						$scope.tiposligacao = data["tipoLigacao"];
					});
					$http.get('http://localhost:8080/CRM/rest/restTelefone/listarTodos')
					.success(function(data) {
						$scope.telefones = data["telefone"];
					});
					$http.get('http://localhost:8080/CRM/rest/restTipoTelefone/listarTodos')
						.success(function(data) {
							$scope.tipostelefone = data["tipoTelefone"];
					});


				 //Genrenciar ligações
				 $scope.addLigacao = function(){

					if(validarCamposLigacao()){
						if($scope.ligacao.id == null){
									autoincrementLigacao();
									$scope.listLigacoes.push({
											id: $scope.ligacao.id ,
											telefone:$scope.ligacao.telefone,
											tipoligacao:$scope.ligacao.tipoligacao,
											duracao:$scope.ligacao.duracao,
											datacadastro:$scope.ligacao.datacadastro,
											resumo:$scope.ligacao.resumo,

										});
									$scope.ligacao = { "id": null,"telefone": '',"tipotelefone":'',"duracao":'',"data":'',"resumo":''};

								}else{
										var index = getSelectedIndexLigacao($scope.ligacao.id);
										$scope.listLigacoes[index].telefone = $scope.ligacao.telefone;
										$scope.listLigacoes[index].nome = $scope.comunicador.nome;
										$scope.listLigacoes[index].tipotelefone = $scope.ligacao.tipotelefone;
										$scope.listLigacoes[index].duracao = $scope.ligacao.duracao;
										$scope.listLigacoes[index].data = $scope.ligacao.data;
										$scope.listLigacoes[index].resumo = $scope.ligacao.resumo;

									$scope.comunicador = {
												"id": null,
												"telefone": '',
												"tipotelefone": '',
												"duracao":'',
												"data": '',
												"resumo": ''
									};
								}
					}
				 }
				 $scope.selectEditLigacao = function(id){
							var SelLigacao = getSelectedLigacao(id);
							$scope.comunicador = {
									"id": SelLigacao.id,
									"telefone": SelLigacao.telefone,
									"tipotelefone": SelLigacao.tipotelefone,
									"duracao":SelLigacao.duracao,
									"data": SelLigacao.data,
									"resumo": SelLigacao.resumo
							};
				 };
				 $scope.delLigacao = function(id){
					var result = confirm('Tem certeza?');
						if (result === true){
							for(var j = 0; j < $scope.listLigacoes.length;j ++){
									if($scope.listLigacoes[j].id == id){
										$scope.listLigacoes.splice(j, 1);
									}
								}
						}
				 };
				 function getSelectedIndexLigacao(id){
					for(var i=0; i <  Object.keys($scope.listLigacoes).length; i ++)
						if($scope.listLigacoes[i].id == id)
							return i;
					return 1;

				 }
				 function autoincrementLigacao(){
					if($scope.listLigacoes){
							$scope.ligacao.id = "#"+Object.keys($scope.listLigacoes).length;
					}else{
							$scope.ligacao.id = "#"+1;
					}

				 }
				 function getSelectedLigacao(id){
					for(var i=0; i <  Object.keys($scope.listLigacoes).length; i ++)
						if($scope.listLigacoes[i].id == id)
							return $scope.listLigacoes[i];
					return 1;
				 }
				 function getSelectedIndexLigacao(id){
						for(var i=0; i <  Object.keys($scope.listLigacoes).length; i ++)
							if($scope.listLigacoes[i].id == id)
								return i;
						return 1;
				 }

				 function validarCamposLigacao(){
					 var i;
						if($scope.ligacao){
						if(! $scope.ligacao.telefone ){
							alert("O campo nome de interações está vázio, favor preencher o campo.");
							i = false;

						}else if(! $scope.ligacao.telefone){
							alert("Selecione um telefone para continuar.");
							i = false;
						}
						else if(! $scope.ligacao.tipoligacao){
							alert("Selecione um tipo de telefone para continuar.");
							i = false;
						}
						else if(! $scope.ligacao.duracao){
							alert("Preencha a duração da ligação.");
							i = false;
						}else if(! $scope.ligacao.datacadastro){
							alert("Preencha a data para continuar.");
							i = false;
						}else if(! $scope.ligacao.resumo){
							alert("Preencha a data para continuar.");
							i = false;
						}else{
							i = true
						}
					}else{
						alert("Todos os campos são de preenchimento obrigatório.");
							i = false;
						}
							return i;
				 }


			   $scope.Excluir = function(id){

				   var result = confirm("Tem Certeza Que Deseja Excluir Esta Atividade?");
					if (result === true){
						if(id){

							$http.post('http://localhost:8080/CRM/rest/restAtividade/Excluir/'+id)
								.success(
								function(data, status) {
									alert("Atividade Excluída Com Sucesso!");
									$scope.BuscarInformacao();

								}).error(
								function(data, status) {
									$scope.Resposta = data ;
								});
						   };
					}
					else{
						alert("Atividade Conservada Com Sucesso!");
						$scope.BuscarInformacao();
					}

				};

				$http.get('http://localhost:8080/CRM/rest/restCollections/situacao')
				.success(function(data) {
					$scope.situacoes = data["situacao"];
				});
				$http.get('http://localhost:8080/CRM/rest/restContato/listarTodos')
				.success(function(data) {
					$scope.contatos = data["contato"];
				});
				$http.get('http://localhost:8080/CRM/rest/restEmpresa/listarTodos')
				.success(function(data) {
					$scope.empresas = data["empresa"];
				});
//				$http.get('http://localhost:8080/CRM/rest/restUsuario/listarTodos')
//				.success(function(data) {
//					$scope.usuarios = data["usuario"];
//				});
				$http.get('http://localhost:8080/CRM/rest/restTipoAtividade/listarTodos')
				.success(function(data) {

					$scope.tiposatividade = data["tipoAtividade"];
				});
				$http.get('http://localhost:8080/CRM/rest/restCollections/tipoligacao')
				.success(function(data) {
					$scope.tiposligacao = data["tipoLigacao"];
				});
				$http.get('http://localhost:8080/CRM/rest/restTelefone/listarTodos')
				.success(function(data) {
					$scope.telefones = data["telefone"];
				});
				$http.get('http://localhost:8080/CRM/rest/restTipoTelefone/listarTodos')
					.success(function(data) {
						$scope.tipostelefone = data["tipoTelefone"];
				});

		});
	}
});
myControllers.controller('CadastrarAtividadeController', function($scope, $routeParams,$http) {

	$scope.Titulo = "Cadastrar Atividade";

});
myControllers.controller('AtividadeController', function($scope, $routeParams, $http, $location) {

	$http.get('http://localhost:8080/CRM/rest/restCollections/situacao')
	.success(function(data) {
		$scope.situacoes = data["situacao"];
	});
	$http.get('http://localhost:8080/CRM/rest/restContato/listarTodos')
	.success(function(data) {
		$scope.contatos = data["contato"];
	});
	$http.get('http://localhost:8080/CRM/rest/restEmpresa/listarTodos')
	.success(function(data) {
		$scope.empresas = data["empresa"];
	});
//	$http.get('http://localhost:8080/CRM/rest/restUsuario/listarTodos')
//	.success(function(data) {
//		$scope.usuarios = data["usuario"];
//	});
	$http.get('http://localhost:8080/CRM/rest/restTipoAtividade/listarTodos')
	.success(function(data) {

		$scope.tiposatividade = data["tipoAtividade"];
	});
	$http.get('http://localhost:8080/CRM/rest/restCollections/tipoligacao')
	.success(function(data) {
		$scope.tiposligacao = data["tipoLigacao"];
	});
	$http.get('http://localhost:8080/CRM/rest/restTelefone/listarTodos')
	.success(function(data) {
		$scope.telefones = data["telefone"];
	});
	$http.get('http://localhost:8080/CRM/rest/restTipoTelefone/listarTodos')
		.success(function(data) {
			$scope.tipostelefone = data["tipoTelefone"];
	});

	$scope.EnviarInformacao = function() {

		var parameter = JSON.stringify({

			type : "atividade",
			id : $scope.atividade.id,
			usuarioresponsavel : $scope.atividade.usuarioresponsavel,
			empresa : $scope.atividade.empresa,
			contato : $scope.atividade.contato,
			tipoatividade : $scope.atividade.tipoatividade,

			nome : $scope.atividade.nome,
			datacadastro : $scope.atividade.datacadastro,
			datainicio : $scope.atividade.datainicio,
			datafim : $scope.atividade.datafim,
			descricao : $scope.atividade.descricao,
			situacao: $scope.atividade.situacao

		});

		var config = {
			headers : {
				'Content-Type' : 'application/json;charset=utf-8;'
			}
		}

		$http.post(
				'http://localhost:8080/CRM/rest/restAtividade/Salvar',
				parameter, config).success(
				function(data, status, headers, config) {

					$scope.atividade = data;
					var atividade =  new Object();
					atividade = $scope.atividade

					alert("Atividade: "+ $scope.atividade.nome +". Salva Com Sucesso!");

					$location.path('/Atividade/Editar/'+atividade.id)


				}).error(
				function(data, status, header, config) {
					$scope.Resposta = data ;
				});
	   };

	   $scope.Excluir = function(id){

		   var result = confirm("Tem Certeza Que Deseja Excluir Esta Atividade?");
			if (result === true){
				if(id){

					$http.post('http://localhost:8080/CRM/rest/restAtividade/Excluir/'+id)
						.success(
						function(data, status) {
							alert("Atividade Excluída Com Sucesso!");
							$scope.BuscarInformacao();

						}).error(
						function(data, status) {
							$scope.Resposta = data ;
						});
				   };
			}
			else{
				alert("Atividade Conservada Com Sucesso!");
				$scope.BuscarInformacao();
			}

		};

});
