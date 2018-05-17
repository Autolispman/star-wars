let myMap = new Map();
// let crystals = ["#crystal1", "#crystal2", "#crystal3", "#crystal4"];
// let winsLosses = new Map();

setupNewGame();

function setupNewGame() {
    $(document).ready(function() {
        myMap.set("computerNumber", numberGenerator(19, 120));
        myMap.set("crystal1", numberGenerator(1, 12));
        myMap.set("crystal2", numberGenerator(1, 12));
        myMap.set("crystal3", numberGenerator(1, 12));
        myMap.set("crystal4", numberGenerator(1, 12));
        myMap.set("subTotal", 0);
        if(myMap.get("wins") == undefined ) {
            myMap.set("wins", 0);
            myMap.set("losses", 0);
        }
        $("#randomNumberDisplay").text(myMap.get("computerNumber"));
        $("#subTotal").text(myMap.get("subTotal"));
        $("#wins").text("Wins " + myMap.get("wins"));
        $("#losses").text("Losses " + myMap.get("losses"));
    });
}

function numberGenerator (lowerRange, upperRange) {
    return Math.floor(Math.random() * ((upperRange - lowerRange) + 1) + lowerRange );
}

function processCrystal(crystal) {
    $(document).ready(function() {
        $("#info").text("");
        myMap.set("subTotal", myMap.get(crystal) + myMap.get("subTotal"));
        $("#subTotal").text(myMap.get("subTotal"));
        if(myMap.get("subTotal") > myMap.get("computerNumber")) {
            $("#info").text("Sorry! You lost.");
            myMap.set("losses", myMap.get("losses") + 1);
            setupNewGame();
            return;
        }
        if(myMap.get("subTotal") === myMap.get("computerNumber")) {
            $("#info").text("You won.");
            myMap.set("wins", myMap.get("wins") + 1);
            setupNewGame();
            return;
        }
    });
}

$(document).on("click", "#crystal1", function() {
    processCrystal("crystal1");
});
$(document).on("click", "#crystal2", function() {
    processCrystal("crystal2");
});
$(document).on("click", "#crystal3", function() {
    processCrystal("crystal3");
});
$(document).on("click", "#crystal4", function() {
    processCrystal("crystal4");
});
    