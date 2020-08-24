var vm = new Vue({
    el:'#main',
    data:{
        boxnum: '10',
        boomnum: 20,
        booms: [],
        isfailed: false,
        issuccessd:false,
    },
    computed:{
        boxnums:function(){
            return parseInt(this.boxnum) * parseInt(this.boxnum);
        },
        // 不包含地雷的盒子
        excludebooms:function(){
            var exbo = [];
            for(i=1;i<= this.boxnums;i++){
                if(this.booms.indexOf(i) == -1) exbo.push(i);
            }
            return exbo;
        }
    },
    created:function(){
        // 执行生成地雷
        this.createbooms();
    },
    methods:{
        // 鼠标移入雷区
        showdialog(e){
            var flaginfo = e.target.getElementsByClassName('glyphicon glyphicon-flag')[0];
            var n = e.target.className;
            n = n.substr(3,n.length-1);
            // console.log(n);
            // 改变插旗与撤销状态
            if(flaginfo.style.display != 'none'){
                document.getElementById('dialog'+n).getElementsByTagName('li')[1].innerText = '撤旗';
            }else{
                document.getElementById('dialog'+n).getElementsByTagName('li')[1].innerText = '插旗';
            }
            // 展示菜单
            if(!this.isfailed && !this.issuccessd){
                if(document.getElementById('dialog'+n).style.display != 'block'){
                document.getElementById('dialog'+n).style.display = 'block';
                }
            }
        },
        // 鼠标移出雷区
        hidedialog(e){
            var n = e.target.className;
            n = n.substr(3,n.length-1);
            // console.log(n);
            if(document.getElementById('dialog'+n).style.display != 'none'){
                // 隐藏菜单
                this.closeelement(document.getElementById('dialog'+n));
            }
        },
        // 插、撤旗
        showflag(e){
            var flag = e.path[2].getElementsByClassName('glyphicon glyphicon-flag')[0];
            if(flag.style.display != 'block'){
                flag.style.display = 'block';

            }else{
                this.closeelement(flag);
            }
        },
        // 扫雷
        scanboom(e){
            // console.log(e);
            var box = e.path[2];
            var n = box.className;
            // 获得盒子编号
            var numofbox = parseInt(n.substr(3,n.length-1));
            // 踩雷
            if(this.booms.indexOf(numofbox) != -1){
                box.style.background = '#802424'
                this.booms.splice(this.booms.indexOf(numofbox),1);
                this.isfailed = true;
                this.seekbooms();
            }else{
                // 未踩雷
                box.style.background = '#ccc';
                this.seekboomsnum(e);
                // 判断是否胜利
                if(this.distinguish_is_success()){
                    this.issuccessd = true;
                    alert('你赢了！');
                }
            }
            
        },
        // 产生地雷
        createbooms(){
            for (index = 0; index < this.boomnum; index++){
                var n = parseInt(Math.random() * 100);
                if(this.booms.indexOf(n) == -1 && n <= this.boxnums) this.booms.push(n);
            }
        },
        
        // 查看地雷分布
        seekbooms(){
            for(i = 0;i < this.booms.length;i++){
                var posi = this.booms[i];
                document.getElementsByClassName('box'+posi)[0].style.background = '#f22';
            }
        },
        // 探测周围地雷数,并显示
        seekboomsnum(e){
            // 炸弹数
            var num = 0;
            // 当前位置
            var b = e.path[2];
            var posi = parseInt(e.path[2].className.substr(3,e.path[2].className.length-1));
            // 周围
            var top = posi - parseInt(this.boxnum);
            var bottom = posi + parseInt(this.boxnum);
            var left = posi - 1;
            var right = posi + 1;
            var lefttop = posi - parseInt(this.boxnum) - 1;
            var righttop = posi - parseInt(this.boxnum) + 1;
            var leftbotton = posi + parseInt(this.boxnum) - 1;
            var rightbottom = posi + parseInt(this.boxnum) + 1;
            // 判断上方是否存在炸弹
            if(this.booms.indexOf(top) != -1) num++;
            // 判断下方是否存在炸弹
            if(this.booms.indexOf(bottom) != -1) num++;
            // 判断左方是否存在炸弹
            if(this.distinguish_is_bound(posi) != 1 && this.booms.indexOf(left) != -1) num++;
            // 判断右方是否存在炸弹
            if(this.distinguish_is_bound(posi) != 2 && this.booms.indexOf(right) != -1) num++;
            // 判断左上方是否存在炸弹
            if(posi - parseInt(this.boxnum) >0 && this.distinguish_is_bound(posi) != 1 && this.booms.indexOf(lefttop) != -1) num++;
            // 判断左下方是否存在炸弹
            if(posi + parseInt(this.boxnum) <= this.boxnums && this.distinguish_is_bound(posi) != 1 && this.booms.indexOf(leftbotton) != -1) num++;
            // 判断右上方是否存在炸弹
            if(posi - parseInt(this.boxnum) >0 && this.distinguish_is_bound(posi) != 2 && this.booms.indexOf(righttop) != -1) num++;
            // 判断右下方是否存在炸弹
            if(posi + parseInt(this.boxnum) <= this.boxnums && this.distinguish_is_bound(posi) != 2 && this.booms.indexOf(rightbottom) != -1) num++;

            var spanNum = b.getElementsByTagName('span')[1];
            spanNum.innerText = num + '';
            spanNum.style.display = 'block';
        },
        // 传入数字判断是否为左右边缘
        distinguish_is_bound(n){
            /*var per = parseInt(this.boxnum);
            var left = (per + 1) + '';
            left = left[]
            var right = per;*/
            var s = n + '';
            s = s[s.length - 1];
            // 在左边缘
            if(s == '1') return 1;
            // 在右边缘
            if(s == '0') return 2;

        },
        // 判断是否胜利
        // 雷全部标记,非雷全部清空
        distinguish_is_success(){
            var allflagismarked = true;
            var allboxiscleaned = true;
            // 判断雷是否全部标记
            for(i = 0;i < this.booms.length;i++){
                // 每一颗地雷位置上的旗子
                var flag =  document.getElementsByClassName('box' + this.booms[i])[0].getElementsByTagName('span')[0];
                // 如果flag不可见则break,allflagismarked=false
                if(flag.style.display != 'block'){
                    allflagismarked = false;
                    break;
                }
            }
            // 判断非雷是否全部清空
            // #ccc转换后变为"rgb(204, 204, 204)"
            for(i=0;i<this.excludebooms.length;i++){
                // 每一个没雷的位置
                var exbo = document.getElementsByClassName('box'+this.excludebooms[i])[0];
                if(exbo.style.background != "rgb(204, 204, 204)"){
                    allboxiscleaned = false;
                    break;
                }
            }

            if(allflagismarked && allboxiscleaned){
                return true;
            }else{
                return false;
            }
        },
        // 关闭传入的元素
        closeelement(e){
            e.style.display = 'none';
        },
        // 重载
        reset(){
            document.location.reload();
     
        },

    }

})