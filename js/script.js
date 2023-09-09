const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const output = document.getElementById('output');

// Initialize the current directory to the root
let currentDirectory = '~/';

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = input.value.trim(); // Trim leading/trailing whitespace
        input.value = ''; // Clear the input

        if (command !== '') {
            executeCommand(command);
        } else {
            // Create a new line when Enter is pressed with empty input
            createNewLine();
        }

        // Scroll to the bottom of the terminal
        terminal.scrollTop = terminal.scrollHeight;
    }
});

function executeCommand(command) {
    // Create a new line with user@web and the current directory before displaying the result
    const newLine = document.createElement('div');
    newLine.classList.add('input-line'); // Add the input-line class

    // Update the current directory for the 'cd' command
    if (command.startsWith('cd ')) {
        const newDirectory = command.substring(3).trim();
        if (newDirectory === '..') {
            // Navigate up one level
            currentDirectory = currentDirectory.split('/').slice(0, -2).join('/') + '/';
        } else if (newDirectory === '') {
            // Navigate to the home directory
            currentDirectory = '~/';
        } else {
            // Navigate to a new directory
            currentDirectory += newDirectory + '/';
        }
    }

    newLine.innerHTML = `<span class="user-prompt">user@web:${currentDirectory}~$</span> ${command}`;
    output.appendChild(newLine);

    // Split the command into parts
    const parts = command.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1).join(' ');

    // Execute commands
    switch (cmd) {
        case 'clear':
            clearTerminal();
            break;
        case 'echo':
            output.innerHTML += `<div>${args}</div>`;
            break;
        case 'title':
            setTitle(args);
            break;
        case 'ls':
            listFiles();
            break;
        case 'mkdir':
            createDirectory(args);
            break;
        case 'cat':
            readData(args);
            break;
        case 'nano':
            openNano();
            break;
        default:
            // For unrecognized commands, display an error message
            output.innerHTML += `<div>${cmd}: command not found</div>`;
    }

    // Scroll to the bottom of the terminal
    terminal.scrollTop = terminal.scrollHeight;
}

function createNewLine() {
    // Create a new line with just the user prompt
    const newLine = document.createElement('div');
    newLine.classList.add('input-line'); // Add the input-line class
    newLine.innerHTML = `<span class="user-prompt">user@web:${currentDirectory}~$</span>`;
    output.appendChild(newLine);

    // Scroll to the bottom of the terminal
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    output.innerHTML = '';
    // Scroll to the bottom of the terminal after clearing
    terminal.scrollTop = terminal.scrollHeight;
}

function setTitle(title) {
    document.title = title;
}

function listFiles() {
    // Retrieve data from localStorage (replace 'ls_data' with a suitable key)
    const lsData = localStorage.getItem('ls_data');
    if (lsData) {
        output.innerHTML += `<div>${lsData}</div>`;
    } else {
        output.innerHTML += `<div>No files or directories found.</div>`;
    }
}

function createDirectory(directoryName) {
    // Create a new directory in localStorage (replace 'ls_data' with a suitable key)
    const lsData = localStorage.getItem('ls_data');
    if (lsData) {
        const newData = lsData + `<br>${currentDirectory}${directoryName}/`;
        localStorage.setItem('ls_data', newData);
        output.innerHTML += `<div>Created directory: ${currentDirectory}${directoryName}</div>`;
    } else {
        // If no data exists, create the first directory
        localStorage.setItem('ls_data', `${currentDirectory}${directoryName}/`);
        output.innerHTML += `<div>Created directory: ${currentDirectory}${directoryName}</div>`;
    }
}

function removeFile(fileName) {
    // Remove a file from localStorage (replace 'rm_data' with a suitable key)
    const rmData = localStorage.getItem('rm_data');
    if (rmData) {
        // Split the data into lines
        const lines = rmData.split('<br>');
        // Check if the file exists and remove it
        if (lines.includes(`${currentDirectory}${fileName}`)) {
            const newData = lines.filter(line => line !== `${currentDirectory}${fileName}`).join('<br>');
            localStorage.setItem('rm_data', newData);
            output.innerHTML += `<div>Removed file: ${currentDirectory}${fileName}</div>`;
        } else {
            output.innerHTML += `<div>${currentDirectory}${fileName}: No such file</div>`;
        }
    } else {
        output.innerHTML += `<div>${currentDirectory}${fileName}: No such file</div>`;
    }
}

function removeDirectory(directoryName) {
    // Remove a directory from localStorage (replace 'rmdir_data' with a suitable key)
    const rmdirData = localStorage.getItem('rmdir_data');
    if (rmdirData) {
        // Split the data into lines
        const lines = rmdirData.split('<br>');
        // Check if the directory exists and remove it
        if (lines.includes(`${currentDirectory}${directoryName}/`)) {
            const newData = lines.filter(line => line !== `${currentDirectory}${directoryName}/`).join('<br>');
            localStorage.setItem('rmdir_data', newData);
            output.innerHTML += `<div>Removed directory: ${currentDirectory}${directoryName}</div>`;
        } else {
            output.innerHTML += `<div>${currentDirectory}${directoryName}: No such directory</div>`;
        }
    } else {
        output.innerHTML += `<div>${currentDirectory}${directoryName}: No such directory</div>`;
    }
}
function readData(fileName) {
    // Retrieve data from localStorage (replace 'cat_data' with a suitable key)
    const catData = localStorage.getItem('cat_data');
    if (catData) {
        output.innerHTML += `<div>${catData}</div>`;
    } else {
        output.innerHTML += `<div>${currentDirectory}${fileName}: No such file or directory</div>`;
    }
}

function openNano() {
    // Implement the nano text editor here or display a message
    output.innerHTML += `<div>Welcome to Nano text editor. (Implement your nano functionality here)</div>`;
}
