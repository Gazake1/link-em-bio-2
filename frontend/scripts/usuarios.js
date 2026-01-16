async function carregarUsuarios() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  const res = await fetch("/api/users", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const users = await res.json();

  document.getElementById("total").innerText = users.length;

  const tbody = document.getElementById("lista");
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.nome}</td>
      <td>${formatarData(user.data_nascimento)}</td>
      <td>${user.telefone}</td>
      <td>${user.email}</td>
      <td>${user.cpf}</td>
      <td>
        <div class="actions-btns">
          <button class="edit">Editar</button>
          <button class="delete">Excluir</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

carregarUsuarios();
