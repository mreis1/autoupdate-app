/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
	    var controlsEl = parentElement.querySelector('.controls');
		document.getElementById('clear').addEventListener('click',app.clearLog);
	    document.getElementById('fetchUpdate').addEventListener('click',app.fetchUpdate);
	    document.getElementById('installUpdate').addEventListener('click',app.installUpdate);
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        controlsEl.setAttribute('style', 'display: block;');

        console.log('Received Event: ' + id);

    }
};


/*
chcp_updateIsReadyToInstall - sent when new release was successfully loaded and ready to be installed.
chcp_updateLoadFailed - sent when plugin couldn't load update from the server. Error details are attached to the event.
chcp_nothingToUpdate - sent when we successfully loaded application config from the server, but there is nothing new is available.
chcp_beforeInstall - sent when an update is about to be installed.
chcp_updateInstalled - sent when update was successfully installed.
chcp_updateInstallFailed - sent when update installation failed. Error details are attached to the event.
chcp_nothingToInstall - sent when there is nothing to install. Probably, nothing was loaded before that.
chcp_beforeAssetsInstalledOnExternalStorage - sent when plugin is about to start installing bundle content on the external storage.
chcp_assetsInstalledOnExternalStorage - sent when plugin successfully copied web project files from bundle on the external storage. Most likely you will use it for debug purpose only. Or even never.
chcp_assetsInstallationError - sent when plugin couldn't copy files from bundle on the external storage. If this happens - plugin won't work. Can occur when there is not enough free space on the device. Error details are attached to the event.
*/

function _log(id){
	return function () {
		var args = Array.prototype.slice.call(arguments);
		app.log.apply(app.log, [id].concat(args));
	}
}


app.logTxt = '';
app.log = function(){
    app.logTxt += '\n';
	app.logTxt += JSON.stringify(arguments);
	app.logTxt += '\n';
	document.getElementById('log').innerHTML = app.logTxt;
};

['chcp_updateIsReadyToInstall',
	'chcp_updateLoadFailed',
	'chcp_nothingToUpdate',
	'chcp_beforeInstall',
	'chcp_updateInstalled',
	'chcp_updateInstallFailed',
	'chcp_nothingToInstall',
	'chcp_beforeAssetsInstalledOnExternalStorage',
	'chcp_assetsInstalledOnExternalStorage',
	'chcp_assetsInstallationError'].forEach(function (eventId) {
	app.log('Registered ' + eventId)
	document.addEventListener(eventId, _log(eventId), false);
	if (eventId === 'chcp_updateIsReadyToInstall'){
		document.addEventListener(eventId, function newUpdateAvailableHandler(eventData) {
				// do something
				var res = confirm('A new update is available. If you click confirm we will install it automatically for you.');
				if (res){
					app.installUpdate();
				}
			}, false);
	}
});

app.clearLog = function(){
    app.logTxt = '';
	document.getElementById('log').innerHTML = app.logTxt;
};
app.fetchUpdate = function () {
    chcp.fetchUpdate(function () {
        app.log(arguments);
    })
};
app.installUpdate = function () {
	chcp.installUpdate(function () {
		app.log(arguments);
	})
};

app.initialize();