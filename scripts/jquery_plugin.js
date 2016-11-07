/**
 * Created by houdong on 16/9/26.
 */
!function ($, window, document, undefined) {


    var timer = '';//定时器
    var plugin_luckDraw = 1;//是否第一次点击,如果第二次点击style不需要再次添加
    var plugin_openLoading = 1;//是否第一次点击,如果第二次点击style不需要再次添加

    var Construction = function (ele, opt) {
        this.$element = ele;
        this.defaults = {
            speed: 80,
            id: 1,
            deg: 0,
            callback: function () {}
        };
        this.options = $.extend({}, this.defaults, opt)
    };

    Construction.prototype = {
        //打开loading
        openLoading: function () {
            var loadingHtml =
                '<img src="images/Preloader_2_00000.png">' +
                '<div>加载中...</div>';
            this.$element.append(loadingHtml);
            if (plugin_openLoading == 1) {
                var className = this.$element.attr('class');
                $('<style></style>').text(
                    '.' + className + '{' +
                    'width:1.6rem;' +
                    'height:1.6rem;' +
                    'position: fixed;' +
                    'top:50%;' +
                    'margin-top: -0.8rem;' +
                    'left:50%;' +
                    'margin-left: -0.8rem;' +
                    'background-color:rgba(0,0,0,0.8);' +
                    'border-radius: 10px;' +
                    'display: none;' +
                    '}' +
                    '.' + className + ' img{' +
                    'width:1.28rem;' +
                    'height:0.4rem;' +
                    'position: absolute;' +
                    'top:0.5rem;' +
                    'left:50%;' +
                    'margin-left: -0.64rem;' +
                    '}' +
                    '.' + className + ' div{' +
                    'width:1.6rem;' +
                    'font-size: 0.2rem;' +
                    'color: #ffffff;' +
                    'position: absolute;' +
                    'top:1rem;' +
                    'left:50%;' +
                    'margin-left: -0.8rem;' +
                    'text-align: center;' +
                    '}'
                ).appendTo($("head"));
                plugin_openLoading = 0;
            }
            var i = 0;
            var changeImgSrc = function () {
                i++;
                if (0 <= i && i < 10) {
                    this.$element.children('img').attr('src', 'images/Preloader_2_0000' + i + '.png');
                } else if (10 <= i && i <= 15) {
                    this.$element.children('img').attr('src', 'images/Preloader_2_000' + i + '.png');
                } else {
                    i = 0;
                }
            }.bind(this);
            this.$element.show();
            timer = setInterval(changeImgSrc, this.options.speed);
        },
        //关闭loading
        closeLoading: function () {
            clearInterval(timer);
            this.$element.hide();
        },
        //转盘抽奖     
        luckDraw: function () {
            var isD = 0; //是否正在转 0：未转 1：在转
            var i = 0; //计数第几次抽奖
            var pre = 0; //当前角度
            var next = 0;//之后角度
            var turnAround = function () {
                if (!isD) {
                    isD = 1;
                    i++;
                    next = this.options.id * this.options.deg;
                    var nextDeg = next + 2880;
                    if (plugin_luckDraw == 1) {
                        var s = '@keyframes turnAround' + i + '{'
                            + '      0% {'
                            + '   		transform: rotate(' + 0 + 'deg);'
                            + '   	}'
                            + '   	100% {'
                            + '   		transform: rotate(' + nextDeg + 'deg);'
                            + '   	}'
                            + '   }';
                        s += '   @-webkit-keyframes turnAround' + i + '{'
                            + '      0% {'
                            + '   		-webkit-transform: rotate(' + 0 + 'deg);'
                            + '   	}'
                            + '   	100% {'
                            + '   		-webkit-transform: rotate(' + nextDeg + 'deg);'
                            + '   	}'
                            + '   }'
                            + '   .turnAround' + i + ' {'
                            + '   	animation: turnAround' + i + ' 2s ease;'
                            + '     -webkit-animation: turnAround' + i + ' 2s ease;'
                            + '   }';
                        $('<style></style>').text(s).appendTo($("head"));
                        plugin_luckDraw = 0;
                    }
                    this.$element.addClass('turnAround' + i);
                    pre = next;
                    setTimeout(function () {
                        this.$element.css({
                            transform: 'rotate(' + pre + 'deg)'
                        });
                        isD = 0;
                        this.$element.removeClass('turnAround' + i);
                        this.options.callback();
                    }.bind(this), 1900);
                }
            }.bind(this);
            return turnAround();
        },
        //滑动到底部刷新
        slideRefresh: function () {
            var moreHtml =
                '<div class="sk-fading-circle">' +
                '<div class="sk-circle sk-circle1"></div>' +
                '<div class="sk-circle sk-circle2"></div>' +
                '<div class="sk-circle sk-circle3"></div>' +
                '<div class="sk-circle sk-circle4"></div>' +
                '<div class="sk-circle sk-circle5"></div>' +
                '<div class="sk-circle sk-circle6"></div>' +
                '<div class="sk-circle sk-circle7"></div>' +
                '<div class="sk-circle sk-circle8"></div>' +
                '<div class="sk-circle sk-circle9"></div>' +
                '<div class="sk-circle sk-circle10"></div>' +
                '<div class="sk-circle sk-circle11"></div>' +
                '<div class="sk-circle sk-circle12"></div>' +
                '</div>';
            this.$element.children('.more-loading').html(moreHtml);
            this.$element[0].onscroll = function () {
                var marginBot = 0;
                //scrollTop 页面利用滚动条滚动到下方时，隐藏在滚动条上方的页面的高度
                //scrollHeight  网页内容的实际高度
                //clientHeight 内容可视区域的高度
                //网页内容的实际高度 = 滚动条的高度(隐藏元素的高度)+内容可视区域的高度
                marginBot = this.$element[0].scrollHeight - this.$element[0].scrollTop - this.$element[0].clientHeight;
                if (marginBot <= 0) {
                    $('.sk-fading-circle').show();
                    var func = function () {
                        this.$element.children('.content').append(this.options.callback());
                        $('.sk-fading-circle').hide();
                    }.bind(this);
                    setTimeout(func,2000);//这里是为了展示效果所以设置定时器,正式插件只写func里面的方法即可
                }
            }.bind(this);
        }
    };

    $.fn.plugins = function (options) {
        var construction = new Construction(this, options.options);
        return construction[options.name]()
    };

}(jQuery, window, document, undefined);

