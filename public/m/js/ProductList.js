$(function () {
    // 先获取传过来的search
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
    queryProduct()
    searchProduct()
    sortProduct()
    pullRefresh()



    // 查询商品列表的函数
    function queryProduct() {
        // 获取前面网页搜索的内容
        var search = getSearch("search");
        $.ajax({
            url: "/product/queryProduct",
            data: {
                proName: search,
                page: 1,
                pageSize: 4,
            },
            success: function (obj) {
                var html = template("ProductListTpl", obj)
                $(".shangPing").html(html)
            }
        })
    }


    // 点击当前页面搜索按钮 搜索
    function searchProduct() {
        $(".btn-ProductList").on("tap", function () {
            //获取输入框的文字
            var inputSearch = $(".input-search").val().trim()
            //判断非空
            if (inputSearch == "") {
                mui.toast('请输入合法搜索内容!', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }
            //存入浏览器
            var jiLu = localStorage.getItem("jiLu");
            if (jiLu) {
                jiLu = JSON.parse(jiLu)
            } else {
                jiLu = []
            }
            // 先去重
            for (var i = 0; i < jiLu.length; i++) {
                if (jiLu[i].key == inputSearch) {
                    jiLu.splice(i, 1)
                    i--
                }
            }
            jiLu.unshift({
                key: inputSearch,
                time: new Date().getTime()
            })
            localStorage.setItem("jiLu", JSON.stringify(jiLu))
            $(".input-search").val("")
            location = "productlist.html?search=" + inputSearch + "&time=" + new Date().getTime();

        })
    }

    // 商品排序功能
    function sortProduct() {
        // 1. 给所有排序按钮添加点击事件
        // 2. 切换active类名
        // 3. 获取当前排序的方式 (提前把所有按钮排序方式保存到按钮属性上 通过js去获取排序方式)
        // 4. 调用API传人当前商品排序的方式 和 排序顺序（1表示升序  2 表示降序）
        // 5. 获取后台排序后的商品数据 调用模板 
        // 6. 把模板渲染到页面 */
        $(".ProductList_a a").on("tap", function () {

            $(this).addClass("active").siblings().removeClass("active")
            var sort = $(this).data("sort")
            // 判断如果是2 点击以后就变成1
            if (sort == 2) {
                sort = 1;
                $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up")
            } else {
                sort = 2
                $(this).find("i").removeClass("fa-angle-up").addClass("fa-angle-down")
            }
            $(this).data("sort", sort)
            var type = $(this).data("type")
            var search = getSearch("search")
            var obj = {
                proName: search,
                page: 1,
                pageSize: 4
            }
            obj[type] = sort;
            $.ajax({
                url: "/product/queryProduct",
                data: obj,
                success: function (obj) {
                    console.log(obj);
                    
                    var html = template('ProductListTpl', obj);
                    
                    $(".shangPing").html(html)
                }
            })



        })
    }

    // 下拉刷新和上拉加载
    function pullRefresh() {
        mui.init({
            pullRefresh: {
                // 指定当前下拉刷新的父容器 建议使用id选择器给区域滚动添加一个 pullrefresh id
                container: '#pullrefresh',
                // 初始化下拉刷新
                down: {
                    // 下拉刷新的回调函数 用真正的刷新数据 发送请求真实刷新数据和页面
                    callback: pulldownRefresh
                },
                // 初始化上拉加载更多
                up: {
                    // 上拉加载的回调函数 用来真正请求更多数据 追加到页面上
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function() {
                queryProduct()
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            }, 1500);
        }
        var page = 1;
        /**
         * 上拉加载具体业务实现
         */
        var search = getSearch("search")
        function pullupRefresh() {
            setTimeout(function() {
               $.ajax({
                   url : "/product/queryProduct",
                   data : {
                       proName : search,
                       page : ++page,
                       pageSize : 4,
                   },
                   success : function (obj) {
                       console.log(obj);
                       if (obj.data.length>0) {
                        var html = template('ProductListTpl', obj);
                        $(".shangPing").append(html)
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                       }else{
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); 
                       }
                     }
               })
            }, 1000);
        }
       
    }







    $(".mui-card-content").on("tap",".product-buy",function () {
        var id=$(this).data("id")
        location="detail.html?id="+id+"&time="+new Date().getTime();
      })



})