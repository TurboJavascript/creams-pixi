$(function () {
    var app = new CreamsPIXI(document.getElementById('creams-pixi'));
    app.graphManager.setGraph({
        backgroundPic: '/res/Model.jpg',
        shapes: data,
    })

    let dom = $("#operation");
    $(dom.find("span")[0]).click(function () {
        app.operationManager.zoomIn(1.5)
    })
    $(dom.find("span")[1]).click(function () {
        app.operationManager.justify()
    })
    $(dom.find("span")[2]).click(function () {
        app.operationManager.zoomOut(1.5)
    })

    let eraser=$("#eraser");
    $(eraser.find("span")[0]).click(function () {
        app.operationManager.enableEraser(true);
    })
    $(eraser.find('span')[1]).click(()=>{
        app.operationManager.setEraserSize($(eraser.find("input")).val())
    })
    $(eraser.find("span")[2]).click(function () {
        app.operationManager.enableEraser(false);
    })
    app.eventManager.onClickGraph((index,event)=>{
        console.log(index+";x:"+event.x+"y:"+event.y)
    })
    app.eventManager.onMouseEnterShape((index,event)=>{
        console.log(index+";x:"+event.x+"y:"+event.y)
    })
})