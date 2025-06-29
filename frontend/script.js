const galeria = document.getElementById('galeria');
const paginacao = document.getElementById('paginacao');
const formEnvio = document.getElementById('form-envio');
const navButtons = document.querySelectorAll('.nav-btn');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
const tituloSite = document.getElementById('titulo-site');
const fotoPerfil = document.getElementById('foto-perfil');
const descricaoArtista = document.getElementById('descricao-artista');
const redesSociais = document.getElementById('redes-sociais');
const configBtn = document.getElementById('config-btn');
const configModal = document.getElementById('config-modal');
const fecharConfigModal = document.getElementById('fechar-config-modal');
const configContent = document.getElementById('config-content');
const formEnvioContainer = document.getElementById('form-envio-container');
const modal = document.createElement('div');
modal.id = 'modal';
modal.className = 'modal';
document.body.appendChild(modal);
const imagemModal = document.createElement('img');
imagemModal.id = 'imagemModal';
modal.appendChild(imagemModal);
const fecharModal = document.createElement('span');
fecharModal.id = 'fechar-modal';
fecharModal.textContent = '×';
modal.appendChild(fecharModal);

// Novo elemento para animação de carregamento
const loadingOverlay = document.createElement('div');
loadingOverlay.id = 'loading-overlay';
loadingOverlay.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(loadingOverlay);

let paginaAtual = 1;
const limite = 6; // Aumenta o limite para carregar mais itens por vez
let currentColors = { background: '#000', text: '#fff', accent: '#fff' };
let authToken = localStorage.getItem('token') || null;
let cachedImagens = {}; // Cache para imagens

// Imagens fixas para exibir inicialmente (opcional, pode ser removido se backend fornecer tudo)
const imagensFixas = [
  { url: 'https://via.placeholder.com/300x200?text=Imagem+1', titulo: 'Imagem 1' },
  { url: 'https://via.placeholder.com/300x200?text=Imagem+2', titulo: 'Imagem 2' },
  { url: 'https://via.placeholder.com/300x200?text=Imagem+3', titulo: 'Imagem 3' }
];

function showLoading() {
  loadingOverlay.style.display = 'flex';
}

function hideLoading() {
  loadingOverlay.style.display = 'none';
}

async function carregarConfiguracoes() {
  showLoading();
  try {
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok && res.status === 401) {
      authToken = null;
      localStorage.removeItem('token');
      throw new Error('Acesso não autorizado. Faça login novamente.');
    }
    if (!res.ok) throw new Error('Falha ao carregar configurações');
    const config = await res.json();
    tituloSite.textContent = config.tituloSite;
    fotoPerfil.src = config.fotoPerfil;
    descricaoArtista.textContent = config.descricaoArtista;
    redesSociais.innerHTML = `
      <a href="${config.redesSociais.instagram || '#'}" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
      <a href="${config.redesSociais.youtube || '#'}" aria-label="YouTube"><img src="https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png" alt="YouTube" /></a>
      <a href="${config.redesSociais.whatsapp || '#'}" aria-label="WhatsApp"><img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" /></a>
    `;
    currentColors = config.cores || currentColors;
    applyColors();
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    alert(error.message);
  } finally {
    hideLoading();
  }
}

function applyColors() {
  document.body.style.background = currentColors.background;
  document.body.style.color = currentColors.text;
  header.style.background = currentColors.background;
  header.style.color = currentColors.text;
  nav.style.background = currentColors.background;
  nav.style.color = currentColors.text;
  footer.style.background = currentColors.background;
  footer.style.color = currentColors.text;
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.style.borderColor = currentColors.accent;
    btn.style.color = currentColors.text;
  });
  fotoPerfil.style.borderColor = currentColors.accent;
  tituloSite.style.color = currentColors.text;
}

async function carregarImagens(categoria = '') {
  showLoading();
  const cacheKey = `${categoria}-${paginaAtual}`;
  if (cachedImagens[cacheKey]) {
    renderImagens(cachedImagens[cacheKey]);
    hideLoading();
    return;
  }

  galeria.innerHTML = '';
  // Adicionar imagens fixas apenas na primeira página, se desejar
  if (paginaAtual === 1) {
    imagensFixas.forEach(imagem => {
      const div = document.createElement('div');
      div.classList.add('item-galeria');
      div.innerHTML = `
        <img src="${imagem.url}" alt="${imagem.titulo}" loading="lazy" />
        <h3>${imagem.titulo}</h3>
      `;
      div.addEventListener('click', (e) => {
        abrirModal(imagem.url, '');
      });
      galeria.appendChild(div);
    });
  }

  const url = new URL('https://desenho-portifolio.onrender.com/api/imagens');
  url.searchParams.append('pagina', paginaAtual);
  url.searchParams.append('limite', limite);
  if (categoria) url.searchParams.append('categoria', categoria);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar imagens');
    const dados = await res.json();
    const imagens = dados.imagens;
    cachedImagens[cacheKey] = imagens; // Armazena no cache
    renderImagens(imagens);
    gerarPaginacao(dados.total);
  } catch (error) {
    console.error('Erro ao carregar imagens:', error);
    galeria.innerHTML = '<p>Erro ao carregar imagens. Tente novamente.</p>';
  } finally {
    hideLoading();
  }
}

