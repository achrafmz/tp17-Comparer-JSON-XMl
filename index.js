const fs = require('fs');
const convert = require('xml-js');
const protobuf = require('protobufjs');

// Chargement du schéma Protobuf
const root = protobuf.loadSync('employee.proto');
const EmployeeList = root.lookupType('Employees');

// Données
const employees = [
    { id: 1, name: 'Ali', salary: 9000 },
    { id: 2, name: 'Kamal', salary: 22000 },
    { id: 3, name: 'Amal', salary: 23000 }
];

const jsonObject = {
    employee: employees
};

// JSON
const jsonData = JSON.stringify(jsonObject, null, 2);

// XML
const options = {
    compact: true,
    ignoreComment: true,
    spaces: 4
};
const xmlData = "<root>\n" + convert.json2xml(jsonObject, options) + "\n</root>";

// Protobuf
const errMsg = EmployeeList.verify(jsonObject);
if (errMsg) {
    throw Error(errMsg);
}
const message = EmployeeList.create(jsonObject);
const buffer = EmployeeList.encode(message).finish();

// 📌 ÉCRITURE DES FICHIERS
fs.writeFileSync('data.json', jsonData);
fs.writeFileSync('data.xml', xmlData);
fs.writeFileSync('data.proto', buffer);

// 📌 CALCUL DES TAILLES APRÈS CRÉATION
const jsonFileSize = fs.statSync('data.json').size;
const xmlFileSize = fs.statSync('data.xml').size;
const protoFileSize = fs.statSync('data.proto').size;

// 📌 AFFICHAGE DES TAILLES
console.log(`Taille de 'data.json' : ${jsonFileSize} octets`);
console.log(`Taille de 'data.xml'  : ${xmlFileSize} octets`);
console.log(`Taille de 'data.proto': ${protoFileSize} octets`);
