var config = require('./config.json');
var fs = require('fs');

// profile blocks
var aliases = '\n# Aliases\n';
var funcs = '# Helper functions\n';
var project_root = '';
var profile = '';

// helper functions
function addAlias(alias, cmd) {
    aliases += 'alias ' + alias + '="' + cmd + '"\n';
}

function makeCd(path) {
    return 'cd ' + path;
}

function makeProjectPath(project) {
    return config['projects_root'] + '/' + project;
}

function addCd(alias, path) {
    addAlias(alias, makeCd(path));
}

function addClass(pr) {
    if ('div' in pr) {
        var pFunc = 'cmd' + pr.alias + '() {\n' +
                    '\tif [ $# -eq 0 ]\n' +
                    '\t\tthen\n' +
                    '\t\t\t' + makeCd(makeProjectPath(pr.dir)) + ';\n' +
                    '\t\telse\n' +
                    '\t\t\t' + makeCd(makeProjectPath(pr.dir)) + '/' + pr.div + '$1;\n' +
                    '\tfi\n' +
                    '}\n\n';
        funcs += pFunc;
        addAlias(pr.alias, 'cmd' + pr.alias);
    } else {
        addCd(pr.alias, makeProjectPath(pr.dir));        
    }
}

function writeout() {
    // write into bash_profile file
    profile += funcs + aliases;

    fs.open('bash_profile', 'w', function(err, fd) {
        fs.write(fd, profile, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The profile was saved!");
        });
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            } 
        });
    });
}


// add shortcut to home directory
if ('home' in config) {
    addCd(config.home, '~/');
}

// keep track of project root and add a shortcut to it
addCd('pro', config['projects_root']);

// add classes
for (var i = 0, len = config.classes.length; i < len; i++) {
    addClass(config.classes[i]);
}

// add shortcuts to projects
for (var i = 0, len = config.projects.length; i < len; i++) {
    addAlias(config.projects[i].alias, makeCd(makeProjectPath(config.projects[i].dir)));
}


// add other aliases
for (var i = 0, len = config.aliases.length; i < len; i++) {
    addAlias(config.aliases[i].alias, config.aliases[i].cmd);
}

// add partials
var len = config.partials.length;
if (len > 0) {
    var i = 0;
    function partialCallback(err, data) {
        if (err) {
            return console.log(err);
        }
        profile = data + profile;
        i++;
        if (i < len) {
            fs.readFile('./partials/' + config.partials[i], 'utf8', partialCallback);
        } else {
            writeout();
        }
    }
    fs.readFile('./partials/' + config.partials[i], 'utf8', partialCallback);
} else {
    writeout();
}
