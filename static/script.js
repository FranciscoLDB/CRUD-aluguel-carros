function initPopOvers(){
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl)
    })
}

function addCarroTable(carro){
    let item = document.createElement('tr');
    let id = carro.id;              
    item.innerHTML = 
        `<th>${id} <i class="fa-solid fa-pen-to-square btn_upload" id="upcarro${id}" data-bs-toggle="modal" data-bs-target="#attModal"></i></th>
        <td>${carro.modelo} / ${carro.marca} / ${carro.ano} 
        <a tabindex="0" class="btn" role="button" data-bs-toggle="popover" data-bs-trigger="focus" title="Observações" data-bs-content="${carro.observacoes}"><i class="fa-solid fa-circle-info"></i></a></td>
        <td>R$${carro.vDiaria}</td>
        <td>${carro.status}<i class="fa-solid fa-trash btn_delete" id="updelete${id}"></i></td>`;
    tBody.appendChild(item);
    
    let btnUpdate = document.getElementById(`upcarro${id}`);
    btnUpdate.addEventListener('click', atalhoUpdateCarro.bind(arguments, carro));
    let btnDelete = document.getElementById(`updelete${id}`);
    btnDelete.addEventListener('click', () => {
        deleteCarro(id);
    });
}

let tBody = document.querySelector('.table__tbody');
function loadCarros(){
    tBody.innerHTML = "";
    fetch('http://127.0.0.1:5000/carros', {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            data.carros.forEach(carro => {
                addCarroTable(carro);
            });
            initPopOvers();
            console.log(data);
        });
}
loadCarros();
function loadCarro(){
    let id = document.querySelector('#input_get_id');
    let tBody = document.querySelector('.table__tbody');
    tBody.innerHTML = "";
    fetch(`http://127.0.0.1:5000/carros/${id.value}`, {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            addCarroTable(data.carro);
            initPopOvers();
        });
}
function deleteCarro(id = 0){
    if (id == 0){
        id = document.querySelector('#input_delete_id').value;
    }
    let tBody = document.querySelector('.table__tbody');
    tBody.innerHTML = "";
    fetch(`http://127.0.0.1:5000/carros/${id}`, {
        method: "DELETE"
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            loadCarros();
        });
}
function postCarro(){
    let inputModelo = document.getElementById('input_post_modelo');
    let inputMarca = document.getElementById('input_post_marca');
    let inputAno = document.getElementById('input_post_ano');
    let inputObservacoes = document.getElementById('input_post_observacoes');
    let inputVDiaria = document.getElementById('input_post_vDiaria');
    let inputData = {
        "modelo": inputModelo.value,
        "marca": inputMarca.value,
        "ano": inputAno.value,
        "observacoes": inputObservacoes.value,
        "vDiaria": inputVDiaria.value,
    };
    inputModelo.value = "";
    inputMarca.value = "";
    inputAno.value = "";
    inputObservacoes.value = "";
    inputVDiaria.value = "";
    fetch(`http://127.0.0.1:5000/carros`, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(inputData)
    })
        .then((response) => response.json())
        .then((data) => {
            loadCarros();
    });
}
function updateCarro(){
    let inputId = document.getElementById('input_put_id');
    let inputData = {
        "modelo": document.getElementById('input_put_modelo').value,
        "marca": document.getElementById('input_put_marca').value,
        "ano": document.getElementById('input_put_ano').value,
        "observacoes": document.getElementById('input_put_observacoes').value,
        "vDiaria": document.getElementById('input_put_vDiaria').value,
        "status": document.getElementById('input_put_status').value
    };
    fetch(`http://127.0.0.1:5000/carros/${inputId.value}`, {
        method: "PUT",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(inputData)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            loadCarros();
    });
}
function atalhoUpdateCarro(data){
    console.log("Atualizar carro id: " + data.id);
    document.getElementById('input_put_id').value = data.id;
    document.getElementById('input_put_modelo').value = data.modelo;
    document.getElementById('input_put_marca').value = data.marca;
    document.getElementById('input_put_ano').value = data.ano;
    document.getElementById('input_put_observacoes').value = data.observacoes;
    document.getElementById('input_put_vDiaria').value = data.vDiaria;
    document.getElementById('input_put_status').value = data.status;
}