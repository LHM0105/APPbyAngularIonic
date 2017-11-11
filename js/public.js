//设置根字体大小
(function(designWidth, maxWidth) {
	var doc = document,
	win = window,
	docEl = doc.documentElement,
	remStyle = document.createElement("style"),
	tid;

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		maxWidth = maxWidth || 540;
		width>maxWidth && (width=maxWidth);
		var rem = width * 100 / designWidth;
		remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
	}

	if (docEl.firstElementChild) {
		docEl.firstElementChild.appendChild(remStyle);
	} else {
		var wrap = doc.createElement("div");
		wrap.appendChild(remStyle);
		doc.write(wrap.innerHTML);
		wrap = null;
	}
	//要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
	refreshRem();

	win.addEventListener("resize", function() {
		clearTimeout(tid); //防止执行两次
		tid = setTimeout(refreshRem, 300);
	}, false);

	win.addEventListener("pageshow", function(e) {
		if (e.persisted) { // 浏览器后退的时候重新计算
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);

	if (doc.readyState === "complete") {
		doc.body.style.fontSize = "16px";
	} else {
		doc.addEventListener("DOMContentLoaded", function(e) {
			doc.body.style.fontSize = "16px";
		}, false);
	}
})(750, 750);

//创建项目模块，引入ionic模块
var m1 = angular.module("pro",["ionic"]);
m1.controller("general",["$scope","$state","$ionicPlatform","$location",function($scope,$state,$ionicPlatform,$location){
	//设置打开就是“习惯页面”
	$state.go("habit");
}])

//自定义底部模板
//???每个页面的底部并不是完全一样，当前页面的底部按钮颜色不同，如何改变？
m1.directive("footPart",function(){
	return {
		template:`<ul class="footlist">
			<li class="foot-item foot-habit" ng-click="$state.go('habit')"><i></i><span>习惯</span></li>
			<li class="foot-item foot-search" ng-click="$state.go('search')"><i class="active"></i><span>发现</span></li>
			<li class="foot-item foot-message" ng-click="$state.go('message')"><i></i><span>消息</span></li>
			<li class="foot-item foot-mine" ng-click="$state.go('my')"><i></i><span>我的</span></li>
		</ul>`	
	}
})

//配置路由
m1.config(function($stateProvider){
	$stateProvider.state("habit",{
		url:"/index",
		templateUrl:"temp/habit.html",
		controller:"habitController"
	}).state("addHabit",{
		url:"/index/addHabit",
		templateUrl:"temp/addHabit.html",
		controller:"addHabitController"
	}).state("editHabit",{
		url:"index/editHabit",
		templateUrl:"temp/editHabit.html",
		controller:"editHabitController"
	}).state("search",{
		url:"/search",
		templateUrl:"temp/search.html",
		controller:"searchController"
	}).state("message",{
		url:"/message",
		templateUrl:"temp/message.html",
		controller:"messageController"
	}).state("my",{
		url:"/my",
		templateUrl:"temp/my.html",
		controller:"myController"
	}).state("haibitDetail",{
		url:"/haibitDetail/:habitId",
		temolateUrl:"temp/haibitDetail.html",
		controller:"haibitDetailController"
	}).state("myhabitDetail",{
		url:"/myhabit/:habitId",
		templateUrl:"temp/myhabitDetail.html",
		controller:"myhabitDeController"
	}).state("focus",{
		url:"/search/focus",
		templateUrl:"temp/focus.html",
		controller:"searchController"
	}).state("hot",{
		url:"/search",
		templateUrl:"temp/search.html",
		controller:"searchController"
	}).state("newest",{
		url:"/search/new",
		templateUrl:"temp/newest.html",
		controller:"searchController"
	})
})

//习惯页面的控制器
m1.controller("habitController",["$scope","$http","$state","$rootScope",function($scope,$http,$state,$rootScope){
	//调用假数据方法
	$rootScope.mockdata();
	
    $http({
        url: 'http://g.cn',
        method:"get",
//      params:{userID:"userid"}
        }).success(function(data) {
        	$scope.datalist = data.array;
        	console.log(data.array);
    });
    
    //点击编辑，编辑习惯
    $scope.habitEdit = function(){
    	console.log("编辑习惯,转到编辑页面");
    	$state.go("editHabit");
    }
    //点击“+”，添加习惯
    $scope.addHabit = function(){
    	console.log("添加习惯，转到添加习惯页面");
    	$state.go("addHabit");
    }
    
    $scope.$state = $state;
}])

//我的习惯页面
m1.controller("myhabitDeController",["$scope","$http","$state","$rootScope","$stateParams",function($scope,$http,$state,$rootScope,$stateParams){
//引入假数据
	$rootScope.mockAdata();
	//请求数据
	$http({
		url:"http://g.cn",
		method:"get",
	}).success(function(data){
		console.log(data.coments);
		$scope.commontList = data.coments;
	})
	
	
	//下拉刷新
	$scope.doRefresh = function() {
		console.log("下拉刷新")
		$http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			$scope.commontList = data.coments;
			$scope.$broadcast('scroll.refreshComplete');
		})
	};
	$scope.ismore = true;
	$scope.loadMore = function() {
	 	console.log("上拉加载")
	    $http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			if(data.coments.length > 0){
				$scope.commontList = $scope.commontList.concat(data.coments);	
			}else{
//				//如果请求到的数据为0，就阻止无限滚动
				$scope.ismore = false;
			}
//console.log(data)
			//停止广播
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
	};
	$scope.habitname = decodeURI($stateParams.habitId);
	console.log($stateParams);
	//获取到习惯的id
	//通过习惯的id获取相关信息
	
    $scope.$state = $state;
}])


