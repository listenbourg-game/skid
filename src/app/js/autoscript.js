skidinc.autoscript = {};



skidinc.autoscript.list = function() {
    return '<b>*</b> autoscripts got the same names as scripts. You can also check the autoscript tab for names.';
};

skidinc.autoscript.buy = function(what) {
    var cost=0
    var exists = false,
        s;
    
    for (var script in skidinc.script.scripts) {
        var i = script,
            script = skidinc.script.scripts[i];
        
        if (what == script.id) {
            exists = true;
            s = script;
        };
    };
    
    if (!exists)
        return skidinc.console.print('<x>ERR</x> <b>' + what + '</b> is not a known autoscript name.');
    
    if (exists) {
        if (skidinc.autoscript.unlocked[s.i])
            return skidinc.console.print('<x>ERR</x> you already unlocked <b>' + s.id + '</b> autoscript.');
        
        if (skidinc.player.money < skidinc.autoscript.cost[s.i])
            return skidinc.console.print('<x>ERR</x> not enough money to buy <b>' + s.id + '</b> autoscript (cost <b>$' + fix(skidinc.autoscript.cost[s.i]) + '</b>).');
        else {
            
            if(
                skidinc.script.unlocked[s.i]
            ){
                cost=skidinc.autoscript.cost[s.i];
            }else{
                cost=skidinc.autoscript.cost[s.i]+skidinc.script.scripts[s.i].cost

            }
            skidinc.player.money -= cost
            skidinc.autoscript.unlocked[s.i] = true;
            skidinc.script.unlocked[s.i] = true;
            return skidinc.console.print('You bought <b>' + s.id + '</b> autoscript.');
        };
    };
};

skidinc.autoscript.loop = function(times) {
    for (var i = 0; i < skidinc.script.scripts.length; i++) {
        var script = skidinc.script.scripts[i];
        //console.log(script)
        if (skidinc.autoscript.unlocked[script.i]) {
            skidinc.autoscript.time[script.i] += times / skidinc.fps;
            
            var maxTime = script.time / skidinc.player.getTimeMult(),
                percent = skidinc.autoscript.time[script.i] / maxTime * 100;
            
            $('#autoscript-' + script.i + ' #time').html(fix(skidinc.autoscript.time[script.i], 2) + 's <small>(' + fix(percent, 0) + '%)</small>');

            if (skidinc.autoscript.time[script.i] >= (script.time / skidinc.player.getTimeMult()))
                skidinc.autoscript.finish(script);
        };
    };
    
    skidinc.autoscript.update();
};

skidinc.autoscript.finish = function(script) {
    var money = script.money * skidinc.player.getMoneyMult()*skidinc.getbonus(skidinc.player.botnet+1),
        exp = script.exp * skidinc.player.getExpMult();
    
    skidinc.player.earn('money', Math. round(money));
    skidinc.player.earn('exp', exp);
    
    skidinc.script.completed[script.i]++;
    skidinc.script.totalCompleted = skidinc.script.completed.reduce((a, b) => a + b, 0);
    skidinc.autoscript.time[script.i] = 0;
};

skidinc.autoscript.update = function() {
    for (var i = 0; i < skidinc.script.scripts.length; i++) {
        var script = skidinc.script.scripts[i],
            scriptUnlocked = skidinc.script.unlocked[script.i],
            unlocked = skidinc.autoscript.unlocked[i],
            time = script.time / skidinc.player.getTimeMult(),
            income = script.money * skidinc.player.getMoneyMult(),
            incomePerSec = income / time,
            exp = script.exp * skidinc.player.getExpMult(),
            expPerSec = exp / time;
        
        if (unlocked) {
            $('#autoscript-' + script.i + ' #money').html('Money');
            $('#autoscript-' + script.i + ' #experience').html('Experience');
            $('#autoscript-' + script.i + ' #income').html('$' + fix(income, 0) + ' <small></small>');
            $('#autoscript-' + script.i + ' #exp').html(fix(exp, 0) + ' exp. <small></small>');
        }
        else {
            if (scriptUnlocked)
                $('#autoscript-' + script.i + ' #income').html('bought');
            else
                $('#autoscript-' + script.i + ' #income').html('cost <b>$' + fix(script.cost, 0) + '</b>');
            
            $('#autoscript-' + script.i + ' #money').html('Script');
            $('#autoscript-' + script.i + ' #experience').html('Autoscript');
            $('#autoscript-' + script.i + ' #exp').html('cost $' + fix(skidinc.autoscript.cost[i], 0) + '</b>');
        };
    };
};

skidinc.autoscript.domInit = function() {
    for (var i = 0; i < skidinc.script.scripts.length; i++) {
        var script = skidinc.script.scripts[i]
           
        
        $('#stats-autoscripts').append('<div id="autoscript-' + script.i + '" class="stat-container big-content">' +
            '<div id="autoscript-' + script.i + '-name" class="names">' +
                '<p><b>' + script.id + '</b></p>' +
                '<p id="money">Money</p>' +
                '<p id="experience">Experience</p>' +
            '</div>' +
            '<div class="content">' +
                '<p id="time">0.00s</p>' +
                '<p id="income">$0.00</p>' +
                '<p id="exp">$0.00</p>' +
            '</div>' +
        '</div>');
    };
};

skidinc.autoscript.init = function() {
    skidinc.script.slist.then((data)=>{
        skidinc.autoscript.unlocked = data.map((use)=>{return false})
        skidinc.autoscript.time = data.map((use)=>{return 0})
        skidinc.autoscript.cost = data.map((item)=>{
            
            return Math.pow(25,item.i+1)*2
        })
        if (skidinc.script.scripts.length !== skidinc.autoscript.unlocked.length) {
            skidinc.autoscript.unlocked = [];
            
            skidinc.script.scripts.forEach(function(i) {
                skidinc.autoscript.unlocked.push(false);
            });
        };
    
        if (skidinc.script.scripts.length !== skidinc.autoscript.time.length) {
            skidinc.autoscript.time = [];
            
            skidinc.script.scripts.forEach(function(i) {
                skidinc.autoscript.time.push(0);
            });
        };
    })
   
};

skidinc.autoscript.prestige = function() {
    skidinc.autoscript.unlocked = [];
    skidinc.autoscript.time = [];

    skidinc.script.scripts.forEach(function(i) {
        skidinc.autoscript.unlocked.push(false);
        skidinc.autoscript.time.push(0);
    });
}; 