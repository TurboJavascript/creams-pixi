$(function () {
    var app = new CreamsPIXI(document.getElementById('creams-pixi'));
    app.graphManager.setGraph({
        backgroundPic: '/res/Model.jpg',
        shapes: data,
    })

    let dom = $("#operation");
    $(dom.find("span")[0]).click(function () {
        app.operationManager.zoomIn(2)
    })
    $(dom.find("span")[1]).click(function () {
        app.operationManager.justify()
    })
    $(dom.find("span")[2]).click(function () {
        app.operationManager.zoomOut(2)
    })
})