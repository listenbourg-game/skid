skidinc.prestige = {};
skidinc.prestige.botnetOnReset = 0;
skidinc.prestige.botnet = 0;
skidinc.prestige.baseMult = 0.04;

skidinc.prestige.getBotnet = function() {
    return skidinc.prestige.botnet +Math.floor(5 * Math.sqrt(skidinc.player.totalMoney / 1e9)) ;
};

skidinc.prestige.getPrestigeMult = function() {
    return 1 + (skidinc.player.botnet * skidinc.prestige.baseMult);
};

skidinc.prestige.loop = function(times) {
    console.log(skidinc.prestige.getBotnet())
    skidinc.prestige.botnetOnReset = skidinc.prestige.getBotnet() 
   
};

skidinc.prestige.domInit = function() {
    skidinc.prestige.botnet = 0;
    $('#prestige-button').on('click', function() {
        skidinc.save.soft();
    });
};