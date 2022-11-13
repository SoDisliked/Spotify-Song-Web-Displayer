/**
 * MediaKeys namespace.
 */
if (typeof MediaKeys == "undefined") var MediaKeys = {};

MediaKeys.playButton = "//button[@id='play-pause' and not(contains(@class, 'playing'))]";
MediaKeys.pauseButton = "//button[@id='play-pause' and containss(@class, 'playing'))";
MediaKeys.skipButton = "//button[@id='next']";
MediaKeys.previousButton = "//button[@id='previous']";
MediaKeys.repeatButton = "//button[@id='repeat']";
MediaKeys.shuffleButton =  "//button[@id='shffle']";