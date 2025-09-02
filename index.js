let coeficientesArray = [];
let rangoValoresX = [];
let rangoValoresY = [];
let grafico1 = [];
let chartInstance;
let arrayNormalizadoX = [];
let arrayNormalizadoY = [];

// Objeto para guardar las instancias de cada gráfica
let charts = {};

const boton = document.querySelector('#boton');
boton.addEventListener('click', analizarDatos);

function analizarDatos(){
    const numeroEnviado = document.querySelector('#factorMultiplicador').value;

    tablaCoeficientes(numeroEnviado);

    tablaDatosGenerados();

    const { valorMinX, valorMaxX, valorMinY, valorMaxY } = rangoValores();

    tablaDatosGenerados(valorMinX, valorMaxX, valorMinY, valorMaxY);

    graficos(grafico1, 'blue', 'Y normalizado', 'lineChart')

    // Tablas y cálculo de datos -> retornan arrays de puntos {x, y}
    const puntos1 = tabla1Grafico2(arrayNormalizadoX, arrayNormalizadoY);
    const puntos2 = tabla2Grafico2(arrayNormalizadoX, arrayNormalizadoY);

    // Graficamos esos resultados en distintas gráficas
    graficos(puntos1, 'red', 'Promedio Y', 'ventasChart');
    graficos(puntos2, 'green', 'Promedio Y', 'distribucionChart');

    // 🔹 Gráfica combinada
    graficosUnidos([
        { data: grafico1, color: 'blue', label: 'Y normalizado' },
        { data: puntos1, color: 'red', label: 'Promedio Y 1' },
        { data: puntos2, color: 'green', label: 'Promedio Y 2' }
    ], 'combinedChart'); // <-- canvas extra
}


function tablaCoeficientes(numeroEnviado){
    const coeficientesDatos = document.querySelector('#coeficientesDatos');

    coeficientesDatos.innerHTML = "";
    coeficientesArray = [];

    for (let index = 1; index <= 21; index++) {
        let resultadoCoeficiente = (Math.random() -  Math.random()) * numeroEnviado;
        coeficientesArray.push(resultadoCoeficiente);

        const div = document.createElement("div");
        div.innerHTML = `
        <div class="text-center p-3 bg-blue-50 rounded" id="idCoeficiente-${index}">${resultadoCoeficiente.toFixed(4)}</div>
        `;
        coeficientesDatos.appendChild(div);
    }
}

