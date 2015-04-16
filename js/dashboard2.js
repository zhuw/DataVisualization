/**
 * Created by ZhuWei on 4/5/15.
 */

var dashboard2 = (function () {
    var chart;
    function createImage()
    {

    }

    function render() {
        var html =
        '<h1 align="center">Convenience Factor</h1>'+
        '<table>'+
        '<tr>' +
        '<td>' +
            '<iframe src="data/updateDountChart2kids.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'+
            '<iframe src="data/updateDountChart2Credits.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'+
            '<iframe src="data/updateDountChart2HasTV.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
            '<iframe src="data/updateDountChart2Wi-Fi.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'+
                '<iframe src="data/updateDountChart2Takeout.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'+
                '<iframe src="data/updateDountChart2Wheelchair.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'+
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' +
                '<iframe src="data/updateDountChart2OutdoorSeating.html" frameBorder="0" width="300" scrolling="no" height="300"><'+
                ' <iframe src="data/updateDountChart2Delivery.html" frameBorder="0" width="300" scrolling="no" height="300"></iframe>'
        '<tr>' +
        '<td>' +
        '</table>'

        $("#content").html(html);

        chart = createImage();
    }

    return {
        render: render
    }

}());

