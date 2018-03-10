(function($){
	$.fn.dksPagination.locales['en-US'] = {
			formatPageRecords: function (totPages,totalRows) {
				return 'Show '+totPages+' pages/ ' + totalRows + ' records';
			},
			formatFirstPage:function(){
				return 'First';
			},
			formatPrePage:function(){
				return 'Previous';
			},
			formatNextPage:function(){
				return 'Next';
			},
			formatInputPage:function(){
				return 'Turn to';
			},
			formatPage:function(){
				return 'pages';
			}
	};
})(jQuery);