/*
 Mudar isto para mudar a cidade e número de locais por cidade.
 Cada local a mais = um request a mais à API (cuidado com os limites)
 */

const n_city = "London";
const n_places = 2;


const request = require("request");

const client_id = "KLNHDNOFVR5QN1JWA0KDA0HTQ0RVY0REMMICDU0MSISUTPHZ";
const client_secret = "UDQUJRTYURYB044FTWJUQYDE0PSDGTOIM1RNV4K434IPVJZJ";
const base_url = "https://api.foursquare.com/v2/";

function getLocations(city){
        let queryString = {
            "client_id": client_id,
            "client_secret": client_secret,
            "near": city,
            "v": "20181214",
            "sortByDistance": 0,
            "limit": n_places
        };
        
        let places = [];
        request.get({url: base_url + "venues/explore/", qs: queryString},
            function (error, response, body) {
                let data = JSON.parse(body);
                data["response"]["groups"][0]["items"].forEach(function(element){
                    let place = {};
                    place["title"] = element["venue"]["name"];
                    place["lat"] = element["venue"]["location"]["lat"];
                    place["lng"] = element["venue"]["location"]["lng"];
                    console.log(obj["title"]);
                    console.log(obj["lat"]);
                    console.log(obj["lng"]);
                });
            }
        );
}


getLocations(n_city);