function renderImagens(imagens) {
  galeria.innerHTML = ''; // Limpa apenas se necessário
  imagens.forEach(imagem => {
    const div = document.createElement('div');
    div.classList.add('item-galeria');
    div.innerHTML = `
      <img src="${imagem.url}" alt="${imagem.titulo}" loading="lazy" />
      <h3>${imagem.titulo}</h3>
    `;
    div.addEventListener('click', (e) => {
      abrirModal(imagem.url, imagem.descricao);
    });
    galeria.appendChild(div);
  });
}

formEnvio.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formEnvio);
  try {
    showLoading();
    const res = await fetch('https://desenho-portifolio.onrender.com/api/imagens/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Falha ao enviar imagem');
    alert('Imagem enviada com sucesso!');
    formEnvio.reset();
    formEnvioContainer.style.display = 'none';
    paginaAtual = 1; // Volta para a primeira página após upload
    carregarImagens();
  } catch (error) {
    alert('Erro ao enviar imagem: ' + error.message);
  } finally {
    hideLoading();
  }
});

function gerarPaginacao(total) {
  const totalPaginas = Math.ceil(total / limite);
  paginacao.innerHTML = '';
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === paginaAtual) btn.classList.add('ativo');
    btn.addEventListener('click', () => {
      paginaAtual = i;
      carregarImagens();
    });
    paginacao.appendChild(btn);
  }
}

navButtons.forEach(button => {
  button.addEventListener('click', () => {
    paginaAtual = 1;
    const categoria = button.getAttribute('data-categoria');
    carregarImagens(categoria);
    if (window.innerWidth <= 768) nav.classList.remove('ativo');
  });
});

menuToggle.addEventListener('click', () => nav.classList.toggle('ativo'));

function abrirModal(src, descricao) {
  imagemModal.src = src;
  const descricaoElement = modal.querySelector('p');
  if (descricaoElement) modal.removeChild(descricaoElement);
  if (descricao) {
    const p = document.createElement('p');
    p.textContent = descricao || 'Sem descrição';
    modal.appendChild(p);
  }
  modal.classList.add('ativo');
}

fecharModal.addEventListener('click', () => {
  modal.classList.remove('ativo');
  const descricaoElement = modal.querySelector('p');
  if (descricaoElement) modal.removeChild(descricaoElement);
  imagemModal.src = '';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('ativo');
    const descricaoElement = modal.querySelector('p');
    if (descricaoElement) modal.removeChild(descricaoElement);
    imagemModal.src = '';
  }
});

const formContainer = document.getElementById('form-envio-container');
const botaoMostrarForm = document.createElement('button');
botaoMostrarForm.textContent = 'Adicionar Arte';
botaoMostrarForm.classList.add('botao-envio-discreto');
formContainer.parentNode.insertBefore(botaoMostrarForm, formContainer);
formEnvioContainer.style.display = 'none';

botaoMostrarForm.addEventListener('click', () => {
  formEnvioContainer.style.display = formEnvioContainer.style.display === 'none' ? 'block' : 'none';
});

configBtn.addEventListener('click', () => {
  if (!authToken) {
    showLoginModal();
  } else {
    openConfigModal();
  }
});

function showLoginModal() {
  const loginModal = document.createElement('div');
  loginModal.id = 'login-modal';
  loginModal.className = 'modal';
  loginModal.innerHTML = `
    <div class="login-content">
      <h3>Login</h3>
      <input type="email" id="login-email" placeholder="E-mail" required>
      <input type="password" id="login-password" placeholder="Senha" required>
      <button onclick="handleLogin()">Entrar</button>
      <span id="close-login-modal">×</span>
    </div>
  `;
  document.body.appendChild(loginModal);

  document.getElementById('close-login-modal').addEventListener('click', () => {
    loginModal.remove();
  });

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.remove();
  });
}

