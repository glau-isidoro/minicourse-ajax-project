
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetS = $('#street').val();
    var cityS = $('#city').val();
    var address = streetS + ', ' + cityS;

    $greeting.text('So you want to live at ' + address + '?');

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' +
                        address + '';
    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');

    // YOUR CODE GOES HERE!

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='
                      + cityS + '&sort=newest&api-key=1eeab4da5ab34758a20ed57755d3df63';
    $.getJSON(nytimesUrl, function(data){
      $nytHeaderElem.text('New York Times Articles About ' + cityS);
      articles = data.response.docs;
      for(var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article"><a href="' + article.web_url + '">' +
                        article.headline.main + '</a><p>' + article.snippet + '</p></li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    })

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityS +
                  '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
      $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      success: function(response) {
        var articleList = response[1];
        for(var i = 0; i < articleList.length; i++) {
          articleS = articleList[i];
          var url = 'http://en.wikipedia.org/wiki/' + articleS;
          $wikiElem.append('<li><a href="' + url + '">' + articleS + '</a></li>');
        };

        clearTimeout(wikiRequestTimeout);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
