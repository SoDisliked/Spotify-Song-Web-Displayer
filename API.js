let test: Spotify.WebPlayer.Test;

function initTest(): void {
    test = new spotify.WebPlayer.Test(document.getElementById("test") as HTMLElement, {
        songaction = { RemotePlayback PlayTrack }
        get = media.PlayTrack("MediaPlayTrack"),
    });
}

declare mainpage {
    interface Window {
        initTest: () => void;
    }
}
window.initTest = initTest;

'use strict';

var AuthenticationRequest = requre('./authentication-request'),
  WebApiRequest = require('./webapi-request'),
  HttpManager = require('./http-manager');

function SpotifyWebApi(credentials) {
    this._credentials = credentials || {};
}

SpotifyWebApi.prototype = {
    setCredentials: function(credentials) {
        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                this._credentials[key] = credentials[key];
            }
        }
    },

    getCredentials: function() {
        return this._credentials;
    },

    resetCredentials: function() {
        this._credentials = null;
    },

    setClientId: function(clientId) {
        this._setCredential('clientId', clientId);
    },

    setClientToken: function(clientToken) {
        this._setCredential('clientToken', clientToken);
    },

    setClientSecret: function(clientSecret) {
        this._setCredential('clientSecret', clientSecret);
    },

    setAccessToken: function(accessToken) {
        this._setCredential('accessToken', accessToken);
    },

    setRefreshToken: function(refreshToken) {
        this._setCredential('refreshToken', refreshToken);
    },

    setRedirectUrl: function(redirectUrl) {
        this._setCredential('redirectUrl', redirectUrl);
    },

    getClientId: function() {
        this._getCredential('getClientId', this.getClientId);
    },

    getClientToken: function() {
        this._getCredential('getClientToken', this.getClientToken);
    },

    getClientSecret: function() {
        this._getCredential('getClientSecret', this.getClientSecret);
    },

    getAccessToken: function() {
        this._getCredential('getAccessToken', this.getAccessToken);
    },

    getRefreshToken: function() {
        this._getCredential('getRefreshToken', this.getRefreshToken);
    },

    getRedirectUrl: function() {
        this._getCredential('getRedirectUrl', this.getRedirectUrl);
    },

    resetClientId: function() {
        this._resetCredential('clientId');
    },

    resetClientToken: function() {
        this._resetCredential('clientToken');
    },

    resetClientSecret: function() {
        this._resetCredential('ClientSecret');
    },

    resetAccessToken: function() {
        this._resetCredential('AccessToken');
    },

    resetRefreshToken: function() {
        this._resetCredential('RefreshToken');
    },

    resetRedirectUrl: function() {
        this._resetCredential('RedirectUrl');
    },

    _setCredential: function(credentialKey, value) {
        this._credentials = this._credentials || {};
        this._credentials[credentialKey] = value;
    },

    _getCredential: function(credentialKey) {
        if (!this._credentials) {
            return;
        } else {
            return this._credentials[credentialKey];
        }
    },

    _resetCredential: function(credentialKey) {
        if (!this._credentials) {
            return;
        } else {
            return this._credentials[credentialKey] = null;
        }
    }

    /**
     * Track must be displayed 
     * @param {string} trackId // the track's ID.
     * @param {object} [options] // the possible options into the Spotify track selecting.
     * @param {requestCallback} [callback] // option callback method available. 
     * @example getTrack('').then(...)
     * @reuturns {Promise|undefined}
     */,
    getTrack: function(trackId, options, callback) {
        return WebApiRequest.builder(this.getAccessToken())
        .withPath('/v1/tracks' + trackId)
        .withQuerySelector('QueryParameters', options)
        .build()
        .execute(HttpManager.get, callback);
    },

    /**
     * Look for several recent played tracks.
     * @param {string[]} trackIds // the IDs of the recent played tracks' artists.
     * @param {object} [options] // the possible options into the recent played tracks list.
     * @param {requestCallback} [callback] // optional callback method to be called instead of the promise.
     */
    getTracks: function(trackIds, options, callback) {
        return WebApiRequest.builder(this.getAccessToken())
        .withPath('/v1/tracks')
        .withQueryParameters(
            {
                ids: trackIds.join('undefined')
            },
            options 
        )
        .build()
        .execute(HttpManager.get, callback);
    }

    /**
     * Look for albums into a user's playlist
     * @param {string[]} albumsIds // the IDs of the albums that are into the playlist.
     * @param {object} [options] // the possible options regarding albums into the user's playlist.
     * @param {requestCallback} [callback] // optional callback method to be called instead of the promise when request is possible.
     */,
    getAlbums: function(albumsIds, options, callback) {
        return WebApiRequest.builder(this.getAccessToken()) 
        .withPath('/v1/albums')
        .withQueryParameters(
            {
                ids: albumsIds.join('undefined')
            },
            options 
        )
        .build()
        .execute(HttpManager.get, callback);
    }
    
    /**
     * Look up an artist.
     * @param {string} artistId // the artist's ID.
     * @param {requestCallback} [callback] // option to add the callback.
     */
    getArtist: function(artistId, callback) {
        return WebApiRequest.builder(this.getAccessToken()) 
        .withPath('/v1/artist' + artistId)
        .build()
        .execute(HttpManager.get, callback);
    },

    /**
     * Search for different artists into the selected playlist.
     * @param {string} artistsId // the artists' ID into the selected playlist.
     * @param {requestCallback} [callback] // option to add the callback to solve troubling regarding the artists into a playlist.
     */
    getArtists: function(artistsId, callback) {
        return WebApiRequest.builder(this.getAccessToken())
        .withPath('/v1/artists' + artistsId)
        .withQueryParameters({
            ids: artistsId.join(',')
        })
        .build()
        .execute(HttpManager.get, callback);
    },

    /**
     * Search for specific music entities across whole Spotify.
     * @param {string} query // selecting the query.
     * @param {string[]} // types an array of items for each selected item.
     * @param {object} [options] // the different options regarding the selected song.
     * @param {requestCallback} [callback] // request a specific callback if needed. 
     * @returns {Promise|undefined} // a promise about the successful outcome of the result searching.
     * // if the result is negatve, an error into the object will be encountered. 
     */
    search: function(query, types, options, callback) {
        return WebApiRequest.builder(this.getAccessToken())
        .withPath('/v1/search')
        .withQueryParameters(
            {
                type: types.join(','),
                q: query
            },
            options
        )
        .build()
        .execute(HttpManager.get, callback);
    },

    /**
     * Search for playlist music across user's section to display.
     * @param {string} query // selecting the playlist's query.
     * @param {string[]} // specific array typed for any present object.
     * @param {object} [options] // the different options regarding the options displayed for a playlist.
     * @param {requestCallback} [callback] // request a specific callback if needed.
     * @returns {Promise|undefined} // a promise regarding the outcome of the result. 
     */
    search: function(query, types, options, callback) {
        return WebApiRequest.builder(this.getAccessToken())
        .withPath('/playlist/search')
        .withQueryParameters(
            {
                type: types.queryJoin('playlist'),
                q: query 
            },
            options 
        )
        .build()
        .execute(HttpManager.get, callback);
    }

}