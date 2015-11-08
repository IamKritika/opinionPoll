// public/core.js
var app = angular.module('opinion', []);
  
  app.config(function($routeProvider) {
        $routeProvider

            // route for the about page
            .when('/', {
                templateUrl : 'pages/admin.html',
                controller  : 'adminController'
            })
			 .when('/user', {
                templateUrl : 'pages/user.html',
                controller  : 'userController'
            })
			.otherwise({ template : 'The route not defined'});
    });

function adminController($scope, $http) {
	  $scope.questionarray =[];
      $scope.questionnaireCreate = false;
	  $scope.question={};
	  $scope.questionnaire = {};
	  $scope.questionnaireArray = [];
	  $scope.qaObj = {};
	  $scope.queID = 1;
	  $scope.option = {};
	  		$scope.questionnaireView = false;
			 $scope.questionnaireTitle = false;
			 $scope.initialScreen =true;
			 $scope.quesTitle = "";

 $scope.createQuestionnaireTitle = function()
 {  $scope.questionnaireTitle = true;
	$scope.questionnaireCreate =false; 
	$scope.questionnaireView = false;
	 $scope.initialScreen = false;
 };	 
 $scope.createQuestionnaire = function()
 {   $scope.questionnaireTitle = false;
	$scope.questionnaireCreate = true; 
	$scope.questionnaireView = false;
	$scope.initialScreen = false;
 };
    // when submitting the add form, send the text to the node API
    $scope.createquestion = function() {
		if ($scope.question.text)
		{	
		$scope.questionnaire = {question : $scope.question.text , answers : $scope.option};
       $scope.questionnaireArray.push($scope.questionnaire);
	   
	    $scope.question = {};
		 $scope.option = {};
		}
    };
	
	$scope.submitQuestionnaire = function() {
		if ($scope.question.text)
		{	
		$scope.createquestion();
		$scope.qaObj = { questionnaireID : $scope.queID ,  questionnaireTitle :$scope.quesTitle , qa :  $scope.questionnaireArray};
		$scope.questionnaireArray = [];
		console.log($scope.qaObj);
		$http.post('/api/todos', $scope.qaObj)
            .success(function(data) {
                $scope.qaObj = {};
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
			$scope.queID++;
			alert( "questionnaire has been submitted");
			$scope.questionnaireCreate = false;
			$scope.initialScreen = true;
		}
    };
	
	$scope.viewQuestionnaire = function()
	{
		 $http.get('/api/todos')
        .success(function(data) {
             $scope.qaObj = data;
            console.log($scope.qaObj);
			 console.log($scope.qaObj[0].qa);
			 console.log($scope.qaObj[0].qa[0].question);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
		$scope.questionnaireView = true;
	}

}

function userController($scope, $http) {
	$scope.showQues = false;
	 $scope.qaObj =[];
	$scope.index =0;
	$scope.questionIndex = 0;
	  $scope.answer={};
	   $scope.answerArray =[];
	  	$scope.surveyOver = true;
		$scope.startQues = false;
		$scope.questionnaireID ="";
		$scope.answerArray =[];
	 $scope.getAdminQuestion = function(){
    // when landing on the page, get all todos and show them
   $http.get('/api/todos')
        .success(function(data) {
             $scope.qaObj = data;
            console.log($scope.qaObj);
			 console.log($scope.qaObj[0].qa);
			 console.log($scope.qaObj[0].qa[0].question);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
  $scope.surveyOver = false;
};

// when submitting the add form, send the text to the node API
    $scope.showNextQuestion = function(index,length) {
		
		
		$scope.index ++;
		$scope.recordedAnswer = {qaID:$scope.questionnaireID+1, questionID : $scope.index , answer : $scope.answer.text};
		console.log($scope.recordedAnswer);	
        $scope.answerArray.push($scope.recordedAnswer);
	    $scope.answer = {};
		
		if ( $scope.index > length )
		{
		alert ("Thanks");
		$scope.ansObj = { userID : 001 , ans :  $scope.answerArray};
		$scope.answerArray = [];
		console.log($scope.ansObj);
		$http.post('/api/ans', $scope.ansObj)
            .success(function(data) {
                $scope.ansObj = {};
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
			
		 
		}
		  
    };
	
	// when submitting the add form, send the text to the node API
    $scope.showQues = function(ID) {
		console.log("Hi");
		$scope.questionnaireID = ID;
		$scope.startQues = true;
	
		 
	  
		  
    };
}