async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    showLoading();
    const res = await fetch('https://desenho-portifolio.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Falha no login');
    const { token } = await res.json();
    authToken = token;
    localStorage.setItem('token', token);
    document.getElementById('login-modal').remove();
    openConfigModal();
  } catch (error) {
    alert('Erro ao fazer login: ' + error.message);
  } finally {
    hideLoading();
  }
}

function openConfigModal() {
  configContent.innerHTML = `
    <h3>Configurações</h3>
    <button id="edit-titulo">Editar Título e Cor</button>
    <button id="edit-foto">Trocar Foto do Artista</button>
    <button id="edit-descricao">Editar Descrição</button>
    <button id="edit-redes">Editar Redes Sociais</button>
    <button id="edit-cores">Trocar Cores</button>
    <button id="gerenciar-imagens">Gerenciar Imagens</button>
    <button id="adicionar-arte">Adicionar Arte</button>
  `;
  configModal.classList.add('ativo');

  document.getElementById('edit-titulo').addEventListener('click', () => {
    configContent.innerHTML = `
      <h3>Editar Título e Cor</h3>
      <input type="text" id="novo-titulo" value="${tituloSite.textContent}" />
      <input type="color" id="titulo-color" value="${currentColors.text}" />
      <button onclick="salvarTitulo()">Salvar</button>
    `;
    configModal.classList.add('ativo');
  });

  document.getElementById('edit-foto').addEventListener('click', () => {
    configContent.innerHTML = `
      <h3>Trocar Foto do Artista</h3>
      <input type="file" id="nova-foto" />
      <button onclick="salvarFoto()">Salvar</button>
    `;
    configModal.classList.add('ativo');
  });

  document.getElementById('edit-descricao').addEventListener('click', () => {
    configContent.innerHTML = `
      <h3>Editar Descrição</h3>
      <textarea id="nova-descricao">${descricaoArtista.textContent}</textarea>
      <button onclick="salvarDescricao()">Salvar</button>
    `;
    configModal.classList.add('ativo');
  });

  document.getElementById('edit-redes').addEventListener('click', () => {
    configContent.innerHTML = `
      <h3>Editar Redes Sociais</h3>
      <input type="text" id="insta-link" placeholder="Link Instagram" value="${redesSociais.querySelector('a[aria-label="Instagram"]')?.href || ''}" />
      <input type="text" id="youtube-link" placeholder="Link YouTube" value="${redesSociais.querySelector('a[aria-label="YouTube"]')?.href || ''}" />
      <input type="text" id="whatsapp-link" placeholder="Link WhatsApp" value="${redesSociais.querySelector('a[aria-label="WhatsApp"]')?.href || ''}" />
      <button onclick="salvarRedes()">Salvar</button>
    `;
    configModal.classList.add('ativo');
  });

  document.getElementById('edit-cores').addEventListener('click', () => {
    configContent.innerHTML = `
      <h3>Trocar Cores</h3>
      <label>Cor de Fundo: <input type="color" id="bg-color" value="${currentColors.background}" /></label><br>
      <label>Cor do Texto: <input type="color" id="text-color" value="${currentColors.text}" /></label><br>
      <label>Cor de Destaque: <input type="color" id="accent-color" value="${currentColors.accent}" /></label><br>
      <button onclick="salvarCores()">Salvar</button>
    `;
    configModal.classList.add('ativo');
  });

  document.getElementById('gerenciar-imagens').addEventListener('click', () => {
    configContent.innerHTML = `<h3>Gerenciar Imagens</h3><div id="imagens-list"></div>`;
    carregarImagensParaGerenciar();
    configModal.classList.add('ativo');
  });

  document.getElementById('adicionar-arte').addEventListener('click', () => {
    formEnvioContainer.style.display = 'block';
    configModal.classList.remove('ativo');
  });
}

fecharConfigModal.addEventListener('click', () => {
  configModal.classList.remove('ativo');
});
configModal.addEventListener('click', (e) => {
  if (e.target === configModal) configModal.classList.remove('ativo');
});

async function salvarTitulo() {
  const novoTitulo = document.getElementById('novo-titulo').value;
  const tituloColor = document.getElementById('titulo-color').value;
  try {
    showLoading();
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ tituloSite: novoTitulo, cores: { ...currentColors, text: tituloColor } })
    });
    if (!res.ok) throw new Error('Falha ao salvar título');
    const config = await res.json();
    tituloSite.textContent = config.tituloSite;
    currentColors.text = config.cores.text;
    applyColors();
    alert('Título e cor salvos com sucesso!');
  } catch (error) {
    alert('Erro ao salvar título: ' + error.message);
  } finally {
    hideLoading();
  }
  configModal.classList.remove('ativo');
}

