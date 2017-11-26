
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
            // entryName: entryName,
            // golfer1: golfer1,
            // rank1: rank1,
            // golfer2: golfer2,
            // rank2: rank2,
            // golfer3: golfer3,
            // rank3: rank3,
            // golfer4: golfer4,
            // rank4: rank4,
            // golfer5: golfer5,
            // rank5: rank5,
            // golfer6: golfer6,
            // rank6: rank6

            entryName: entryName,
            golfer1: {
                name: golfer1,
                rank: rank1,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null,
            },
            golfer2: {
                name: golfer2,
                rank: rank2,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null,
            },
            golfer3: {
                name: golfer3,
                rank: rank3,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null,
            },
            golfer4: {
                name: golfer4,
                rank: rank4,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null,
            },
            golfer5: {
                name: golfer5,
                rank: rank5,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null,
            },
            golfer6: {
                name: golfer6,
                rank: rank6,
                position: null,
                round1: null,
                round2: null,
                round3: null,
                round4: null,
                total: null
            },
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
        var rank1 = $('#rank1').data('rank');
        console.log('Golfer 1 Name: ', golfer1);
        console.log('Golfer 1 Rank: ', rank1);
        var golfer2 = $('#golfer2Id').data('name');
        var rank2 = $('#rank2').data('rank');
        console.log('Golfer 2 Name: ', golfer2);
        var golfer3 = $('#golfer3Id').data('name');
        var rank3 = $('#rank3').data('rank');
        console.log('Golfer 3 Name: ', golfer3);
        var golfer4 = $('#golfer4Id').data('name');
        var rank4 = $('#rank4').data('rank');
        console.log('Golfer 4 Name: ', golfer4);
        var golfer5 = $('#golfer5Id').data('name');
        var rank5 = $('#rank5').data('rank');
        console.log('Golfer 5 Name: ', golfer5);
        var golfer6 = $('#golfer6Id').data('name');
        var rank6 = $('#rank6').data('rank');
        console.log('Golfer 6 Name: ', golfer6);

        updateScores({
            entryID: entryID,
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
            rank6: rank6,
        });


        
        function updateScores(teamData) {
            $.post('/team/update', teamData).then(function() {
                window.location.href = '/team';
            });
        }
    });
    

    $(document).on('click', '.deleteEntry', function() {
        console.log('Delete Verification Clicked');
        var objectID = $(this).attr('data-entryID');
        console.log('Company ID: ', objectID);

        $('#deleteEntryModal').data('id', objectID); 
        console.log($('#deleteEntryModal').data('id'));  
    });

    $(document).on('click', '#deleteEntry', function(event) {
        event.preventDefault();
        console.log('Delete Entry button clicked');
        var entryID = $('#deleteEntryModal').data('id');
        console.log(entryID)
        var id = {id: entryID};
        console.log('Delete Company ID: ', id);

        deleteEntry(id);

        function deleteEntry(MongoID) {
            $.post('/entry/delete/', MongoID).then(function() {
                window.location.href = '/team';
    
            });
        }
    });

    
});

