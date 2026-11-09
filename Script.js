const extensao = '.svg';

const produtos = [
  { id: 1, imagem: 'nocturne-39', marca: 'Aureus', nome: 'Nocturne 39', preco: 8490, antigo: 9990, desc: 15, tipo: 'relogio', novo: false, cor: 'c1' },
  { id: 2, imagem: 'grande-reserve', marca: 'Montre Atelier', nome: 'Grande Réserve', preco: 12800, tipo: 'relogio', novo: true, cor: 'c2' },
  { id: 3, imagem: 'nocturne-reserve-39', marca: 'Aureus Genève', nome: 'Nocturne Réserve 39', preco: 8490, antigo: 9990, desc: 15, tipo: 'relogio', novo: true, cor: 'c1' },
  { id: 4, imagem: 'calibre-01', marca: 'Edição limitada', nome: 'Calibre 01', preco: 21900, antigo: 24900, desc: 12, tipo: 'relogio', novo: true, cor: 'c3' },
  { id: 5, imagem: 'heritage-chrono', marca: 'Cronógrafos', nome: 'Héritage Chrono', preco: 13260, antigo: 15600, desc: 15, tipo: 'relogio', novo: true, cor: 'c2' },
  { id: 6, imagem: 'opale-36', marca: 'Minimalistas', nome: 'Opale 36', preco: 5520, antigo: 6900, desc: 20, tipo: 'relogio', novo: true, cor: 'c3' },
  { id: 7, imagem: 'aurore-38', marca: 'Clássicos', nome: 'Aurore 38', preco: 9720, antigo: 10800, desc: 10, tipo: 'relogio', novo: true, cor: 'c1' },
  { id: 8, imagem: 'pulseira-couro-preto', marca: 'Pulseiras', nome: 'Pulseira em couro preto', preco: 890, tipo: 'acessorio', cor: 'c4 acessorio' },
  { id: 9, imagem: 'pulseira-couro-cinza', marca: 'Pulseiras', nome: 'Pulseira em couro cinza', preco: 890, tipo: 'acessorio', cor: 'c4 acessorio' },
  { id: 10, imagem: 'estojo-viagem', marca: 'Estojos', nome: 'Estojo de viagem', preco: 1250, tipo: 'acessorio', cor: 'c4 acessorio' },
  { id: 11, imagem: 'kit-cuidados', marca: 'Manutenção', nome: 'Kit de cuidados', preco: 390, tipo: 'acessorio', cor: 'c4 acessorio' },
  { id: 12, imagem: 'caixa-3-relogios', marca: 'Estojos', nome: 'Caixa para 3 relógios', preco: 2400, tipo: 'acessorio', cor: 'c4 acessorio' },
  { id: 13, imagem: 'pulseira-aco', marca: 'Pulseiras', nome: 'Pulseira em aço', preco: 1180, tipo: 'acessorio', cor: 'c4 acessorio' }
];

const categorias = {
  relogios: { rotulo: 'Coleção completa', titulo: 'Relógios', texto: 'Peças de manufatura suíça, do clássico ao complicado, selecionadas pelo nosso curador.' },
  novidades: { rotulo: 'Recém-chegados', titulo: 'Novidades', texto: 'As últimas peças da temporada, em quantidades limitadas.' },
  acessorios: { rotulo: 'Para completar', titulo: 'Acessórios', texto: 'Pulseiras, estojos e cuidados para acompanhar cada relógio.' },
  ofertas: { rotulo: 'Condições especiais', titulo: 'Ofertas', texto: 'Seleção com preços reduzidos por tempo limitado.' }
};

const pagina = document.body.dataset.pagina;
let limite = 6;
let cupom = false;

function ler(chave) {
  return JSON.parse(localStorage.getItem(chave)) || [];
}

function salvar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function real(valor) {
  return 'R$ ' + valor.toLocaleString('pt-BR');
}

function achar(id) {
  return produtos.find(p => p.id === id);
}

function alternarMenu() {
  document.getElementById('menu').classList.toggle('aberto');
}

function atualizarContador() {
  const total = ler('carrinho').length;
  const contador = document.getElementById('contador');
  contador.textContent = total;
  contador.hidden = total === 0;
}

function foto(p) {
  return `<img src="img/${p.imagem}${extensao}" alt="${p.nome}" onerror="this.remove()">`;
}

