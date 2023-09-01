const { exec, spawn } = require('child_process');

const getScripts = (command) => {
    return [
        { commands: [command, ['install']], cwd: 'web' },
        { commands: [command, ['install']], cwd: 'api' },
    ];
};

const HEART_EMOJI = `\u2764\uFE0F`;
const CRY_EMOJI = `\u{1F622}`;

const runScripts = async (scripts, index = 0) => {
    if (index >= scripts.length) {
        console.log(`\n\n${HEART_EMOJI} INSTALL SCRIPT EXECUTED SUCCESSFULLY ${HEART_EMOJI}`);
        return;
    }
    const [command, args] = scripts[index].commands;
    const cwd = scripts[index].cwd;
    console.log(`\n${HEART_EMOJI} START INSTALL PACKAGES IN ${cwd} FOLDER ${HEART_EMOJI}`);

    const childProcess = spawn(command, args, { shell: true, cwd });

    childProcess.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    childProcess.on('close', (code) => {
        if (code === 0) {
            console.log(
                `${HEART_EMOJI} INSTALL PACKAGES IN ${cwd} FOLDER SUCCESSFULLY ${HEART_EMOJI}`
            );
            runScripts(scripts, index + 1);
        } else {
            console.error(
                `${CRY_EMOJI} INSTALL PACKAGES IN ${cwd} folder exited with code ${code} ${CRY_EMOJI}`
            );
        }
    });
};

exec('yarn --version', (error, stdout, stderr) => {
    if (error) {
        // For npm
        runScripts(getScripts('npm'));
    } else {
        // For yarn
        runScripts(getScripts('yarn'));
    }
});
