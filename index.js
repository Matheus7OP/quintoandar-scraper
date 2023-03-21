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
                headers: {
                  'x-instana-t': '969eadc351a83924',
                  'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                  'sec-ch-ua-mobile': '?0',
                  'x-instana-l': '1,correlationType=web;correlationId=969eadc351a83924',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                  'Referer': '',
                  'x-instana-s': '969eadc351a83924',
                  'sec-ch-ua-platform': '"Windows"'
                }
              });
              property = response.data;
        } catch(err) {
            throw new Error('Failed to make the request. ' + err);
        }
        // codigo, bairro, endereço, andar, metro prox, tamanho, condo, iptu, incendio
        // tx servico, total, mobiliado, noQuartos, noSuites, noVagasCarro, aceitaPets
        // temElevador
        // *fiquei devendo info sobre vista livre
        const fields = [
            property.code,
            property.neighborhood,
            property.address.zipCode,
            property.floor,
            property.nearSubway,
            property.totalArea,
            property.rentValue,
            property.condominiumValue,
            property.iptuValue,
            property.homeownersInsuranceValue,
            property.tenantServiceFee,
            property.totalCost,
            property.isFurnished,
            property.bedrooms,
            property.suites,
            property.parkingSlots,
            property.acceptPets,
            property.hasElevator
        ];
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
    return ids;
}

