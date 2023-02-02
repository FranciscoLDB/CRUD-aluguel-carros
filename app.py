from flask import Flask, jsonify, request, render_template
app = Flask(__name__)

carros = [
    {
        'id': 1, 
        'modelo': 'Etios',  
        'marca': 'Toyota', 
        'ano': 2020, 
        'observacoes': 'Bla bla bla, bla', 
        'vDiaria': 299.00, 
        'status': 'livre'},
    {
        'id': 2,
        'modelo': 'Etios',
        'marca': 'Toyota', 
        'ano': 2022,
        'observacoes': 'Bla bleee, bla',
        'vDiaria': 499.00, 
        'status': 'manutenção'}]

@app.route('/')
def index():
    return render_template('index.html')

# GET request to retrieve all carros
@app.route('/carros', methods=['GET'])
def get_carros(): 
    if not carros:
        return jsonify({'message':'No carros founded in server'}), 404
    return jsonify({'carros': carros}), 200

# GET request to retrieve one carros
@app.route('/carros/<int:id>', methods=['get'])
def get_carro(id):
    for carro in carros:
        if id == carro['id']:
            return jsonify({'carro': carro}),200
    return jsonify({'message':'carro not found'}), 404

# POST request to add a new carro with data of the new carro on a json file
@app.route('/carros', methods=['POST'])
def add_carro():
    if not request.is_json:
        return jsonify({'message':'body is not a json'}), 415
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca', 'ano', 'observacoes', 'vDiaria')): #polir depois
        return jsonify({'message':'bad request'}), 400
    id = 1
    if len(carros) > 0:
        id = carros[-1]['id']+1
    c = {
        'id':id,
        'modelo':data['modelo'],
        'marca':data['marca'],
        'ano':data['ano'],
        'observacoes':data['observacoes'],
        'vDiaria':data['vDiaria'],
        'status': 'livre'}
    carros.append(c) 
    return jsonify({'carro': c}), 201

# PUT request to update a carro
@app.route('/carros/<int:id>', methods=['PUT'])
def update_carro(id):
    if not request.is_json:
        return jsonify({'message':'body is not a json'}), 415
    data = request.get_json()
    if not data or not all(key in data for key in ('modelo', 'marca', 'ano', 'observacoes', 'vDiaria', 'status')):
        return jsonify({'message':'bad request'}), 400
    for i,carro in enumerate(carros):
        if carro['id'] == id:
            carros[i] = {'id':id,
                        'modelo':data['modelo'],
                        'marca':data['marca'],
                        'ano':data['ano'],
                        'observacoes':data['observacoes'],
                        'vDiaria':data['vDiaria'],
                        'status':data['status']}

            return jsonify({'carro': carros[i]}),200
    return jsonify({'message':'carro not found'}), 404

# DELETE request to delete a carro
@app.route('/carros/<int:id>', methods=['DELETE'])
def delete_carro(id):
    for i,carro in enumerate(carros):
        if carro['id'] == id:
            del carros[i]   
            return jsonify({'message': 'carro deleted'}),200
    return jsonify({'message':'carro not found'}), 404

app.run(debug=True)
