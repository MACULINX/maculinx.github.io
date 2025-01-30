const stati = '/csv/listaStati.csv';
const comuni = '/csv/listaComuni.csv';
const province = '/csv/listaProvince.csv';
const form = "datiCF";



function datiCF() {
    let nome = document.forms[form]["inputNome"].value == '' ? 'none' : document.forms[form]["inputNome"].value.toUpperCase();
    let cognome = document.forms[form]["inputCognome"].value == '' ? 'none' : document.forms[form]["inputCognome"].value.toUpperCase();
    let data = document.forms[form]["inputData"].value;
    let sesso = document.forms[form]["inputSesso"].value;
    let stato = document.forms[form]["inputStato"].value;
    let comune = document.forms[form]["inputComune"].value;

    if(!(nome == 'none' 
       || cognome == 'none' 
       || data == 'none' 
       || sesso == 'none' 
       || stato == 'none' 
       || (stato == 'n.d.' && comune == 'none'))){

        var CF = puliziaNome(cognome, "c") + puliziaNome(nome, "n") + dataNascita(data, sesso);

        if(stato != "n.d.")
            CF += stato;
        else
            CF += comune;

        CF += controlloNumerico(CF);

        document.getElementById("risCodiceFiscale").innerHTML = "Il codice fiscale richiesto è: " + CF;
        mostraModal("#codiceFiscale");
    }else
        mostraModal("#errore");
}

function puliziaNome(str, option) {

    let retVal = "";
    
    let cons = str.replace(/[AEIOU $]/g, '');
    let voc = str.replace(/[^AEIOU]/g, '');
    if(option == "n" && cons.length >= 4)
        cons = cons[0]+cons[2]+cons[3];

    retVal += cons + voc + "XXX";

    return retVal.slice(0, 3);
}

function dataNascita(data, sesso) {

    const mesi = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];

    const campidata = data.split("-");
    const anno = campidata[0];
    const mese = parseInt(campidata[1], 10);
    let giorno = parseInt(campidata[2], 10);

    if (sesso === "F")
        giorno += 40;

    const retVal = anno.slice(2,4) + mesi[mese - 1] + giorno.toString().padStart(2, '0');

    return retVal;
}

function letturaCSV(str) {
    let retVal;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', str, false);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var csvContent = xhr.responseText;
            const rows = csvContent.split('\n');
            const data = rows.map(row => row.split(';'));
            retVal = data
        }
    };

    xhr.send();
    return retVal;
}

function caricaStati()
{
    letturaCSV(stati).forEach(element => {
        if(element[0] == "Stato(S)/Territorio(T)")
            console.log("Caricamento stati...")
        else
            document.getElementById("inputStato").innerHTML += '<option value="'+ element[9] +'">'+element[6]+'</option>'
    });
}

function caricaComuni()
{
    letturaCSV(comuni).forEach(element => {
        if(element[0] == "Stato(S)/Territorio(T)")
            console.log("Caricamento comuni...")
        else if(element[1] == document.getElementById("inputProvincia").value)
            document.getElementById("inputComune").innerHTML += '<option value="'+ element[0] +'">'+element[2]+'</option>'
    });
}

function caricaProvince()
{
    letturaCSV(province).forEach(element => {
        element[0] = element[0].replace(/\r/g, "")
        if(element == "Sigla Provincia")
            console.log("Caricamento province...")
        else
            document.getElementById("inputProvincia").innerHTML += '<option value="'+ element[0] +'">'+element[0]+'</option>'
    });
}

function controlloNumerico(codiceFiscale) {
    const tabellaDispari = {
        A:1, B:0, C:5, D:7, E:9, F:13, G:15, H:17, I:19, J:21,
        K:2, L:4, M:18, N:20, O:11, P:3, Q:6, R:8, S:12, T:14,
        U:16, V:10, W:22, X:25, Y:24, Z:23,
        0:1, 1:0, 2:5, 3:7, 4:9, 5:13, 6:15, 7:17, 8:19, 9:21
    };

    const tabellaPari = {
        A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8, J:9,
        K:10, L:11, M:12, N:13, O:14, P:15, Q:16, R:17, S:18, T:19,
        U:20, V:21, W:22, X:23, Y:24, Z:25,
        0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9
    };

    const tabellaRestoLettera = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let somma = 0;

    for (let i = 0; i < codiceFiscale.length; i++) {
        let carattere = codiceFiscale[i];
        if (i % 2 == 0) 
            somma += tabellaDispari[carattere];
        else
            somma += tabellaPari[carattere];
    }

    let resto = somma % 26;
    return tabellaRestoLettera[resto];
}

function mostraModal(s)
{
    const modal = new bootstrap.Modal(s);
    modal.show();
}