async function salvarFoto() {
  const novaFoto = document.getElementById('nova-foto').files[0];
  if (novaFoto) {
    const formData = new FormData();
    formData.append('fotoPerfil', novaFoto);
    try {
      showLoading();
      const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formData
      });
      if (!res.ok) throw new Error('Falha ao salvar foto');
      const config = await res.json();
      fotoPerfil.src = config.fotoPerfil;
      alert('Foto salva com sucesso!');
    } catch (error) {
      alert('Erro ao salvar foto: ' + error.message);
    } finally {
      hideLoading();
    }
  } else {
    alert('Por favor, selecione uma foto.');
  }
  configModal.classList.remove('ativo');
}

async function salvarDescricao() {
  const novaDescricao = document.getElementById('nova-descricao').value;
  try {
    showLoading();
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ descricaoArtista: novaDescricao })
    });
    if (!res.ok) throw new Error('Falha ao salvar descrição');
    const config = await res.json();
    descricaoArtista.textContent = config.descricaoArtista;
    alert('Descrição salva com sucesso!');
  } catch (error) {
    alert('Erro ao salvar descrição: ' + error.message);
  } finally {
    hideLoading();
  }
  configModal.classList.remove('ativo');
}

async function salvarRedes() {
  const instaLink = document.getElementById('insta-link').value;
  const youtubeLink = document.getElementById('youtube-link').value;
  const whatsappLink = document.getElementById('whatsapp-link').value;
  try {
    showLoading();
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({
        redesSociais: { instagram: instaLink, youtube: youtubeLink, whatsapp: whatsappLink }
      })
    });
    if (!res.ok) throw new Error('Falha ao salvar redes sociais');
    const config = await res.json();
    redesSociais.innerHTML = `
      <a href="${config.redesSociais.instagram || '#'}" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
      <a href="${config.redesSociais.youtube || '#'}" aria-label="YouTube"><img src="https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png" alt="YouTube" /></a>
      <a href="${config.redesSociais.whatsapp || '#'}" aria-label="WhatsApp"><img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" /></a>
    `;
    alert('Redes sociais salvas com sucesso!');
  } catch (error) {
    alert('Erro ao salvar redes sociais: ' + error.message);
  } finally {
    hideLoading();
  }
  configModal.classList.remove('ativo');
}

function salvarCores() {
  currentColors.background = document.getElementById('bg-color').value;
  currentColors.text = document.getElementById('text-color').value;
  currentColors.accent = document.getElementById('accent-color').value;
  applyColors();
  showLoading();
  fetch('https://desenho-portifolio.onrender.com/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify({ cores: currentColors })
  })
    .then(res => {
      if (!res.ok) throw new Error('Falha ao salvar cores: ' + res.statusText);
      return res.json();
    })
    .then(() => {
      alert('Cores salvas com sucesso!');
      configModal.classList.remove('ativo');
    })
    .catch(err => {
      alert('Erro ao salvar cores: ' + err.message);
      console.error('Detalhes do erro:', err);
    })
    .finally(() => hideLoading());
}

async function carregarImagensParaGerenciar() {
  showLoading();
  const url = 'https://desenho-portifolio.onrender.com/api/imagens';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar imagens');
    const dados = await res.json();
    const imagensList = document.getElementById('imagens-list');
    imagensList.innerHTML = '';
    dados.imagens.forEach(imagem => {
      const div = document.createElement('div');
      div.innerHTML = `
        <img src="${imagem.url}" alt="${imagem.titulo}" style="max-width: 100px;" />
        <p>${imagem.titulo}</p>
        <button onclick="deletarImagem('${imagem._id}')">Remover</button>
      `;
      imagensList.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao carregar imagens para gerenciar:', error);
  } finally {
    hideLoading();
  }
}

async function deletarImagem(id) {
  if (confirm('Tem certeza que deseja deletar esta imagem?')) {
    try {
      showLoading();
      const res = await fetch(`https://desenho-portifolio.onrender.com/api/imagens/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Falha ao deletar imagem');
      alert('Imagem deletada com sucesso!');
      carregarImagens();
      carregarImagensParaGerenciar();
    } catch (error) {
      alert('Erro ao deletar imagem: ' + error.message);
    } finally {
      hideLoading();
    }
  }
}

carregarConfiguracoes();
carregarImagens();
applyColors();