const extensao = '.png';

const produtos = [
  { id: 1, imagem: 'Nocturne 39', marca: 'Aureus', nome: 'Nocturne 39', preco: 8490, antigo: 9990, desc: 15, tipo: 'relogio', novo: false },
  { id: 2, imagem: 'Grande reserve', marca: 'Montre Atelier', nome: 'Grande Réserve', preco: 12800, tipo: 'relogio', novo: true },
  { id: 3, imagem: 'Nocturne reserve 39', marca: 'Aureus Genève', nome: 'Nocturne Réserve 39', preco: 8490, antigo: 9990, desc: 15, tipo: 'relogio', novo: true },
  { id: 4, imagem: 'Calibre 01', marca: 'Edição limitada', nome: 'Calibre 01', preco: 21900, antigo: 24900, desc: 12, tipo: 'relogio', novo: true },
  { id: 5, imagem: 'Heritage chrono', marca: 'Cronógrafos', nome: 'Héritage Chrono', preco: 13260, antigo: 15600, desc: 15, tipo: 'relogio', novo: true },
  { id: 6, imagem: 'Opale 36', marca: 'Minimalistas', nome: 'Opale 36', preco: 5520, antigo: 6900, desc: 20, tipo: 'relogio', novo: true },
  { id: 7, imagem: 'Aurore 38', marca: 'Clássicos', nome: 'Aurore 38', preco: 9720, antigo: 10800, desc: 10, tipo: 'relogio', novo: true },
  { id: 8, imagem: 'Pulseira couro preto', marca: 'Pulseiras', nome: 'Pulseira em couro preto', preco: 890, tipo: 'acessorio' },
  { id: 9, imagem: 'Pulseira couro cinza', marca: 'Pulseiras', nome: 'Pulseira em couro cinza', preco: 890, tipo: 'acessorio' },
  { id: 10, imagem: 'Estojo viagem', marca: 'Estojos', nome: 'Estojo de viagem', preco: 1250, tipo: 'acessorio' },
  { id: 11, imagem: 'Kit cuidados', marca: 'Manutenção', nome: 'Kit de cuidados', preco: 390, tipo: 'acessorio' },
  { id: 12, imagem: 'Caixa 3 relogios', marca: 'Estojos', nome: 'Caixa para 3 relógios', preco: 2400, tipo: 'acessorio' },
  { id: 13, imagem: 'Pulseira aco', marca: 'Pulseiras', nome: 'Pulseira em aço', preco: 1180, tipo: 'acessorio' }
];

const categorias = {
  relogios: { rotulo: 'Coleção completa', titulo: 'Relógios', texto: 'Peças de manufatura suíça, do clássico ao complicado, selecionadas pelo Atelier.' },
  novidades: { rotulo: 'Recém-chegados', titulo: 'Novidades', texto: 'As últimas peças da temporada, em quantidades limitadas.' },
  acessorios: { rotulo: 'Para completar', titulo: 'Acessórios', texto: 'Pulseiras, estojos e cuidados para acompanhar cada relógio.' },
  ofertas: { rotulo: 'Condições especiais', titulo: 'Ofertas', texto: 'Seleção com preços reduzidos por tempo limitado.' }
};

const cores = [
  { nome: 'Couro preto', cor: '#1c1a18' },
  { nome: 'Couro marrom', cor: '#6d4a35' },
  { nome: 'Couro cinza', cor: '#b9b6ae' }
];

const pagina = document.body.dataset.pagina;
let limite = 6;
let cupom = false;
let pulseiraEscolhida = 'Couro preto';

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

function foto(p) {
  return `<img src="img/${p.imagem}${extensao}" alt="${p.nome}" onerror="this.remove()">`;
}

function abrirMenu() {
  document.getElementById('menu').hidden = false;
  document.body.style.overflow = 'hidden';
}

function fecharMenu() {
  document.getElementById('menu').hidden = true;
  document.body.style.overflow = '';
}

function atualizarContador() {
  const total = ler('carrinho').length;

  document.querySelectorAll('.contador').forEach(contador => {
    contador.textContent = total;
    contador.hidden = total === 0;
  });
}

