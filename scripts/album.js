
var createSongRow = function(songNumber, songName, songLength) {

var setSong = function(songNumber)

        if (currentSoundFile) {
          currentSoundFile.stop();
        }
        currentlyPlayingSongNumberNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];

        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
  };

  var setVolume = function(volume) {
       if (currentSoundFile) {
           currentSoundFile.setVolume(volume);
       }
   };
   
  var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
  };

  var createSongRow = function(songNumber, songName, songLength) {

       var template =
          '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;

       var $row = $(template);
       var clickHandler = function() {
         var songItem = $(this).attr('data-song-number')
         if(currentlyPlayingSongNumber !== null) {
            var playingSong = getSongNumberCell(currentlyPlayingSongNumber);
            playingSong.html(currentlyPlayingSongNumber);
         }

         if (currentlyPlayingSongNumber !== songNumber) {
            currentSoundFile.play();
		        $(this).html(pauseButtonTemplate);
		        currentlyPlayingSongNumber = setSong;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	       } else if (currentlyPlayingSongNumber === songNumber) {
           if (currentSoundFile.isPaused()) {
+                $(this).html(pauseButtonTemplate);
+                $('.main-controls .play-pause').html(playerBarPauseButton);
+                currentSoundFile.play();
+            } else {
+                $(this).html(playButtonTemplate);
+                $('.main-controls .play-pause').html(playerBarPlayButton);
+                currentSoundFile.pause();
+            }
	}
       };

       var onHover = function(event) {
         var songPlace = $(this).find('.song-item-number');
         var songNum = parseInt(songPlace.attr('data-song-number'));

         if (songNum !== currentlyPlayingSongNumber) {
           songPlace.html(playButtonTemplate);
         }
       };
       var offHover = function(event) {
         var songPlace = $(this).find('.song-item-number');
         var songNum = parseInt(songPlace.attr('data-song-number'));
         console.log(songNum, currentlyPlayingSongNumber)
         if (songNum !== currentlyPlayingSongNumber) {
            songPlace.html(songNumber);
          }
       };
       $row.find('.song-item-number').click(clickHandler);
       $row.hover(onHover, offHover);
       return $row;
   };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');


     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);


     $albumSongList.empty();


     for (var i = 0; i < album.songs.length; i++) {
          var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
          $albumSongList.append($newRow);
        }
    };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {

      $('.currently-playing .song-name').text(currentSongFromAlbum.title);
      $('.currently-playing .artist-name').text(currentAlbum.artist);
      $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
      $('.main-controls .play-pause').html(playerBarPauseButton);
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSongNumber === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSongNumber = songItem.getAttribute('data-song-number');
     }else if (currentlyPlayingSongNumber === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSongNumber = null;
     }else if (currentlyPlayingSongNumber !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSongNumber + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSongNumber = songItem.getAttribute('data-song-number');
     }
 };




var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;
    console.log('lastSongNumber', lastSongNumber);

    setSong = currentSongIndex + 1;
    currentSoundFile.play();
    console.log('currentlyPlayingSongNumber', currentlyPlayingSongNumber);
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    var lastSongNumber = currentlyPlayingSongNumber;

    setSong = currentSongIndex + 1;
    currentSoundFile.play();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
