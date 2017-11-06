//设置根字体大小

//创建项目模块，引入ionic模块
var m1 = angular.module("pro",["ionic"]);
m1.controller("general",["$scope","$state",function($scope,$state){
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
		url:"/editHabit",
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
//      	console.log(data.array);
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


//编辑习惯控制器
m1.controller("editHabitController",["$scope","$state","$http","$ionicPopup",function($scope,$state,$http,$ionicPopup){
	//点击完成，回到习惯页面
	$scope.editComplete = function(){
		$state.go("habit")
	}
	//展示数据
	$http({
		url:"http://g.cn",
		method:"get",
	}).success(function(data){
		console.log(data);
		$scope.hibatList = data.array;
	});
	//点击按钮删除习惯
	$scope.isDel = false;
	$scope.delHabit = function(){
		console.log(this.data.name);
		let name = this.data.name;
		console.log("删除习惯");
	     var confirmPopup = $ionicPopup.confirm({
		       	title: '删除习惯',
		       	template: '确认删除习惯[ '+name+' ]吗?',
//			  	templateUrl: '', // String (可选)。放在弹窗body内的一个html模板的URL。
			  	cancelText: '取消', // String (默认: 'Cancel')。一个取消按钮的文字。
			  	cancelType: 'button-clear button-balanced', // String (默认: 'button-default')。取消按钮的类型。
			  	okText: '确认', // String (默认: 'OK')。OK按钮的文字。
			  	okType: 'button-clear button-balanced', // String (默认: 'button-positive')。OK按钮的类型。
	     });
	     
	     confirmPopup.then(function(res) {
		       if(res) {
		       	//用户确认删除
		         console.log('确认删除');
		         //向后台发送请求
//		         $http({
//		         	url:"",
//		         	method:"post",
//		         	params:"habitID:,userID:;"
//		         	
//		         }).success(function(data){
//		         	
//		         })
		       } else {
		       	//用户取消删除
		         console.log('取消删除');
		       }
	     });
	  
	 };
}])

//添加习惯 页面的控制器
m1.controller("addHabitController",["$scope","$state","$http","$rootScope","$ionicNavBarDelegate",function($scope,$state,$http,$rootScope,$ionicNavBarDelegate){
	//将$state服务赋给变量$state,便于在页面中使用
	
	$scope.$state = $state;
	
	//利用服务隐藏头部
	$ionicNavBarDelegate.showBar(false);
	
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
m1.controller("searchController",["$scope","$state","$http","$ionicPopup",function($scope,$state,$http,$ionicPopup){
	$scope.$state = $state;
}])
//消息message页面的控制器
m1.controller("messageController",["$scope","$state","$http","$ionicPopup",function($scope,$state,$http,$ionicPopup){
	$scope.$state = $state;
}])

//我的 my页面的控制器
m1.controller("myController",["$scope","$state","$http","$ionicPopup",function($scope,$state,$http,$ionicPopup){
	$scope.$state = $state;
}])


//定义假数据，全局变量
m1.run(function($rootScope){
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
			      "time": "@time('HH:mm')"
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
})