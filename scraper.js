/*
 Mudar isto para mudar a cidade e número de locais por cidade.
 Cada local a mais = um request a mais à API (cuidado com os limites)
 */

const city = "NYC";
const n_places = 5;


const request = require("request");
const fs = require('fs');
const Place = require('./server/models').Place;
const models = require('./server/models')

const client_id = "KLNHDNOFVR5QN1JWA0KDA0HTQ0RVY0REMMICDU0MSISUTPHZ";
const client_secret = "UDQUJRTYURYB044FTWJUQYDE0PSDGTOIM1RNV4K434IPVJZJ";
const base_url = "https://api.foursquare.com/v2/";

function getLocations(){
        let queryString = {
            "client_id": client_id,
            "client_secret": client_secret,
            "near": city,
            "v": "20181214",
            "sortByDistance": 0,
            "limit": n_places
        };
        
        request.get({url: base_url + "venues/explore/", qs: queryString},
            function (error, response, body) {
                let data = JSON.parse(body);
                data["response"]["groups"][0]["items"].forEach(function(element){
                    let place = {};
                    place["title"] = element["venue"]["name"];
                    place["lat"] = element["venue"]["location"]["lat"];
                    place["lng"] = element["venue"]["location"]["lng"];
                    
                    let queryString = {
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "v": "20181214",
                    };
                    request.get({url: base_url + "venues/" +element["venue"]["id"], qs: queryString},
                        function (error, response, body) {
                            let data = JSON.parse(body);
                            if(data["response"]["venue"]["description"]) place["description"] = data["response"]["venue"]["description"];
                            else place["description"] = null;
                            
                            if(data["response"]["venue"]["photos"]["groups"]){
                               let photo_url =  data["response"]["venue"]["photos"]["groups"][1]["items"]["0"]["prefix"] + "original"
                                    + data["response"]["venue"]["photos"]["groups"][1]["items"]["0"]["suffix"];
                                let photo_path = "./photos/"+ data["response"]["venue"]["id"]+"_01"
                                                + data["response"]["venue"]["photos"]["groups"][1]["items"]["0"]["suffix"].substring(
                                                    data["response"]["venue"]["photos"]["groups"][1]["items"]["0"]["suffix"].length - 4);
                                request.head(photo_url, 
                                    function(err, res, body){
                                        if(res.statusCode == 200){
                                            request(photo_url).pipe(fs.createWriteStream(photo_path));
                                            place["photo_path"] = photo_path;
                                        }
                                        else place["photo_path"] = null;
                                        return Place.create({
                                            title: place["title"],
                                            description: place["description"],
                                            lat: place["lat"],
                                            lng: place["lng"],
                                            photo_path: place["photo_path"]
                                        });
                                });
                            }
                    });
                    
                });
                
        });
}

getLocations();
