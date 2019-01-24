const Guide = require('../models').Guide;
const City = require('../models').City;

// create guide -> register
// TODO only admins create guides ???
exports.create_guide = function(req, res) {
    return Guide
        .create({
            account_number: req.body.account_number,
            swift: req.body.swift,
            user_id: req.body.user_id
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
};

exports.add_city = function (req, res) {

    // e jabardao isto, eu sei, mas azar
    let x =["Vila Verde","Vila do Porto","Povoação","Ribeira Grande","Vila Franca do Campo","Madalena","Lajes das Flores","Barrancos","Arraiolos","Borba","Castelo de Vide","Gavião","Setúbal","Cascais","Vila Franca de Xira","Abrantes","Arruda dos Vinhos","Penamacor","Almeida","Celorico da Beira","Pinhel","Mangualde","Santa Comba Dão","Penela","Tábua","Pedrógão Grande","Batalha","Oliveira do Bairro","Vagos","Vila do Bispo","Alfândega da Fé","Torre de Moncorvo","Lamego","Baião","Paços de Ferreira","Penafiel","Vila Nova de Gaia","Póvoa de Lanhoso","Penedono","São João da Pesqueira","Oliveira de Azeméis","Vale de Cambra","Mondim de Basto","Resende","Gondomar","Melgaço","Machico","Porto Santo","Vila da Praia da Vitória","Santa Cruz da Graciosa","Golegã","São Roque do Pico","Beja","Ourique","Redondo","Vendas Novas","Fronteira","Portalegre","Beira Baixa","Funchal","Porto Moniz","Nordeste","Ponta Delgada","Velas","Horta","Santa Cruz das Flores","Santarém","Moura","Estremoz","Viana do Alentejo","Loures","Lourinhã","Belmonte","Covilhã","Oleiros","Proença-a-Nova","Oliveira de Frades","Tondela","Miranda do Corvo","Leiria","Pombal","Ílhavo","Ovar","Sever do Vouga","Faro","Lagos","Portimão","Miranda do Douro","Vimioso","Vinhais","Vila Nova de Foz Côa","Santa Marta de Penaguião","Vila Real","Sernancelhe","São João da Madeira","Castelo de Paiva","Azambuja","Cuba","Serpa","Santiago do Cacém","Sines","Alcochete","Montijo","Seixal","Alcobaça","Torres Vedras","Guarda","Aguiar da Beira","Viseu","Lousã","Arouca","Celorico de Basto","Amarante","Cinfães","Matosinhos","Porto","Penacova","Soure","Albergaria-a-Velha","Loulé","São Brás de Alportel","Chaves","Freixo de Espada à Cinta","Vila Flor","Mesão Frio","Armamar","Moimenta da Beira","Póvoa de Varzim","Viana do Castelo","Vila Nova de Cerveira","Algarve","Algarve","Lezíria do Tejo","Baixo Alentejo","Alentejo Central","Alto Alentejo","Alentejo Litoral","Alentejo","Médio Tejo","Oeste","Centro","Norte","Douro","Ave","Cávado","Portugal","Região Autónoma da Madeira","Região Autónoma da Madeira","Região Autónoma da Madeira","Região Autónoma dos Açores","Região Autónoma dos Açores","Região Autónoma dos Açores","Continente","Vizela","Trofa","Braga","Monção","Ponte de Lima","Monforte","Almada","Mafra","Alcanena","Torres Novas","Caldas da Rainha","Peniche","Manteigas","Sabugal","Trancoso","Vila de Rei","Vouzela","Castanheira de Pêra","Marinha Grande","Cantanhede","Coimbra","Anadia","Albufeira","Castro Marim","Boticas","Mirandela","Mogadouro","Alijó","Sabrosa","Tarouca","Santa Maria da Feira","Guimarães","Mortágua","Moita","Sintra","Alenquer","Cadaval","Fundão","Castelo Branco","Vila Velha de Ródão","Sertã","Mação","Carregal do Sal","Vila Nova da Barquinha","Bombarral","Óbidos","Fornos de Algodres","Gouveia","Seia","São Pedro do Sul","Arganil","Porto de Mós","Condeixa-a-Nova","Águeda","Olhão","Bragança","Paredes","Santo Tirso","Barcelos","Lousada","Valongo","Fafe","Terras de Bouro","Paredes de Coura","Câmara de Lobos","Ferreira do Alentejo","Vidigueira","Alandroal","Mora","Arronches","Avis","Campo Maior","Crato","Nisa","Grândola","Barreiro","Oeiras","Odivelas","Ferreira do Zêzere","Sardoal","Valença","Santa Cruz","Almeirim","Rio Maior","Aljustrel","Mértola","Mourão","Portel","Reguengos de Monsaraz","Sousel","Elvas","Alcácer do Sal","Nelas","Vila Nova de Paiva","Oliveira do Hospital","Ansião","Figueira da Foz","Murtosa","Alcoutim","Monchique","Vila Real de Santo António","Macedo de Cavaleiros","Viseu Dão Lafões","Região de Leiria","Região de Coimbra","Sobral de Monte Agraço","Penalva do Castelo","Região de Aveiro","Terras de Trás-os-Montes","Tâmega e Sousa","Alto Tâmega","Área Metropolitana do Porto","Alto Minho","Lisboa","Mêda","Nazaré","Calheta","Calheta","Ribeira Brava","Angra do Heroísmo","Corvo","Alpiarça","Benavente","Cartaxo","Chamusca","Coruche","Alvito","Castro Verde","Vila Viçosa","Alter do Chão","Marvão","Ponte de Sor","Palmela","Amadora","Constância","Idanha-a-Nova","Figueira de Castelo Rodrigo","Castro Daire","Góis","Pampilhosa da Serra","Vila Nova de Poiares","Figueiró dos Vinhos","Mira","Montemor-o-Velho","Aveiro","Mealhada","Aljezur","Lagoa","Lagoa","Silves","Tavira","Montalegre","Vila Pouca de Aguiar","Peso da Régua","Tabuaço","Felgueiras","Marco de Canaveses","Espinho","Vieira do Minho","Esposende","Arcos de Valdevez","Ponta do Sol","Santana","Lajes do Pico","Salvaterra de Magos","Almodôvar","Évora","Montemor-o-Novo","Odemira","Sesimbra","Entroncamento","Tomar","Ourém","Sátão","Alvaiázere","Estarreja","Murça","Valpaços","Carrazeda de Ansiães","Cabeceiras de Basto","Ribeira de Pena","Vila do Conde","Ponte da Barca","São Vicente","Área Metropolitana de Lisboa","Área Metropolitana de Lisboa","Beiras e Serra da Estrela","Maia","Vila Nova de Famalicão","Amares","Caminha"];
    let i = x.length;

    while(i--){

        City.create({
            name: x[i]
        });
    }
    res.status(200).send('cities added');
};

exports.add_category = function (req, res) {

    return Category
        .create({
            name: req.body.name
        })
        .then((cc) => res.status(200).send(cc))
        .catch((error) => res.status(400).send(error));
};