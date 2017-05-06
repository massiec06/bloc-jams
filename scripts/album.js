var setSong = function(songNumber) {
        currentlyPlayingSongNumberNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];
  };

  var createSongRow = function(number) {
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
		        $(this).html(pauseButtonTemplate);
		        setSong(songNumber);
	       } else if (currentlyPlayingSongNumber === songNumber) {
		        $(this).html(playButtonTemplate);
		        currentlyPlayingSongNumber = null;
	}
       };
       var onHover = function(event) {
         var songPlace = $(this).find('.song-item-number');
         var songNum = songPlace.attr('data-song-number');

         if (songNum !== currentlyPlayingSongNumber) {
           songPlace.html(playButtonTemplate);
         }
       };
       var offHover = function(event) {
         var songPlace = $(this).find('.song-item-number');
         var songNum = songPlace.attr('data-song-number');

         if (songNum !== currentlyPlayingSongNumber) {
            songPlace.html(songNumber);
          }
       };
       $row.find('.song-item-number').click(clickHandler);
       $row.hover(onHover, offHover);
       return $row;
   };

   var setCurrentAlbum = function(album) {

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

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSongNumber === null) {
         songItem.innerHTML = pauseButtonTemplate;
         setSong(songItem.getAttribute('data-song-number'));
     }else if (currentlyPlayingSongNumber === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPLayingSongNumber = null;
     }else if (currentlyPlayingSongNumber !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongNumberElement = document.querySelector('[data-song-number="' + currentlyPlayingSongNumber + '"]');
         currentlyPlayingSongNumberElement.innerHTML = currentlyPlayingSongNumberElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         setSong(songItem.getAttribute('data-song-number'));
     }
 };




var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSongNumber = null;


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
});