function cartao(p, comBotao) {
  const favorito = ler('favoritos').includes(p.id);
  const selo = p.desc ? `<span class="selo">−${p.desc}%</span>` : '';
  const antigo = p.antigo ? `<s>${real(p.antigo)}</s>` : '';
  const botao = comBotao
    ? `<button class="botao claro pequeno" onclick="adicionar(${p.id}, this)">Adicionar ao carrinho</button>`
    : '';

  return `
    <article class="cartao">
      ${selo}
      <button class="coracao" onclick="favoritar(${p.id})" aria-label="Favoritar">
        <i class="bi ${favorito ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <a href="produto.html?id=${p.id}" class="foto ${p.cor}">${foto(p)}</a>
      <small>${p.marca}</small>
      <h3>${p.nome}</h3>
      <p>${real(p.preco)} ${antigo}</p>
      ${botao}
    </article>`;
}

function favoritar(id) {
  const favoritos = ler('favoritos');
  const posicao = favoritos.indexOf(id);

  if (posicao >= 0) {
    favoritos.splice(posicao, 1);
  } else {
    favoritos.push(id);
  }

  salvar('favoritos', favoritos);
  desenhar();
}

function adicionar(id, botao) {
  const carrinho = ler('carrinho');
  carrinho.push(id);
  salvar('carrinho', carrinho);
  atualizarContador();

  if (botao) {
    const texto = botao.textContent;
    botao.textContent = 'Adicionado';
    setTimeout(() => {
      botao.textContent = texto;
    }, 1200);
  }
}

function desenharHome() {
  document.getElementById('destaques').innerHTML = cartao(achar(1)) + cartao(achar(2));
}

function desenharProdutos() {
  const params = new URLSearchParams(location.search);
  const cat = categorias[params.get('cat')] ? params.get('cat') : 'relogios';
  const busca = (params.get('busca') || '').toLowerCase();
  const info = categorias[cat];

  let lista = produtos.filter(p => {
    if (busca) return (p.nome + ' ' + p.marca).toLowerCase().includes(busca);
    if (cat === 'novidades') return p.novo;
    if (cat === 'acessorios') return p.tipo === 'acessorio';
    if (cat === 'ofertas') return p.desc > 0;
    return p.tipo === 'relogio';
  });

  const maximo = Number(document.getElementById('precoMax').value);
  const ordem = document.getElementById('ordem').value;

  lista = lista.filter(p => p.preco <= maximo);

  if (ordem === 'menor') lista.sort((a, b) => a.preco - b.preco);
  if (ordem === 'maior') lista.sort((a, b) => b.preco - a.preco);

  document.getElementById('rotulo').textContent = busca ? 'Busca' : info.rotulo;
  document.getElementById('titulo').textContent = busca ? 'Resultados' : info.titulo;
  document.getElementById('texto').textContent = busca ? `Peças para “${busca}”.` : info.texto;
  document.getElementById('precoTexto').textContent = 'Até ' + real(maximo);
  document.getElementById('contagem').textContent = `${lista.length} peças · mostrando ${Math.min(limite, lista.length)}`;

  const grade = document.getElementById('lista');
  grade.innerHTML = lista.slice(0, limite).map(p => cartao(p)).join('');

  if (lista.length === 0) {
    grade.innerHTML = '<p class="vazio">Nenhuma peça encontrada. Ajuste o filtro ou a busca.</p>';
  }

  document.getElementById('maisPecas').hidden = limite >= lista.length;
}

function carregarMais() {
  limite += 6;
  desenhar();
}

function alternarFiltro() {
  const painel = document.getElementById('filtro');
  painel.hidden = !painel.hidden;
}

