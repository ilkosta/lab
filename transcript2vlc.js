(function() {
  var v = "1.9.0";

  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement("script");
    //script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    script.src = "http://localhost:8000/static/jquery.min.js";
    script.onload = script.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
        done = true;
        initMyBookmarklet();
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    initMyBookmarklet();
  }

  String.prototype.repeat = function(num) {
    return new Array(isNaN(num)? 1 : ++num).join(this);
  };

  function toDate(strTime) {
    var time_parts = strTime.split(/:/);
    var time = new Date();
    //time.setHours   (time_parts[0]);
    time.setMinutes (time_parts[0]);
    time.setSeconds (time_parts[1]);
    return time;
  }

  function toVlcTime(time) {
    if( typeof time != typeof (new Date()) ) {
      console.log('parametro time errato:' + time);
      return null;
    }

    function fill(n) { return (n<10) ? ('0' + n) : n; }
    var s = '';
    return  fill(time.getMinutes()) +
      ':' + fill(time.getSeconds()) +
      ',' + time.getMilliseconds();
  }

  function initMyBookmarklet() {
    (window.myBookmarklet = function() {
      var lessons = jQuery("table#tblCourse").find("table.transVideos tbody tr");
      var output  = [];

      function printLessonTitle(lesson_name) {
        output.push('-'.repeat(lesson_name.length) );
        output.push( lesson_name );
        output.push('');
      }

      function printPhrase( counter, start_t, end_t, phrase ) {
        if( phrase.trim() === '' )
          return;

        output.push( counter );
        output.push( start_t + ' --> ' + end_t );
        output.push( phrase );
        output.push('');
      }

      lessons.each(function() {

        jQuery(this).find(':nth-child(1)').each( function() {
          jQuery(this).find('a.toggle').each( function() {
            var lesson_name = jQuery(this).text().trim();
            printLessonTitle(lesson_name);
          });

          var counter = 0;
          var start_t = null; //'00:00:00,000';
          var row_t, phrase, current_phrase, end_time;
          jQuery(this).find('table tbody tr').each( function() {
            row_t = jQuery(this).find(':nth-child(1)').not('a').text().trim();
            current_phrase = jQuery(this).find(':nth-child(2)').text().trim();

            if(start_t != null) {
              end_time  = new Date(toDate(row_t) - 900);
              printPhrase( counter, start_t, toVlcTime(end_time), phrase);
            }
            start_t   = '00:' + row_t + ',000';
            phrase    = current_phrase;
            counter   += 1;
          });
        });

      }); // each lesson
      //window.URL = window.webkitURL || window.URL;
      console.log(output.join('\n'));
      //location.href = "data:application/octet-stream" +
      //  encodeURIComponent( output.join('\n') );

    })();
  }

})();
