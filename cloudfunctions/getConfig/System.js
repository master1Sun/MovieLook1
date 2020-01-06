
/**
 * @include "../Include.js"
 * @include "../GlobalSetting.js"
 * @include "HashTable.js"
 */


/**
 * 移除数组中的空位置,让数组紧凑。
 * 
 * @return {Array} 处理后的数组。
 */
Array.prototype.Compact = function()
{
	var compact = this;
	for(var i=0;i<compact.length;i++)
	{
		if(typeof(compact[i]) == "undefined" || compact[i] == null) 
		{
			compact.RemoveAt(i);
			i--;
		}
	}
	return compact;
}



/*
 * 对对象进行排序,对象可以是string object number ，当对象是object时需要知道排序的属性字段。
 */
Array.prototype.SortNumber = function(pName)
{
    if(this==null||this.length==1)
        return this;

    if(typeof(this[0]) == "number" )
    {
        return this.sort(function sortNumber(a, b) {return a - b;});
    }

    if(typeof(this[0]) == "object" && typeof(pName) == "string" )
    {
        return this.sort(function sortNumber(a, b) {return (a[pName]> b[pName])?1:-1;});
    }

}

/*
 * 对对象进行排序,对象可以是string object number ，当对象是object时需要知道排序的属性字段。
 */
Array.prototype.SortNumberDesc = function(pName)
{
    if(this==null||this.length==1)
        return this;

    if(typeof(this[0]) == "number" )
    {
        return this.sort(function sortNumber(a, b) {return b - a;});
    }

    if(typeof(this[0]) == "object" && typeof(pName) == "string" )
    {
        return this.sort(function sortNumber(a, b) {return (b[pName]> a[pName])?1:-1;});
    }

}

/**
 * 从一个数组中移除某个索引处的数组。
 * @param {Int} index 需要移除元素的索引。
 * @return {Array} 返回移除元素后的数组。
 * */
Array.prototype.RemoveAt = function(index) 
{
	if(index<0||index >= this.length) return this;
	return this.splice(index, 1);
}


/**
 * 返回 Array此实例中的第一个匹配项的索引，如果未找见，返回 -1。
 * @param {Mixed} o 需要查询的元素。
 * @return {Array} 元素在数组中的位置。
 * */
Array.prototype.IndexOf=function(o)
{
	for(var i=0;i<this.length;i++)
	{
		if(this[i]==o)
		return i;
	}
	return-1;
}

/**
 * 指定的对象在此实例中的最后一个匹配项的索引位置。
 * @param {Mixed} o  需要查询的元素。
 * @return {Array} 元素在数组中的位置。
 * */
Array.prototype.LastIndexOf=function(o)
{
	for(var i=this.length-1;i>=0;i--)
	{
		if(this[i]==o)
		return i;
	}
	return-1;
}



/**
 * 指定数组中是否包含某个对象。
 * @param {Mixed} o  需要查询的元素。
 * @return {Boolean} 元素是否在数组中。
 * */
Array.prototype.Contains=function(o)
{
	return this.IndexOf(o)!= -1;
}


/**
 * 数组拷贝（浅拷贝）。
 * @return {Array} 拷贝后的数组。
 * */
Array.prototype.Copy=function()
{
	return this.concat();
}



/**
 * 在数组的指定索引处增加一个元素。
 * @param {Mixed} o 需要追加的元素。
 * @param {Int} i 元素追加的位置。
 * */
Array.prototype.InsertAt=function(o,i)
{
	this.splice(i,0,o);
}

 

/**
 * 在某个对象前面插入一个对象，如果对象没有找见，则在最后数组最后加入。
 * @param {Mixed} o 需要对比的元素。
 * @param {Mixed} o2 需要追加的元素。
 * */
Array.prototype.InsertBefore=function(o,o2)
{

	var i=this.IndexOf(o2);
	if(i== -1)
		this.push(o);
	else 
		this.splice(i,0,o);
}

 
/**
 * 从数组中移出某个对象，如果移除成功返回true，否则返回false。
 * @param {Mixed} o 需要删除的元素。
 * */