function desenharProduto() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const p = achar(id) || achar(1);
  const favorito = ler('favoritos').includes(p.id);
  const antigo = p.antigo ? `<s>${real(p.antigo)}</s> <em>−${p.desc}%</em>` : '';
  const pulseira = p.tipo === 'relogio'
    ? `<label for="pulseira">Pulseira</label>
       <select id="pulseira">
         <option>Couro preto</option>
         <option>Couro cinza</option>
         <option>Aço</option>
       </select>`
    : '';

  document.title = p.nome + ' · ATELIER';
  document.getElementById('detalhe').innerHTML = `
    <div class="galeria">
      <button class="coracao" onclick="favoritar(${p.id})" aria-label="Favoritar">
        <i class="bi ${favorito ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <div class="foto ${p.cor}">${foto(p)}</div>
    </div>
    <div class="detalhe">
      <span class="rotulo">Ref. AT-${3900 + p.id}</span>
      <small class="suave">${p.marca} · 4,9 (27)</small>
      <h1>${p.nome}</h1>
      <p class="preco">${real(p.preco)} ${antigo}</p>
      <p class="suave">ou 10× de ${real(Math.round(p.preco / 10))} sem juros</p>
      ${pulseira}
      <p class="suave" style="margin: 16px 0">Precisão e acabamento em cada detalhe, com perfil esbelto e materiais selecionados.</p>
      <button class="botao" onclick="adicionar(${p.id}, this)">Adicionar ao carrinho</button>
      <details><summary>Detalhes e materiais</summary><p>Caixa em aço inoxidável, cristal de safira e garantia de 5 anos.</p></details>
      <details><summary>Guia de medidas</summary><p>Caixa de 39 mm, espessura de 9 mm e pulseira de 20 mm.</p></details>
      <div class="garantias"><span>Autenticidade garantida</span><span>Envio segurado</span></div>
    </div>`;
}

function desenharFavoritos() {
  const ids = ler('favoritos');

  document.getElementById('favoritosCheio').hidden = ids.length === 0;
  document.getElementById('favoritosVazio').hidden = ids.length > 0;
  document.getElementById('qtdFavoritos').textContent = ids.length === 1 ? '1 peça salva' : ids.length + ' peças salvas';
  document.getElementById('listaFavoritos').innerHTML = ids.map(id => cartao(achar(id), true)).join('');
  document.getElementById('sugestoes').innerHTML = cartao(achar(1)) + cartao(achar(2));
}

function itensDoCarrinho() {
  const itens = [];

  ler('carrinho').forEach(id => {
    const item = itens.find(i => i.p.id === id);
    if (item) {
      item.qtd++;
    } else {
      itens.push({ p: achar(id), qtd: 1 });
    }
  });

  return itens;
}

function calcularTotais() {
  let subtotal = 0;
  itensDoCarrinho().forEach(i => {
    subtotal += i.p.preco * i.qtd;
  });

  const desconto = cupom ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, desconto, total: subtotal - desconto };
}

function desenharCheckout() {
  const itens = itensDoCarrinho();
  const totais = calcularTotais();
  const quantidade = ler('carrinho').length;

  document.getElementById('itens').innerHTML = itens.length === 0
    ? '<p class="vazio">Sua sacola está vazia.<br><a href="produtos.html?cat=relogios" class="botao">Ver relógios</a></p>'
    : itens.map(i => `
      <div class="item">
        <div class="foto ${i.p.cor}">${foto(i.p)}</div>
        <div>
          <small>${i.p.marca}</small>
          <h3>${i.p.nome}</h3>
          <div class="qtd">
            <button onclick="mudarQuantidade(${i.p.id}, -1)">−</button>
            <span>${i.qtd}</span>
            <button onclick="mudarQuantidade(${i.p.id}, 1)">+</button>
          </div>
        </div>
        <strong>${real(i.p.preco * i.qtd)}</strong>
      </div>`).join('');

  document.getElementById('tituloSacola').textContent = `Sacola · ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`;
  document.getElementById('subtotal').textContent = real(totais.subtotal);
  document.getElementById('desconto').textContent = totais.desconto ? '−' + real(totais.desconto) : 'R$ 0';
  document.getElementById('parcela').textContent = `Impostos incluídos · 10× de ${real(Math.round(totais.total / 10))} sem juros`;
  document.querySelectorAll('.totalGeral').forEach(e => {
    e.textContent = real(totais.total);
  });
}

function mudarQuantidade(id, mudanca) {
  const carrinho = ler('carrinho');

  if (mudanca > 0) {
    carrinho.push(id);
  } else {
    carrinho.splice(carrinho.indexOf(id), 1);
  }

  salvar('carrinho', carrinho);
  desenhar();
}

function aplicarCupom() {
  const codigo = document.getElementById('codigoCupom').value.trim().toUpperCase();
  const aviso = document.getElementById('avisoCupom');

  cupom = codigo === 'ATELIER10';
  aviso.textContent = cupom ? 'Cupom aplicado: 10% de desconto.' : 'Cupom inválido. Tente ATELIER10.';
  desenhar();
}

