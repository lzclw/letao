// import { log } from "util";


// import { template } from "handlebars";

$(function () {
    addHistory()
    queryHistory()
    deleteHistory()
    clearHistory()
    // 添加记录函数
    function addHistory() {
        // 1. 点击搜索添加记录 添加事件
        // 2. 获取当前输入内容 搜索的内容
        // 3. 判断如果没有输入内容 提示输入
        // 4. 把记录添加到本地存储中
        // 5. 因为连续添加记录应该把数据放到一个数组中 把数组整个加入到本地存储中
        // 6. 而且还得获取之前的数组之前有数组 使用之前的数组往这个里面添加 新的搜索的值
        // 7. 而且如果搜索内容重复还要对数组去重（把旧的删掉 在添加新的） 新的内容往数组最前面加
        // 8. 加完后把数组保存到本地存储中（转成json字符串）
        $(".main_btn").on("tap", function () {
            var search = $(".main_search").val().trim();
            if (search == "") {
                mui.toast('请输入搜索内容', {
                    duration: 'long',
                    type: 'div'
                });
                return false;
            }

            // 刷新网页就查询 有没有记录
            var jiLu = localStorage.getItem("jiLu")
            // 判断 如果有 就等于这个值 没有就等于空数组
            if (jiLu) {
                jiLu = JSON.parse(jiLu)
            } else {
                jiLu = []
            };
            //判断 有没有重复的
            for (var i = 0; i < jiLu.length; i++) {
                if (jiLu[i].key == search) {
                    jiLu.splice(i, 1)
                    i--;
                }
            };

            jiLu.unshift({
                key: search,
                time: new Date().getTime()
            });

            //把数据存到浏览器
            localStorage.setItem("jiLu", JSON.stringify(jiLu))
            queryHistory()
            $(".main_search").val("")

            // 需要跳转到商品列表  要获取到输入的文字
            location='ProductList.html?search='+search+'&time='+new Date().getTime()
        })



    }

    // 查询记录函数
    function queryHistory() {
        var jiLu = localStorage.getItem("jiLu");
        if (jiLu) {
            jiLu = JSON.parse(jiLu)
        } else {
            jiLu = []
        };
        var html = template("searchTpl", {
            list: jiLu
        })
        $(".search_ul").html(html)
    }

    /* 3. 删除记录函数 */
    function deleteHistory() {
        $(".search_ul").on("tap",".mui-badge", function () {
            console.log($(this).parent());
            var index=$(this).parent().index();
            var jiLu= localStorage.getItem("jiLu")
            jiLu=JSON.parse(jiLu)
            jiLu.splice(index,1)
            // 再次存入浏览器
            localStorage.setItem("jiLu",JSON.stringify(jiLu))
            queryHistory()
 
         })
    }
    /* 4. 清空记录函数 */
    function clearHistory() {
        $(".clear").on("tap",function () {
            localStorage.removeItem("jiLu")
            queryHistory()
          })
    }

    

})