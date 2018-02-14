> 在学习了之前的路由vue-router和状态管理vuex之后，就应该是网络交互了。就学习尤大推荐的axios了。刚好本人对网络请求这块除了会get、put、post和delete这四个方法之外知之甚少，刚好补全上。

**注意：**Vue官方推荐的网络通信库不再是vue-resource了，推荐使用[axios](https://github.com/mzabriskie/axios)。
![尤大的公告](http://upload-images.jianshu.io/upload_images/1987062-b3255d564903d3d7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# axios安装
npm:
```
$ npm install axios
```
bower:
```
$ bower install axios
```
Using cdn:
```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```
# 基本使用方法
`GET`请求
```
// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// Optionally the request above could also be done as
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
`POST`请求
```
 axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
同时执行多个请求
```
function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
  }));
```
其实和其他的ajax库一样，基本用法都是差不多的。大家一看就知道怎么用。
# axios API
可以直接通过`config`来完成请求
axios(config)
```
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```
axios(url, [config])
```
// Send a GET request (default method)
axios('/user/12345');
```
## 请求方法别名
下面是axios支持的所有请求方法别名，便于各种请求。
注：`[...]`中的数据表示可以为空。`url`是ajax请求地址；`data`是提交的数据对象；`config`是配置对象，所有ajax配置都可以在`config`中实现。
* axios.request(config)
* axios.get(url[, config])
* axios.delete(url[, config])
* axios.head(url[, config])
* axios.post(url[, data[, config]])
* axios.put(url[, data[, config]])
* axios.patch(url[, data[, config]])

## 并发性
下列接口用于处理并发请求(同时处理多个多个request)
* axios.all(iterable)
* axios.spread(callback)

## axios实例
可以用自定义的config创建一个axios实例
axios.create([config])
```
var instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```
## 实例方法
下面是实例的所有可用方法，方法中的`config`会与axios实例中的config合并。（实例可以将一些通用的config先配置好）
* axios#request(config)
* axios#get(url, [config])
* axios#delete(url, [config])
* axios#head(url, [config])
* axios#post(url[, data[, config]])
* axios#put(url[, data[, config]])
* axios#patch(url[, data[, config]])

## Config
重点来了，来看看Config。
下面列出了config的所有配置项，其中之后`url`是必填的。当`method`没有指定方法，默认为`GET`。
```
{
  // `url` is the server URL that will be used for the request
  // 用来向服务器发送请求的url
  url: '/user',

  // `method` is the request method to be used when making the request
 // 请求方法
  method: 'get', // default

  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  // 假如`url`不是绝对路径，那么向服务器发送请求的URL将是`baseURL + url`
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // The last function in the array must return a string, an ArrayBuffer, or a Stream
  transformRequest: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (data) {
    // Do whatever you want to transform the data

    return data;
  }],

  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },

  // `paramsSerializer` is an optional function in charge of serializing `params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream
  data: {
    firstName: 'Fred'
  },

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000,

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `adapter` allows custom handling of requests which makes testing easier.
  // Return a promise and supply a valid response (see [response docs](#response-api)).
  adapter: function (config) {
    /* ... */
  },

  // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  // This will set an `Authorization` header, overwriting any existing
  // `Authorization` custom headers you have set using `headers`.
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default

  // `onUploadProgress` allows handling of progress events for uploads
  onUploadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `onDownloadProgress` allows handling of progress events for downloads
  onDownloadProgress: function (progressEvent) {
    // Do whatever you want with the native progress event
  },

  // `maxContentLength` defines the max size of the http response content allowed
  maxContentLength: 2000,

  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },

  // `maxRedirects` defines the maximum number of redirects to follow in node.js.
  // If set to 0, no redirects will be followed.
  maxRedirects: 5, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows to configure options like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // 'proxy' defines the hostname and port of the proxy server
  // `auth` indicates that HTTP Basic auth should be used to connect to the proxy, and supplies credentials.
  // This will set an `Proxy-Authorization` header, overwriting any existing `Proxy-Authorization` custom headers you have set using `headers`.
  proxy: {
    host: '127.0.0.1',
    port: 9000,
    auth: : {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  })
}
```
## 分析Config
配置参数很多，我们一个一个来了解它们
* **url** —— 用来向服务器发送请求的url
* **method** —— 请求方法，默认是`GET`方法
* **baseURL** —— 基础URL路径，假如`url`不是绝对路径，如`https://some-domain.com/api/v1/login?name=jack`,那么向服务器发送请求的URL将会是`baseURL + url`。
* **transformRequest** —— `transformRequest`方法允许在请求发送到服务器之前修改该请求，此方法只适用于`PUT`、`POST`和`PATCH`方法中。而且，此方法最后必须返回一个string、ArrayBuffer或者Stream。
* **transformResponse** —— `transformResponse`方法允许在数据传递到then/catch之前修改`response`数据。此方法最后也要返回数据。
* **headers** —— 发送自定义Headers头文件，头文件中包含了http请求的各种信息。
* **params** —— `params`是发送请求的查询参数对象，对象中的数据会被拼接成`url?param1=value1&param2=value2`。
* **paramsSerializer** —— `params`参数序列化器。
* **data** —— `data`是在发送`POST`、`PUT`或者`PATCH`请求的数据对象。
* **timeout** —— 请求超时设置，单位为毫秒
* **withCredentials** —— 表明是否有跨域请求需要用到证书
* **adapter** —— `adapter`允许用户处理更易于测试的请求。返回一个Promise和一个有效的response
* **auth** —— `auth`表明提供凭证用于完成http的身份验证。这将会在headers中设置一个`Authorization`授权信息。自定义`Authorization`授权要设置在`headers`中。
* **responseType** —— 表示服务器将返回响应的数据类型，有`arraybuffer`、`blob`、`document`、`json`、`text`、`stream`这6个类型，默认是`json`类似数据。
* **xsrfCookieName** —— 用作 xsrf token 值的 cookie 名称
* **xsrfHeaderName** —— 带有 xsrf token 值 http head 名称
* **onUploadProgress** ——  允许在上传过程中的做一些操作
* **onDownloadProgress** —— 允许在下载过程中的做一些操作
* **maxContentLength** —— 定义了接收到的response响应数据的最大长度。
* **validateStatus** —— `validateStatus`定义了根据HTTP响应状态码决定是否接收或拒绝获取到的promise。如果 `validateStatus` 返回 `true` (或设置为 `null` 或 `undefined` ),promise将被接收;否则,promise将被拒绝。
* **maxRedirects** —— `maxRedirects`定义了在node.js中redirect的最大值，如果设置为0，则没有redirect。
* **httpAgent** —— 定义在使用http请求时的代理
* **httpsAgent** —— 定义在使用https请求时的代理
* **proxy** —— `proxy`定义代理服务器的主机名和端口，`auth`
* **cancelToken** —— `cancelToken`定义一个 `cancel token` 用于取消请求

