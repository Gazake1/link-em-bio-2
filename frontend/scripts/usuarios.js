let usuariosCache = [];

async function carregarUsuarios() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/admin/users", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const users = await res.json();
  usuariosCache = users;

  document.getElementById("total").innerText = users.length;
  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nome}</td>
      <td>${formatarData(user.data_nascimento)}</td>
      <td>${user.telefone || "-"}</td>
      <td>${user.email}</td>
      <td>${user.cpf}</td>
      <td>${user.frequencia || "-"}</td>
      <td>${user.rank}</td>
      <td>${user.status || "-"}</td>
      <td>${user.ultima_visita ? formatarData(user.ultima_visita) : "-"}</td>
      <td>
        <button class="edit" onclick="abrirModal(${user.id})">Editar</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function abrirModal(id) {
  const u = usuariosCache.find(user => user.id === id);

  document.getElementById("edit-id").value = u.id;
  document.getElementById("edit-nome").value = u.nome;
  document.getElementById("edit-email").value = u.email;
  document.getElementById("edit-telefone").value = u.telefone || "";
  document.getElementById("edit-nascimento").value = u.data_nascimento.split("T")[0];
  document.getElementById("edit-frequencia").value = u.frequencia || "";
  document.getElementById("edit-status").value = u.status || "ativo";
  document.getElementById("edit-rank").value = u.rank;
  document.getElementById("edit-visita").value =
    u.ultima_visita ? u.ultima_visita.split("T")[0] : "";

  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  document.getElementById("modal").classList.add("hidden");
}

async function salvarEdicao() {
  const id = document.getElementById("edit-id").value;
  const token = localStorage.getItem("token");

  await fetch(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nome: document.getElementById("edit-nome").value,
      email: document.getElementById("edit-email").value,
      telefone: document.getElementById("edit-telefone").value,
      data_nascimento: document.getElementById("edit-nascimento").value,
      frequencia: document.getElementById("edit-frequencia").value,
      status: document.getElementById("edit-status").value,
      rank: document.getElementById("edit-rank").value,
      ultima_visita: document.getElementById("edit-visita").value || null
    })
  });

  fecharModal();
  carregarUsuarios();
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

carregarUsuarios();