//编辑习惯控制器
m1.controller("editHabitController",["$scope","$state","$http","$ionicPopup","$rootScope",function($scope,$state,$http,$ionicPopup,$rootScope){
	//点击完成，回到习惯页面
	$scope.editComplete = function(){
		$state.go("habit")
	}
	$rootScope.mockdata();
	//展示数据
	$http({
		url:"http://g.cn",
		method:"get",
	}).success(function(data){
		console.log(data);
		$scope.items = data.array;
	});
	
	//设置删除按钮是否显示
	$scope.data = {
	   showDelete: true,
	   showReorder:true
	};
	//移动位置
	$scope.moveItem = function(item, fromIndex, toIndex) {
		console.log($scope.items)
	   	$scope.items.splice(fromIndex, 1);
	    $scope.items.splice(toIndex, 0, item);
	};
	//删除选项
	$scope.onItemDelete = function(item) {
		console.log(this.$index)
		let name = this.item.name;
		console.log("删除习惯");
	     var confirmPopup = $ionicPopup.confirm({
		       	title: '删除习惯',
		       	template: '确认删除习惯[ '+name+' ]吗?',
			  	cancelText: '取消', 
			  	cancelType: 'button-clear button-balanced', 
			  	okText: '确认',
			  	okType: 'button-clear button-balanced', 
	     });
	     
	     confirmPopup.then(function(res) {
		       if(res) {
		       	//用户确认删除
		         console.log('确认删除');
		         //向后台发送请求,删除记录
//		         $http({
//		         	url:"",
//		         	method:"post",
//		         	params:"habitID:,userID:;"
//		         	
//		         }).success(function(data){
//		    		//删除页面元素
	     			$scope.items.splice($scope.items.indexOf(item), 1);	
//		         })
		       } else {
		       	//用户取消删除
		         console.log('取消删除');
		       }
	    });
	};

}])

//添加习惯 页面的控制器
m1.controller("addHabitController",["$scope","$state","$http","$rootScope","$ionicNavBarDelegate","$ionicPlatform",function($scope,$state,$http,$rootScope,$ionicNavBarDelegate,$ionicPlatform){
	//将$state服务赋给变量$state,便于在页面中使用
	
	$scope.$state = $state;
	
	//利用服务隐藏头部
	$ionicNavBarDelegate.showBackButton(false);
	
	//默认第一项“热门”被选中
	$scope.isActive = 1;
	$rootScope.mockalldata();
	//显示习惯列表
	$http({
		url:"http://g.cn",
		method:"get",
		
	}).success(function(data){
		console.log(data.array)
		$scope.allHabitList = data.array;
	})
	
	//点击习惯类型选项卡，显示对应类别习惯列表
	$scope.checkTab = function(type){
		console.log(type);
		$scope.isActive = type;
		//向后台发送请求，改变allHabitList
		$http({
			url:"http://g.cn",
			method:"get",
			
		}).success(function(data){
			console.log(data.array)
			$scope.allHabitList = data.array;
		})
	}
}])
//习惯详情页面
m1.controller("haibitDetailController",["$scope","$state","$http","$ionicPopup","$stateParams",function($scope,$state,$http,$ionicPopup,$stateParams){
	$scope.$state = $state;
	//获取路由中的参数
	console.log($stateParams);
	
	
}])

