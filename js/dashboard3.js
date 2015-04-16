/**
 * Created by ZhuWei on 4/5/15.
 */

var dashboard3 = (function () {
    var chart;
    function createImage()
    {

    }

    function render() {
        var html =
        '<h1 align="center">Customer Review and Star</h1>'+
            '<iframe src="data/ratingCounter.html" frameBorder="0" width="1200" scrolling="no" height="900"></iframe>'


        $("#content").html(html);

        chart = createImage();
    }

    return {
        render: render
    }

}());