function cartao(p, comBotao) {
  const favorito = ler('favoritos').includes(p.id);
  const selo = p.desc ? `<span class="selo">−${p.desc}%</span>` : '';
  const antigo = p.antigo ? `<s>${real(p.antigo)}</s>` : '';
  const botao = comBotao
    ? `<button class="botao contorno" style="margin-top:10px; height:40px" onclick="adicionar(${p.id}, this)">Adicionar ao carrinho</button>`
    : '';

  return `
    <article class="cartao">
      ${selo}
      <button class="coracao" onclick="favoritar(${p.id})" aria-label="Favoritar">
        <i class="bi ${favorito ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <a href="produto.html?id=${p.id}" class="foto">${foto(p)}</a>
      <span class="marca-peca">${p.marca}</span>
      <h3>${p.nome}</h3>
      <p class="preco-linha">${real(p.preco)}${antigo}</p>
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
    const conteudo = botao.innerHTML;
    botao.innerHTML = '<i class="bi bi-check2"></i> Adicionado';
    setTimeout(() => {
      botao.innerHTML = conteudo;
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
  document.getElementById('precoTexto').textContent = 'Preço até ' + real(maximo);
  document.getElementById('totalPecas').textContent = lista.length + (lista.length === 1 ? ' peça' : ' peças');
  document.getElementById('mostrando').textContent = 'Mostrando ' + Math.min(limite, lista.length);

  const grade = document.getElementById('lista');
  grade.innerHTML = lista.slice(0, limite).map(p => cartao(p)).join('');

  if (lista.length === 0) {
    grade.innerHTML = '<p class="vazio" style="grid-column: 1 / -1">Nenhuma peça encontrada. Ajuste o filtro ou a busca.</p>';
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

function escolherPulseira(nome) {
  pulseiraEscolhida = nome;
  desenhar();
}

function mostrarInfo(texto) {
  const caixa = document.getElementById('info');
  const mesmo = !caixa.hidden && caixa.textContent === texto;

  caixa.textContent = texto;
  caixa.hidden = mesmo;
}

function desenharProduto() {
  const id = Number(new URLSearchParams(location.search).get('id')) || 1;
  const p = achar(id) || achar(1);
  const favorito = ler('favoritos').includes(p.id);
  const antigo = p.antigo ? `<s>${real(p.antigo)}</s><em>−${p.desc}%</em>` : '';
  const colecao = p.tipo === 'relogio' ? 'Coleção ' + p.nome.split(' ')[0] : p.marca;

  const opcoesCor = cores.map(c => `
    <button class="${c.nome === pulseiraEscolhida ? 'escolhida' : ''}" style="background:${c.cor}" onclick="escolherPulseira('${c.nome}')" aria-label="${c.nome}"></button>`).join('');

  const pulseira = p.tipo === 'relogio'
    ? `<div class="pulseira">
         <div><small>Pulseira</small><span>${pulseiraEscolhida}</span></div>
         <div class="cores">${opcoesCor}</div>
       </div>`
    : '';

  document.title = p.nome + ' · ATELIER';
  document.getElementById('produto').innerHTML = `
    <div class="galeria">
      ${foto(p)}
      <span class="legenda">${colecao} · AT-${3900 + p.id}</span>
      <button class="coracao" onclick="favoritar(${p.id})" aria-label="Favoritar">
        <i class="bi ${favorito ? 'bi-heart-fill' : 'bi-heart'}"></i>
      </button>
      <div class="pontos"><i class="ativo"></i><i></i><i></i><i></i></div>
    </div>
    <div class="detalhes">
      <div class="linha-topo">
        <span class="marca-peca">${p.marca}</span>
        <span class="nota"><i class="bi bi-star"></i> 4,9 (27)</span>
      </div>
      <h1>${p.nome}</h1>
      <div class="preco-grande"><strong>${real(p.preco)}</strong>${antigo}</div>
      <p class="parcelas">ou 10× de ${real(Math.round(p.preco / 10))} sem juros</p>
      ${pulseira}
      <p class="descricao"><strong>Precisão e acabamento</strong> em cada detalhe. Caixa de 39 mm, cristal de safira e reserva de marcha de 72 horas.</p>
      <div class="links">
        <button onclick="mostrarInfo('Caixa em aço inoxidável, cristal de safira, resistente à água até 50 metros.')">Detalhes &amp; materiais</button>
        <button onclick="mostrarInfo('Caixa de 39 mm, espessura de 9 mm e pulseira de 20 mm.')">Guia de medidas</button>
      </div>
      <p class="info" id="info" hidden></p>
      <button class="botao" onclick="adicionar(${p.id}, this)"><i class="bi bi-bag"></i> Adicionar ao carrinho</button>
      <div class="selos">
        <span><i class="bi bi-shield-check"></i>Autenticidade garantida</span>
        <span><i class="bi bi-box-seam"></i>Envio seguro</span>
      </div>
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
  let original = 0;

  itensDoCarrinho().forEach(i => {
    subtotal += i.p.preco * i.qtd;
    original += (i.p.antigo || i.p.preco) * i.qtd;
  });

  const desconto = cupom ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, original, desconto, total: subtotal - desconto };
}

