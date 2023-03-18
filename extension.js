const vscode = require('vscode');
const axios = require('axios');
const { spawn } = require('child_process');


function activate(context) {

	let disposable = vscode.commands.registerCommand('yolocommit.randomCommit', async function () {
		const response = await axios.get('http://whatthecommit.com/index.txt');
		// print the text of the reposne to the console
		console.log(response.data);

		const commitMessage = `Yolo Commit: ${response.data.trim()}`;
		console.log(`🗒️ LazyLogX Lazy Debugging for: commitMessage  =>  ${commitMessage}`);

		const options = { cwd: vscode.workspace.rootPath };
		const add = spawn('git', ['add', '.'], options);
		await new Promise(resolve => add.on('close', resolve));
		const commit = spawn('git', ['commit', '-m', commitMessage], options);
		await new Promise(resolve => commit.on('close', resolve));
	});

	context.subscriptions.push(disposable);

	vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0).text = "$(git-commit) Random Commit";
	vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1).command = 'extension.randomCommit';
}


// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