function camposPreenchidos(idBloco) {
  let tudoCerto = true;

  document.querySelectorAll('#' + idBloco + ' input[required]').forEach(campo => {
    const vazio = campo.value.trim() === '';
    campo.classList.toggle('erro', vazio);
    if (vazio) tudoCerto = false;
  });

  return tudoCerto;
}

function irParaEtapa(numero) {
  if (numero === 2 && ler('carrinho').length === 0) return;
  if (numero === 3 && !camposPreenchidos('etapa2')) return;

  for (let i = 1; i <= 4; i++) {
    document.getElementById('etapa' + i).hidden = i !== numero;
  }

  document.getElementById('passos').hidden = numero === 4;
  document.querySelectorAll('#passos span').forEach((passo, i) => {
    passo.classList.toggle('atual', i === numero - 1);
  });

  window.scrollTo(0, 0);
}

function escolherMetodo() {
  const metodo = document.querySelector('input[name="metodo"]:checked').value;
  document.getElementById('blocoCartao').hidden = metodo !== 'cartao';
  document.getElementById('blocoPix').hidden = metodo !== 'pix';
}

function copiarPix(botao) {
  navigator.clipboard.writeText(document.getElementById('codigoPix').textContent);
  botao.textContent = 'Copiado';
}

function concluirCompra() {
  const metodo = document.querySelector('input[name="metodo"]:checked').value;
  if (metodo === 'cartao' && !camposPreenchidos('blocoCartao')) return;

  const quantidade = ler('carrinho').length;
  const totais = calcularTotais();

  document.getElementById('numeroPedido').textContent = 'AT-' + (20000 + Math.floor(Math.random() * 9999));
  document.getElementById('resumoItens').textContent = quantidade + (quantidade === 1 ? ' peça' : ' peças');
  document.getElementById('resumoPagamento').textContent = metodo === 'pix' ? 'Pix' : 'Cartão de crédito';
  document.getElementById('resumoTotal').textContent = real(totais.total);

  salvar('carrinho', []);
  atualizarContador();
  irParaEtapa(4);
}

function entrar(evento) {
  evento.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const erro = document.getElementById('erro');

  if (!email.includes('@')) {
    erro.textContent = 'Digite um e-mail válido.';
    return;
  }

  if (senha.length < 4) {
    erro.textContent = 'A senha precisa ter pelo menos 4 caracteres.';
    return;
  }

  localStorage.setItem('logado', 'sim');
  location.href = 'conta.html';
}

function sair() {
  localStorage.removeItem('logado');
  location.href = 'login.html';
}

function mostrarAba(nome) {
  ['dados', 'pedidos', 'config'].forEach(aba => {
    document.getElementById('aba-' + aba).hidden = aba !== nome;
    document.getElementById('btn-' + aba).classList.toggle('ativa', aba === nome);
  });
}

function editarDados() {
  const campos = document.querySelectorAll('#aba-dados input');
  const editando = campos[0].disabled;

  campos.forEach(campo => {
    campo.disabled = !editando;
  });

  document.getElementById('btnEditar').textContent = editando ? 'Salvar informações' : 'Editar informações';
}

function filtrarPedidos(status, botao) {
  document.querySelectorAll('.filtros button').forEach(b => b.classList.remove('ativa'));
  botao.classList.add('ativa');

  document.querySelectorAll('.pedido').forEach(pedido => {
    pedido.hidden = status !== 'todos' && pedido.dataset.status !== status;
  });
}

function mudarTema(tema) {
  localStorage.setItem('tema', tema);
  document.documentElement.dataset.tema = tema;
  marcarTema();
}

function marcarTema() {
  const atual = document.documentElement.dataset.tema;

  document.querySelectorAll('.tema').forEach(botao => {
    botao.classList.toggle('escolhido', botao.dataset.tema === atual);
  });

  document.getElementById('temaAtual').textContent = atual === 'escuro' ? 'Modo escuro selecionado' : 'Modo claro selecionado';
}

function desenhar() {
  if (pagina === 'home') desenharHome();
  if (pagina === 'produtos') desenharProdutos();
  if (pagina === 'produto') desenharProduto();
  if (pagina === 'favoritos') desenharFavoritos();
  if (pagina === 'checkout') desenharCheckout();
  atualizarContador();
}

desenhar();

if (pagina === 'conta') {
  const aba = location.hash.replace('#', '');
  mostrarAba(['dados', 'pedidos', 'config'].includes(aba) ? aba : 'dados');
  marcarTema();
}