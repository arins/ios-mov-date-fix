var exec = require('child_process').exec;
const fails = [];
const parse = /^Creation Date *: (\d\d\d\d:\d{2,2}:\d{2,2} \d{2,2}:\d{2,2}:\d{2,2}\+\d{2,2}:\d{2,2})$/i

const fs = require('fs');
if(process.argv.length < 3){
    console.log('no path specified');
    return;
}
const pathToFixFiles = process.argv[2];
exec('which exiftool', function callback(error, stdout, stderr) {
    if (stdout && !stderr) {
        fs.readdir(pathToFixFiles, (err, files) => {
            if (err) {
                console.log(err);
                return;
            }
            files.forEach(file => {
                exec('exiftool "-creationdate" ' + pathToFixFiles + file, function callback(error, stdout, stderr) {
                    stdout = stdout.replace('\n', '');
                    console.log(stderr);
                    result = parse.exec(stdout);
                    if (result) {
                        const command = 'exiftool ' + pathToFixFiles + file + ' "-alldates=' + result[1] + '"';
                        exec(command, function callbackEx(error, stdout, stderr) {
                            if (stdout) {
                                console.log('success:' + pathToFixFiles + file);

                            } else {
                                console.log('error: ' + stderr);
                            }

                        });

                    } else {
                        console.log('skipped: ' + pathToFixFiles + file);
                        console.log(result);
                        fails.push('skipped: ' + pathToFixFiles + file);
                    }
                });
            });
        });
        if (fails.length > 0) {
            for (let i = 0; i < fails.length; i++) {
                console.log('fails: ' + fails);
            }
            console.log('nr of fails: ' + fails.length);

        }
    } else {
        console.log('you need to install exiftool to be able to use this script')
    }

});