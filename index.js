const path = require('node:path');
const axios = require('axios');
const fs = require('fs');

const clearFile = (filePath) => {
    if(fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if(err) console.error(err);
        });
    }
}

const writeDataToFile = async (propertyIds) => {
    const filePath = path.join(__dirname, 'options.csv');
    clearFile(filePath);
    for(i = 0; i < propertyIds.length; ++i) {
        id = propertyIds[i];
        property = null;
        try {
            const response = await axios.get('https://www.quintoandar.com.br/property/'+id, {
                params: {
                    'variant': '0',
                    'showPartnerId': 'true'
                  },
                  headers: {}
            });
              property = response.data;
        } catch(err) {
            throw new Error(err);
        }
        nearbySubwayStations = []
        for(j = 0; j < property.placesNearby.length; ++j) {
            place = property.placesNearby[j];
            if(place && place.type == "ESTACAO_METRO_OU_TREM") {
                nearbySubwayStations.push(place.name);
            }
        }
        nearbySubwayStations = [...new Set(nearbySubwayStations)];
        if(nearbySubwayStations.length == 0) {
            nearbySubwayStations = "N/A";
        } else {
            nearbySubwayStations = nearbySubwayStations.join(" | ");
        }
        isAvailable = property.availabilityType != undefined
        // link, isAvailable, bairro, lat, long, andar, tamanho, aluguel, condo
        // iptu, incendio, tx servico, total, mobiliado, temElevador, estacoes de metro prox
        const fields = [
            'https://www.quintoandar.com.br/imovel/'+property.code,
            isAvailable,
            property.neighborhood,
            property.lat,
            property.lng,
            property.floor,
            property.totalArea,
            property.rentValue,
            property.condominiumValue,
            property.iptuValue,
            property.homeownersInsuranceValue,
            property.tenantServiceFee,
            property.totalCost,
            property.isFurnished,
            property.hasElevator,
            nearbySubwayStations
        ];
        for(j = 0; j < fields.length; ++j) {
            if(fields[j] == undefined) fields[j] = "N/A";
        }
        const content = fields.join();
        fs.appendFileSync(filePath, content + '\n', err => {
            if(err) console.error(err);
        });
    }
}

const getPropertyIds = (htmlData) => {
    var key = "imovelId";
    var matches = [];
    for (i = 0; i < htmlData.length; ++i) {
      if (htmlData.substring(i, i + key.length) == key) {
        matches.push(i);
      }
    }
    var ids = [];
    var prefixOffset = 10, suffixOffset = 19;
    for (i = 0; i < matches.length; ++i) {
        ids.push(htmlData.slice(matches[i] + prefixOffset, matches[i] + suffixOffset));
    }
    ids = [...new Set(ids)];
    return ids;
}

const getData = async() => {
    const listID = "42d64187-e6d6-472e-bde5-4ac4b06b693d"; // your list ID here
    try {
        const response = await axios.get('https://vitrine.quintoandar.com.br/interestShared/' + listID, {
            headers: {},
        });
        await writeDataToFile(getPropertyIds(response.data));
        console.log('Done!');
    } catch(err) {
        throw new Error('Failed to make the request. ' + err);
    }
}

console.log('Getting data and writing it to file.');
getData();