//发现search页面的控制器
m1.controller("searchController",["$scope","$state","$http","$ionicPopup","$rootScope",function($scope,$state,$http,$ionicPopup,$rootScope){
	$scope.$state = $state;
//	$scope.isActive = 1;
	$scope.clickTab = function(val,type){
//		$scope.isActive = val;
		$state.go(type)
	}
	//引入假数据
	$rootScope.mockAdata();
	//请求数据
	$http({
		url:"http://g.cn",
		method:"get",
	}).success(function(data){
		console.log(data.coments);
		$scope.commontList = data.coments;
	})
	
	
	//下拉刷新
	$scope.doRefresh = function() {
		console.log("下拉刷新")
		$http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			$scope.commontList = data.coments;
			$scope.$broadcast('scroll.refreshComplete');
		})
	};
	$scope.ismore = true;
	$scope.loadMore = function() {
	 	console.log("上拉加载")
	    $http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			if(data.coments.length > 0){
				$scope.commontList = $scope.commontList.concat(data.coments);	
			}else{
//				//如果请求到的数据为0，就阻止无限滚动
				$scope.ismore = false;
			}
			//停止广播
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
	};
}])
//消息message页面的控制器
m1.controller("messageController",["$scope","$state","$http","$ionicPopup",function($scope,$state,$http,$ionicPopup){
	$scope.$state = $state;
}])

//我的 my页面的控制器
m1.controller("myController",["$scope","$state","$http","$ionicPopup","$rootScope",function($scope,$state,$http,$ionicPopup,$rootScope){
	$scope.$state = $state;
	
	//创建假数据
	$rootScope.mockmydata();
	//从后台请求数据
	$http({
		url:"http://g.cn",
		method:"get",
		
	}).success(function(data){
		console.log(data.array)
		$scope.myhabitList = data.array;
	})
	
	//下拉刷新
	$scope.doRefresh = function() {
		console.log("下拉刷新")
		$http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			$scope.myhabitList = data.array;
			$scope.$broadcast('scroll.refreshComplete');
		})
	};
	
	$scope.ismore = true;
	$scope.loadMore = function() {
	 	console.log("上拉加载")
	    $http({
			method:"get",
			url:"http://g.cn",
		}).success(function(data){
			console.log(data.array);
			
			if(data.array.length > 0){
				$scope.myhabitList = $scope.myhabitList.concat(data.array);	
			}else{
//				//如果请求到的数据为0，就阻止无限滚动
				$scope.ismore = false;
			}
			//停止广播
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
	};
	
	
}])


//定义假数据，全局变量
m1.run(function($rootScope){
//	$rootScope.$rootScope=$rootScope;
	$rootScope.mockmydata=function(){
		//模拟假数据
		Mock.mock('http://g.cn',{
		  "array|20": [
			    {
			      "name|+1": [
			        "吃早饭",
			        "今日事，今日毕",
			        "早起",
			        "多喝水",		        
			        "运动",
			        "每天看书1小时",
			        "吃水果",
			        "不吃零食"
			      ],
			      "days|0-999":30,
			      "stime": "@datetime('yyyy MM.dd')",
			      "etime": "@datetime('yyyy MM.dd')",
			      "habitID|+1":1,
			      "imgsrc|1-4":1
			    }
		  ]
		})
	}
	
	$rootScope.mockdata=function(){
		//模拟假数据
		Mock.mock('http://g.cn',{
		  "array|8": [
			    {
			      "name|+1": [
			        "吃早饭",
			        "今日事，今日毕",
			        "早起",
			        "多喝水",		        
			        "运动",
			        "每天看书1小时",
			        "吃水果",
			        "不吃零食"
			      ],
			      "logosrc|+1":1,
			      "days|0-30":1,
			      "time": "@time('HH:mm')",
			      "habitID|+1":1
			    }
		  ]
		})
	}
	
	//所有习惯
	$rootScope.mockalldata=function(){
		//模拟假数据
		Mock.mock('http://g.cn',{
		  "array|20": [
			    {
			      "name|+1": [
			        "吃早饭",
			        "今日事，今日毕",
			        "早起",
			        "多喝水",		        
			        "运动",
			        "每天看书1小时",
			        "吃水果",
			        "不吃零食"
			      ],
			      "logosrc|1-8":1,
			      "days|0-30":1,
			      "time": "@time('HH:mm')",
			      "peopleNum|1999-99999":200,
			      "habitID|+1":1
			    }
		  ]
		})
	}
	//习惯详情
	$rootScope.mockAdata=function(){
		//模拟假数据
		Mock.mock('http://g.cn',{

	      	"coments|8":[
	      		{
	      			"userName|+1":[
	      				"lhm11",
	      				"啦啦啦",
	      				"是我啊",
	      				"小仙女",
	      				"那好吧",
	      				"我是小王子",
	      				"莫西莫西",
	      				"hello你好"
	      			],
	      			"text":"这是一些类似评论的记录习惯的信息",
	      			"habitType":"早起",
	      			"time": "@time('HH:mm')",
	      			"days|1-300":1,
	      			"imgsrc|1-4":1,
	      			"photo|1-8":1
	      		}
	      	]
		})
	}
})