$(document).ready(function() {
    let charMaps = [];
    let characterNames = [["Luke Skywalker", "lukeSkywalker.jpg", 8], ["Darth Vader", "darthVader.jpg", 5], ["Rey", "rey.jpg", 10], ["Storm Trooper", "stormTrooper.jpg", 15]];
    let currentYourCharacter = null;
    let currentDefender = null;
    let currentYourCharFightPower = 0;
    let currentDefenderFightPower = 0;
    let gameOver = false;

    function setupNewGame() {
        $(document).ready(function() {
            gameOver = false;
            deleteMessage();
            $("#restart").empty();
            $("#yourCharacter").empty();
            $("#enemies").empty();
            $("#defender").empty();
            charMaps = [];
            currentYourCharacter = null;
            currentDefender = null;
            currentYourCharFightPower = 0;
            currentDefenderFightPower = 0;
            $(characterNames).each(elem => {
                let charMap = new Map();
                charMap.set("characterName", characterNames[elem][0]);
                charMap.set("filePathName", "assets/images/" + characterNames[elem][1]);
                charMap.set("points", numberGenerator(100, 200));
                charMap.set("yourCharacter", false);
                charMap.set("enemy", false);
                charMap.set("defender", false);
                charMap.set("defeated", false);
                // charMap.set("fightingPower", characterNames[elem][2]);
                charMap.set("fightingPower", numberGenerator(5, 20));
                charMaps.push(charMap);
                buildImgs("#characterSelection", "imgDivCharacter", charMap);
            })    
        });
    }

    //Random number function
    function numberGenerator (lowerRange, upperRange) {
        return Math.floor(Math.random() * ((upperRange - lowerRange) + 1) + lowerRange );
    }

    //Function to create image divs
    function buildImgs(parentDivId, divClassName, chMap) {
        let outerDiv = $("<div>");
        outerDiv.addClass(divClassName);
        outerDiv.attr("charName", chMap.get("characterName"));
        let firstP = $("<p>");
        firstP.attr("class", "charTitle")
        firstP.text(chMap.get("characterName"));
        outerDiv.append(firstP).end();
        let img1 = $("<img>");
        img1.addClass("imgClip character");
        img1.attr("src", chMap.get("filePathName"));
        outerDiv.append(img1).end();
        let secP = $("<p>");
        secP.addClass("charTitle points");
        secP.attr("charNamePoints", chMap.get("characterName"));
        secP.text(chMap.get("points"));
        outerDiv.append(secP).end();
        $(parentDivId).append(outerDiv).end();
    }

    function calculateFightingPower() {
        currentYourCharFightPower = currentYourCharacter.get("fightingPower") + currentYourCharFightPower;
        currentDefenderFightPower = currentDefender.get("fightingPower");
    }

    function sendMessage(mes) {
        let newDiv = $("<p>");
        newDiv.text(mes);
        $("#messages").append(newDiv).end();
    }

    function deleteMessage() {
        $("#messages").empty();
    }

    function isBattleOver() {
        if(currentYourCharacter.get("points") < 1) {
            deleteMessage();
            sendMessage("You have been defeated! ....GAME OVER");
            let restart = $("<input>");
            restart.attr("id", "restartButtonId");
            restart.attr("type", "button");
            restart.attr("value", "Restart");
            $("#restart").append(restart).end();
            gameOver = true;
            return;
        }
        if(currentDefender.get("points") < 1) {
            currentDefender.set("defeated", true);
            deleteMessage();
            $("#defender").empty();
            if(isWarWon()) {
                sendMessage("You won!");
                gameOver = true;
                let restart = $("<input>");
                restart.attr("id", "restartButtonId");
                restart.attr("type", "button");
                restart.attr("value", "Restart");
                $("#restart").append(restart).end();
            }
            else {
                sendMessage("You have defeated " + currentDefender.get("characterName") + " , you can choose another enemy.")
            }
            currentDefender = null;
        }
    }

    function checkEnv(evn) {
        if(gameOver) return false;
        deleteMessage();
        let bool = true;
        if(evn === "characterSelect") {
            if(currentYourCharacter !== null) {
                bool = false;
                sendMessage("You have already chosen your character.")
                return bool;
            } 
        }        
        if(evn == "defenderSelect") {
            if(currentDefender !== null) {
                bool = false;
                sendMessage("A defender is already selected");
                return bool;
            }
        }
        if(evn == "attackButton") {
            if(currentYourCharacter === null) {
                bool = false;
                sendMessage("You need to select your character");
                return bool;
            } 
            if(currentDefender === null) {
                bool = false;
                sendMessage("You need to select a defender");
                return bool;
            }           
        }
        return bool;   
    }

    function isWarWon() {
        let bool = true;
        $(charMaps).each(elem => {
            if(charMaps[elem].get("defeated") === false) {
                if(charMaps[elem].get("characterName") !== currentYourCharacter.get("characterName")) {
                    bool = false;
                }              
            }
        });
        return bool;
    }

    //Event handler to select your character
    $(document).on("click", ".imgDivCharacter", function() {        
        if(checkEnv("characterSelect")) {
            deleteMessage();
            $("#characterSelection").empty();
            $(charMaps).each(elem => {
                if(charMaps[elem].get("characterName") === $(this).attr("charName")) {
                    charMaps[elem].set("yourCharacter", true);
                    currentYourCharacter = charMaps[elem];
                    buildImgs("#yourCharacter", "imgDivCharacter", charMaps[elem]);
                }
                else
                {
                    charMaps[elem].set("enemy", true);
                    buildImgs("#enemies", "imgDivEnemies", charMaps[elem]);
                }
            }) 
        }      
    });

    //Event handler to select defender
    $(document).on("click", ".imgDivEnemies", function() {        
        if(checkEnv("defenderSelect")) {
            deleteMessage();
            $("#enemies").empty();
            $(charMaps).each(elem => {
                if(charMaps[elem].get("characterName") === $(this).attr("charName")) {
                    charMaps[elem].set("defender", true);
                    currentDefender = charMaps[elem];
                    buildImgs("#defender", "imgDivDefender", charMaps[elem]);
                }
                else {
                    if(charMaps[elem].get("defender") === false &&
                        charMaps[elem].get("yourCharacter") === false &&
                        charMaps[elem].get("defeated") === false) {
                        buildImgs("#enemies", "imgDivEnemies", charMaps[elem]);
                    }
                }
            })
            calculateFightingPower();    
        }           
    });

    //Event handler for attack button
    $("#attackButtonId").on("click", function() {
        if(gameOver === false) {
            if(checkEnv("attackButton")) {
                deleteMessage();             
                let x = 0;
                $(".points").each(function(elem) {
                    if($(this).attr("charNamePoints") === currentDefender.get("characterName")) {
                        x = currentDefender.get("points") - currentYourCharFightPower;
                            currentDefender.set("points", x);
                        $(this).text(x);                
                    }
                    if($(this).attr("charNamePoints") === currentYourCharacter.get("characterName")) {
                        x = currentYourCharacter.get("points") - currentDefenderFightPower;
                            currentYourCharacter.set("points", x);
                        $(this).text(x);
                    }               
                });        
                sendMessage("You attacked " + currentDefender.get("characterName") + " for " + currentYourCharFightPower + " damage");                
                sendMessage(currentDefender.get("characterName") + " attacked you back for " + currentDefenderFightPower + " damage");                
                isBattleOver();
                calculateFightingPower();                  
            }
        }
    })

    //Event handler for restart button
    $("#restart").on("click", function() {
        setupNewGame();
    })

    setupNewGame();

});

    