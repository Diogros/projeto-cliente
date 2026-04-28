Sistema de Gestão Clínica - Mecânica Precision
Este projeto consiste numa solução full-stack desenvolvida para a gestão de pacientes, integrando uma aplicação desktop robusta com uma interface web de consulta rápida. O sistema foi concebido para automatizar o fluxo de atendimento, desde o registo inicial até à consulta de dados por parte do utilizador final.  

Descrição do Projeto
A aplicação permite o controlo total de pacientes através de um sistema CRUD (Create, Read, Update, Delete).  


Módulo Administrativo (Desktop): Desenvolvido em Electron para uso interno da clínica, permitindo gerir cadastros com validações de segurança.  


Módulo de Consulta (Web): Uma página leve que permite aos pacientes consultarem os seus próprios dados através do CPF, garantindo acessibilidade e integração entre plataformas.  

Tecnologias Utilizadas

Ambiente de Execução: Node.js   


Framework Desktop: Electron.js   


Backend: Express para criação da API   


Banco de Dados: MySQL para persistência de dados   


Frontend: HTML5, CSS3 (com variáveis nativas e animações) e JavaScript Vanilla   

Demonstração
(Dica: Substitua os links abaixo pelos caminhos reais das imagens no seu repositório)

Interface de Gestão (Desktop)
Legenda: Dashboard administrativo com listagem ordenada e botões de ação.  

Consulta Web
Legenda: Interface web responsiva para consulta de pacientes por CPF.  

Como Executar o Sistema
1. Preparação do Banco de Dados
Certifique-se de que o MySQL está a correr e execute o seguinte script no seu terminal ou Workbench:

SQL
CREATE DATABASE sistema;
USE sistema;

CREATE TABLE cliente (
    id_clientes INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nascimento DATE,
    telefone VARCHAR(15)
);
2. Instalação de Dependências
No diretório raiz do projeto, instale as bibliotecas necessárias:

Bash
npm install
3. Iniciar a Aplicação
Abra dois terminais:

Terminal 1 (Backend): node server.js

Terminal 2 (Desktop): npm start

Para testar a versão Web, basta abrir o ficheiro consulta.html em qualquer navegador moderno enquanto o servidor estiver ativo. # projeto-cliente
