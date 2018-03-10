/**
 * 翻页组件
 * @author Monsir 2018-01-19
 * version: 1.01.1
 */
(function($){
	
	/**
	 * @param el dom对象
	 * @param options {"pageNumber":1,"pageSize":10,"totalRows":30,"onPageChange":callBackFunc}
	 */
	var DksPagination = function(el,options){
		this.options = $.extend(this.options, options);
		this.$el = $(el);
		this.initPagination();
	};
	
	/**
	 * 默认配置
	 */
	DksPagination.DEFAULTS = {
			pageNumber: 1,
			locale: undefined
	};
	
	DksPagination.LOCALES = {};
	
	DksPagination.LOCALES['zh-CN'] = {
			formatPageRecords: function (totPages,totalRows) {
				return '显示共 '+totPages+' 页/ ' + totalRows + ' 条记录';
			},
			formatFirstPage:function(){
				return '首页';
			},
			formatPrePage:function(){
				return '上一页';
			},
			formatNextPage:function(){
				return '下一页';
			},
			formatInputPage:function(){
				return '转到';
			},
			formatPage:function(){
				return '页';
			}
	};
	
	$.extend(DksPagination.DEFAULTS, DksPagination.LOCALES['zh-CN']);
	
	/**
	 * 对外接口,构造翻页组件
	 */
	$.fn.dksPagination = function(option){
		var value,
        args = Array.prototype.slice.call(arguments, 1);
		var $this = $(this),
        data = $this.data('dekscom.pagination');
		options = $.extend({},DksPagination.DEFAULTS, $this.data(),
                typeof option === 'object' && option);
		
		if (typeof option === 'string'){
			if(!data)
				return;
			if('refresh' == option){
				value = data[option].apply(data,args);
			}
		}
		
		if(!data)
			$this.data('dekscom.pagination',(data = new DksPagination(this,options)));
		return typeof value === 'undefined' ? this : value;
	};
	
	//设置默认配置
	$.fn.dksPagination.defaults = DksPagination.DEFAULTS;
	//设置默认语言
	$.fn.dksPagination.locales = DksPagination.LOCALES;
	
	
	DksPagination.prototype.initLocale = function(){
		if (this.options.locale){
			if ($.fn.dksPagination.locales[this.options.locale]){
				$.extend(this.options, $.fn.dksPagination.locales[this.options.locale]);
			}
		}
	};
	
	/**
	 * 构造分页html,注册事件
	 * 中间最多显示5个页码
	 */
	DksPagination.prototype.initPagination = function(){
		var nShowCnt = 5;
		var html = [];
		var totalRows = typeof this.options.totalRows !== 'undefined' ? this.options.totalRows : 0;
		var pageNumber = typeof this.options.pageNumber !== 'undefined' ? this.options.pageNumber : (totalRows >0 ? 1 : 0 );
		var totPages = this.options.totalRows > 0 ? Math.floor(this.options.totalRows/this.options.pageSize)+(this.options.totalRows%this.options.pageSize == 0 ? 0 :1) : 0;
		this.options.totPages = totPages;
		this.options.pageNumber = pageNumber;
		//构造html
		html.push('<div class="page-container dks-page-center-block">');
		html.push('<ul class="total-desc"><li><span>'+this.options.formatPageRecords(totPages,totalRows)+'</span></li></ul>');
		//首页
		html.push('<ul class="dks-pagination "><li class="page-first"><a href="#">'+this.options.formatFirstPage()+'</a></li><li class="page-pre"><a href="#">'+this.options.formatPrePage()+'</a></li>');
		
		if(totPages <= nShowCnt+1){
			for(var i = 1;i <= totPages ;i++){
				var active = i == pageNumber ? ' active' : '';
				html.push('<li class="page-num ' + active + '"><a href="#">' + i + '</a></li>');
			}
		}else {
			if(pageNumber <= nShowCnt-1 ){
				for(var i = 1;i <= nShowCnt ;i++){
					var active = i == pageNumber ? ' active ' : '';
					html.push('<li class="page-num ' + active + '"><a href="#">' + i + '</a></li>');
				}
				html.push('<li class="page-num">...</li>');
			}else{
				for(var i = 1;i <= 2 ;i++){
					var active = i == pageNumber ? ' active ' : '';
					if(i == 2){
						html.push('<li class="page-num">...</li>');
						continue;
					}
					html.push('<li class="page-num ' + active + '"><a href="#">' + i + '</a></li>');
				}
				
				if(totPages - pageNumber >= 3){
					for(var i = pageNumber-2;i <= pageNumber+2;i++){
						var active = i == pageNumber ? ' active ' : '';
						html.push('<li class="page-num ' + active + '"><a href="#">' + i + '</a></li>');
					}
					html.push('<li class="page-num">...</li>');
				}else{
					for(var i = Math.min(pageNumber-2,totPages-4);i <= totPages;i++){
						var active = i == pageNumber ? ' active ' : '';
						html.push('<li class="page-num ' + active + '"><a href="#">' + i + '</a></li>');
					}
				}
			}
		}
		
		//下一页
		html.push('<li class="page-next"><a href="#">'+this.options.formatNextPage()+'</a></li><li><span>'+this.options.formatInputPage()+'</span><input type="text" size="2" class="page-input"></input><span>'+this.options.formatPage()+'</span></li></ul></div>');
		this.$el.html(html.join(''));
		
		//注册事件
		$pageContainer = this.$el.find('.page-container');
		$pageFirst = $pageContainer.find('.page-first');
		$pagePre =   $pageContainer.find('.page-pre');
		$pageNum =   $pageContainer.find('.page-num');
		$pageNext =  $pageContainer.find('.page-next');
		$pageInput = $pageContainer.find('.page-input');
		
		//注册事件
		$pageFirst.off('click').on('click',$.proxy(this.onPageFirst,this));
		$pagePre.off('click').on('click',$.proxy(this.onPagePre,this));
		$pageNum.off('click').on('click',$.proxy(this.onPageNumber,this));
		$pageNext.off('click').on('click',$.proxy(this.onPageNext,this));
		$pageInput.off('keypress').on('keypress',$.proxy(this.onPageInput,this));
		
		
	};
	
	/**
	 * 更新分页
	 * @param data {"totalRows":30}
	 */
	DksPagination.prototype.refresh = function(option){
		this.options = $.extend(this.options, option);
		this.initPagination();
	};
	
	/**
	 * 点击首页
	 * @param event
	 */
	DksPagination.prototype.onPageFirst = function(event){
		this.options.pageNumber = 1;
		this.onPageChange(this.options.pageNumber,this.options.pageSize);
	};
	
	/**
	 * 点击上一页
	 * @param event
	 */
	DksPagination.prototype.onPagePre = function(event){
		this.options.pageNumber -= 1;
		if(this.options.pageNumber <= 0)
			this.options.pageNumber = 1;
		this.onPageChange(this.options.pageNumber,this.options.pageSize);
	};
	
	
	/**
	 * 点击页码
	 * @param event
	 */
	DksPagination.prototype.onPageNumber = function(event){
		var pageNum = +$(event.currentTarget).text();
		this.options.pageNumber = pageNum;
		this.onPageChange(pageNum,this.options.pageSize);
	};
	
	/**
	 * 点击下一页
	 * @param event
	 */
	DksPagination.prototype.onPageNext = function(event){
		this.options.pageNumber += 1;
		if(this.options.pageNumber > this.options.totPages)
			this.options.pageNumber = this.options.totPages;
		this.onPageChange(this.options.pageNumber,this.options.pageSize);
	};
	
	/**
	 * 输入页码
	 * @param event
	 */
	DksPagination.prototype.onPageInput = function(event){
		if(event.keyCode == '13'){
			var pageNum = +$(event.currentTarget).val();
			this.options.pageNumber = pageNum;
			this.onPageChange(this.options.pageNumber,this.options.pageSize);
		}
	};
	
	
	/**
	 * 事件的统一出口
	 * @param pageNum
	 * @param pageSize
	 */
	DksPagination.prototype.onPageChange = function(pageNum,pageSize){
		this.initPagination();
		this.options.onPageChange(pageNum,pageSize);
	};
	
	
})(jQuery);
	

