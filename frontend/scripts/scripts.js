const form = document.querySelector(".form");
let resposta = document.getElementById("mensagem")


form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const data_nascimento = document.getElementById("data").value;

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        cpf,
        telefone,
        email,
        data_nascimento
      })
    });

    const data = await response.json();

    if (!response.ok) {
      resposta.textContent = (data.error || "Erro ao cadastrar");
      return;
    }

    resposta.textContent = ("Cadastro realizado com sucesso!");
    form.reset();
  } catch (error) {
    console.error(error);
    resposta.textContent = ("Erro de conexão com o servidor");
  }
});