function desenharCheckout() {
  const itens = itensDoCarrinho();
  const totais = calcularTotais();
  const quantidade = ler('carrinho').length;
  const vazio = itens.length === 0;

  document.getElementById('itens').innerHTML = vazio
    ? '<p class="vazio">Sua sacola está vazia.<a href="produtos.html?cat=relogios" class="botao">Ver relógios</a></p>'
    : itens.map(i => `
      <div class="item">
        <div class="miniatura">${foto(i.p)}</div>
        <div>
          <small>${i.p.marca}</small>
          <h3>${i.p.nome}</h3>
          <div class="qtd">
            <button onclick="mudarQuantidade(${i.p.id}, -1)" aria-label="Diminuir"><i class="bi bi-dash"></i></button>
            <span>${i.qtd}</span>
            <button onclick="mudarQuantidade(${i.p.id}, 1)" aria-label="Aumentar"><i class="bi bi-plus"></i></button>
          </div>
        </div>
        <div class="valor">${real(i.p.preco * i.qtd)}${i.p.antigo ? `<s>${real(i.p.antigo * i.qtd)}</s>` : ''}</div>
      </div>`).join('');

  document.getElementById('tituloSacola').textContent = `Sacola · ${quantidade} ${quantidade === 1 ? 'item' : 'itens'}`;
  document.getElementById('subtotal').textContent = real(totais.original);
  const economia = totais.original - totais.total;
  document.getElementById('desconto').textContent = economia ? '−' + real(economia) : 'R$ 0';
  document.getElementById('parcela').textContent = `Impostos incluídos · 10× de ${real(Math.round(totais.total / 10))} sem juros`;
  document.getElementById('continuar').disabled = vazio;
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
    passo.classList.toggle('feito', i < numero - 1);
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

function mostrarSenha(botao) {
  const campo = document.getElementById('senha');
  const visivel = campo.type === 'text';

  campo.type = visivel ? 'password' : 'text';
  botao.innerHTML = visivel ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
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

function editarCampo(id) {
  const campo = document.getElementById(id);
  campo.disabled = false;
  campo.focus();
}

function editarDados() {
  const campos = document.querySelectorAll('.dado input');
  const editando = campos[0].disabled;

  campos.forEach(campo => {
    campo.disabled = !editando;
  });

  document.getElementById('btnEditar').innerHTML = editando
    ? '<i class="bi bi-check2"></i> Salvar informações'
    : '<i class="bi bi-pencil"></i> Editar informações';
}

function filtrarPedidos(status, botao) {
  document.querySelectorAll('.filtros button').forEach(b => b.classList.remove('ativa'));
  botao.classList.add('ativa');

  document.querySelectorAll('.pedido').forEach(pedido => {
    pedido.hidden = status !== 'todos' && pedido.dataset.status !== status;
  });
}

function alternarPedido(botao) {
  const detalhe = botao.closest('.pedido').querySelector('.info');
  detalhe.hidden = !detalhe.hidden;
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

function alternarNotificacao(caixa) {
  caixa.nextElementSibling.textContent = caixa.checked ? 'Ativadas' : 'Desativadas';
}

function desenhar() {
  if (pagina === 'home') desenharHome();
  if (pagina === 'produtos') desenharProdutos();
  if (pagina === 'produto') desenharProduto();
  if (pagina === 'favoritos') desenharFavoritos();
  if (pagina === 'checkout') desenharCheckout();
  if (pagina === 'conta') document.getElementById('qtdFav').textContent = ler('favoritos').length;
  atualizarContador();
}

desenhar();

if (pagina === 'config') marcarTema();