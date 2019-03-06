// import { log } from "util";

$(function () {
    /* 1. 完成分类左侧列表动态渲染
        1. 使用ajax请求数据
        2. 使用模板引擎渲染列表 */
    // 1. 使用ajax请求数据
    $.ajax({
        // 因为已经在localhost:3000域名下打开页面
        url: '/category/queryTopCategory',
        success: function (data) {
            // data是后台返回给我们的数据 返回就已经是对象 因为模板引擎要求 后台直接返回模板引擎需要的格式
            // data是这个对象 遍历的是data对象的rows数组
            // console.log(data);
            // 2. 使用模板函数调用 template函数 第一个参数模板id categoryLeftTpl 第二个是数据对象
            // 我们现在后台返回data已经是数据对象了 可以直接使用
            var html = template('categoryLeftTpl', data);
            // 3. 把生成模板渲染到ul里面
            $('.category-left ul').html(html);
        }
    });

    // 点击效果分类 页面左侧
    leftClick()
    right(1)

    function leftClick() {
        $(".category_click").on("tap", "li", function () {
            $(this).addClass("active").siblings("li").removeClass("active")
            // 获取当前的id
            var id = $(this).data("id")
            right(id)
        })
    }

    //右侧的ajax请求
    function right(id) {
        $.ajax({
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            success: function (data) {
                var html = template("categoryRightTpl", {
                    list: data.rows
                })
                $(".category-right .right").html(html)
            }
        })
    };

    // 区域滚动初始化
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
})