const getData = async() => {
    const listID = "example_id"; // your list ID here
    try {
        const response = await axios.get('https://vitrine.quintoandar.com.br/interestShared/' + listID, {
            headers: {
              'authority': 'vitrine.quintoandar.com.br',
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'accept-language': 'en-GB,en;q=0.9,pt-BR;q=0.8,pt;q=0.7,en-US;q=0.6',
              'cache-control': 'max-age=0',
              'cookie': 'ab.storage.deviceId.cf9e8c77-7b32-4126-940b-b58658d0918e=%7B%22g%22%3A%22db968684-5933-aa77-df11-b0bb9146022e%22%2C%22c%22%3A1678847944211%2C%22l%22%3A1678847944211%7D; _gcl_aw=GCL.1678847947.Cj0KCQjwtsCgBhDEARIsAE7RYh123h75p1bRugxG0iNkPKLO8kEovqgyOf9KBFd0DK73tT154NOWdbsaAp3gEALw_wcB; _gcl_au=1.1.599574673.1678847947; _tt_enable_cookie=1; _ttp=7k87nrkNrKb5B37SjhTvkwDAGLe; _fbp=fb.2.1678847948361.2035569216; 5A_COOKIE_ACCEPT=true; _hjSessionUser_1203740=eyJpZCI6ImQ3MjI3ZDE1LTI0ZDYtNWM1ZS1hODcxLWVmNTBkYjBkNTgzOCIsImNyZWF0ZWQiOjE2Nzg4NDc5NDYwMTUsImV4aXN0aW5nIjp0cnVlfQ==; __zlcmid=1EtlfhpLSz4jmc2; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Mar+14+2023+23%3A58%3A20+GMT-0300+(Brasilia+Standard+Time)&version=202302.1.0&isIABGlobal=false&hosts=&consentId=68215e98-1ffd-45f8-8b38-1ebc5b1ae38a&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0005%3A0%2CC0004%3A0%2CC0003%3A0%2CC0002%3A0&AwaitingReconsent=false; _hjSessionUser_2983812=eyJpZCI6IjdlNjNjN2MyLTZkODktNTI3MS05NTQ0LTdmMWZmNWVmOTU3MiIsImNyZWF0ZWQiOjE2Nzg4NDkwMjg4NTEsImV4aXN0aW5nIjp0cnVlfQ==; _ga=GA1.3.2027542555.1678848482; _ga_L3E7HRD80N=GS1.1.1678849028.1.1.1678849144.0.0.0; _ga_1W6FE6T2GS=GS1.1.1678849029.1.1.1678849144.0.0.0; ab.storage.userId.cf9e8c77-7b32-4126-940b-b58658d0918e=%7B%22g%22%3A%224198068%22%2C%22c%22%3A1678849393635%2C%22l%22%3A1678849393635%7D; _hjSessionUser_2916267=eyJpZCI6ImI1ODcwZTExLWEyMGUtNTZkMi1hZjRhLTFjYjM4YTJlYjQzMiIsImNyZWF0ZWQiOjE2Nzg5ODQzMTQwOTYsImV4aXN0aW5nIjp0cnVlfQ==; amplitude_id_9caf9dfbba44d1a9013983613cdc3a69quintoandar.com.br=eyJkZXZpY2VJZCI6Ijk4ZmE2YmEzLTM3OWItNDdhOS04YzFlLTBkZjU0Yjc1ODEyZFIiLCJ1c2VySWQiOiI0MTk4MDY4Iiwib3B0T3V0IjpmYWxzZSwic2Vzc2lvbklkIjoxNjc5MDIxMDE3ODgzLCJsYXN0RXZlbnRUaW1lIjoxNjc5MDIxMDE5NjkzLCJldmVudElkIjoxMSwiaWRlbnRpZnlJZCI6Miwic2VxdWVuY2VOdW1iZXIiOjEzfQ==; 5AJWT_AUTH=eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJYdFpNMi05SzJOMUtSZ3p0QnIxRG9BIiwiaWF0IjoxNjc5MDIxMDg1LCJpZCI6NDE5ODA2OCwibmFtZSI6Ik1hdGhldXMgT2xpdmVpcmEgUGVyZWlyYSIsImZpcnN0bmFtZSI6Ik1hdGhldXMiLCJ0aXR1bG8iOiJNYXRoZXVzIiwiZW1haWwiOiJtYXRoZXVzN29wQGdtYWlsLmNvbSIsInRlbGVmb25lIjoiKzU1ODM5OTExNjExNTAiLCJyb2xlcyI6ImNvbXVtIiwiY3JlYXRpb25EYXRlIjoiMTcvMDMvMjAyMyAwMjo0NCIsInVzZXJDcmVhdGVkQXQiOiIyMDIxLTA5LTI5VDIxOjI4OjI4WiIsImV4cCI6MTY4Njc5NzA4NX0.I3nM0EKo3rFDEB-2sYYW82GxXuDJYbGYq-tGMPCjIbsj-l4q2qOHPFZse7LuUoJ3szR9f7IJxjqMxuMJq_yMevgRKBFPTVzxgKX2-qowUSlA8Y3YsXswdHaSoPLUf6lI9Is79x8bFaKoWUj6e5GCkcxyxR4906MPbfa2gVHUjzkfijFVkuxWwpR96eUD55TPdHMQoTI5oa7unN4s7nAH4meO_eJyPS8YAFA7Y_eB2nUOF6VtPL21b_e6i1oaAjJ1xMZ280heRsGY3SMUeU7VFgWXQN_tgt4u_fEN1ziYPjKMrxndRTQi4T84HgWpAWA3ppF8FkAhJTL1sxvCd0VfXw; _hjSession_2916267=eyJpZCI6IjFhMDdiMmRiLWY5NGYtNGUzNi1iZDVlLTUzYjUyMWI0YmYwMSIsImNyZWF0ZWQiOjE2NzkzNDI1NzUwMjAsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1; _hjIncludedInSessionSample_1203740=0; _hjSession_1203740=eyJpZCI6IjcwYmEwODQ2LWIxMzktNDEyZi04MzhlLTYyODY0NWViNTE5MCIsImNyZWF0ZWQiOjE2NzkzNDI3Nzc3NTMsImluU2FtcGxlIjpmYWxzZX0=; _uetsid=28f5df00c72a11edac021501d53854fd; ab.storage.sessionId.cf9e8c77-7b32-4126-940b-b58658d0918e=%7B%22g%22%3A%226fdea23f-a9aa-4281-14f1-c9a5f0b3889b%22%2C%22e%22%3A1679346005403%2C%22c%22%3A1679342776585%2C%22l%22%3A1679344205403%7D; cto_bundle=Bn6tgl9RSnJwTElCUTl6dGRDbjY0WHBxbnY3JTJGT3kzZSUyQmR3QUJNNkRzUVZpdnl3RjZYMDZid3pxTWRKcE1qcDc5UGJiRTklMkJ3S29JZGhGTVlsc3IlMkZjRTdVUCUyQnF0eGUyRDNqSUFmVHU4S3dKVyUyQjVaWGdQY1VLUWYxN3RsYWdsVFVvUU5NWEVvMUJkNWszVCUyQm9IaTBMVjc0ZDlJZmV2NDdpSmNRd0pmaVE2JTJGRmpPcjhZJTNE; amplitude_id_3fbf25d58c3cce92f0e6609904a37cc9quintoandar.com.br=eyJkZXZpY2VJZCI6ImRkOWIwMTdlLTA4OTMtNDVkZS05YTdlLTZiZTZkYjI1YzI2Y1IiLCJ1c2VySWQiOiI0MTk4MDY4Iiwib3B0T3V0IjpmYWxzZSwic2Vzc2lvbklkIjoxNjc5MzQyNTc0MDAxLCJsYXN0RXZlbnRUaW1lIjoxNjc5MzQ0NjI3MDU0LCJldmVudElkIjo1ODcsImlkZW50aWZ5SWQiOjMxMTIxLCJzZXF1ZW5jZU51bWJlciI6MzE3MDh9',
              'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"Windows"',
              'sec-fetch-dest': 'document',
              'sec-fetch-mode': 'navigate',
              'sec-fetch-site': 'same-origin',
              'sec-fetch-user': '?1',
              'upgrade-insecure-requests': '1',
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
            }
          });
        await writeDataToFile(getPropertyIds(response.data));
        console.log('Done!');
    } catch(err) {
        throw new Error('Failed to make the request. ' + err);
    }
}

console.log('Getting data and writing it to file.');
getData();