## Response
当我们ajax获取数据成功后会返回一个response对象，它包含了以下内容：
```
{
  // `data` is the response that was provided by the server
  data: {},

  // `status` is the HTTP status code from the server response
  status: 200,

  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',

  // `headers` the headers that the server responded with
  headers: {},

  // `config` is the config that was provided to `axios` for the request
  config: {}
}
```
response是通过promise的`then`方法来获取,具体使用方法如下：
```
axios.get('/user/12345')
  .then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });
```
相对的，我们有时也会出现ajax报错，此时就会到我们的`catch`中去捕获异常`error`对象。

# 为何放弃vue-resource
尤大的原话：
> 最近团队讨论了一下，Ajax 本身跟 Vue 并没有什么需要特别整合的地方，使用 fetch polyfill 或是 axios、superagent 等等都可以起到同等的效果，vue-resource 提供的价值和其维护成本相比并不划算，所以决定在不久以后取消对 vue-resource 的官方推荐。已有的用户可以继续使用，但以后不再把 vue-resource 作为官方的 ajax 方案。
知乎链接：https://www.zhihu.com/question/52418455/answer/130535375

# Vue.js学习系列
鉴于前端知识碎片化严重，我希望能够系统化的整理出一套关于Vue的学习系列博客。

[Vue.js学习系列一 —— vue-router2学习实践笔记（附DEMO）](http://www.jianshu.com/p/8013d8d37bd0)
[Vue.js学习系列二 —— vuex学习实践笔记（附DEMO）](http://www.jianshu.com/p/d6f7e11f18af)
[Vue.js学习系列三 —— axios和网络传输相关知识的学习实践](http://www.jianshu.com/p/8e5fb763c3d7)
[Vue.js学习系列四 —— Webpack打包工具的使用](http://www.jianshu.com/p/aef34acd111f)
[Vue.js学习系列五 —— 从VUE-CLI来聊聊ESLint](http://www.jianshu.com/p/efb6fbed6fac)
[Vue.js学习系列六 —— Vue单元测试Karma+Mocha学习笔记](http://www.jianshu.com/p/073d25a3bba0)
[Vue.js学习系列七 —— Vue服务器渲染Nuxt学习](https://www.jianshu.com/p/ba7466d7101a)
[Vue.js学习系列八 —— Vue源码学习之State学习](https://www.jianshu.com/p/15028f91226e)

# Vue.js学习系列项目地址
本文源码已收入到GitHub中，以供参考，当然能留下一个star更好啦^-^。
[https://github.com/violetjack/VueStudyDemos](https://github.com/violetjack/VueStudyDemos)

# 关于作者
VioletJack，高效学习前端工程师，喜欢研究提高效率的方法，也专注于Vue前端相关知识的学习、整理。
欢迎关注、点赞、评论留言~我将持续产出Vue相关优质内容。

新浪微博： http://weibo.com/u/2640909603
掘金：https://gold.xitu.io/user/571d953d39b0570068145cd1
CSDN: http://blog.csdn.net/violetjack0808
简书： http://www.jianshu.com/users/54ae4af3a98d/latest_articles
Github： https://github.com/violetjack