# dks-page
 pagination component dependent on JQuery.It is developed secondarily on the base of bootstrap-treeview.

## 用法
```html
<link rel="stylesheet" type="text/css" href="dks-page.css" ></link>

<script type="text/javascript" src="jquery-1.11.1.js"></script>
<script type="text/javascript" src="dks-page.js"></script>
```

```html
<div id="divPage"></div>
```

## 配置项
```javascript
 var option = {
    pageNumber:  1,
    pageSize: 10,
    totalRows: 30,
    onPageChange: callBackFunc
  }
```

### 配置项说明

后缀带*的是必须的配置项
#### pageNumber
当前页码,默认值1
#### pageSize*
每页条数
#### totalRows
总条数,默认值0
#### onPageChange*
点击首页,上一页,下一页,末页时触发的方法
```javascript
function onPageChange(number,size){

}
```
number: 当前页码. 

size: 每页条数.
