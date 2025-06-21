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
const configPanel = document.getElementById('config-panel');
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

let paginaAtual = 1;
const limite = 6;
let currentColors = { background: '#000', text: '#fff', accent: '#fff' };

async function carregarConfiguracoes() {
  try {
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config');
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
}

async function carregarImagens(categoria = '') {
  const url = new URL('https://desenho-portifolio.onrender.com/api/imagens');
  url.searchParams.append('pagina', paginaAtual);
  url.searchParams.append('limite', limite);
  if (categoria) url.searchParams.append('categoria', categoria);

  const res = await fetch(url);
  const dados = await res.json();

  galeria.innerHTML = '';
  dados.imagens.forEach(imagem => {
    const div = document.createElement('div');
    div.classList.add('item-galeria');
    div.innerHTML = `
      <img src="${imagem.url}" alt="${imagem.titulo}" />
      <h3>${imagem.titulo}</h3>
      <p>${imagem.descricao}</p>
      <button class="edit-btn" data-id="${imagem._id}">Editar</button>
      <button class="delete-btn" data-id="${imagem._id}">Deletar</button>
    `;
    div.querySelector('.edit-btn').addEventListener('click', () => editarImagem(imagem._id));
    div.querySelector('.delete-btn').addEventListener('click', () => deletarImagem(imagem._id));
    div.addEventListener('click', (e) => {
      if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
        abrirModal(imagem.url);
      }
    });
    galeria.appendChild(div);
  });

  gerarPaginacao(dados.total);
}

formEnvio.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formEnvio);

  const res = await fetch('https://desenho-portifolio.onrender.com/api/imagens/upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Imagem enviada com sucesso!');
    formEnvio.reset();
    formEnvioContainer.style.display = 'none';
    carregarImagens();
  } else {
    alert('Erro ao enviar imagem: ' + (await res.text()));
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
    if (window.innerWidth <= 768) {
      nav.classList.remove('ativo');
    }
  });
});

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('ativo');
});

function abrirModal(src) {
  imagemModal.src = src;
  modal.classList.add('ativo');
}
fecharModal.addEventListener('click', () => {
  modal.classList.remove('ativo');
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('ativo');
});

const formContainer = document.getElementById('form-envio-container');
const botaoMostrarForm = document.createElement('button');
botaoMostrarForm.textContent = 'Adicionar Arte';
botaoMostrarForm.classList.add('botao-envio-discreto');

formContainer.parentNode.insertBefore(botaoMostrarForm, formContainer);
formContainer.style.display = 'none';

botaoMostrarForm.addEventListener('click', () => {
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
});

