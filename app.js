const API = "http://localhost:3000";

class SistemaClinica {
    constructor() {
        document.getElementById('form-login').addEventListener('submit', (e) => this.autenticar(e));
        
        this.iniciarEventos();
    }

    async autenticar(evento) {
        evento.preventDefault();
        
        const login = document.getElementById('login-usuario').value;
        const senha = document.getElementById('senha-usuario').value;
        const msgErro = document.getElementById('mensagem-erro-login');

        try {
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, senha })
            });

            const dados = await res.json();

            if (res.ok) {
                document.getElementById('tela-login').style.display = 'none';
                document.getElementById('sistema-principal').style.display = 'block';
                this.atualizarTabela();
            } else {
                msgErro.innerText = dados.erro;
                msgErro.style.display = 'block';
            }
        } catch (erro) {
            console.error("Erro ao conectar com a API:", erro);
            msgErro.innerText = "Servidor offline!";
            msgErro.style.display = 'block';
        }
    }

     iniciarEventos() {
    const form = document.getElementById('form-paciente');
    const linkDash = document.getElementById('link-dashboard');
    const linkCad = document.getElementById('link-cadastro');
    const inputCPF = document.getElementById('cpf');

    if (form) {
        form.addEventListener('submit', (e) => this.salvarPaciente(e));
    }

    if (linkDash) {
        linkDash.addEventListener('click', (e) => {
            e.preventDefault();
            this.navegar('tela-dashboard', 'link-dashboard');
            this.atualizarTabela(); 
        });
    }

    if (linkCad) {
        linkCad.addEventListener('click', (e) => {
            e.preventDefault();
            this.limparFormulario();
            this.navegar('tela-cadastro', 'link-cadastro');
        });
    }

    if (inputCPF) {
        inputCPF.addEventListener('input', (e) => {
            document.getElementById('erro-cpf').style.display = 'none';
            let v = e.target.value.replace(/\D/g, ""); 
            if (v.length > 11) v = v.substring(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            
            e.target.value = v;
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

        const cpfValor = document.getElementById('cpf').value;
    const erroCPF = document.getElementById('erro-cpf');
    if (!this.validarCPF(cpfValor)) {
        erroCPF.style.display = 'block';
        document.getElementById('cpf').focus();
        return;
    } else {
        erroCPF.style.display = 'none';
    }
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

    async atualizarTabela(ordenacao = 'nome') {
        try {
            const res = await fetch(`${API}/cliente?ordem=${ordenacao}`);
            const pacientes = await res.json();

            const tbody = document.querySelector('#tabela-pacientes tbody');
            if (!tbody) return;

            tbody.innerHTML = '';

pacientes.forEach(p => {
    let cpfFormatado = p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    let telFormatado = p.telefone;
    if (telFormatado.length === 11) {
        telFormatado = telFormatado.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><strong>${p.nome}</strong></td>
        <td>${cpfFormatado}</td>
        <td>${telFormatado}</td>
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
validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); 

    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}
}

const instanciaApp = new SistemaClinica();
