
$(function() {

    var player1;
    var player2;
    var player3;
    var player4;
    var player5;
    var player6;
    
    $('#scrapeOWGR').click(function() {
        console.log('OWGR Update Button Clicked!!!!');

    });

    $('#scrapePGA').click(function() {
        console.log('PGA Leaderboard Update Button Clicked!!!!');

    });    

    $('#teamSubmit').click(function() {
        if($('#golfer1').val() == 'Select Golfer' || $('#golfer2').val() == 'Select Golfer' || $('#golfer3').val() == 'Select Golfer' || $('#golfer4').val() == 'Select Golfer' || $('#golfer5').val() == 'Select Golfer' || $('#golfer6').val() == 'Select Golfer') {
            return;
        }

        event.preventDefault();
        console.log('Team Submit Button Clicked!!!!');
        golfer1 = $('#golfer1').val();
        console.log('Golfer 1: ', golfer1);
        golfer2 = $('#golfer2').val();
        console.log('Golfer 2: ', golfer2);
        golfer3 = $('#golfer3').val();
        console.log('Golfer 3: ', golfer3);
        golfer4 = $('#golfer4').val();
        console.log('Golfer 4: ', golfer4);
        golfer5 = $('#golfer5').val();
        console.log('Golfer 5: ', golfer5);
        golfer6 = $('#golfer6').val();
        console.log('Golfer 6: ', golfer6);


        insertTeam({
            golfer1: golfer1,
            golfer2: golfer2,
            golfer3: golfer3,
            golfer4: golfer4,
            golfer5: golfer5,
            golfer6: golfer6
        });


    }); 
    
    function insertTeam(teamData) {
        $.post('/team/new', teamData).then(function() {
            window.location.href = '/team';
        });
    }
    
});

