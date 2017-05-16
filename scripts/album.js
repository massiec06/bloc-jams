
// var createSongRow = function(songNumber, songName, songLength) {

var setSong = function(songNumber) {

        if (currentSoundFile) {
          currentSoundFile.stop();
        }
        currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];

        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
  };

  var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

  var setVolume = function(volume) {
       if (currentSoundFile) {
           currentSoundFile.setVolume(volume);
       }
   };

  var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
  };

  var $controller = $('.main-controls .play-pause')

  var createSongRow = function(songNumber, songName, songLength) {

       var template =
          '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
        + '</tr>'
      // };

       var $row = $(template);

       var clickHandler = function() {
        //  var songNumber = $(this).attr('data-song-number');
         if(currentlyPlayingSongNumber !== null) {
            var playingSong = getSongNumberCell(currentlyPlayingSongNumber);
            playingSong.html(currentlyPlayingSongNumber);
         }

         if (currentlyPlayingSongNumber !== songNumber) {
           setSong(songNumber);
           $(this).html(pauseButtonTemplate);
           $controller.html(playerBarPauseButton);
            currentSoundFile.play();
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            updateSeekBarWhileSongPlays();
	       } else if (currentlyPlayingSongNumber === songNumber) {
           if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $controller.html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            }else{
                //setSong(null);
                $(this).html(playButtonTemplate);
                $controller.html(playerBarPlayButton);
                currentSoundFile.pause();
                updateSeekBarWhileSongPlays();
            }
	       }
         updatePlayerBarSong();
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

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {

         currentSoundFile.bind('timeupdate', function(event) {

             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(this.getTime());
         });
     }
 };

 var setCurrentTimeInPlayerBar = function(currentTime) {
    var $timeElement = $('.current-time');
    $timeElement.text(filterTimeCode(currentTime));
 }

 var setTotalTimeInPlayerBar = function(totalTime) {
   var $timeElement = $('.total-time');
   $timeElement.text(filterTimeCode(totalTime));
 }

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
        var offsetXPercent = seekBarFillRatio * 100;

        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(100, offsetXPercent);


        var percentageString = offsetXPercent + '%';
        $seekBar.find('.fill').width(percentageString);
        $seekBar.find('.thumb').css({left: percentageString});
     };

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;


        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {

   var $seekBar = $(this).parent();

   $(document).bind('mousemove.thumb', function(event){
       var offsetX = event.pageX - $seekBar.offset().left;
       var barWidth = $seekBar.width();
       var seekBarFillRatio = offsetX / barWidth;

       updateSeekPercentage($seekBar, seekBarFillRatio);
   });
   $(document).bind('mouseup.thumb', function() {
       $(document).unbind('mousemove.thumb');
       $(document).unbind('mouseup.thumb');
   });
 });
 $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }

        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
      });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
 };

var updatePlayerBarSong = function() {

      $('.currently-playing .song-name').text(currentSongFromAlbum.title);
      $('.currently-playing .artist-name').text(currentAlbum.artist);
      $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
      
      setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};

// var clickHandler = function(targetElement) {
//     var songItem = getSongItem(targetElement);
//     if (currentlyPlayingSongNumber === null) {
//          songItem.innerHTML = pauseButtonTemplate;
//          currentlyPlayingSongNumber = songItem.getAttribute('data-song-number');
//      }else if (currentlyPlayingSongNumber === songItem.getAttribute('data-song-number')) {
//          songItem.innerHTML = playButtonTemplate;
//          currentlyPlayingSongNumber = null;
//      }else if (currentlyPlayingSongNumber !== songItem.getAttribute('data-song-number')) {
//          var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSongNumber + '"]');
//          currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
//          songItem.innerHTML = pauseButtonTemplate;
//          currentlyPlayingSongNumber = songItem.getAttribute('data-song-number');
//      }
//  };




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

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    var lastSongNumber = currentlyPlayingSongNumber;
    console.log('lastSongNumber', lastSongNumber);

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    console.log('currentlyPlayingSongNumber', currentlyPlayingSongNumber);
    // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

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

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
  console.log('in togglePlayFromPlayerBar', currentlyPlayingSongNumber);
  if (currentlyPlayingSongNumber === null) {
      setSong(1);
      //currentSoundFile.play();
  }

  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile.isPaused()) {
       currentlyPlayingCell.html(pauseButtonTemplate);
       $controller.html(playerBarPauseButton);
       currentSoundFile.play();
   }else{
       currentlyPlayingCell.html(playButtonTemplate);
       $controller.html(playerBarPlayButton);
       currentSoundFile.pause();
   }
}

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $controller.click(togglePlayFromPlayerBar);
    setupSeekBars();
});

var filterTimeCode = function(timeInSeconds) {
  var timeInSeconds = parseFloat(timeInSeconds);
  var minutes = Math.floor(timeInSeconds / 60);
  var seconds = Math.floor(timeInSeconds % 60);
  if (seconds < 10) {
    var songTime = minutes + ':' + 0 + seconds;
  }else{
    var songTime = minutes + ':' + seconds;
  }
  return songTime;
}
