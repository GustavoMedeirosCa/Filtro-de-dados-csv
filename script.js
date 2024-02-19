function fillTable(data) {
    const tableBody = document.getElementById('table-body');
    const processList = document.getElementById('process-list');
    tableBody.innerHTML = '';
    processList.innerHTML = '';

    // Itera sobre as diretorias
    data.diretorias.forEach((diretoria, index) => {
        const row = document.createElement('tr');
        if(diretoria != ""){
            row.innerHTML = `
                <td class="directorate">${diretoria}</td>
                <td>${data.numeroProcessos[index]}</td>
            `;
         }
        tableBody.appendChild(row);
    
        const processosDiretoria = data.processosDiretorias[index];
        const ul = document.createElement('ul');
        processosDiretoria.forEach(arrayDeProcessos => {
            arrayDeProcessos.forEach(processo => {
                console.log(processo);
                if(processo=="s"){
                    const listItem = document.createElement('li');
                    // Modifique aqui para formatar os processos como desejar
                    listItem.textContent = processo;
                    ul.appendChild(listItem);
                }
            });
        });
        processList.appendChild(ul);
    });
    

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
    console.log(processos);
    // Verifica se processos estão definidos antes de iterar sobre eles
    if (processos) {
        processos.forEach(subprocessos => { // Itera sobre os subprocessos
            if (Array.isArray(subprocessos)) { // Verifica se é um array
                const sublist = document.createElement('ul'); // Cria uma lista
                subprocessos.forEach(processo => { // Itera sobre os processos
                    const listItem = document.createElement('li');
                    listItem.textContent = processo;
                    sublist.appendChild(listItem); // Adiciona o item à lista
                });
                processList.appendChild(sublist); // Adiciona a lista de items à lista principal de processos
            } else {
                console.error("Os subprocessos não são um array:", subprocessos);
            }
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
    var u = 0;

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
                const processosDiretoria = []; // Array para armazenar os processos desta diretoria
                const array1 = [];
                for (let j = 2; j < rows.length; j++) {
                    var cols2 = rows[j].split(',');
                    array1.push(cols2[u]);
                    // array1.push(cols2[j].trim());
                }
                u++;
                
                const primeiroProcesso = array1;
                if (primeiroProcesso !== "") {
                    processosDiretoria.push(primeiroProcesso);
                }

                // Adiciona os processos desta diretoria ao array de processos das diretorias
                processosDiretorias.push(processosDiretoria);
            }
        }
    }
    // console.log( diretorias);
    // console.log( numeroProcessos);
    // console.log(processosDiretorias);

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