Array.prototype.Remove=function(o)
{
	var i=this.IndexOf(o);
	if(i!= -1)
	{
		this.splice(i,1);
		return true;
	}
	return false;
}



 
/**
 * 将items中的项依次添加到Array的结尾。
 * @param {Array} items 需要添加的元素。
 * */
Array.prototype.AddRange = function (items)
{
    if(items==null||items.length==0)return;
    for(var i=0;i<items.length;i++)
    {
        this.push(items[i]);
    }
}

 
/**
 * 在 i 之后插入元素到数组中。
 * @param {Mixed} obj 需要添加的元素。
 * @param {Int} i 添加的元素位置。
 * */
Array.prototype.InsertAt = function (obj, i) 
{
    this.splice(i, 0, obj);
}

 
/**
 * 在指定元素之前插入元素。
 * @param {Mixed} obj 需要插入的元素。
 * @param {Mixed} obj2 对比的元素。
 * */
Array.prototype.InsertBefore = function (obj, obj2) 
{
    var i = this.IndexOf(obj2);
    if (i == -1)
        this.push(obj);
    else
        this.splice(i, 0, obj);
}


 
/**
 * 删除数组中重复的元素。
 * */
Array.prototype.Unique = function() 
{
	var temp = [];
	for(var i=0;i<this.length;i++)
	{
		if(!temp.Contains(this[i])) temp.push(this[i]) ;
	}
	this.length = temp.length;
    for (var i = 0; i < temp.length; i++)
    {
        this[i] = temp[i];
    }
    
}



/**
 * 去除字符串左边的空格。
 * */
String.prototype.LTrim = function () 
{
	return this.replace(/^\s*/, "");
}

/**
 * 去除字符串右边的空格。
 * */
String.prototype.RTrim = function ()
{
	return this.replace(/\s*$/, "");
}


/**
 * 去除字符串两边的空格。
 * */
String.prototype.Trim = function () 
{
	return this.replace(/(^\s+)|\s+$/g,"");
}


/**
 * 判断字符串是否以某个字符结尾。
 * */
String.prototype.EndWith = function(end)
{
	return (this.substr(this.length-end.length)==end);
}



/**
 * 判断字符串是否以某个字符开始。
 * */
String.prototype.StartWith = function(start) 
{
	return (this.substr(0,start.length)==start);
}

String.prototype.endWith =String.prototype.EndWith;
String.prototype.startWith = String.prototype.StartWith;



/**
 * 提供字符串的格式化 例如: "a+b计算结构为:{0}+{1}={3}".Format(a,b,c)
 * */
String.prototype.Format = function()
{ 
	var s = this;
	for (var i=0; i < arguments.length; i++)
	{
		s = s.replace("{" + i + "}", arguments[i]);
	}
	return(s);
}


/**
 * 得到需要格式化字符串中的参数。 例如: "a+b计算结构为:{p1}+{c1}={g}".GetFormatParames() 返回p1 c1  g 构成的数组 
 * */
String.prototype.GetFormatParameters = function()
{ 
	var s = this;
	var re=/\{[^\{\}]*\}/gi;
	var arr = s.match(re);
	if(arr==null) return null;
	for(var i=0;i<arr.length;i++)
	{
		arr[i] = arr[i].substring(1,arr[i].length-1);
	}
	return arr;
}



/**
 * 去除字符串中所有空格。 
 * */
String.prototype.RemoveSpaces = function()
{
	return this.replace(new RegExp(" ", "gi"),"");
}



/**
 * 把连续的空格替换为单个空格。 
 * */
String.prototype.RemoveExtraSpaces = function()
{
	return(this.replace(/\s+/g, " "));
}



/**
 * 对字符串进行URL编码。 
 * */
String.prototype.EncodeURI = function()
{ 
	var str;
	str = escape( this );
	// + 号需要编码
	str = str.replace(/\+/g,"%2B");
	return str;
}


