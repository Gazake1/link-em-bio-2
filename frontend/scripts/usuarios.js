let usuariosCache = [];

async function carregarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/login.html";

    const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login.html";
        return;
    }

    const data = await res.json();
    const users = Array.isArray(data) ? data : data.users;

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
      <td>${user.frequencia ?? 0}</td>
      <td>${user.rank}</td>
      <td>${user.status}</td>
      <td>${user.ultima_visita ? formatarData(user.ultima_visita) : "-"}</td>
      <td>
        <button class="edit" onclick="abrirModal(${user.id})">Editar</button>
      </td>
    `;

        tbody.appendChild(tr);
    });
}

function abrirModal(id) {
    const user = usuariosCache.find(u => u.id === id);

    document.getElementById("edit-id").value = user.id;
    document.getElementById("edit-nome").value = user.nome;
    document.getElementById("edit-email").value = user.email;
    document.getElementById("edit-telefone").value = user.telefone || "";
    document.getElementById("edit-nascimento").value = user.data_nascimento?.split("T")[0];
    document.getElementById("edit-frequencia").value = user.frequencia || 0;
    document.getElementById("edit-status").value = user.status_cliente;
    document.getElementById("edit-rank").value = user.rank;
    document.getElementById("edit-ultima_visita").value = user.ultima_visita?.split("T")[0] || "";

    document.getElementById("modalEditar").classList.remove("hidden");
}

function fecharModal() {
    document.getElementById("modalEditar").classList.add("hidden");
}

async function salvarEdicao() {
    const token = localStorage.getItem("token");
    const id = document.getElementById("edit-id").value;

    const body = {
        nome: document.getElementById("edit-nome").value,
        email: document.getElementById("edit-email").value,
        telefone: document.getElementById("edit-telefone").value,
        data_nascimento: document.getElementById("edit-nascimento").value,
        frequencia: Number(document.getElementById("edit-frequencia").value),
        status_cliente: document.getElementById("edit-status").value, // ✅
        rank: document.getElementById("edit-rank").value,
        ultima_visita: document.getElementById("edit-ultima_visita").value || null
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
    carregarUsuarios();
}


function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}

carregarUsuarios();
