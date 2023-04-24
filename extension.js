const vscode = require('vscode');
const axios = require('axios');
const { spawn } = require('child_process');


function activate(context) {

	let disposable = vscode.commands.registerCommand('yolocommit.randomCommit', async function () {
		const response = await axios.get('https://whatthecommit.com/index.txt');


		const push_to_remote = vscode.workspace
			.getConfiguration()
			.get('yolocommit.push_to_remote')

		//  get the commit prefix from the settings
		const commit_prefix = vscode.workspace
			.getConfiguration()
			.get('yolocommit.commit_prefix')
		console.log(commit_prefix);

		if (push_to_remote) {
			const commitMessage = `${commit_prefix}${response.data.trim()}`;
			console.log(`🗞️ LazyLogX Lazy Debugging for: commitMessage  =>  ${commitMessage}`);
			// show a vscode message with the commit message and then remove it after 5 seconds
			const message = vscode.window.showInformationMessage("Git Push: " + response.data.trim());
			setTimeout(() => message.dispose(), 5000);


			const options = { cwd: vscode.workspace.rootPath };
			const add = spawn('git', ['add', '.'], options);
			await new Promise(resolve => add.on('close', resolve));
			const commit = spawn('git', ['commit', '-m', commitMessage], options);
			await new Promise(resolve => commit.on('close', resolve));
			const push = spawn('git', ['push'], options);
			await new Promise(resolve => push.on('close', resolve));
		}
		else {

			const commitMessage = `Yolo Commit: ${response.data.trim()}`;
			// show a vscode message with the commit message and then remove it after 5 seconds
			const message = vscode.window.showInformationMessage(response.data.trim());
			setTimeout(() => message.dispose(), 5000);


			const options = { cwd: vscode.workspace.rootPath };
			const add = spawn('git', ['add', '.'], options);
			await new Promise(resolve => add.on('close', resolve));
			const commit = spawn('git', ['commit', '-m', commitMessage], options);
			await new Promise(resolve => commit.on('close', resolve));

		}


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
