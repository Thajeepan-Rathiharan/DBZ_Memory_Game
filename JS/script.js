$(document).ready(() => {

    // Images from my IMG folder.
    let pictures =
        [
            "../IMG/goku.jpg", "../IMG/krillin.jpg", "../IMG/vegeta.jpeg",
            "../IMG/gohan.jpg", "../IMG/roshi.jpg", ".../IMG/chichi.jpg",
            "../IMG/yamcha.jpg", "../IMG/chiaoutzu.jpg", "../IMG/frieza.jpg",
            "../IMG/cell.jpg", "../IMG/android18.jpg", "../IMG/kidbuu.jpg",
            "../IMG/piccolo.jpg", "../IMG/tien.jpeg", "../IMG/trunks.jpg"
        ];
    // Timer function.
    let timer;

    $("#difficulty").change(() => {

        let numOfPictures = $("#difficulty").val();
        let board = $("#board");
        //prvo se cisti tabla svaki put kad se promeni difficulty
        board.empty();
        //dodajem kartice
        for (let i = 0; i < numOfPictures / 2; i++) {
            for (let y = 0; y < 2; y++) {
                board.append("<div class='memoryCard'><img class='cardFront' src='" +
                    pictures[i] + "'><img class='cardBack' src='./db/kugla.jpg' alt='kugla'></div>");
            }
        }
        // Function to swap around the cards.
        $(".memoryCard").addClass(" rotate");
    });



    $("#startBtn").click(() => {
        // Here, .val() returns a string, so I convert it into a number.
        let numOfPictures = parseInt($("#difficulty").val());
        let randomNumbers = [];
        let disableBoard = false;
        let timeRemaining = 59;
        let timerField = $("#timer");
        let endGameText = $("#overlay");
        let flippedCard = false;
        let firstFlipped;
        let secondFlipped;
        let totalMoves = 0;
        let cardsMatched = 0;
        let counter = $("#moves");

        if (numOfPictures != 0) {

            // Disabled difficulty from being changed.
            $("#difficulty").prop('disabled', true);
            // Start button gets disabled after being pressed.
            $("#startBtn").prop('disabled', true);
            //okrecem karte
            $(".memoryCard").removeClass(" rotate");

            // Random numbers string to choose picture order.
            while (randomNumbers.length < numOfPictures) {
                var number = Math.floor(Math.random() * numOfPictures) + 1;
                if (randomNumbers.indexOf(number) === -1) randomNumbers.push(number);
            }
            // Cards get mixed order of numbers.     
            function suffleCards() {
                for (let i = 0; i < numOfPictures; i++) {
                    $("#board .memoryCard:eq(" + i + ")").css("order", randomNumbers[i]);
                }
            }
            // A timeout function for the cards getting shuffled.
            setTimeout(suffleCards, 200);

            // Timer function.
            function countdown() {
                timerField.text(timeRemaining);
                timeRemaining--;
                if (timeRemaining < 0) {
                    clearInterval(timer);
                    $("#endGame").text("DEFEAT!");
                    endTextOn();
                    // Clicking cards disabled. 
                    disableBoard = true;
                }
            }
            timer = setInterval(countdown, 1000);

            // Function that hides text.
            function endTextOn() {
                endGameText.css("display", "block");
            }
            function endTextOff() {
                endGameText.css("display", "none");
            }
            // When the game ends, the browser waits for the user to click to end the game.
            endGameText.click(endTextOff);

            // Function for cards to turn over when getting clicked on.
            $(".memoryCard").click(function () {
                // If there are two cards clicked, they turn over when the time expires for the game.
                if (disableBoard) {
                    return false;
                }
                // Adds a class called "rotate" to the clicked card.
                $(this).addClass(" rotate");

                // The first card (of the game) that gets clicked is revealed.
                if (!flippedCard) {
                    flippedCard = true;
                    firstFlipped = $(this);

                    // If it isn't this one, it's the other one. 
                } else {
                    // Function to make the same card isn't clicked twice.
                    // If it's clicked once, it won't be clicked again.
                    if ($(this).css("order") === firstFlipped.css("order")) {
                        return false;
                    }
                    secondFlipped = $(this);
                    flippedCard = false;

                    //Function to check the images that are clicked on.
                    if (firstFlipped.children(".cardFront").attr("src") ===
                        secondFlipped.children(".cardFront").attr("src")) {
                        // Function to turn off clicking for pairs that are matched.
                        firstFlipped.off("click");
                        secondFlipped.off("click");
                        // Function to count moves aka clicks taken to match cards.
                        cardsMatched++;
                        totalMoves++;
                        counter.text(totalMoves);

                    } else {
                        // Cards don't turn over until pairs are matched.
                        disableBoard = true;
                        // Cards shown for a few seconds with timer on them.
                        function turnCards() {
                            firstFlipped.removeClass("rotate");
                            secondFlipped.removeClass("rotate");
                            disableBoard = false;
                        }
                        setTimeout(turnCards, 1000);
                        totalMoves++;
                        counter.text(totalMoves);
                    }
                }
                if (cardsMatched * 2 === numOfPictures) {
                    clearInterval(timer);
                    $("#endGame").text("VICTORY!");
                    endTextOn();
                }
            });

        } else {
            window.alert("Please choose difficulty level!");
        }

    });
    // Button to restart the game.
    $("#restartBtn").click(function () {
        $("#board").empty();
        $("#difficulty").prop('disabled', false);
        $("#difficulty").val("0");
        $("#startBtn").prop('disabled', false);
        clearInterval(timer);
        $("#moves").text("0");
        $("#timer").text("60");
    });

});