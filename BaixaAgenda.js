function gerarPDF() {
    const agenda = document.querySelector('.agenda-semanal');
    if (agenda) {
        const pdf = new jsPDF();
        pdf.text("Agenda Semanal", 10, 10); // Título do PDF

        const dados = [];
        const linhas = agenda.querySelectorAll('tr');
        linhas.forEach(linha => {
            const celulas = Array.from(linha.querySelectorAll('td, th')).map(celula => celula.innerText);
            dados.push(celulas);
        });

        pdf.autoTable({
            head: [dados[0]], // Cabeçalho da tabela
            body: dados.slice(1), // Corpo da tabela
            startY: 20
        });

        pdf.save("agenda-semanal.pdf"); // Salva o arquivo como "agenda-semanal.pdf"
    } else {
        alert("Agenda não encontrada para exportar.");
    }
}