/**
 * 对字符串进行 URL 解码。 
 * */
String.prototype.DecodeURI = function() 
{
	return unescape(this);
}


 

/**
 * 处理XML预定义五个通用实体引用。五个实体引用出现在XML文档中用来代替一些特殊的字符，
 * 这些字符如果不用引用方式就会被解释为标记。 
 * */
String.prototype.ConvertEntity = function ()
{
	if(this.length<1) return "";
	var str = this.toString();
	str = str.replace(/&/gi, "&amp;");
	str = str.replace(/</gi, "&lt;");
	str = str.replace(/>/gi, "&gt;");
	str = str.replace(/'/gi, "&apos;");
	str = str.replace(/"/gi, "&quot;");
	return str;
}



/**
 * 实体引用反编码。 
 * */
String.prototype.DeconvertEntity = function ()
{
	if(this.length<1) return "";
	var str = this.toString();
	str = str.replace(/&lt;/gi, "<");
	str = str.replace(/&gt;/gi, ">");
	str = str.replace(/&apos;/gi, "'");
	str = str.replace(/&quot;/gi, "\"");
	str = str.replace(/&amp;/gi, "&");
	return str;
}


 
/**
 * 是否Email字符串。 
 * */
String.prototype.IsEmail=function ()
{
	return (/^([a-z][a-z0-9\_\.]*[a-z0-9])(@)(([a-z0-9][a-z0-9\-]*[a-z0-9][\.])+(com|cn|net|hk|tw|au|uk|de|tv|info|biz))$/ig).test(this);
}





/**
 *  是否数字。 
 * */
String.prototype.IsNumber = function()
{
  var re=/^\d*$/;
  return re.test(this);
} 


/**
 *  转换为驼峰写法，例如 page-size --> pageSize。 
 * */
String.prototype.Camelize= function() 
{
    var oStringList = this.split('-');
    var camelizedString = oStringList[0];
    for (var i = 1; i < oStringList.length; i++) {
        var s = oStringList[i];
        camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }
    return camelizedString;
}



/**
 *  得到左边的字符串。
 *  @param {Int} len 截取的字符长度。
 * */
String.prototype.Left = function(len)
{

	if(isNaN(len)||len==null)
	{
		len = this.length;
	}
	else
	{
		if(parseInt(len)<0||parseInt(len)>this.length)
		{
			len = this.length;
		}
	}
	
	return this.substr(0,len);
}


/**
 *  得到右边的字符串。
 *  @param {Int} len 截取的字符长度。
 * */
String.prototype.Right = function(len)
{

	if(isNaN(len)||len==null)
	{
		len = this.length;
	}
	else
	{
		if(parseInt(len)<0||parseInt(len)>this.length)
		{
			len = this.length;
		}
	}
	
	return this.substring(this.length-len,this.length);
}

/**
 *  是否是正确的长日期。
 * */
String.prototype.IsLongDate = function()
{
	var r = this.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/); 
	if(r==null)
	{
		return false; 
	}
	var d = new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]); 
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);

}


/**
 *  是否是正确的短日期。
 * */
String.prototype.IsShortDate = function()
{
	var r = this.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
	if(r==null)
	{
		return false; 
	}
	var d = new Date(r[1], r[3]-1, r[4]); 
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
}



/**
 *  得到utf-8的字节。
 * */
String.prototype.GetByteForUTF = function ()   
{   
  var s = this;
  s=s.replace(/[\u0000-\u007f]/g,"\u0061");   
  s=s.replace(/[\u0080-\u07ff]/g,"\u0061\u0061");   
  s=s.replace(/[\u0800-\uffff]/g,"\u0061\u0061\u0061");   
  return   s.length; 
} 
 
   
/**
 *  得到用gb2312的字节。
 * */
String.prototype.GetByteForGB = function ()   
{   
  var s = this;
  return   s.replace(/[^\u0000-\u007f]/g,"\u0061\u0061").length;    
}
    


/**
 *  是否是正确的日期。
 * */
