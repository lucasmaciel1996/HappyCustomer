package br.edu.facear.test;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.junit.Assert;
import org.junit.Test;

import br.edu.facear.crm.entity.Empresa;
import br.edu.facear.crm.entity.Item;
import br.edu.facear.crm.entity.Negocio;
import br.edu.facear.crm.entity.Produto;
import br.edu.facear.crm.entity.Usuario;
import br.edu.facear.facade.FacadeHappyCustomer;

public class NegocioTest {
	
	SimpleDateFormat sdf= new SimpleDateFormat("dd/MM/yyyy");
	
	FacadeHappyCustomer facade = new FacadeHappyCustomer();
	@SuppressWarnings("deprecation")
	
	Negocio Negocio = new Negocio();
	Produto Produto = new Produto();
	Usuario Usuario = new Usuario();
	Empresa Empresa = new Empresa();
	
	Item Item = new Item();
	
	// CADASTRAR
	@Test
	public void testCadastroNegocio() throws Exception {
		
		//ATRIBUTOS NEG�CIO
		Negocio.setNome("Compra de Comida");
		Calendar data = new GregorianCalendar(29,10,2016);
		Negocio.setData(data.getTime());
		
		//USU�RIO RESPONS�VEL PELO NEG�CIO
		Usuario.setId(1l);
		Negocio.setUsuarioresponsavel(Usuario);
		
		//EMPRESA RESPONS�VEL PELO NEG�CIO
		Empresa.setId(1l);
		Negocio.setEmpresa(Empresa);
		
		facade.CadastrarNegocio(Negocio);
		Assert.assertEquals(true, Negocio.getId() != null && Negocio.getId() != null);
		//TERMINA NEG�CIO E JA INICIA O ITENS
		
		//ITENS DO NEG�CIO
		Produto.setId(1l);
		Item.setProduto(Produto);
		Item.setNegocio(Negocio);
		Item.setQuantidade(2l);
		facade.CadastrarItem(Item);		
	}

	// ALTERAR
	//@Test
	public void testAterarNegocio() throws Exception {
		
		Negocio Negocio = facade.BuscarNegocioPorId(2l);

		//ATRIBUTOS NEG�CIO
				Negocio.setNome("Compra de Bebida");
				Calendar data = new GregorianCalendar(30,10,2016);
				Negocio.setData(data.getTime());
				
				//USU�RIO RESPONS�VEL PELO NEG�CIO
				Usuario.setId(2l);
				Negocio.setUsuarioresponsavel(Usuario);
				
				//EMPRESA RESPONS�VEL PELO NEG�CIO
				Empresa.setId(3l);
				Negocio.setEmpresa(Empresa);
				
				facade.AlterarNegocio(Negocio);
				Assert.assertEquals(true, Negocio.getNome().equals("Compra de Bebida"));
				//TERMINA NEG�CIO E JA INICIA O ITENS
				
				//ITENS DO NEG�CIO
				Produto.setId(2l);
				Item.setProduto(Produto);
				Item.setNegocio(Negocio);
				Item.setQuantidade(7l);
				facade.CadastrarItem(Item);
	}
	
	//EXCLUIR
	//@Test
	public void testExcluirNegocio() throws Exception {
		
		//PRIMEIRO TEM QUE APAGAR TODOS OS ITENS RELACIONADOS AO NEGOCIO ABAIXO,
		//SEN�O ELE N�O DEIXA POR CAUSA DO RELACIONAMENTO.
		Item Item = facade.BuscarItemPorId(3l);
		facade.ExcluirItem(Item);
		
		Negocio Negocio = facade.BuscarNegocioPorId(2l);
		facade.ExcluirNegocio(Negocio);
	}
	
	// LISTAR
	//@Test
	public void testListarNegocio() throws Exception {
		List<Negocio> Negocio = new ArrayList<Negocio>();
		Negocio = facade.ListarNegocio();
		Assert.assertEquals(true, Negocio.size() > 0);
		System.out.println("NEG�CIO(S) CADASTRADO(S)");
		for (Negocio Negocio2 : Negocio) {
			System.out.println("Id: "+Negocio2.getId()+"  Nome: "+Negocio2.getNome());
		}
	}
}