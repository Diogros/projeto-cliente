const API = "http://localhost:3000";

class SistemaClinica {
    constructor() {
        this.iniciarEventos();
        this.atualizarTabela();
    }

    iniciarEventos() {
        const form = document.getElementById('form-paciente');
        const linkDash = document.getElementById('link-dashboard');
        const linkCad = document.getElementById('link-cadastro');

        if (form) {
            form.addEventListener('submit', (e) => this.salvarPaciente(e));
        }

        if (linkDash) {
            linkDash.addEventListener('click', (e) => {
                e.preventDefault();
                this.navegar('tela-dashboard', 'link-dashboard');
                this.atualizarTabela(); // Atualiza ao voltar para a lista
            });
        }

        if (linkCad) {
            linkCad.addEventListener('click', (e) => {
                e.preventDefault();
                this.limparFormulario();
                this.navegar('tela-cadastro', 'link-cadastro');
            });
        }
    }

    navegar(idTela, idLink) {
        document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
        document.querySelectorAll('.menu-principal a').forEach(l => l.classList.remove('ativo'));

        const tela = document.getElementById(idTela);
        const link = document.getElementById(idLink);
        
        if (tela) tela.classList.add('ativa');
        if (link) link.classList.add('ativo');
    }

    async salvarPaciente(evento) {
        evento.preventDefault();

        const idInput = document.getElementById('paciente-id').value;
        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            nascimento: document.getElementById('nascimento').value,
            telefone: document.getElementById('telefone').value
        };

        try {
            let url = `${API}/cliente`;
            let metodo = "POST";

            if (idInput) {
                url = `${API}/cliente/${idInput}`;
                metodo = "PUT";
            }

            const res = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });

            if (res.ok) {
                alert(idInput ? "Paciente atualizado com sucesso!" : "Paciente cadastrado com sucesso!");
                this.limparFormulario();
                this.atualizarTabela();
                this.navegar('tela-dashboard', 'link-dashboard');
            } else {
                alert("Erro ao salvar no banco de dados.");
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    async atualizarTabela() {
        try {
            const res = await fetch(`${API}/cliente`);
            const pacientes = await res.json();

            const tbody = document.querySelector('#tabela-pacientes tbody');
            if (!tbody) return;

            tbody.innerHTML = '';

            pacientes.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${p.nome}</strong></td>
                    <td>${p.cpf}</td>
                    <td>${p.telefone}</td>
                    <td>
                        <button class="btn-acao btn-editar" onclick="instanciaApp.prepararEdicao(${p.id_clientes})">Editar</button>
                        <button class="btn-acao btn-excluir" onclick="instanciaApp.excluirPaciente(${p.id_clientes})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            const mensagemVazia = document.getElementById('mensagem-vazia');
            const tabela = document.getElementById('tabela-pacientes');
            
            if (pacientes.length === 0) {
                if (mensagemVazia) mensagemVazia.style.display = 'block';
                if (tabela) tabela.style.display = 'none';
            } else {
                if (mensagemVazia) mensagemVazia.style.display = 'none';
                if (tabela) tabela.style.display = 'table';
            }
        } catch (erro) {
            console.error("Erro ao carregar tabela:", erro);
        }
    }

    async prepararEdicao(id) {
        try {
            const res = await fetch(`${API}/cliente/${id}`);
            const p = await res.json();

            document.getElementById('paciente-id').value = p.id_clientes;
            document.getElementById('nome').value = p.nome;
            document.getElementById('email').value = p.email || '';
            document.getElementById('cpf').value = p.cpf;
            document.getElementById('telefone').value = p.telefone;
            
            if (p.nascimento) {
                document.getElementById('nascimento').value = p.nascimento.substring(0, 10);
            }

            document.getElementById('titulo-form').innerText = "Editando Paciente";
            this.navegar('tela-cadastro', 'link-cadastro');
        } catch (erro) {
            console.error("Erro ao carregar paciente:", erro);
        }
    }

    async excluirPaciente(id) {
        if (confirm("Deseja realmente excluir este paciente?")) {
            try {
                const res = await fetch(`${API}/cliente/${id}`, {
                    method: "DELETE"
                });

                if (res.ok) {
                    this.atualizarTabela();
                } else {
                    alert("Erro ao excluir do banco.");
                }
            } catch (erro) {
                console.error("Erro ao excluir:", erro);
            }
        }
    }

    limparFormulario() {
        const form = document.getElementById('form-paciente');
        if (form) form.reset();
        document.getElementById('paciente-id').value = "";
        document.getElementById('titulo-form').innerText = "Novo Paciente";
    }
}

const instanciaApp = new SistemaClinica();