function tablaDatosGenerados(valorMinX, valorMaxX, valorMinY, valorMaxY){
    const tablaDatosGenerados = document.querySelector('#tablaDatosGenerados');

    tablaDatosGenerados.innerHTML = '';
    rangoValoresX = [];
    rangoValoresY = [];
    grafico1 = [];
    arrayNormalizadoX = [];
    arrayNormalizadoY = [];

    for(let i = 0; i <= 360; i++){
    
        let resultadoY1 = coeficientesArray[0] * Math.sin(( coeficientesArray[7] * i + coeficientesArray[14]) * Math.PI / 180);
        let resultadoY2 = coeficientesArray[1] * Math.sin(( coeficientesArray[8] * i + coeficientesArray[15]) * Math.PI / 180);
        let resultadoY3 = coeficientesArray[2] * Math.sin(( coeficientesArray[9] * i + coeficientesArray[16]) * Math.PI / 180);
        let resultadoY4 = coeficientesArray[3] * Math.sin(( coeficientesArray[10] * i + coeficientesArray[17]) * Math.PI / 180);
        let resultadoY5 = coeficientesArray[4] * Math.sin(( coeficientesArray[11] * i + coeficientesArray[18]) * Math.PI / 180);
        let resultadoY6 = coeficientesArray[5] * Math.sin(( coeficientesArray[12] * i + coeficientesArray[19]) * Math.PI / 180);
        let resultadoY7 = coeficientesArray[6] * Math.sin(( coeficientesArray[13] * i + coeficientesArray[20]) * Math.PI / 180);
        let sumatoriaY = resultadoY1 + resultadoY2 + resultadoY3 + resultadoY4 + resultadoY5 + resultadoY6 + resultadoY7;
        let normalizadoX = (i-valorMinX)/(valorMaxX-valorMinX);
        let normalizadoY = (sumatoriaY-valorMinY)/(valorMaxY-valorMinY);

        rangoValoresX.push(i);
        rangoValoresY.push(sumatoriaY)
        grafico1.push({x: normalizadoX, y: normalizadoY});
        arrayNormalizadoX.push(normalizadoX);
        arrayNormalizadoY.push(normalizadoY)

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="sticky-column px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">${i}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY1.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY2.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY3.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY4.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY5.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY6.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${resultadoY7.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">${sumatoriaY.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">${normalizadoX.toFixed(4)}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600">${normalizadoY.toFixed(4)}</td>
        `;

        tablaDatosGenerados.appendChild(tr);
    }
}

function rangoValores(){
    let valorMinX = Math.min(...rangoValoresX);
    let valorMaxX = Math.max(...rangoValoresX);
    let valorMinY = Math.min(...rangoValoresY);
    let valorMaxY = Math.max(...rangoValoresY);
    
    const tablaRangoValores =  document.querySelector('#tablaRangoValores');
    tablaRangoValores.innerHTML = '';
    const html = `
    <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm text-blue-600">X minimo</p>
        <p class="text-2xl font-bold text-blue-800">${valorMinX}</p>
    </div>
    <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-sm text-green-600">X maximo</p>
        <p class="text-2xl font-bold text-green-800">${valorMaxX}</p>
    </div>
    <div class="bg-purple-50 p-4 rounded-lg">
        <p class="text-sm text-purple-600">Y minimo</p>
        <p class="text-2xl font-bold text-purple-800">${valorMinY.toFixed(4)}</p>
    </div>
    <div class="bg-red-50 p-4 rounded-lg">
        <p class="text-sm text-red-600">Y maximo</p>
        <p class="text-2xl font-bold text-red-800">${valorMaxY.toFixed(4)}</p>
    </div>
`;

    document.querySelector('#tablaRangoValores').insertAdjacentHTML('beforeend', html);

    return { valorMinX, valorMaxX, valorMinY, valorMaxY };
}


function graficos(datos, color, etiqueta, id) {
  const ctx = document.getElementById(id).getContext('2d');

  if (charts[id]) {
    charts[id].destroy();
  }

  charts[id] = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: etiqueta,
        data: datos,
        borderColor: color,
        fill: false
      }]
    },
    options: {
      scales: {
        x: { type: 'linear', position: 'bottom' }
      }
    }
  });
}

function tabla1Grafico2(datoA,datoB){
    let conjuntoDatos = {
        Xa: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
        Xb: [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]
    }
    const tablaPromedio1 = document.querySelector('#tablaPromedio1');
    tablaPromedio1.innerHTML = '';

    // Arrays donde vamos a guardar los datos
    let puntos = [];

    for (let i = 0; i < conjuntoDatos.Xa.length; i++) {
        const xc = ((conjuntoDatos.Xa[i] + conjuntoDatos.Xb[i]) / 2).toFixed(2);
        const promedio = promedioSiConjunto(datoB, datoA, conjuntoDatos.Xa[i], conjuntoDatos.Xb[i]);

        puntos.push({x: parseFloat(xc), y: promedio});

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-3 text-sm text-gray-700">${conjuntoDatos.Xa[i]}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${conjuntoDatos.Xb[i]}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${xc}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${promedio}</td>
        `;

        tablaPromedio1.appendChild(tr);
    }

    // Devolvemos los arreglos para usarlos luego en la gráfica
    return puntos;
}

function tabla2Grafico2(datoA,datoB){
    let conjuntoDatos = {
        Xa: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.60, 0.65, 0.70, 0.75, 0.8, 0.85, 0.9, 0.95],
        Xb: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.60, 0.65, 0.70, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
    }
    const tablaPromedio2 = document.querySelector('#tablaPromedio2');
    tablaPromedio2.innerHTML = '';

    let puntos = [];

    for (let i = 0; i < conjuntoDatos.Xa.length; i++) {
        const xc = ((conjuntoDatos.Xa[i] + conjuntoDatos.Xb[i]) / 2).toFixed(2);
        const promedio = promedioSiConjunto(datoB, datoA, conjuntoDatos.Xa[i], conjuntoDatos.Xb[i]);

        puntos.push({x: parseFloat(xc), y: promedio});

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-3 text-sm text-gray-700">${conjuntoDatos.Xa[i]}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${conjuntoDatos.Xb[i]}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${xc}</td>
            <td class="px-4 py-3 text-sm text-gray-700">${promedio}</td>
        `;

        tablaPromedio2.appendChild(tr);
    }

    // Devolvemos los arreglos para usarlos luego en la gráfica
    return puntos;
}

function promedioSiConjunto(valores, criterios, y, z) {
  // Filtramos según el criterio
  let filtrados = valores.filter((_, i) => criterios[i] >= y && criterios[i] <= z);

  if (filtrados.length === 0) return null; // evitar división por 0

  // Calculamos promedio
  let suma = filtrados.reduce((acc, v) => acc + v, 0);
  return parseFloat((suma / filtrados.length).toFixed(4));
}

function graficosUnidos(datasets, canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Si ya existe, lo destruimos para evitar errores
    if (window.combinedInstance) {
        window.combinedInstance.destroy();
    }

    window.combinedInstance = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets.map(ds => ({
                label: ds.label,
                data: ds.data,   // [{x: valor, y: valor}, ...]
                borderColor: ds.color,
                backgroundColor: ds.color,
                fill: false,
                tension: 0.3
            }))
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'linear', position: 'bottom' },
                y: { beginAtZero: false }
            }
        }
    });
}