String.prototype.IsDate = function()
{
	return this.IsLongDate()||this.IsShortDate();
}


/**
 *  是否是有汉字。
 * */
String.prototype.ExistChinese = function()
{
	//[\u4E00-\u9FA5]汉字﹐[\uFE30-\uFFA0]全角符号
	return  /^[\x00-\xff]*$/.test(this)?false:true;
}


/**
 * 是否为颜色字符串。 
 * */
String.prototype.IsColor = function ()
{
	return (/^[0-9a-fA-F]{6}$/ig).test(this);
}



/**
 * 转换成全角串。 
 * */
String.prototype.ToCase = function()
{
	var tmp = "";
	for(var i=0;i<this.length;i++)
	{
		if(this.charCodeAt(i)>0&&this.charCodeAt(i)<255)
		{
			tmp += String.fromCharCode(this.charCodeAt(i)+65248);
		}
		else
		{
			tmp += String.fromCharCode(this.charCodeAt(i));
		}
	}
	return tmp;
}


/**
 * 对字符串进行Html编码。 
 * */
String.prototype.ToHtmlEncode = function()
{
	var str = this;

	str=str.replace(/&/g,"&amp;");
	str=str.replace(/</g,"&lt;");
	str=str.replace(/>/g,"&gt;");
	str=str.replace(/\'/g,"&apos;");
	str=str.replace(/\"/g,"&quot;");
	str=str.replace(/\n/g,"<br>");
	str=str.replace(/\ /g,"&nbsp;");
	str=str.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");

	return str;
}

 
/**
 * 判断是否为正确的正数（可以含小数部分）。 
 * */
String.prototype.IsPlusNumeric = function ()
{
    if ((isNaN(this)) || (this.indexOf("-")!=-1))
        return false ;
    return true;    
} 


/**
 * 判断是否为正确的数字（可以为负数，小数）。 
 * */
String.prototype.IsNumeric = function ()
{
    if (isNaN(this))
        return false;
        
    return true;
}

 

/**
 * 判断是否为正整数。 
 * */
String.prototype.IsInteger = function ()
{
    if ((isNaN(this)) || (this.indexOf(".")!=-1) || (this.indexOf("-")!=-1))
        return false;    
    return true;    
} 


/**
 * 得到Get字符串参数。 
 * */
String.prototype.GetQuery = function(paramName,defaultValue)
{
	var param = window.location.href.split(paramName+"=")[1];
	if(!param || param.length<1) return defaultValue;
	param = param.split("&")[0];
	param = param.split("#")[0];
	return param;
}



/**
 * 得到字符的显示宽度。
 * */
String.prototype.DisplayLength  = function (){
    var str = this;
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len+=0.85;
        }
        else {
            len+=2;
        }
    }
    return len;
}

/**
 * 保留小数位数。 
 * @param {Int} len 小数位数。
 * */
Number.prototype.ToFixed=function(len)
{
	
	if(isNaN(len)||len==null)
	{
		len = 0;
	}
	else
	{
		if(len<0)
		{
			len = 0;
		}
	}

    return Math.round(this * Math.pow(10,len)) / Math.pow(10,len);

}



/**
 * 数字是否在某个区间范围内部。 
 * */
Number.prototype.Inrange=function(vmin,vmax)
{
	return this>vmin&&this<vmax;
}


/**
 * 重写Error toString方法。 
 * */
Error.prototype.toString=function()
{
	return this.message;
}


/**
 *  返回某对象的一个方法，用另一个对象替换当前对象。
 *  比如： 
 *       <input type="text" id="aaa" value="aaa"> 
 *       <input type="text" id="bbb" value="bbb"> 
 *       ................. 
 *       <script> 
 *           var aaa = document.getElementById("aaa"); 
 *           var bbb = document.getElementById("bbb"); 
 *           aaa.showValue = function() {alert(this.value);} 
 *           aaa.showValue2 = aaa.showValue.Bind(bbb); 
 *       </script>
 *   那么，调用aaa.showValue 将返回"aaa", 但调用aaa.showValue2 将返回"bbb"。
 *   
 *   @param {Object} object 将作为当前对象使用的对象。
 *   @returns {Function} 返回一个新函数对象，新函数对象的主体和原对象相同，但是 object 将被用作当前对象的对象。
 *   也就是说新函数中的 this 引用被改变为参数提供的对象。
 * */
