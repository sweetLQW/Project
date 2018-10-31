console.log(window.localStorage);
if(window.localStorage.number){
    if(window.localStorage.hours){
        location.href = "timing.html";
    }else{
        //h5定位
        //navigator.geolocation.getCurrentPosition(translatePoint); //定位
        //function translatePoint(position){
        //    var currentLat = position.coords.latitude;
        //    var currentLon = position.coords.longitude;
        //    var point = new BMap.Point(currentLon, currentLat);
        //    gps = point;
        //    BMap.Convertor.translate(gps, 0, initMap); //转换坐标
        //}
        //function initMap(point){
        //    //初始化地图
        //    nowpoint = point;
        //    map = new BMap.Map("map");
        //    map.addControl(new BMap.NavigationControl());//添加地图平移插件
        //    map.addControl(new BMap.GeolocationControl());//刷新
        //    map.centerAndZoom(point, 18);
        //    map.addOverlay(new BMap.Marker(point));
        //}
        //浏览器定位
        map = new BMap.Map("map");
        var point = new BMap.Point(116.331398,39.897445);
        map.centerAndZoom(point,12);
        geolocationPosition();
        //获取当前位置
        function geolocationPosition(){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    mk = new BMap.Marker(r.point);
                    map.addOverlay(mk);
                    map.panTo(r.point);
                    map.addControl(new BMap.NavigationControl());//添加地图平移插件
                    var opts = {anchor: BMAP_ANCHOR_TOP_LEFT, offset: new BMap.Size(40, 40)};
                    map.addControl(new BMap.GeolocationControl(opts));//定位控件，针对移动端开发，默认位于地图左下方。
                    nowpoint = r.point;
                }
                else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true});
        }
        //显示车辆位置
        setTimeout(function(){
            $.ajax({
                type:"get",
                url:"/findpoint",
                async:"false",
                success:function(data){
                    console.log(data);
                    for(var i in data){
                        showcyclepoint();
                        function showcyclepoint(){
                            var cycle_point = new BMap.Point(data[i].lng,data[i].lat);
                            var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png",new BMap.Size(23,25),{
                                offset:new BMap.Size(10.25),imageOffset:new BMap.Size(0,0-10*25)});
                            marker = new BMap.Marker(cycle_point,{icon:myIcon});// 创建标注
                            map.addOverlay(marker);// 将标注添加到地图中
                        }
                        //获取点击的覆盖物的经纬度，闭包
                        var polyline;
                        marker.onclick = (function(i){
                            return function(){
                                var overlays = map.getOverlays();
                                cycle_point = new BMap.Point(data[i].lng,data[i].lat);
                                var myP1 = nowpoint;    //起点
                                var myP2 = cycle_point;    //终点
                                window.run = function (){
                                    var distance = map.getDistance(myP1,myP2).toFixed(0);
                                    var needtime = Math.floor(distance/80);
                                    var opt = {
                                        width : 5,     // 信息窗口宽度
                                        height: 30,     // 信息窗口高度
                                        title : ""  // 信息窗口标题
                                    };
                                    var infoWindow = new BMap.InfoWindow('距离：'+distance+'米,时间：'+needtime+'分钟', opt);  // 创建信息窗口对象
                                    map.openInfoWindow(infoWindow, cycle_point);
                                    walking = new BMap.WalkingRoute(map,{onSearchComplete: function(results){
                                        if (walking.getStatus() == BMAP_STATUS_SUCCESS) {
                                            // 地图覆盖物
                                            addOverlays(results);
                                        }
                                    }},{renderOptions:{map: map,autoViewport: true}});    //驾车实例
                                    walking.search(myP1, myP2);    //显示一条线路
                                    // 添加覆盖物并设置视野
                                };
                                setTimeout(function(){
                                    run();
                                },100);
                                function addOverlays(results) {
                                    //设置小人
                                    var pts = walking.getResults().getPlan(0).getRoute(0).getPath();    //通过驾车实例，获得一系列点的数组
                                    var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
                                        //offset: new BMap.Size(0, -5),    //相当于CSS精灵
                                        imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
                                    });
                                    var carMk = new BMap.Marker(pts[0], {icon: myIcon});
                                    map.addOverlay(carMk);
                                    // 自行添加起点和终点
                                    //var start = results.getStart();
                                    //var end = results.getEnd();
                                    //addStart(start.point, start.title);
                                    //addEnd(end.point, end.title);
                                    var viewPoints = [myP1, myP2];
                                    //// 获取方案
                                    var plan = results.getPlan(0);
                                    // 获取方案中包含的路线
                                    for (var i =0; i < plan.getNumRoutes(); i ++) {
                                        addRoute(plan.getRoute(i).getPath());
                                        viewPoints.concat(plan.getRoute(i).getPath());
                                    }
                                    // 设置地图视野
                                    map.setViewport(viewPoints, {
                                        margins: [40, 10, 10, 10]
                                    });
                                }
                                // 添加起点覆盖物
                                function addStart(point, title){
                                    map.addOverlay(new BMap.Marker(point, {
                                        title: title,
                                        icon: new BMap.Icon('../images/1.jpeg', new BMap.Size(38, 41), {
                                            anchor: new BMap.Size(4, 36)
                                        })}));
                                }
                                // 添加终点覆盖物
                                function addEnd(point, title){
                                    map.addOverlay(new BMap.Marker(point, {
                                        title: title,
                                        icon: new BMap.Icon('../images/1.jpeg', new BMap.Size(38, 41), {
                                            anchor: new BMap.Size(4, 36)
                                        })}));
                                }
                                // 添加路线
                                function addRoute(path){
                                    polyline = map.addOverlay(new BMap.Polyline(path, {
                                        strokeColor: 'red',
                                        enableClicking: false
                                    }));
                                }
                                //可进入导航页
                                //var start = {
                                //    latlng: myP1,
                                //    name: ""
                                //};
                                //var end = {
                                //    latlng: myP2,
                                //    name:""
                                //};
                                //var opts1 = {
                                //    mode: BMAP_MODE_WALKING,//公交、驾车、导航均修改该参数
                                //    region: "天津"
                                //};
                                //var routeSearch=new BMap.RouteSearch();
                                //routeSearch.routeCall(start,end,opts1);
                            }
                        })(i);
                    }
                }
            });
        },2000);
        //显示用户手机号信息
        showusersnumber();
        //点击显示侧边栏
        $(document).on("tap",".menu",function(){
            $(".side").css("display","block");
        });
        //滑动左侧边显示侧边栏
        $(".container-bar").swipeRight(function(){
            $(".side").css("display","block");
        });
        //左滑关闭菜单栏
        $(".side").swipeLeft(function(){
            $(".side").css("display","none");
        });
        $(document).on("tap",".side-side",function(){
            $(".side").css("display","none");
        });
        //点击li背景变色
        $(".side-list li").bind("touchstart",function(){
            $(this).css("background-color","rgba(150, 150, 150, 0.36)");
        });
        $(".side-list li").bind("touchend",function(){
            $(this).css("background-color","#fff");
        });
        //点击用车
        $(document).on("tap",".use",function(){
            delete window.localStorage.cycleNumber;
            //test();
            $.ajax({
                type:"post",
                url:"/getbalance",
                data:{"number":window.localStorage.number,"money":"true"},
                success:function(data){
                    console.log(data);
                    if(data.money <= 0){
                        $(".hint-login").text("您的余额不足！");
                        $(".hint-login").fadeIn(500);
                        setTimeout(function(){
                            $(".hint-login").fadeOut(500);
                        },500);
                    }else{
                        if(data.idcard != "未认证"){
                            $(".use-modal").fadeIn();
                        }else{
                            $(".hint-login").text("身份未认证!");
                            $(".hint-login").fadeIn(500);
                            setTimeout(function(){
                                $(".hint-login").fadeOut(500);
                            },500);
                        }
                    }
                }
            });
        });
        $(document).on("tap",".close",function(){
            $(".cycle-number").val("");
            $(".hint").text("");
            $(".use-modal").fadeOut();
        });
        //点击获取车牌号对应密码
        $(document).on("tap",".sub",function(){
            var subText = $(".cycle-number").val();
            var reg = /^[0-9]{4}$/;
            console.log(reg.test(subText));
            if(subText === ""){
                $(".hint").text("请输入车牌号");
            }else if(reg.test(subText) === false){
                $(".hint").text("请输入正确得的车牌号");
            }else{
                $(".hint").text("");
                var data = {"number":subText};
                $.ajax({
                    type:"post",
                    url:"/getpassword",
                    data:data,
                    success:function(data){
                        console.log(data);
                        if(data === ""){
                            $(".hint").text("该车牌号不存在");
                        }else{
                            window.localStorage.cycleNumber = subText;
                            location.href = "timing.html";
                        }
                    }
                })
            }
        });
        //点击退出登录
        $(document).on("tap",".exit",function () {
            window.localStorage.clear(); //清除所有的变量和值
            location.href = "login.html";
        });
        //点击进入用户信息二级页面
        $(document).on("tap",".side-accountnumber",function () {
            location.href = "users-info.html";
        });
    }
}else{
    location.href = "login.html";
}