// Configurações
configBtn.addEventListener('click', () => {
  configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('edit-titulo').addEventListener('click', () => {
  configContent.innerHTML = `
    <h3>Editar Título</h3>
    <input type="text" id="novo-titulo" value="${tituloSite.textContent}" />
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
    <input type="color" id="bg-color" value="${currentColors.background}" />
    <input type="color" id="text-color" value="${currentColors.text}" />
    <input type="color" id="accent-color" value="${currentColors.accent}" />
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

fecharConfigModal.addEventListener('click', () => {
  configModal.classList.remove('ativo');
});
configModal.addEventListener('click', (e) => {
  if (e.target === configModal) configModal.classList.remove('ativo');
});

async function salvarTitulo() {
  const novoTitulo = document.getElementById('novo-titulo').value;
  const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tituloSite: novoTitulo })
  });
  if (res.ok) {
    const config = await res.json();
    tituloSite.textContent = config.tituloSite;
    alert('Título salvo com sucesso!');
  } else {
    alert('Erro ao salvar título: ' + (await res.text()));
  }
  configModal.classList.remove('ativo');
}

async function salvarFoto() {
  const novaFoto = document.getElementById('nova-foto').files[0];
  if (novaFoto) {
    const formData = new FormData();
    formData.append('fotoPerfil', novaFoto);
    const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
      method: 'PUT',
      body: formData
    });
    if (res.ok) {
      const config = await res.json();
      fotoPerfil.src = config.fotoPerfil;
      alert('Foto salva com sucesso!');
    } else {
      alert('Erro ao salvar foto: ' + (await res.text()));
    }
  } else {
    alert('Por favor, selecione uma foto.');
  }
  configModal.classList.remove('ativo');
}

async function salvarDescricao() {
  const novaDescricao = document.getElementById('nova-descricao').value;
  const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricaoArtista: novaDescricao })
  });
  if (res.ok) {
    const config = await res.json();
    descricaoArtista.textContent = config.descricaoArtista;
    alert('Descrição salva com sucesso!');
  } else {
    alert('Erro ao salvar descrição: ' + (await res.text()));
  }
  configModal.classList.remove('ativo');
}

async function salvarRedes() {
  const instaLink = document.getElementById('insta-link').value;
  const youtubeLink = document.getElementById('youtube-link').value;
  const whatsappLink = document.getElementById('whatsapp-link').value;
  const res = await fetch('https://desenho-portifolio.onrender.com/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      redesSociais: { instagram: instaLink, youtube: youtubeLink, whatsapp: whatsappLink }
    })
  });
  if (res.ok) {
    const config = await res.json();
    redesSociais.innerHTML = `
      <a href="${config.redesSociais.instagram || '#'}" aria-label="Instagram"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram" /></a>
      <a href="${config.redesSociais.youtube || '#'}" aria-label="YouTube"><img src="https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png" alt="YouTube" /></a>
      <a href="${config.redesSociais.whatsapp || '#'}" aria-label="WhatsApp"><img src="https://img.icons8.com/ios-filled/50/ffffff/whatsapp.png" alt="WhatsApp" /></a>
    `;
    alert('Redes sociais salvas com sucesso!');
  } else {
    alert('Erro ao salvar redes sociais: ' + (await res.text()));
  }
  configModal.classList.remove('ativo');
}

function salvarCores() {
  currentColors.background = document.getElementById('bg-color').value;
  currentColors.text = document.getElementById('text-color').value;
  currentColors.accent = document.getElementById('accent-color').value;
  applyColors();
  fetch('https://desenho-portifolio.onrender.com/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cores: currentColors })
  }).then(res => {
    if (res.ok) alert('Cores salvas com sucesso!');
    else alert('Erro ao salvar cores: ' + res.statusText);
  }).catch(err => console.error('Erro:', err));
  configModal.classList.remove('ativo');
}

async function carregarImagensParaGerenciar() {
  const url = 'https://desenho-portifolio.onrender.com/api/imagens';
  const res = await fetch(url);
  const dados = await res.json();
  const imagensList = document.getElementById('imagens-list');
  imagensList.innerHTML = '';
  dados.imagens.forEach(imagem => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${imagem.url}" alt="${imagem.titulo}" style="max-width: 100px;" />
      <p>${imagem.titulo}</p>
      <button onclick="editarImagem('${imagem._id}')">Editar</button>
      <button onclick="deletarImagem('${imagem._id}')">Deletar</button>
    `;
    imagensList.appendChild(div);
  });
}

async function editarImagem(id) {
  const url = `https://desenho-portifolio.onrender.com/api/imagens/${id}`;
  const res = await fetch(url);
  const imagem = await res.json();
  configContent.innerHTML = `
    <h3>Editar Imagem</h3>
    <input type="text" id="edit-titulo" value="${imagem.titulo || ''}" />
    <input type="text" id="edit-descricao" value="${imagem.descricao || ''}" />
    <select id="edit-categoria">
      <option value="realismo" ${imagem.categoria === 'realismo' ? 'selected' : ''}>Realismo</option>
      <option value="digital" ${imagem.categoria === 'digital' ? 'selected' : ''}>Digital</option>
      <option value="animes" ${imagem.categoria === 'animes' ? 'selected' : ''}>Animes</option>
    </select>
    <input type="file" id="edit-imagem" />
    <button onclick="salvarEdicao('${id}')">Salvar</button>
  `;
  configModal.classList.add('ativo');
}

async function deletarImagem(id) {
  if (confirm('Tem certeza que deseja deletar esta imagem?')) {
    const res = await fetch(`https://desenho-portifolio.onrender.com/api/imagens/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      alert('Imagem deletada com sucesso!');
      carregarImagens();
      carregarImagensParaGerenciar();
    } else {
      alert('Erro ao deletar imagem: ' + (await res.text()));
    }
  }
}

async function salvarEdicao(id) {
  const formData = new FormData();
  formData.append('titulo', document.getElementById('edit-titulo').value);
  formData.append('descricao', document.getElementById('edit-descricao').value);
  formData.append('categoria', document.getElementById('edit-categoria').value);
  const novaImagem = document.getElementById('edit-imagem').files[0];
  if (novaImagem) formData.append('imagem', novaImagem);

  const res = await fetch(`https://desenho-portifolio.onrender.com/api/imagens/${id}`, {
    method: 'PUT',
    body: formData
  });
  if (res.ok) {
    alert('Imagem atualizada com sucesso!');
    configModal.classList.remove('ativo');
    carregarImagens();
    carregarImagensParaGerenciar();
  } else {
    alert('Erro ao atualizar imagem: ' + (await res.text()));
  }
}

// Inicialização
carregarConfiguracoes();
carregarImagens();
applyColors();