Function.prototype.Bind = function(object) {
  var __method = this;
  return function() {
    __method.apply(object, arguments);
  }
}

Array.prototype.Clone = function()
{
	if(this.length == 0) return [];
	var arr = [];
	for(var i=0;i<this.length;i++)
	{
		var item = this[i];
		if(item == null) arr.push(null);
		else arr.push(item.Clone);
	}
	return arr;
}

 
 /*该方法用来创建一个可以传递参数的回调函数。 
 *该方法可以直接在任何一个function上调用。 
 *例如：<code>myFunction.createCallback(arg1, arg2)</code>，这样就创建了一个绑定了 
 *两个参数的方法。 
     *如果回调函数需要特定的作用域，请用createDelegate()方法替代。 
     *createCallback()方法返回的函数总是在window作用域（顶级作用域）中执行。 
 *如果你想给一个回调方法传递参数，则需要使用该方法。如果不需要参数，你可以直 
 *接简单地传递一个函数的引用给需要回调的地方就可以了(例如callback: myFn)。（译者*注：这句话的意思就是说，如果你不需要向回调函数传递参数，就没有必要使用*createCallback()这个方法，直接按照常规的方式写就可以了）。 
 *然而，（译者注：按照常规的写法的话），如果你尝试向回调函数传递参数，(例如callback: *myFn(arg1, arg2))。那么函数在解析的时候就会被简单地执行。（译者注：而不是你期 
 *望的在发生某件事情之后再来回调。） 
     *createCallback()的示例用法如下： 
     <pre><code> 
 var sayHi = function(name){ 
     alert('Hi, ' + name); 
 } 
  
 // clicking the button alerts "Hi, Fred" 
 new Ext.Button({ 
     text: 'Say Hi', 
     renderTo: Ext.getBody(), 
     handler: sayHi.createCallback('Fred') 
 }); 
 </code></pre> 
      *@返回值 {Function} 新的回调函数。 
      */  
Function.prototype.CreateCallback = function(/*args...*/){  
 //使得传递进来的参数在下面的function中可用。（译者注：这里实际上是返回了//一个闭包函数，然后使用window来调用原来的函数，并把需要的参数传递进去。）  
         var args = arguments;  
         var method = this;  
         return function() {  
             return method.apply(window, args);  
         };  
     },  




