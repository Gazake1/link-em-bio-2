/* =========================
   ESTADO GLOBAL
========================= */
let currentPage = 1;
const limit = 10;

let searchTerm = "";
let filtroRank = "";
let filtroStatus = "";
let filtroFreq = "";

let usuariosCache = [];

/* =========================
   CARREGAR USUÁRIOS
========================= */
async function carregarUsuarios(page = 1) {
  const token = localStorage.getItem("token");
  currentPage = page;

  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (searchTerm) params.append("search", searchTerm);
  if (filtroRank) params.append("rank", filtroRank);
  if (filtroStatus) params.append("status_cliente", filtroStatus);
  if (filtroFreq) params.append("freq_min", filtroFreq);

  const res = await fetch(`/api/admin/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();

  usuariosCache = data.users;

  document.getElementById("total").textContent = data.total;

  renderizarTabela(data.users);
  criarPaginacao(data.page, data.totalPages);
}

/* =========================
   RENDER TABELA
========================= */
function renderizarTabela(users) {
  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  if (!users.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align:center;">Nenhum usuário encontrado</td>
      </tr>
    `;
    return;
  }

  users.forEach(user => {
    tbody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.nome}</td>
        <td>${formatarData(user.data_nascimento)}</td>
        <td>${user.telefone || "-"}</td>
        <td>${user.email}</td>
        <td>${user.cpf}</td>
        <td>${user.frequencia}</td>
        <td>
          <span class="badge badge-${user.rank.toLowerCase()}">
            ${user.rank}
          </span>
        </td>
        <td>
          <span class="badge status-${user.status_cliente}">
            ${user.status_cliente}
          </span>
        </td>
        <td>
          ${user.ultima_visita ? formatarData(user.ultima_visita) : "-"}
        </td>
        <td>
          <button class="edit" onclick="abrirModal(${user.id})">
            Editar
          </button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   PAGINAÇÃO PROGRESSIVA
========================= */
function criarPaginacao(paginaAtual, totalPages) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  // botão anterior
  if (paginaAtual > 1) {
    container.innerHTML += `
      <button onclick="carregarUsuarios(${paginaAtual - 1})">
        ←
      </button>
    `;
  }

  // páginas progressivas
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= paginaAtual - 1 && i <= paginaAtual + 1)
    ) {
      container.innerHTML += `
        <button
          class="${i === paginaAtual ? "active" : ""}"
          onclick="carregarUsuarios(${i})"
        >
          ${i}
        </button>
      `;
    }
  }

  // botão próximo
  if (paginaAtual < totalPages) {
    container.innerHTML += `
      <button onclick="carregarUsuarios(${paginaAtual + 1})">
        →
      </button>
    `;
  }
}

/* =========================
   BUSCA
========================= */
function buscar(valor) {
  searchTerm = valor.trim();
  carregarUsuarios(1);
}

/* =========================
   FILTROS
========================= */
function filtrar() {
  filtroRank = document.getElementById("filter-rank").value;
  filtroStatus = document.getElementById("filter-status").value;
  filtroFreq = document.getElementById("filter-freq").value;

  carregarUsuarios(1);
}

/* =========================
   MODAL
========================= */
function abrirModal(id) {
  const user = usuariosCache.find(u => u.id === id);
  if (!user) return;

  document.getElementById("edit-id").value = user.id;
  document.getElementById("edit-nome").value = user.nome;
  document.getElementById("edit-email").value = user.email;
  document.getElementById("edit-telefone").value = user.telefone || "";
  document.getElementById("edit-nascimento").value =
    user.data_nascimento?.split("T")[0] || "";
  document.getElementById("edit-frequencia").value = user.frequencia;
  document.getElementById("edit-status").value = user.status_cliente;
  document.getElementById("edit-rank").value = user.rank;
  document.getElementById("edit-ultima_visita").value =
    user.ultima_visita?.split("T")[0] || "";

  document.getElementById("modalEditar").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modalEditar").classList.add("hidden");
}

/* =========================
   SALVAR EDIÇÃO
========================= */
async function salvarEdicao() {
  const token = localStorage.getItem("token");
  const id = document.getElementById("edit-id").value;

  const body = {
    nome: document.getElementById("edit-nome").value,
    email: document.getElementById("edit-email").value,
    telefone: document.getElementById("edit-telefone").value,
    data_nascimento: document.getElementById("edit-nascimento").value,
    frequencia: Number(document.getElementById("edit-frequencia").value),
    status_cliente: document.getElementById("edit-status").value,
    rank: document.getElementById("edit-rank").value,
    ultima_visita:
      document.getElementById("edit-ultima_visita").value || null
  };

  await fetch(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  fecharModal();
  carregarUsuarios(currentPage);
}

/* =========================
   UTIL
========================= */
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}

/* =========================
   INIT
========================= */
carregarUsuarios();
