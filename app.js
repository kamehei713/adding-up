'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input:rs,output:{}});

const prefectureDatraMap = new Map();

rl.on('line',function(lineString){
    const columns = lineString.split(',');
    const year =parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015){
        let value = prefectureDatraMap.get(prefecture);
        if(!value){
            value ={
                popu10:0,
                popu15:0,
                change:null,
            };
        }
        if(year === 2010){
            value.popu10 = popu;
        }
        if(year === 2015){
            value.popu15 = popu;
        }
        prefectureDatraMap.set(prefecture,value);
    }
});
rl.on('close',function(){
    for(let [key,value] of prefectureDatraMap){
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDatraMap).sort(function(pair1,pair2){
        return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
        console.log('key'+key);
        console.log('value'+value);
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
        );
      });
      console.log(rankingStrings);
});