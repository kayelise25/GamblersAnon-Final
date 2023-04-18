import { readFileSync } from "fs";
import readline from 'readline';



function getStrategy(dealerVal, playerVal){
    //read file in
    var cardInput = readFileSync('Blackjack Strategy Table ASCII.txt', {encoding:'utf8', flag:'r'});
    
    var card = {};
    const  columns = 10;
    const rows = 29;

    cardInput = cardInput.toString().split('\n')
    for (var i = 1; i < rows; i++) {
        var rowValues = cardInput[i].split("\t");
        var decisionPointer = 2; //decisions are currently hardcoded to start at 2nd index 
        var playerHand = rowValues[0]; //key for dictionary 

        //creating array of decisions to store in dictionary 
        var playerDecisions = new Array(columns);

        for (var j = 0; j < columns; j++) {
            playerDecisions[j] =  rowValues[decisionPointer]
            decisionPointer++;
        }
        card[playerHand] = playerDecisions
    }
    return card[playerVal][dealerVal-2];
}

var test = getStrategy(5, 8);
console.log(test)

//card[player hand][dealer value - 2] ** if dealer has ace card[player hand][10]*/
