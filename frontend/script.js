// frontend/script.js

const galeria = document.getElementById('galeria');
const paginacao = document.getElementById('paginacao');
const formEnvio = document.getElementById('form-envio');
const buscaInput = document.getElementById('busca');
const filtroCategoria = document.getElementById('filtro-categoria');

const modal = document.getElementById('modal');
const imagemModal = document.getElementById('imagem-modal');
const fecharModal = document.getElementById('fechar-modal');

let paginaAtual = 1;
const limite = 6; // imagens por página

// 🔄 Carrega imagens da API
async function carregarImagens() {
  const busca = buscaInput.value;
  const categoria = filtroCategoria.value;

  const url = new URL('http://localhost:3000/api/imagens');
  url.searchParams.append('pagina', paginaAtual);
  url.searchParams.append('limite', limite);
  if (busca) url.searchParams.append('busca', busca);
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
    `;
    div.addEventListener('click', () => abrirModal(imagem.url));
    galeria.appendChild(div);
  });

  gerarPaginacao(dados.total);
}

// 📤 Enviar imagem para backend
formEnvio.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formEnvio);

  const res = await fetch('http://localhost:3000/api/imagens/upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    alert('Imagem enviada com sucesso!');
    formEnvio.reset();
    carregarImagens();
  } else {
    alert('Erro ao enviar imagem.');
  }
});

// 🔁 Paginação
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

// 🔍 Filtros de busca e categoria
buscaInput.addEventListener('input', () => {
  paginaAtual = 1;
  carregarImagens();
});
filtroCategoria.addEventListener('change', () => {
  paginaAtual = 1;
  carregarImagens();
});

// 🔍 Modal de imagem
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

// 🚀 Inicial
carregarImagens();

// === MENU HAMBÚRGUER FUNCIONAL ===
const toggleBtn = document.createElement('div');
toggleBtn.classList.add('menu-toggle');
toggleBtn.innerHTML = `<div></div><div></div><div></div>`;
document.querySelector('header').appendChild(toggleBtn);

toggleBtn.addEventListener('click', () => {
  const nav = document.querySelector('nav');
  nav.classList.toggle('menu-ativo');
});

// === MOSTRAR FORMULÁRIO DE ENVIO COM BOTÃO ===
const formContainer = document.querySelector('.formulario-envio');
const botaoMostrarForm = document.createElement('button');
botaoMostrarForm.textContent = 'Adicionar Arte';
botaoMostrarForm.classList.add('botao-envio-discreto');

formContainer.parentNode.insertBefore(botaoMostrarForm, formContainer);
formContainer.style.display = 'none';

botaoMostrarForm.addEventListener('click', () => {
  formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
});

