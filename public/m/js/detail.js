$(function () {
    // 初始化轮播图 
    function getSearch(name) {
        var search = location.search.substr(1).split("&")
        //遍历得到的这个数组  要转码encodeURI   decodeURI
        for (var i = 0; i < search.length; i++) {
            if (search[i].split("=")[0] == encodeURI(name)) {
                return decodeURI(search[i].split("=")[1])
            }

        }
        return "";
    };


    idSearch()
    // 根据id 获取到详情
    function idSearch() {
        var id = getSearch("id")
        console.log(id);
        $.ajax({
            url: "/product/queryProductDetail",
            data: {
                id: id
            },
            success: function (obj) {
                // 因为size 是字符串 需要数组
                var arr = obj.size.split("-")
                var size=[]
               for(var i = +arr[0] ; i <+arr[1]   ; i++){
                   size.push(i)
               }
               obj.size=size;
                console.log(obj);
                var html = template("mainTpl", obj)
                $("#main-main").html(html)

                // 因为是模板 异步  所以在这里初始化
                initSlide()

                //初始化 区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
                // 数字框初始化
                mui('.mui-numbox').numbox();
                $(".product-size button").on("tap",function () {
                    $(this).addClass("mui-btn-warning").siblings().removeClass("mui-btn-warning")
                  })
                
            }
        })
    }

    // 初始化轮播图
    function initSlide() {
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
    }


})