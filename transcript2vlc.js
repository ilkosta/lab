(function(){
	var v = "1.9.0";

	if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
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

	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
      var lessons = jQuery("table#tblCourse").find("table.transVideos tbody tr");
      var output  = []

      String.prototype.repeat = function(num) {
        return new Array(isNaN(num)? 1 : ++num).join(this);
      }
      lessons.each(function() {
        jQuery(this).find(':nth-child(1)').each( function() {
          jQuery(this).find('a.toggle').each( function() {
            var lesson_name = jQuery(this).text().trim();
            output.append('-'.repeat(lesson_name.length) );
            output.append( lesson_name );
            output.append('');
          });

          var counter = 0;
          var start_t = null;
          var phrase = null;

          jQuery(this).find('table tbody tr').each( function() {
            var row_t   = jQuery(this).find(':nth-child(1)').not('a').text().trim();
            var new_phrase  = jQuery(this).find(':nth-child(2)').text().trim();

            if( start_t != null) {
              var end_time_parts    = row_t.split(':');

              var end_time_minutes  = parseInt( end_time_parts[0] );
              // if( end_time_minutes ) {
                var end_time_minutes_s = '';
                if( end_time_minutes < 10 ) end_time_minutes_s = '0';
                end_time_minutes_s += end_time_minutes;
              // }

              var end_time_seconds  = parseInt( end_time_parts[1] ) -1;
              // if( end_time_seconds ) {
                var end_time_seconds_s = '';
                if( end_time_seconds < 10 ) end_time_seconds_s = '0';
                end_time_seconds_s += end_time_seconds;
              // }

              // if( end_time_seconds && end_time_minutes ) {
                var end_time_string   = '00:' + end_time_minutes_s + ':' + end_time_seconds_s + ',990';

                output.append( counter );
                output.append( start_t + ' --> ' + end_time_string );
                output.append( phrase );
              // }
            }
            start_t = '00:' + row_t + ',000';
            counter += 1;
            phrase = new_phrase;
          });
        });
      });
      //window.URL = window.webkitURL || window.URL;
      console.log(output.join('\n'));
      location.href = "data:application/octet-stream" + 
        encodeURIComponent( output.join('\n') );

		})();
	}

})();
