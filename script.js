function fillTable(data) {
    const tableBody = document.getElementById('table-body');
    const processList = document.getElementById('process-list');
    tableBody.innerHTML = '';
    processList.innerHTML = '';

    // Itera sobre as diretorias
    data.diretorias.forEach((diretoria, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="directorate">${diretoria}</td>
            <td>${data.numeroProcessos[index]}</td>
        `;
        tableBody.appendChild(row);
    
        const processosDiretoria = data.processosDiretorias[index];
        processosDiretoria.forEach(processo => {
            const listItem = document.createElement('li');
            listItem.textContent = processo;
            processList.appendChild(listItem);
        });
    });
    

    // Adiciona evento de clique para mostrar processos da diretoria
// Adiciona evento de clique para mostrar processos da diretoria
const directorateCells = document.querySelectorAll('.directorate');
directorateCells.forEach(cell => {
    cell.addEventListener('click', () => {
        const diretoria = cell.textContent;
        const index = data.diretorias.indexOf(diretoria);
        const processosDiretoria = data.processosDiretorias[index];
        showProcessDetails(diretoria, processosDiretoria);
    });
});

}



// Função para mostrar os processos da diretoria clicada
function showProcessDetails(diretoria, processos) {
    const processList = document.getElementById('process-list');
    processList.innerHTML = ''; // Limpa a lista de processos antes de adicionar os novos

    // Verifica se processos estão definidos antes de iterar sobre eles
    if (processos) {
        processos.forEach(processo => {
            const listItem = document.createElement('li');
            listItem.textContent = processo;
            processList.appendChild(listItem);
        });
    } else {
        // Caso não haja processos definidos, exibe uma mensagem indicando isso
        const listItem = document.createElement('li');
        listItem.textContent = "Nenhum processo encontrado para esta diretoria.";
        processList.appendChild(listItem);
    }
}


// Função para ler e processar os dados do arquivo CSV
function parseCSV(csv) {
    const rows = csv.split('\n');
    const diretorias = [];
    const numeroProcessos = [];
    const processosDiretorias = [];

    // Itera sobre as linhas do CSV
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].split(',');

        // A primeira linha contém os nomes das diretorias
        if (i === 0) {
            diretorias.push(...cols);
        } 
        // A segunda linha contém o número de processos em cada diretoria
        else if (i === 1) {
            numeroProcessos.push(...cols);
        } 
        // As linhas restantes contêm os processos de cada diretoria
        else {
            // Ignora linhas vazias
            if (cols.length > 0) {
                processosDiretorias.push(cols);
            }
        }
    }
    console.log(processosDiretorias);
    return { diretorias, numeroProcessos, processosDiretorias };
}




// Função para carregar o arquivo CSV
function loadCSV() {
    fetch('dados.csv')
    .then(response => response.text())
    .then(csv => {
        const data = parseCSV(csv);
        fillTable(data);
    });
}

// Chamada da função para carregar os dados ao carregar a página
window.onload = function() {
    loadCSV();
};
