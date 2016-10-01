package br.edu.facear.crm.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import br.edu.facear.crm.entity.Cidade;
import br.edu.facear.crm.entity.Estado;

public class CidadeDAO implements InterfaceDAO<Cidade> {
	EntityManager em = Connection.getEntityManager();
	@Override
	public void salvar(Cidade cidade) throws CrmException {
		em.getTransaction().begin();
		em.persist(cidade);
		em.getTransaction().commit();		
	}

	@Override
	public List<Cidade> listar() {
		Query q = em.createQuery("select a from Cidade a");
		
		return q.getResultList();
	}

	@Override
	public void editar(Cidade cidade) {
		em.getTransaction().begin();
		em.merge(cidade);
		em.getTransaction().commit();		
	}

	@Override
	public Cidade getObjectById(Long id) {
		return em.find(Cidade.class, id);	
	}

	@Override
	public void excluir(Cidade cidade) {
		em.getTransaction().begin();
		em.remove(cidade);
		em.getTransaction().commit();	
	}

}