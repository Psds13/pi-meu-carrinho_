const ListaModel = require('../models/ListaModel');

class ListaController {
  static async criarLista(req, res) {
    try {
      if (!req.session || !req.session.user) return res.redirect('/login');
      const { nome } = req.body;
      const usuarioId = req.session.user.id;

      const lista = await ListaModel.criarLista(usuarioId, nome);

      res.redirect(`/listas/${lista.id}`);
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      res.status(500).render('error', {
        error: 'Erro ao criar lista',
        user: req.session.user
      });
    }
  }

  static async minhasListas(req, res) {
    try {
      if (!req.session || !req.session.user) return res.redirect('/login');
      const usuarioId = req.session.user.id;
      const listas = await ListaModel.listarListasUsuario(usuarioId);

      res.render('listas/minhasListas', {
        listas,
        user: req.session.user
      });
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      res.status(500).render('error', {
        error: 'Erro ao carregar listas',
        user: req.session.user
      });
    }
  }

  static async verLista(req, res) {
    try {
      if (!req.session || !req.session.user) return res.redirect('/login');
      const { id } = req.params;
      const usuarioId = req.session.user.id;

      const lista = await ListaModel.buscarListaPorId(id, usuarioId);

      if (!lista) {
        return res.status(404).render('error', {
          error: 'Lista não encontrada',
          user: req.session.user
        });
      }

      res.render('listas/verLista', {
        lista,
        user: req.session.user
      });
    } catch (error) {
      console.error('Erro ao carregar lista:', error);
      res.status(500).render('error', {
        error: 'Erro ao carregar lista',
        user: req.session.user
      });
    }
  }

  static async adicionarItem(req, res) {
    try {
      const { listaId, produtoId, quantidade } = req.body;

      await ListaModel.adicionarItemLista(listaId, produtoId, quantidade || 1);

      res.redirect(`/listas/${listaId}`);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ error: 'Erro ao adicionar item à lista' });
    }
  }

  static async removerItem(req, res) {
    try {
      const { itemId, listaId } = req.body;

      await ListaModel.removerItemLista(itemId);

      res.redirect(`/listas/${listaId}`);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      res.status(500).json({ error: 'Erro ao remover item da lista' });
    }
  }

  static async marcarComprado(req, res) {
    try {
      const { itemId, comprado } = req.body;

      await ListaModel.marcarItemComprado(itemId, comprado === true || comprado === 'true');

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao marcar item:', error);
      res.status(500).json({ error: 'Erro ao atualizar item' });
    }
  }

  static async excluirLista(req, res) {
    try {
      if (!req.session || !req.session.user) return res.redirect('/login');
      const { listaId } = req.body;
      const usuarioId = req.session.user.id;

      await ListaModel.excluirLista(listaId, usuarioId);

      res.redirect('/listas/minhas-listas');
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
      res.status(500).render('error', {
        error: 'Erro ao excluir lista',
        user: req.session.user
      });
    }
  }
}

module.exports = ListaController;