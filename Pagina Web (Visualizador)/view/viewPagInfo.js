import {fetchAllSensors} from '../model/modelPagInfo.js';

function capitalizeFirstLetter(string) {
    return string ? string.trim().charAt(0).toUpperCase() + string.slice(1).toLowerCase() : '';
}

export async function displayDeviceInfo(data, dataSensor) {
    const infoContainer = document.getElementById('info');
    infoContainer.innerHTML = ''; 
    const todosSensores = await fetchAllSensors();
    const dthrIntalacao = data.dthr_instalacao.toDate().toLocaleString();
    const dthrUltConexao = data.dthr_ult_conexao ? new Date(data.dthr_ult_conexao).toLocaleString() : "Data desconhecida";

    // Mapeia os sensores com suas unidades
    const listaSensoresComUnidades = data.lista_sensores.map((sensor_id, index) => {
        const unidade = dataSensor[index]; 
        return `${sensor_id} (${unidade})`;
    });

    const section = `
        <section class="mb-4">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="tituloCard card-title mb-0 text-center flex-grow-1">${capitalizeFirstLetter(data.nome)}</h5>
                        <div>
                            <div id="messageExcluir" class="card-text text-center" style="display: none;">Botão Excluir</div>
                            <div id="messageBaixar" class="card-text text-center" style="display: none;">Botão Baixar</div>
                            <div id="messageAlt" class="card-text text-center" style="display: none;">Botão Alterar</div>
                            
                            <button id="downloadBtn"  class="btn btn-sm btn-success mr-2" data-bs-toggle="tooltip" data-bs-placement="top" title="Baixar Documento">
                                <i class="bi bi-file-earmark-arrow-down"></i>
                            </button>
                            
                            <button id="btnAlterar" class="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#editarDispositivo">
                                <i class="bi bi-pencil-square"></i>
                            </button>

                            <button id="btnExcluir" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deletarDispositivo">
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </div>
                    <p class="card-text">Descrição: ${data.descricao || "Não tem descrição"}</p>
                    <p class="card-text">ID do Dispositivo: ${data.id || "Não foi possível adquirir o ID"}</p>
                    <p class="card-text">Data e Hora da Instalação: ${dthrIntalacao || "Data desconhecida"}</p>
                    <p class="card-text">Data e Hora da Última Conexão: ${dthrUltConexao}</p>
                    <p class="card-text">Endereço MAC: ${data.end_mac || "Não foi possível obter"}</p>
                    <p class="card-text">Lista de Sensores: ${listaSensoresComUnidades.length > 0 ? listaSensoresComUnidades.join(', ') : "Não possui sensores"}</p>
                    <p class="card-text">Localização: ${data.localizacao || "Desconhecida"}</p>
                    <p class="card-text">Status: ${data.status || "Desconhecido"}</p>
                    <p class="card-text">Tipo de Dispositivo: ${data.tipo_dispositivo || "Desconhecido"}</p>
                </div>
            </div>
        </section>
        <section>
            <div class="modal fade" id="editarDispositivo" tabindex="-1" aria-labelledby="editarDispositivo" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 text-center w-100" id="editarDispositivo">${data.nome}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="descricaoModal">
                                <div class="mb-3">
                                    <label for="nomeDispositivo" class="form-label">Nome do Dispositivo</label>
                                    <input type="text" class="form-control" id="nomeDispositivo" value="${data.nome}">
                                </div>
                                <div class="mb-3">
                                    <label for="descricaoDispositivo" class="form-label">Descrição do Dispositivo</label>
                                    <textarea class="form-control" id="descricaoDispositivo">${data.descricao || ""}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="localizacao" class="form-label">Localização</label>
                                    <input type="text" class="form-control" id="localizacao" value="${data.localizacao || ""}">
                                </div>
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <input type="text" class="form-control" id="status" value="${data.status || ""}">
                                </div>
                                <div class="mb-3">
                                    <label for="tipoDispositivo" class="form-label">Tipo do Dispositivo</label>
                                    <input type="text" class="form-control" id="tipoDispositivo" value="${data.tipo_dispositivo || ""}">
                                </div>
                                <fieldset class="mb-3">
                                    <legend>Sensores</legend>
                                    ${todosSensores.map(sensor => `
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="sensor" value="${sensor}" ${data.lista_sensores.includes(sensor) ? 'checked' : ''}>
                                            <label class="form-check-label">${sensor}</label>
                                        </div>
                                    `).join('')}
                                </fieldset>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button id="btnSalvar" type="submit" class="btn btn-success" data-bs-dismiss="modal">Salvar Alterações</button>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="modal fade" id="deletarDispositivo" tabindex="-1" aria-labelledby="deletarDispositivo" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5 text-center w-100" id="deletarDispositivo">Apagar o Dispositivo: ${data.nome}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            Você tem certeza que deseja apagar o dispositivo ${data.nome.bold()}?
                            <p>Esta ação ${"NÃO".bold()} poderá ser desfeita.</p>
                        </div>
                        <div class="modal-footer">
                            <button id="btnConfirmar" type="submit" class="btn btn-success" data-bs-dismiss="modal">Sim, eu tenho</button>
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    infoContainer.innerHTML += section;
}

export function showAlert(message) {
    alert(message);
    document.getElementById("saida").innerHTML = `
    <h4>Algo deu Errado</h4><br>
    <p>${message.bold()}</p>
    `;
}

export function getFormData() {
    return {
        nome: document.getElementById("nomeDispositivo").value,
        descricao: document.getElementById("descricaoDispositivo").value,
        localizacao: document.getElementById("localizacao").value,
        status: document.getElementById("status").value,
        tipo_dispositivo: document.getElementById("tipoDispositivo").value,
        lista_sensores: Array.from(document.querySelectorAll('input[name="sensor"]:checked')).map(cb => cb.value)
    };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('');
}
// Função para criar o gráfico
let myChart; // Variável global para o gráfico

export function createChart(listaSensores, sensorData, timeData) {
    const ctx = document.getElementById('myChart').getContext('2d');

    const datasets = listaSensores.map(sensor => ({
        label: sensor,
        data: sensorData[sensor],
        borderColor: getRandomColor(),
        fill: false,
        tension: 0.2,
        spanGaps: true,
    }));

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeData,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'MMM d, HH:mm',
                            day: 'MMM d',
                        },
                    },
                    title: {
                        display: true,
                        text: 'Data e Hora',
                    }
                },
                y: {
                    type: 'logarithmic',
                    ticks: {
                        font: {
                            size: 15
                        },
                        autoSkip: true,
                        maxTicksLimit: 10,
                        stepSize: 10
                    },
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valores',
                    },
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

}

// Função para filtrar dados do gráfico
export function filterData(listaSensores, sensorData, timeData) {
    const inicio = new Date(document.getElementById('dataInicio').value);
    const fim = new Date(document.getElementById('dataFim').value);

    if (!inicio || !fim || inicio > fim) {
        alert('Por favor, preencha ambas as datas com valor válido (data inicial, data final).');
        document.getElementById('dataInicio').value = "";
        document.getElementById('dataFim').value = "";
        return;
    }

    const dadosFiltrados = { time: [] };

    for (let i = 0; i < timeData.length; i++) {
        const dataItem = new Date(timeData[i]);
        if (dataItem >= inicio && dataItem <= fim) {
            dadosFiltrados.time.push(timeData[i]);
            listaSensores.forEach(sensor => {
                if (sensorData[sensor][i] !== null) {
                    if (!dadosFiltrados[sensor]) {
                        dadosFiltrados[sensor] = [];
                    }
                    dadosFiltrados[sensor].push(sensorData[sensor][i]);
                } else {
                    if (!dadosFiltrados[sensor]) {
                        dadosFiltrados[sensor] = [];
                    }
                    if (dadosFiltrados[sensor].length > 0) {
                        dadosFiltrados[sensor].push(dadosFiltrados[sensor][dadosFiltrados[sensor].length - 1]);
                    } else {
                        dadosFiltrados[sensor].push(null);
                    }
                }
            });
        }
    }

    if (dadosFiltrados.time.length === 0) {
        alert('Nenhum dado encontrado para o intervalo de datas especificado.');
        return;
    }

    myChart.data.labels = dadosFiltrados.time;
    listaSensores.forEach(sensor => {
        if (dadosFiltrados[sensor]) {
            const dataset = myChart.data.datasets.find(ds => ds.label === sensor);
            if (dataset) {
                dataset.data = dadosFiltrados[sensor];
            }
        }
    });

    myChart.update();
}