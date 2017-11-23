
$(function() {

    
    
    $('#scrapeOWGR').click(function() {
        console.log('OWGR Update Button Clicked!!!!');

    });

    $('#scrapePGA').click(function() {
        console.log('PGA Leaderboard Update Button Clicked!!!!');

    });    

    $('#teamSubmit').click(function() {
        if(!$('#entryName').val() || $('#golfer1').val() == 'Select Golfer' || $('#golfer2').val() == 'Select Golfer' || $('#golfer3').val() == 'Select Golfer' || $('#golfer4').val() == 'Select Golfer' || $('#golfer5').val() == 'Select Golfer' || $('#golfer6').val() == 'Select Golfer') {
            return;
        }

        event.preventDefault();
        console.log('Team Submit Button Clicked!!!!');
        entryName = $('#entryName').val().trim();
        
        console.log('Entry Name: ',entryName);
        var golfer1 = $('#golfer1').val().trim();
        var rank1 = $('select#golfer1').find(':selected').data('rank');
        console.log('Golfer 1: ', golfer1);
        console.log('Golfer 1 ranking: ',rank1);
        var golfer2 = $('#golfer2').val().trim();
        var rank2 = $('select#golfer2').find(':selected').data('rank');
        console.log('Golfer 2: ', golfer2);
        console.log('Golfer 2 ranking: ',rank2);
        var golfer3 = $('#golfer3').val().trim();
        var rank3 = $('select#golfer3').find(':selected').data('rank');
        console.log('Golfer 3: ', golfer3);
        console.log('Golfer 3 ranking: ',rank3);
        var golfer4 = $('#golfer4').val().trim();
        var rank4 = $('select#golfer4').find(':selected').data('rank');
        console.log('Golfer 4: ', golfer4);
        console.log('Golfer 4 ranking: ',rank4);
        var golfer5 = $('#golfer5').val().trim();
        var rank5 = $('select#golfer5').find(':selected').data('rank');
        console.log('Golfer 5: ', golfer5);
        console.log('Golfer 5 ranking: ',rank5);
        var golfer6 = $('#golfer6').val().trim();
        var rank6 = $('select#golfer6').find(':selected').data('rank');
        console.log('Golfer 6: ', golfer6);
        console.log('Golfer 6 ranking: ',rank6);


        insertTeam({
            entryName: entryName,
            golfer1: golfer1,
            rank1: rank1,
            golfer2: golfer2,
            rank2: rank2,
            golfer3: golfer3,
            rank3: rank3,
            golfer4: golfer4,
            rank4: rank4,
            golfer5: golfer5,
            rank5: rank5,
            golfer6: golfer6,
            rank6: rank6
        });


    }); 
    
    function insertTeam(teamData) {
        $.post('/team/new', teamData).then(function() {
            window.location.href = '/team';
        });
    }

    $('#updateScores').click(function(event) {
        event.preventDefault();
        console.log('Update Team Scores Button Clicked!!!!');
        var entryID = $('#entryId').attr('data-id');
        console.log('Team ID: ', entryID);
        var golfer1 = $('#golfer1Id').data('name');
        console.log('Golfer 1 Name: ', golfer1);
        var golfer2 = $('#golfer2Id').data('name');
        console.log('Golfer 2 Name: ', golfer2);
        var golfer3 = $('#golfer3Id').data('name');
        console.log('Golfer 3 Name: ', golfer3);
        var golfer4 = $('#golfer4Id').data('name');
        console.log('Golfer 4 Name: ', golfer4);
        var golfer5 = $('#golfer5Id').data('name');
        console.log('Golfer 5 Name: ', golfer5);
        var golfer6 = $('#golfer6Id').data('name');
        console.log('Golfer 6 Name: ', golfer6);

        updateScores({
            entryID: entryID,
            golfer1: golfer1,
            golfer2: golfer2,
            golfer3: golfer3,
            golfer4: golfer4,
            golfer5: golfer5,
            golfer6: golfer6,
        });


        
        function updateScores(teamData) {
            $.post('/team/update', teamData).then(function() {
                // window.location.href = '/team';
            });
        }
    });
    
});