/**
 * 允许你将对象绑定一个在其作用域下的函数，亦可将特定的多个参数，写成数组传入到那个函数中去。
 * 可选地，这需要一个参数来指定是否将参数列表传入到这个数组中去。如果这个第三的参数没有传入，数组将是整个的参数列表。 <br/>
 * var fn = func1.createDelegate(scope, [arg1,arg2], true)   <br/>
 * fn(a,b,c) === scope.func1(a,b,c,arg1,arg2);   <br/>
    
 * var fn = func1.createDelegate(scope, [arg1,arg2])  <br/> 
 * fn(a,b,c) === scope.func1(arg1,arg2);   <br/>
    
 * var fn = func1.createDelegate(scope, [arg1,arg2], 1)  <br/> 
 *  fn(a,b,c) === scope.func1(a,arg1,arg2,b,c); <br/>
     * <pre><code>
var sayHi = function(name){
    // Note this use of "this.text" here.  This function expects to
    // execute within a scope that contains a text property.  In this
    // example, the "this" variable is pointing to the btn object that
    // was passed in createDelegate below.
    alert('Hi, ' + name + '. You clicked the "' + this.text + '" button.');
}

var btn = new Ext.Button({
    text: 'Say Hi',
    renderTo: Ext.getBody()
});

// This callback will execute in the scope of the
// button instance. Clicking the button alerts
// "Hi, Fred. You clicked the "Say Hi" button."
btn.on('click', sayHi.CreateDelegate(btn, ['Fred']));
</code></pre>
     * @param {Object} obj (optional) The object for which the scope is set
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     *                                             if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
Function.prototype.CreateDelegate = function (obj, args, appendArgs)
{
    //return function() 
    //{
    //    return method.apply(instance, arguments);
    // }
   
   
   var method = this;
        return function() 
        {
            var callArgs = args || arguments;
            if(appendArgs === true)
            {
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if(typeof appendArgs == "number")
            {
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
}





/**
 * 在某一定时间间隔之后执行函数，而且可指定执行所在的作用域，连同多个参数的传入一同被调用。
 * <pre><code>
var sayHi = function(name){
    alert('Hi, ' + name);
}

// executes immediately:
sayHi('Fred');

// executes after 2 seconds:
sayHi.defer(2000, this, ['Fred']);

// this syntax is sometimes useful for deferring
// execution of an anonymous function:
(function(){
    alert('Anonymous');
}).defer(100);
</code></pre>
     * @param {Number} millis The number of milliseconds for the setTimeout call (if 0 the function is executed immediately)
     * @param {Object} obj (optional) The object for which the scope is set
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     *                                             if a number the args are inserted at the specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
Function.prototype.Defer = function(millis, obj, args, appendArgs)
{
    var fn = this.CreateDelegate(obj, args, appendArgs);
    if(millis)
    {
        return setTimeout(fn, millis);
    }
    fn();
    return 0;
}


 /**
  * 许你指定一个函数在这个函数之后调用。原函数的所有参数都会传入给它。作用域的参数可选地使用。
 * Create a combined function call sequence of the original function + the passed function.
 * The resulting function returns the results of the original function.
 * The passed fcn is called with the parameters of the original function
 * @param {Function} fcn The function to sequence
 * @param {Object} scope (optional) The scope of the passed fcn (Defaults to scope of original function or window)
 * @return {Function} The new function
 */
Function.prototype.CreateSequence = function(fcn, scope)
{
        if(typeof fcn != "function")
        {
            return this;
        }
        var method = this;
        return function() 
        {
            var retval = method.apply(this || window, arguments);
            fcn.apply(scope || this || window, arguments);
            return retval;
        };
 }
 
 


/**
 * 允许你指定一个函数在这个函数之前调用。原函数的所有参数都会传入给它。如果它返回false，原函数将不会被调用。作用域的参数可选地使用。
 * Creates an interceptor function. The passed fcn is called before the original one. If it returns false, the original one is not called.
 * The resulting function returns the results of the original function.
 * The passed fcn is called with the parameters of the original function.
 * @addon
 * @param {Function} fcn The function to call before the original
 * @param {Object} scope (optional) The scope of the passed fcn (Defaults to scope of original function or window)
 * @return {Function} The new function
 */
Function.prototype.CreateInterceptor = function(fcn, scope)
{
        if(typeof fcn != "function")
        {
            return this;
        }
        var method = this;
        return function() 
        {
            fcn.target = this;
            fcn.method = method;
            if(fcn.apply(scope || this || window, arguments) === false)
            {
                return;
            }
            return method.apply(this || window, arguments);
        };
 }

 
 
 /**
 * 此类表示值为可变字符序列的类似字符串的对象。在处理大量字符串累加的时候
 // 使用此类比普通string可以提高效率
 * @param {String} initString 初始化字符。
 */
function StringBuilder (initString)
{
    this.Strings=[];
    this.Append=function(str) {this.Strings.push(str);}
    this.ToString=function(){return this.Strings.join("");}
    this.Clear = function(){this.Strings.length = 0;}
    //this.IsEmpty = function(){return this.Strings.length>0?true:false;}

    if(typeof(initString)!="undefined" && initString != null){
        this.Append(initString);
    }
}

//判断是否包含
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
};